import { Router } from "express";

import { teamConfigPatchSchema } from "../hotels/schemas.js";
import { getHotel, updateTeamConfig } from "../hotels/service.js";
import { currentUser } from "../lib/current-user.js";
import { parseBody } from "../lib/parse-body.js";
import {
  requireAdminRole,
  requireAuth,
  writesRequireActive,
} from "../middleware/auth.js";
import { inviteSchema, memberPatchSchema } from "./schemas.js";
import {
  inviteMember,
  listMembers,
  patchMember,
  removeMember,
  resetMemberPassword,
} from "./service.js";

export const teamRouter = Router();

teamRouter.use(requireAuth, writesRequireActive);

teamRouter.get("/", async (req, res) => {
  const hotelId = currentUser(req).hotelId;
  const [hotel, members] = await Promise.all([
    getHotel(hotelId),
    listMembers(hotelId),
  ]);
  res.json({ team: { members, ...hotel.team } });
});

teamRouter.patch("/", requireAdminRole, async (req, res) => {
  const patch = parseBody(teamConfigPatchSchema, req.body);
  res.json({ config: await updateTeamConfig(currentUser(req).hotelId, patch) });
});

teamRouter.post("/members", requireAdminRole, async (req, res) => {
  const user = currentUser(req);
  const input = parseBody(inviteSchema, req.body);
  const member = await inviteMember(user.hotelId, user.hotel, user.name, input);
  res.status(201).json({ member });
});

teamRouter.patch<{ id: string }>(
  "/members/:id",
  requireAdminRole,
  async (req, res) => {
    const patch = parseBody(memberPatchSchema, req.body);
    res.json({
      member: await patchMember(currentUser(req).hotelId, req.params.id, patch),
    });
  },
);

teamRouter.post<{ id: string }>(
  "/members/:id/reset-password",
  requireAdminRole,
  async (req, res) => {
    const user = currentUser(req);
    await resetMemberPassword(
      user.hotelId,
      req.params.id,
      user.hotel,
      user.name,
    );
    res.status(204).end();
  },
);

teamRouter.delete<{ id: string }>(
  "/members/:id",
  requireAdminRole,
  async (req, res) => {
    await removeMember(currentUser(req).hotelId, req.params.id);
    res.status(204).end();
  },
);
