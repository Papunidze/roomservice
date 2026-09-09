import { Router } from "express";

import { currentUser } from "../lib/current-user.js";
import { parseBody } from "../lib/parse-body.js";
import { requireAuth, requireManager } from "../middleware/auth.js";
import { archiveRoomRequests } from "../requests/service.js";
import { roomNumbersSchema, roomPatchSchema } from "./schemas.js";
import {
  addRooms,
  closeSession,
  removeRooms,
  listRooms,
  markPrinted,
  openSession,
  regenerateToken,
  setPrinted,
} from "./service.js";

export const roomsRouter = Router();

roomsRouter.use(requireAuth);

roomsRouter.get("/", async (req, res) => {
  res.json({ rooms: await listRooms(currentUser(req).hotelId) });
});

roomsRouter.post("/", requireManager, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  res
    .status(201)
    .json({ rooms: await addRooms(currentUser(req).hotelId, numbers) });
});

roomsRouter.post("/printed", requireManager, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  res.json({ rooms: await markPrinted(currentUser(req).hotelId, numbers) });
});

roomsRouter.patch<{ no: string }>("/:no", requireManager, async (req, res) => {
  const hotelId = currentUser(req).hotelId;
  const patch = parseBody(roomPatchSchema, req.body);
  const no = req.params.no;

  let room = null;
  if (patch.printed !== undefined)
    room = await setPrinted(hotelId, no, patch.printed);
  if (patch.session === null) room = await closeSession(hotelId, no);
  if (patch.session) room = await openSession(hotelId, no, patch.session.lang);
  if (!room) throw new Error("Nothing to update");

  res.json({ room });
});

roomsRouter.post<{ no: string }>("/:no/token", requireManager, async (req, res) => {
  res.json({
    room: await regenerateToken(currentUser(req).hotelId, req.params.no),
  });
});

roomsRouter.post<{ no: string }>("/:no/close", requireManager, async (req, res) => {
  const hotelId = currentUser(req).hotelId;
  const archived = await archiveRoomRequests(hotelId, req.params.no);
  const room = await closeSession(hotelId, req.params.no);
  res.json({ room, archived });
});

roomsRouter.delete("/", requireManager, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  const hotelId = currentUser(req).hotelId;
  for (const no of numbers) await archiveRoomRequests(hotelId, no);
  res.json({ rooms: await removeRooms(hotelId, numbers) });
});
