import { Router } from "express";

import { parseBody } from "../lib/parse-body.js";
import { currentUser } from "../lib/current-user.js";
import { streamEvents } from "../lib/events.js";
import { requireAuth } from "../middleware/auth.js";
import {
  listQuerySchema,
  noteSchema,
  requestPatchSchema,
  staffReplySchema,
} from "./schemas.js";
import {
  addNote,
  assignRequest,
  listRequests,
  replyToRequest,
  setStatus,
} from "./service.js";

export const requestsRouter = Router();

requestsRouter.use(requireAuth);

requestsRouter.get("/", async (req, res) => {
  const { since } = parseBody(listQuerySchema, req.query);
  const hotelId = currentUser(req).hotelId;
  res.json({
    requests: await listRequests(hotelId, since ? new Date(since) : undefined),
  });
});

requestsRouter.get("/events", (req, res) => {
  streamEvents(res, currentUser(req).hotelId.toHexString());
});

const seq = (value: string) => Number.parseInt(value, 10);

requestsRouter.post("/:id/reply", async (req, res) => {
  const user = currentUser(req);
  const message = parseBody(staffReplySchema, req.body);
  res.json({
    request: await replyToRequest(
      user.hotelId,
      seq(req.params.id),
      user.name,
      message,
    ),
  });
});

requestsRouter.post("/:id/notes", async (req, res) => {
  const user = currentUser(req);
  const { text } = parseBody(noteSchema, req.body);
  res.json({
    request: await addNote(user.hotelId, seq(req.params.id), user.name, text),
  });
});

requestsRouter.patch("/:id", async (req, res) => {
  const user = currentUser(req);
  const patch = parseBody(requestPatchSchema, req.body);
  const id = seq(req.params.id);

  let request = null;
  if (patch.assignee !== undefined)
    request = await assignRequest(user.hotelId, id, user.name, patch.assignee);
  if (patch.status !== undefined)
    request = await setStatus(user.hotelId, id, patch.status);
  if (!request) throw new Error("Nothing to update");

  res.json({ request });
});
