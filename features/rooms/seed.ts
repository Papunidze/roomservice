import type { GuestSession, Room } from "./types";

const SESSIONS: Record<string, GuestSession> = {
  "412": { lang: "ar", since: "Tue 14:20", nights: "night 2 of 3" },
  "208": { lang: "ru", since: "Mon 16:05", nights: "night 3 of 5" },
  "317": { lang: "tr", since: "Wed 12:40", nights: "night 1 of 2" },
  "104": { lang: "ru", since: "Sun 15:10", nights: "night 4 of 7" },
  "506": { lang: "ar", since: "Tue 13:00", nights: "night 2 of 4" },
  "221": { lang: "tr", since: "Mon 18:30", nights: "night 3 of 3" },
  "133": { lang: "ka", since: "Tue 19:15", nights: "night 2 of 2" },
  "305": { lang: "ar", since: "Mon 14:00", nights: "night 3 of 6" },
  "102": { lang: "ru", since: "Mon 15:10", nights: "night 3 of 4" },
  "204": { lang: "tr", since: "Tue 11:20", nights: "night 2 of 3" },
  "402": { lang: "en", since: "Wed 09:50", nights: "night 1 of 1" },
  "505": { lang: "ru", since: "Sun 20:10", nights: "night 4 of 5" },
};

const IDLE = [
  "Yesterday 18:40",
  "2 days ago",
  "Sep 3",
  "Aug 30",
  "Sep 5",
  "Aug 28",
];

const FLOORS = [
  { floor: 1, count: 12 },
  { floor: 2, count: 12 },
  { floor: 3, count: 12 },
  { floor: 4, count: 12 },
  { floor: 5, count: 8 },
];

const SUITES = ["133", "221", "317"];

function makeRoom(no: string, index: number): Room {
  const session = SESSIONS[no] ?? null;
  return {
    no,
    floor: Math.floor(Number(no) / 100),
    printed: no !== "507" && no !== "508",
    session,
    lastActivity: session?.since ?? (IDLE[index % IDLE.length] as string),
  };
}

export const ROOMS_SEED: Room[] = [
  ...FLOORS.flatMap(({ floor, count }) =>
    Array.from({ length: count }, (_, index) =>
      makeRoom(String(floor * 100 + index + 1), index),
    ),
  ),
  ...SUITES.map(makeRoom),
].sort((a, b) => Number(a.no) - Number(b.no));

export function nextRoomsFor(
  from: number,
  to: number,
  existing: Room[],
): Room[] {
  const taken = new Set(existing.map((room) => room.no));
  const added: Room[] = [];

  for (let number = from; number <= to; number += 1) {
    const no = String(number);
    if (taken.has(no)) continue;
    added.push({
      no,
      floor: Math.floor(number / 100),
      printed: false,
      session: null,
      lastActivity: "never",
    });
  }

  return added;
}
