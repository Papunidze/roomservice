import { Router } from "express";

import { parseBody } from "../lib/parse-body.js";
import { currentUser } from "../lib/current-user.js";
import {
  requireActive,
  requireAuth,
  requireManager,
} from "../middleware/auth.js";
import { rooms } from "../db.js";
import { settingsPatchSchema } from "./schemas.js";
import { getHotel, toPublicBilling, updateSettings } from "./service.js";

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

settingsRouter.get("/", async (req, res) => {
  const hotel = await getHotel(currentUser(req).hotelId);
  res.json({ settings: hotel.settings });
});

settingsRouter.patch("/", requireManager, requireActive, async (req, res) => {
  const patch = parseBody(settingsPatchSchema, req.body);
  res.json({ settings: await updateSettings(currentUser(req).hotelId, patch) });
});

export const billingRouter = Router();

billingRouter.use(requireAuth);

billingRouter.get("/", async (req, res) => {
  const hotelId = currentUser(req).hotelId;
  const [hotel, roomCount] = await Promise.all([
    getHotel(hotelId),
    rooms().countDocuments({ hotelId }),
  ]);
  res.json({ billing: toPublicBilling(hotel, roomCount) });
});
