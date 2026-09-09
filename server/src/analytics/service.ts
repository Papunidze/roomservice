import type { ObjectId } from "mongodb";

import { requests } from "../db.js";
import type { Category, LangCode } from "../domain.js";
import type { RequestDoc } from "../requests/types.js";

export const RANGES = ["today", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

function bounds(range: Range, now: Date) {
  const start = new Date(now);
  if (range === "today") start.setHours(0, 0, 0, 0);
  else start.setTime(now.getTime() - (range === "7d" ? 7 : 30) * DAY_MS);
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

export async function analytics(
  hotelId: ObjectId,
  range: Range,
  now = new Date(),
) {
  const { start, previous } = bounds(range, now);
  const docs = await requests()
    .find({ hotelId, createdAt: { $gte: previous } })
    .toArray();
  const current = docs.filter((doc) => doc.createdAt >= start);
  const before = docs.filter((doc) => doc.createdAt < start);

  const ticketsByHour = Array.from({ length: 24 }, () => 0);
  for (const doc of current) ticketsByHour[doc.createdAt.getHours()]! += 1;

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

  const byDay = new Map<string, RequestDoc[]>();
  for (const doc of current) {
    const day = doc.createdAt.toISOString().slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), doc]);
  }
  const trend = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, docs]) => {
      const { firstResponseMinutes, resolutionMinutes } = figures(docs);
      return { day, firstResponseMinutes, resolutionMinutes };
    });

  const languageCounts = countBy(current, (doc) => doc.language.base);
  const total = current.length || 1;

  return {
    range,
    from: start.toISOString(),
    to: now.toISOString(),
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
