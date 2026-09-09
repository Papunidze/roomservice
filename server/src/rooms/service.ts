import { randomBytes } from "node:crypto";

import { ObjectId, type UpdateFilter } from "mongodb";

import { rooms } from "../db.js";
import type { LangCode } from "../domain.js";
import { clientOrigin, env } from "../env.js";
import { publish } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import type { PublicRoom, RoomDoc } from "./types.js";

const newToken = () => randomBytes(16).toString("base64url");

export const roomNotFound = () =>
  new HttpError(404, "room_not_found", "No such room");

export function toPublicRoom(room: RoomDoc): PublicRoom {
  return {
    no: room.no,
    floor: room.floor,
    printed: room.printed,
    session: room.session
      ? { lang: room.session.lang, since: room.session.since.toISOString() }
      : null,
    lastActivity: room.lastActivityAt?.toISOString() ?? null,
    url: `${clientOrigin}/r/${room.no}?t=${room.token}`,
  };
}

export async function listRooms(hotelId: ObjectId) {
  const docs = await rooms().find({ hotelId }).toArray();
  return docs.sort((a, b) => Number(a.no) - Number(b.no)).map(toPublicRoom);
}

export async function addRooms(hotelId: ObjectId, numbers: string[]) {
  const existing = new Set(
    (
      await rooms()
        .find({ hotelId }, { projection: { no: 1 } })
        .toArray()
    ).map((room) => room.no),
  );
  const fresh = [...new Set(numbers)].filter((no) => !existing.has(no));
  if (fresh.length === 0) return listRooms(hotelId);

  await rooms().insertMany(
    fresh.map((no) => ({
      _id: new ObjectId(),
      hotelId,
      no,
      floor: Math.floor(Number(no) / 100),
      token: newToken(),
      printed: false,
      session: null,
      lastActivityAt: null,
      createdAt: new Date(),
    })),
  );
  publish(hotelId.toHexString(), { type: "room", no: fresh[0] ?? "" });
  return listRooms(hotelId);
}

async function updateRoom(
  hotelId: ObjectId,
  no: string,
  update: UpdateFilter<RoomDoc>,
) {
  const room = await rooms().findOneAndUpdate({ hotelId, no }, update, {
    returnDocument: "after",
  });
  if (!room) throw roomNotFound();
  publish(hotelId.toHexString(), { type: "room", no });
  return toPublicRoom(room);
}

export function markPrinted(hotelId: ObjectId, numbers: string[]) {
  return rooms()
    .updateMany({ hotelId, no: { $in: numbers } }, { $set: { printed: true } })
    .then(() => {
      publish(hotelId.toHexString(), { type: "room", no: numbers[0] ?? "" });
      return listRooms(hotelId);
    });
}

export function setPrinted(hotelId: ObjectId, no: string, printed: boolean) {
  return updateRoom(hotelId, no, { $set: { printed } });
}

export function regenerateToken(hotelId: ObjectId, no: string) {
  return updateRoom(hotelId, no, {
    $set: { token: newToken(), printed: false },
  });
}

export function openSession(hotelId: ObjectId, no: string, lang: LangCode) {
  return updateRoom(hotelId, no, {
    $set: { session: { lang, since: new Date() }, lastActivityAt: new Date() },
  });
}

export function closeSession(hotelId: ObjectId, no: string) {
  return updateRoom(hotelId, no, { $set: { session: null } });
}

export function touchRoom(hotelId: ObjectId, no: string) {
  return rooms().updateOne(
    { hotelId, no },
    { $set: { lastActivityAt: new Date() } },
  );
}

export async function findRoom(hotelId: ObjectId, no: string) {
  const room = await rooms().findOne({ hotelId, no });
  if (!room) throw roomNotFound();
  return room;
}

export function findRoomByToken(token: string) {
  return rooms().findOne({ token });
}

export async function removeRooms(hotelId: ObjectId, numbers: string[]) {
  await rooms().deleteMany({ hotelId, no: { $in: numbers } });
  publish(hotelId.toHexString(), { type: "room", no: numbers[0] ?? "" });
  return listRooms(hotelId);
}
