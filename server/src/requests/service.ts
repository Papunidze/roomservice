import type { Filter, ObjectId, UpdateFilter } from "mongodb";
import { ObjectId as Id } from "mongodb";
import { randomUUID } from "node:crypto";
import type { z } from "zod";

import { requests, users } from "../db.js";
import { clientOrigin } from "../env.js";
import { getHotel } from "../hotels/service.js";
import {
  UNASSIGNED,
  type Category,
  type LangCode,
  type StaffRole,
  type Status,
} from "../domain.js";
import type { HotelDoc } from "../hotels/types.js";
import { publish } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import { nextSequence } from "../lib/ids.js";
import { sendMail } from "../lib/mail.js";
import { touchRoom } from "../rooms/service.js";
import { translateInBackground } from "./translate-thread.js";
import type {
  createRequestSchema,
  historyQuerySchema,
  ratingSchema,
  staffReplySchema,
} from "./schemas.js";
import { toPublicRequest } from "./serialize.js";
import type { MessageDoc, RequestDoc } from "./types.js";

const INBOX_DONE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  progress: "In progress",
  done: "Done",
};

export const requestNotFound = () =>
  new HttpError(404, "request_not_found", "No such request");

const system = (text: string): MessageDoc => ({
  id: randomUUID(),
  from: "system",
  lang: "en",
  text,
  translations: {},
  at: new Date(),
});

export async function listRequests(hotelId: ObjectId, since?: Date) {
  const recent = new Date(Date.now() - INBOX_DONE_DAYS * DAY_MS);
  const scope: Filter<RequestDoc> = {
    hotelId,
    archived: false,
    $or: [{ status: { $ne: "done" } }, { updatedAt: { $gte: recent } }],
  };
  const filter: Filter<RequestDoc> = since
    ? { ...scope, updatedAt: { $gt: since } }
    : scope;
  const docs = await requests()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  const now = Date.now();
  return docs.map((doc) => toPublicRequest(doc, now));
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function searchHistory(
  hotelId: ObjectId,
  { q, before, limit }: z.infer<typeof historyQuerySchema>,
) {
  const filter: Filter<RequestDoc> = { hotelId };
  if (before) filter.createdAt = { $lt: new Date(before) };
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter.$or = [
      { roomNo: pattern },
      { assignee: pattern },
      { "thread.text": pattern },
      { "thread.translations.en": pattern },
    ];
  }
  const docs = await requests()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .toArray();
  const now = Date.now();
  return {
    requests: docs.slice(0, limit).map((doc) => toPublicRequest(doc, now)),
    hasMore: docs.length > limit,
  };
}

export async function listRoomRequests(hotelId: ObjectId, roomNo: string) {
  const docs = await requests()
    .find({ hotelId, roomNo, archived: false })
    .sort({ createdAt: -1 })
    .toArray();
  const now = Date.now();
  return docs.map((doc) => toPublicRequest(doc, now));
}

async function pickAssignee(hotel: HotelDoc, category: Category) {
  const role = roleFor(hotel, category);
  if (!hotel.team.autoAssign || !role) return UNASSIGNED;
  const member = await users().findOne(
    { hotelId: hotel._id, role, onShift: true },
    { sort: { lastActiveAt: -1 } },
  );
  return member?.name ?? UNASSIGNED;
}

export function roleFor(hotel: HotelDoc, category: Category): StaffRole | null {
  const configured =
    hotel.settings.categories[
      category as keyof HotelDoc["settings"]["categories"]
    ];
  return configured?.role ?? null;
}

async function readerLanguages(hotel: HotelDoc): Promise<LangCode[]> {
  const members = await users()
    .find({ hotelId: hotel._id }, { projection: { lang: 1 } })
    .toArray();
  return [
    ...new Set([
      hotel.settings.staffLang,
      "en" as LangCode,
      ...members.map((m) => m.lang),
    ]),
  ];
}

export async function createRequest(
  hotel: HotelDoc,
  roomNo: string,
  input: z.infer<typeof createRequestSchema>,
) {
  const configured =
    hotel.settings.categories[
      input.category as keyof HotelDoc["settings"]["categories"]
    ];
  const now = new Date();
  const doc: RequestDoc = {
    _id: new Id(),
    hotelId: hotel._id,
    seq: await nextSequence(hotel._id, "request"),
    roomNo,
    category: input.category,
    urgency: configured?.urgency ?? input.urgency,
    language: input.language,
    status: "new",
    assignee: await pickAssignee(hotel, input.category),
    archived: false,
    escalatedAt: null,
    firstResponseAt: null,
    progressAt: null,
    resolvedAt: null,
    rating: null,
    createdAt: now,
    updatedAt: now,
    thread: [
      {
        id: randomUUID(),
        from: "guest",
        lang: input.language.base,
        text: input.text,
        translations: input.freeText ? {} : input.translations,
        at: now,
      },
    ],
  };
  await requests().insertOne(doc);
  await touchRoom(hotel._id, roomNo);
  publish(hotel._id.toHexString(), {
    type: "request",
    id: doc.seq,
    room: roomNo,
  });
  const first = doc.thread[0];
  if (first)
    translateInBackground(
      { hotelId: hotel._id, seq: doc.seq, roomNo },
      first,
      await readerLanguages(hotel),
    );
  return toPublicRequest(doc);
}

async function findDoc(hotelId: ObjectId, seq: number) {
  const doc = await requests().findOne({ hotelId, seq });
  if (!doc) throw requestNotFound();
  return doc;
}

async function apply(
  hotelId: ObjectId,
  seq: number,
  update: UpdateFilter<RequestDoc>,
) {
  const doc = await requests().findOneAndUpdate(
    { hotelId, seq },
    { ...update, $set: { ...update.$set, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (!doc) throw requestNotFound();
  publish(hotelId.toHexString(), {
    type: "request",
    id: seq,
    room: doc.roomNo,
  });
  return toPublicRequest(doc);
}

export async function addGuestMessage(
  hotelId: ObjectId,
  seq: number,
  message: Pick<MessageDoc, "text" | "lang">,
) {
  const doc = await findDoc(hotelId, seq);
  await touchRoom(hotelId, doc.roomNo);
  const line: MessageDoc = {
    id: randomUUID(),
    from: "guest",
    ...message,
    translations: {},
    at: new Date(),
  };
  const result = await apply(hotelId, seq, { $push: { thread: line } });
  const hotel = await getHotel(hotelId);
  translateInBackground(
    { hotelId, seq, roomNo: doc.roomNo },
    line,
    await readerLanguages(hotel),
  );
  return result;
}

export async function rateRequest(
  hotelId: ObjectId,
  seq: number,
  input: z.infer<typeof ratingSchema>,
) {
  const doc = await findDoc(hotelId, seq);
  if (doc.status !== "done")
    throw new HttpError(
      400,
      "not_done",
      "Only a finished request can be rated",
    );
  return apply(hotelId, seq, {
    $set: { rating: { ...input, at: new Date() } },
  });
}

function progressLines(doc: RequestDoc, $set: Partial<RequestDoc>) {
  if (doc.status !== "new") return [];
  $set.status = "progress";
  $set.progressAt = new Date();
  return [system("Status → In progress")];
}

export async function replyToRequest(
  hotelId: ObjectId,
  seq: number,
  by: string,
  message: z.infer<typeof staffReplySchema>,
) {
  const doc = await findDoc(hotelId, seq);
  const reply: MessageDoc = {
    id: randomUUID(),
    from: "staff",
    by,
    ...message,
    at: new Date(),
  };
  const lines: MessageDoc[] = [reply];
  const $set: Partial<RequestDoc> = {};

  if (!doc.firstResponseAt) $set.firstResponseAt = new Date();
  if (doc.assignee === UNASSIGNED) {
    $set.assignee = by;
    lines.push(system(`${by} took the ticket`));
  }
  lines.push(...progressLines(doc, $set));

  const result = await apply(hotelId, seq, {
    $set,
    $push: { thread: { $each: lines } },
  });
  translateInBackground({ hotelId, seq, roomNo: doc.roomNo }, reply, [
    doc.language.base,
  ]);
  return result;
}

export function addNote(
  hotelId: ObjectId,
  seq: number,
  by: string,
  text: string,
) {
  return apply(hotelId, seq, {
    $push: {
      thread: {
        id: randomUUID(),
        from: "note",
        by,
        lang: "en",
        text,
        translations: {},
        at: new Date(),
      },
    },
  });
}

export async function assignRequest(
  hotelId: ObjectId,
  seq: number,
  by: string,
  assignee: string,
) {
  const doc = await findDoc(hotelId, seq);
  if (doc.assignee === assignee) return toPublicRequest(doc);

  const lines = [
    system(
      assignee === UNASSIGNED
        ? `${by} unassigned ${doc.assignee}`
        : `${by} assigned to ${assignee}`,
    ),
  ];
  const $set: Partial<RequestDoc> = { assignee };
  if (assignee !== UNASSIGNED) lines.push(...progressLines(doc, $set));
  return apply(hotelId, seq, { $set, $push: { thread: { $each: lines } } });
}

export async function setStatus(
  hotelId: ObjectId,
  seq: number,
  status: Status,
) {
  const doc = await findDoc(hotelId, seq);
  if (doc.status === status) return toPublicRequest(doc);

  const $set: Partial<RequestDoc> = { status };
  if (status === "done") $set.resolvedAt = new Date();
  if (status === "progress" && !doc.progressAt) $set.progressAt = new Date();
  return apply(hotelId, seq, {
    $set,
    $push: { thread: system(`Status → ${STATUS_LABEL[status]}`) },
  });
}

export async function archiveRoomRequests(hotelId: ObjectId, roomNo: string) {
  const result = await requests().updateMany(
    { hotelId, roomNo, archived: false, status: { $ne: "done" } },
    { $set: { archived: true, updatedAt: new Date() } },
  );
  publish(hotelId.toHexString(), { type: "request", id: 0, room: roomNo });
  return result.modifiedCount;
}

async function notifyEscalation(hotel: HotelDoc, doc: RequestDoc) {
  const targets = await users()
    .find({ hotelId: hotel._id, role: hotel.team.escalation.target })
    .toArray();
  const hotelName = hotel.settings.hotel.name || "your hotel";
  await Promise.all(
    targets.map((member) =>
      sendMail({
        to: member.email,
        subject: `Room ${doc.roomNo} has waited ${hotel.team.escalation.minutes} min · ${hotelName}`,
        text: `Hi ${member.name},\n\nA ${doc.category} request from room ${doc.roomNo} has had no answer for ${hotel.team.escalation.minutes} minutes.\n\nOpen it: ${clientOrigin}/desk?open=${doc.seq}`,
      }).catch((error: unknown) => console.error("[escalation mail]", error)),
    ),
  );
}

export async function escalateStale(hotel: HotelDoc) {
  if (!hotel.team.escalation.enabled) return 0;
  const cutoff = new Date(Date.now() - hotel.team.escalation.minutes * 60_000);
  const stale = await requests()
    .find({
      hotelId: hotel._id,
      status: "new",
      archived: false,
      escalatedAt: null,
      createdAt: { $lt: cutoff },
    })
    .toArray();

  for (const doc of stale) {
    await apply(hotel._id, doc.seq, {
      $set: { escalatedAt: new Date() },
      $push: {
        thread: system(
          `Escalated to ${hotel.team.escalation.target} · unanswered for ${hotel.team.escalation.minutes} min`,
        ),
      },
    });
    await notifyEscalation(hotel, doc);
  }
  return stale.length;
}
