import type { ObjectId } from "mongodb";

import { hotels, users } from "../db.js";
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
          lang: hotel.settings.staffLang,
          onShift: true,
          onShiftAt: new Date(),
          lastActiveAt: null,
        },
        $unset: { hotel: "" },
      },
    );
  }
  if (legacy.length > 0)
    console.log(`[migrate] attached ${legacy.length} user(s) to new hotels`);
}

export async function migrateReaderLanguages() {
  const all = await hotels()
    .find({}, { projection: { "settings.staffLang": 1 } })
    .toArray();
  let migrated = 0;
  for (const hotel of all) {
    const result = await users().updateMany(
      { hotelId: hotel._id, onShiftAt: { $exists: false } },
      [
        {
          $set: {
            lang: hotel.settings.staffLang,
            onShiftAt: { $cond: ["$onShift", "$$NOW", null] },
          },
        },
      ],
    );
    migrated += result.modifiedCount;
  }
  if (migrated > 0)
    console.log(
      `[migrate] set the reading language of ${migrated} member(s) to their hotel's team language`,
    );
}
