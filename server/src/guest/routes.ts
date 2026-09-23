import { Router } from "express";
import { z } from "zod";

import { getHotel } from "../hotels/service.js";
import { langCodeSchema } from "../hotels/schemas.js";
import { streamEvents } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import { parseBody } from "../lib/parse-body.js";
import { guestWriteLimiter } from "../middleware/rate-limit.js";
import {
  createRequestSchema,
  guestMessageSchema,
  ratingSchema,
} from "../requests/schemas.js";
import { forGuest } from "../requests/serialize.js";
import {
  addGuestMessage,
  createRequest,
  listRoomRequests,
  rateRequest,
} from "../requests/service.js";
import { findRoomByToken, openSession } from "../rooms/service.js";

const invalidPlate = () =>
  new HttpError(404, "invalid_plate", "This QR code is no longer valid");

const sessionSchema = z.object({ lang: langCodeSchema });

type Plate = { token: string };

export const guestRouter = Router({ mergeParams: true });

guestRouter.use((req, res, next) => {
  if (req.method === "POST") guestWriteLimiter(req, res, next);
  else next();
});

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
    service,
    lateCheckout,
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
    service,
    lateCheckout,
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

async function openRequestSeq(token: string, id: string) {
  const room = await roomFor(token);
  const seq = Number.parseInt(id, 10);
  const open = await listRoomRequests(room.hotelId, room.no);
  if (!open.some((request) => request.id === seq)) throw invalidPlate();
  return { room, seq };
}

guestRouter.post<Plate & { id: string }>(
  "/requests/:id/messages",
  async (req, res) => {
    const message = parseBody(guestMessageSchema, req.body);
    const { room, seq } = await openRequestSeq(req.params.token, req.params.id);
    const request = await addGuestMessage(room.hotelId, seq, message);
    res.json({ request: forGuest(request) });
  },
);

guestRouter.post<Plate & { id: string }>(
  "/requests/:id/rating",
  async (req, res) => {
    const input = parseBody(ratingSchema, req.body);
    const { room, seq } = await openRequestSeq(req.params.token, req.params.id);
    const request = await rateRequest(room.hotelId, seq, input);
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
