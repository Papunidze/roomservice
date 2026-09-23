import { hotels } from "../db.js";
import { withDefaults } from "../hotels/service.js";
import { escalateStale } from "../requests/service.js";
import { closeIdleSessions } from "../rooms/service.js";
import { endLongShifts } from "../team/service.js";

const INTERVAL_MS = 60_000;

async function run() {
  const all = await hotels().find().toArray();
  for (const doc of all) {
    const hotel = withDefaults(doc);
    const label = hotel.settings.hotel.name || hotel._id.toHexString();
    const escalated = await escalateStale(hotel);
    if (escalated > 0)
      console.log(
        `[escalation] ${escalated} request(s) escalated for ${label}`,
      );
    const closed = await closeIdleSessions(
      hotel._id,
      hotel.settings.sessions.autoCloseHours,
    );
    if (closed > 0)
      console.log(`[sessions] ${closed} idle room(s) closed for ${label}`);
    const offShift = await endLongShifts(hotel._id, hotel.team.offShiftHours);
    if (offShift > 0)
      console.log(
        `[shifts] ${offShift} member(s) taken off shift for ${label}`,
      );
  }
}

export function startScheduler() {
  const timer = setInterval(() => {
    run().catch((error: unknown) => console.error("[scheduler]", error));
  }, INTERVAL_MS);
  timer.unref();
  return timer;
}
