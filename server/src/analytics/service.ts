import type { ObjectId } from "mongodb";

import { requests } from "../db.js";
import type { Category, LangCode } from "../domain.js";
import { getHotel } from "../hotels/service.js";
import type { RequestDoc } from "../requests/types.js";

export const RANGES = ["today", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

function localClock(timeZone: string) {
  const format = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  return (date: Date) => {
    const parts = Object.fromEntries(
      format.formatToParts(date).map((part) => [part.type, part.value]),
    );
    return {
      day: `${parts.year}-${parts.month}-${parts.day}`,
      hour: Number(parts.hour),
      msIntoDay:
        (Number(parts.hour) * 3600 +
          Number(parts.minute) * 60 +
          Number(parts.second)) *
        1000,
    };
  };
}

function bounds(range: Range, now: Date, clock: ReturnType<typeof localClock>) {
  const start =
    range === "today"
      ? new Date(now.getTime() - clock(now).msIntoDay)
      : new Date(now.getTime() - (range === "7d" ? 7 : 30) * DAY_MS);
  const previous = new Date(
    start.getTime() - (now.getTime() - start.getTime()),
  );
  return { start, previous };
}

const average = (values: number[]) =>
  values.length === 0
    ? null
    : values.reduce((a, b) => a + b, 0) / values.length;

const minutesBetween = (from: Date, to: Date) =>
  (to.getTime() - from.getTime()) / 60_000;

function figures(docs: RequestDoc[]) {
  return {
    tickets: docs.length,
    firstResponseMinutes: average(
      docs
        .filter((doc) => doc.firstResponseAt)
        .map((doc) =>
          minutesBetween(doc.createdAt, doc.firstResponseAt as Date),
        ),
    ),
    resolutionMinutes: average(
      docs
        .filter((doc) => doc.resolvedAt)
        .map((doc) => minutesBetween(doc.createdAt, doc.resolvedAt as Date)),
    ),
    rating: average(
      docs.filter((doc) => doc.rating).map((doc) => doc.rating?.score ?? 0),
    ),
    ratings: docs.filter((doc) => doc.rating).length,
  };
}

function countBy<K extends string>(
  docs: RequestDoc[],
  key: (doc: RequestDoc) => K,
) {
  const counts = new Map<K, number>();
  for (const doc of docs) counts.set(key(doc), (counts.get(key(doc)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function groupBy<K extends string>(
  docs: RequestDoc[],
  key: (doc: RequestDoc) => K,
) {
  const groups = new Map<K, RequestDoc[]>();
  for (const doc of docs)
    groups.set(key(doc), [...(groups.get(key(doc)) ?? []), doc]);
  return groups;
}

export async function analytics(
  hotelId: ObjectId,
  range: Range,
  now = new Date(),
) {
  const hotel = await getHotel(hotelId);
  const clock = localClock(hotel.settings.hotel.timezone);
  const { start, previous } = bounds(range, now, clock);
  const docs = await requests()
    .find({ hotelId, createdAt: { $gte: previous } })
    .toArray();
  const current = docs.filter((doc) => doc.createdAt >= start);
  const before = docs.filter((doc) => doc.createdAt < start);

  const ticketsByHour = Array.from({ length: 24 }, () => 0);
  for (const doc of current) ticketsByHour[clock(doc.createdAt).hour]! += 1;

  const byRoom = new Map<
    string,
    { category: Category; count: number; last: Date }
  >();
  for (const doc of current) {
    const key = `${doc.roomNo}:${doc.category}`;
    const entry = byRoom.get(key);
    if (entry) {
      entry.count += 1;
      if (doc.createdAt > entry.last) entry.last = doc.createdAt;
    } else
      byRoom.set(key, {
        category: doc.category,
        count: 1,
        last: doc.createdAt,
      });
  }

  const trend = [
    ...groupBy(current, (doc) => clock(doc.createdAt).day).entries(),
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, docs]) => {
      const { firstResponseMinutes, resolutionMinutes } = figures(docs);
      return { day, firstResponseMinutes, resolutionMinutes };
    });

  const byStaff = [
    ...groupBy(
      current.filter((doc) => doc.assignee !== "Unassigned"),
      (doc) => doc.assignee,
    ).entries(),
  ]
    .map(([name, docs]) => {
      const { tickets, firstResponseMinutes, rating } = figures(docs);
      return {
        name,
        tickets,
        done: docs.filter((doc) => doc.status === "done").length,
        firstResponseMinutes,
        rating,
      };
    })
    .sort((a, b) => b.tickets - a.tickets);

  const languageCounts = countBy(current, (doc) => doc.language.base);
  const total = current.length || 1;

  return {
    range,
    from: start.toISOString(),
    to: now.toISOString(),
    timezone: hotel.settings.hotel.timezone,
    current: figures(current),
    previous: figures(before),
    categoryTotals: countBy(current, (doc) => doc.category).map(
      ([category, count]) => ({
        category,
        count,
      }),
    ),
    ticketsByHour,
    trend,
    byStaff,
    languageMix: languageCounts.map(([lang, count]) => ({
      lang: lang as LangCode,
      percent: Math.round((count / total) * 100),
    })),
    repeatRooms: [...byRoom.entries()]
      .filter(([, entry]) => entry.count > 1)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([key, entry]) => ({
        room: key.split(":")[0] ?? "",
        category: entry.category,
        count: entry.count,
        last: entry.last.toISOString(),
      })),
  };
}
