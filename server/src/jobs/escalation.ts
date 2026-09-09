import { hotels } from "../db.js";
import { escalateStale } from "../requests/service.js";

const INTERVAL_MS = 60_000;

async function run() {
  const all = await hotels()
    .find({ "team.escalation.enabled": true })
    .toArray();
  for (const hotel of all) {
    const count = await escalateStale(hotel);
    if (count > 0)
      console.log(
        `[escalation] ${count} request(s) escalated for ${hotel.settings.hotel.name || hotel._id.toHexString()}`,
      );
  }
}

export function startEscalationJob() {
  const timer = setInterval(() => {
    run().catch((error: unknown) => console.error("[escalation]", error));
  }, INTERVAL_MS);
  timer.unref();
  return timer;
}
