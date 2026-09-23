import { Router } from "express";

import { currentUser } from "../lib/current-user.js";
import { parseBody } from "../lib/parse-body.js";
import {
  requireAdminRole,
  requireAuth,
  writesRequireActive,
} from "../middleware/auth.js";
import { archiveRoomRequests } from "../requests/service.js";
import { roomNumbersSchema, roomPatchSchema } from "./schemas.js";
import {
  addRooms,
  closeSession,
  editRoom,
  listRooms,
  markPrinted,
  openSession,
  regenerateToken,
  removeRooms,
} from "./service.js";

export const roomsRouter = Router();

roomsRouter.use(requireAuth, writesRequireActive);

roomsRouter.get("/", async (req, res) => {
  res.json({ rooms: await listRooms(currentUser(req).hotelId) });
});

roomsRouter.post("/", requireAdminRole, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  res
    .status(201)
    .json({ rooms: await addRooms(currentUser(req).hotelId, numbers) });
});

roomsRouter.post("/printed", requireAdminRole, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  res.json({ rooms: await markPrinted(currentUser(req).hotelId, numbers) });
});

roomsRouter.patch<{ no: string }>(
  "/:no",
  requireAdminRole,
  async (req, res) => {
    const hotelId = currentUser(req).hotelId;
    const { session, ...fields } = parseBody(roomPatchSchema, req.body);
    const no = req.params.no;

    let room = null;
    if (Object.keys(fields).length > 0)
      room = await editRoom(hotelId, no, fields);
    if (session === null) room = await closeSession(hotelId, no);
    if (session) room = await openSession(hotelId, no, session.lang);
    if (!room) throw new Error("Nothing to update");

    res.json({ room });
  },
);

roomsRouter.post<{ no: string }>(
  "/:no/token",
  requireAdminRole,
  async (req, res) => {
    res.json({
      room: await regenerateToken(currentUser(req).hotelId, req.params.no),
    });
  },
);

roomsRouter.post<{ no: string }>("/:no/close", async (req, res) => {
  const hotelId = currentUser(req).hotelId;
  const archived = await archiveRoomRequests(hotelId, req.params.no);
  const room = await closeSession(hotelId, req.params.no);
  res.json({ room, archived });
});

roomsRouter.delete("/", requireAdminRole, async (req, res) => {
  const { numbers } = parseBody(roomNumbersSchema, req.body);
  const hotelId = currentUser(req).hotelId;
  for (const no of numbers) await archiveRoomRequests(hotelId, no);
  res.json({ rooms: await removeRooms(hotelId, numbers) });
});
