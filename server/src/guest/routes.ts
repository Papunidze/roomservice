import { Router } from "express";
import { z } from "zod";

import { getHotel } from "../hotels/service.js";
import { langCodeSchema } from "../hotels/schemas.js";
import { streamEvents } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import { parseBody } from "../lib/parse-body.js";
import {
  createRequestSchema,
  guestMessageSchema,
} from "../requests/schemas.js";
import { forGuest } from "../requests/serialize.js";
import {
  addGuestMessage,
  createRequest,
  listRoomRequests,
} from "../requests/service.js";
import { findRoomByToken, openSession } from "../rooms/service.js";

const invalidPlate = () =>
  new HttpError(404, "invalid_plate", "This QR code is no longer valid");

const sessionSchema = z.object({ lang: langCodeSchema });

type Plate = { token: string };

export const guestRouter = Router({ mergeParams: true });

async function roomFor(token: string) {
  const room = await findRoomByToken(token);
  if (!room) throw invalidPlate();
  return room;
}

guestRouter.get<Plate>("/", async (req, res) => {
  const room = await roomFor(req.params.token);
  const hotel = await getHotel(room.hotelId);
  const {
    hotel: profile,
    guestLanguages,
    info,
    infoSourceLang,
    categories,
    items,
  } = hotel.settings;
  res.json({
    room: room.no,
    session: room.session
      ? { lang: room.session.lang, since: room.session.since.toISOString() }
      : null,
    hotel: { name: profile.name, checkout: profile.checkout },
    guestLanguages,
    info,
    infoSourceLang,
    categories,
    items,
  });
});

guestRouter.post<Plate>("/session", async (req, res) => {
  const room = await roomFor(req.params.token);
  const { lang } = parseBody(sessionSchema, req.body);
  res.json({ room: await openSession(room.hotelId, room.no, lang) });
});

guestRouter.get<Plate>("/requests", async (req, res) => {
  const room = await roomFor(req.params.token);
  const open = await listRoomRequests(room.hotelId, room.no);
  res.json({ requests: open.map(forGuest) });
});

guestRouter.post<Plate>("/requests", async (req, res) => {
  const room = await roomFor(req.params.token);
  const input = parseBody(createRequestSchema, req.body);
  const hotel = await getHotel(room.hotelId);
  const request = await createRequest(hotel, room.no, input);
  res.status(201).json({ request: forGuest(request) });
});

guestRouter.post<Plate & { id: string }>(
  "/requests/:id/messages",
  async (req, res) => {
    const room = await roomFor(req.params.token);
    const message = parseBody(guestMessageSchema, req.body);
    const seq = Number.parseInt(req.params.id, 10);
    const open = await listRoomRequests(room.hotelId, room.no);
    if (!open.some((request) => request.id === seq)) throw invalidPlate();
    const request = await addGuestMessage(room.hotelId, seq, message);
    res.json({ request: forGuest(request) });
  },
);

guestRouter.get<Plate>("/events", async (req, res) => {
  const room = await roomFor(req.params.token);
  streamEvents(
    res,
    room.hotelId.toHexString(),
    (event) => event.type === "request" && event.room === room.no,
  );
});
