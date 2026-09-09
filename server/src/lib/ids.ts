import type { ObjectId } from "mongodb";

import { counters } from "../db.js";

export async function nextSequence(hotelId: ObjectId, name: string) {
  const counter = await counters().findOneAndUpdate(
    { hotelId, name },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return counter?.value ?? 1;
}
