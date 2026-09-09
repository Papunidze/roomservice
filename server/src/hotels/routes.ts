import { Router } from "express";

import { parseBody } from "../lib/parse-body.js";
import { currentUser } from "../lib/current-user.js";
import { requireAuth, requireManager } from "../middleware/auth.js";
import { settingsPatchSchema } from "./schemas.js";
import { getHotel, updateSettings } from "./service.js";

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

settingsRouter.get("/", async (req, res) => {
  const hotel = await getHotel(currentUser(req).hotelId);
  res.json({ settings: hotel.settings });
});

settingsRouter.patch("/", requireManager, async (req, res) => {
  const patch = parseBody(settingsPatchSchema, req.body);
  res.json({ settings: await updateSettings(currentUser(req).hotelId, patch) });
});
