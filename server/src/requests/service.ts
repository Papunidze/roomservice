import type { ObjectId, UpdateFilter } from "mongodb";
import { ObjectId as Id } from "mongodb";
import { randomUUID } from "node:crypto";
import type { z } from "zod";

import { requests, users } from "../db.js";
import { getHotel } from "../hotels/service.js";
import {
  routingGroupFor,
  UNASSIGNED,
  type Category,
  type StaffRole,
  type Status,
} from "../domain.js";
import type { HotelDoc } from "../hotels/types.js";
import { publish } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import { nextSequence } from "../lib/ids.js";
import { touchRoom } from "../rooms/service.js";
import { translateInBackground } from "./translate-thread.js";
import type { createRequestSchema, staffReplySchema } from "./schemas.js";
import { toPublicRequest } from "./serialize.js";
import type { MessageDoc, RequestDoc } from "./types.js";

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
  const filter = since ? { hotelId, updatedAt: { $gt: since } } : { hotelId };
  const docs = await requests()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  const now = Date.now();
  return docs.map((doc) => toPublicRequest(doc, now));
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
  if (configured) return configured.role;
  const group = routingGroupFor(category);
  return group ? hotel.team.routing[group] : null;
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
    resolvedAt: null,
    createdAt: now,
    updatedAt: now,
    thread: [
      {
        id: randomUUID(),
        from: "guest",
        lang: input.language.base,
        text: input.text,
        translations: input.freeText ? {} : input.translations,
        photo: input.photo,
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
    translateInBackground({ hotelId: hotel._id, seq: doc.seq, roomNo }, first, [
      hotel.settings.staffLang,
      "en",
    ]);
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
  translateInBackground({ hotelId, seq, roomNo: doc.roomNo }, line, [
    hotel.settings.staffLang,
    "en",
  ]);
  return result;
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
  if (doc.status === "new") {
    $set.status = "progress";
    lines.push(system("Status → In progress"));
  }

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
  if (doc.status === "new" && assignee !== UNASSIGNED) {
    $set.status = "progress";
    lines.push(system("Status → In progress"));
  }
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
  }
  return stale.length;
}
