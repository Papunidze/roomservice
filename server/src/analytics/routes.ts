import { Router } from "express";
import { z } from "zod";

import { currentUser } from "../lib/current-user.js";
import { parseBody } from "../lib/parse-body.js";
import { requireAuth, requireManager } from "../middleware/auth.js";
import { analytics, RANGES } from "./service.js";

const querySchema = z.object({ range: z.enum(RANGES).default("7d") });

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth, requireManager);

analyticsRouter.get("/", async (req, res) => {
  const { range } = parseBody(querySchema, req.query);
  res.json({ analytics: await analytics(currentUser(req).hotelId, range) });
});
