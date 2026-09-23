import { Router } from "express";
import { z } from "zod";

import { currentUser } from "../lib/current-user.js";
import { parseBody } from "../lib/parse-body.js";
import { requireAdminRole, requireAuth } from "../middleware/auth.js";
import { analytics, RANGES } from "./service.js";

const querySchema = z.object({ range: z.enum(RANGES).default("7d") });

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth, requireAdminRole);

analyticsRouter.get("/", async (req, res) => {
  const { range } = parseBody(querySchema, req.query);
  res.json({ analytics: await analytics(currentUser(req).hotelId, range) });
});
