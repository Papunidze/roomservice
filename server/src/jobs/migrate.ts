import type { ObjectId } from "mongodb";

import { users } from "../db.js";
import { createHotel } from "../hotels/service.js";

interface LegacyUser {
  _id: ObjectId;
  hotel?: string;
  hotelId?: unknown;
}

export async function migrateLegacyUsers() {
  const legacy = await users()
    .find({ hotelId: { $exists: false } })
    .project<LegacyUser>({ hotel: 1 })
    .toArray();

  for (const user of legacy) {
    const hotel = await createHotel(user.hotel ?? "");
    await users().updateOne(
      { _id: user._id },
      {
        $set: {
          hotelId: hotel._id,
          role: "Manager",
          lang: "en",
          telegram: false,
          onShift: true,
          lastActiveAt: null,
        },
        $unset: { hotel: "" },
      },
    );
  }
  if (legacy.length > 0)
    console.log(`[migrate] attached ${legacy.length} user(s) to new hotels`);
}
