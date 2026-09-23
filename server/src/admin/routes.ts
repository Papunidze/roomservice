import { Router } from "express";
import { ObjectId } from "mongodb";

import { hotels, requests, rooms, users } from "../db.js";
import { billingPatchSchema } from "../hotels/schemas.js";
import {
  billingStatus,
  updateBilling,
  withDefaults,
} from "../hotels/service.js";
import type { HotelDoc } from "../hotels/types.js";
import { HttpError } from "../lib/http-error.js";
import { parseBody } from "../lib/parse-body.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export const adminRouter = Router();

adminRouter.use(requireAuth, requireOwner);

async function summarise(hotel: HotelDoc) {
  const weekAgo = new Date(Date.now() - 7 * DAY_MS);
  const [members, roomCount, weekRequests, manager] = await Promise.all([
    users().countDocuments({ hotelId: hotel._id }),
    rooms().countDocuments({ hotelId: hotel._id }),
    requests().countDocuments({
      hotelId: hotel._id,
      createdAt: { $gte: weekAgo },
    }),
    users().findOne(
      { hotelId: hotel._id, role: "Manager" },
      { sort: { createdAt: 1 } },
    ),
  ]);
  return {
    id: hotel._id.toHexString(),
    name: hotel.settings.hotel.name,
    manager: manager ? { name: manager.name, email: manager.email } : null,
    members,
    rooms: roomCount,
    weekRequests,
    createdAt: hotel.createdAt.toISOString(),
    plan: hotel.billing.plan,
    status: billingStatus(hotel.billing),
    trialEndsAt: hotel.billing.trialEndsAt.toISOString(),
    paidUntil: hotel.billing.paidUntil?.toISOString() ?? null,
  };
}

adminRouter.get("/hotels", async (_req, res) => {
  const docs = await hotels().find().sort({ createdAt: -1 }).toArray();
  res.json({
    hotels: await Promise.all(docs.map((doc) => summarise(withDefaults(doc)))),
  });
});

adminRouter.patch<{ id: string }>("/hotels/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    throw new HttpError(404, "hotel_not_found", "No such hotel");
  const patch = parseBody(billingPatchSchema, req.body);
  const hotel = await updateBilling(new ObjectId(req.params.id), {
    ...(patch.plan !== undefined && { plan: patch.plan }),
    ...(patch.trialEndsAt !== undefined && {
      trialEndsAt: new Date(patch.trialEndsAt),
    }),
    ...(patch.paidUntil !== undefined && {
      paidUntil: patch.paidUntil === null ? null : new Date(patch.paidUntil),
    }),
  });
  res.json({ hotel: await summarise(hotel) });
});
