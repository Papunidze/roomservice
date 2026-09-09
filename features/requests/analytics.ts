"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

import { apiGet } from "@/shared/lib/api";

import { langCodeSchema } from "./schemas";
import { CATEGORIES } from "./types";

export const ANALYTICS_RANGES = ["today", "7d", "30d"] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export const RANGE_LABEL: Record<
  AnalyticsRange,
  { chip: string; label: string }
> = {
  today: { chip: "Today", label: "today" },
  "7d": { chip: "7 days", label: "the last 7 days" },
  "30d": { chip: "30 days", label: "the last 30 days" },
};

const figuresSchema = z.object({
  tickets: z.number(),
  firstResponseMinutes: z.number().nullable(),
  resolutionMinutes: z.number().nullable(),
});

const analyticsSchema = z.object({
  analytics: z.object({
    range: z.enum(ANALYTICS_RANGES),
    current: figuresSchema,
    previous: figuresSchema,
    categoryTotals: z.array(
      z.object({ category: z.enum(CATEGORIES), count: z.number() }),
    ),
    ticketsByHour: z.array(z.number()).length(24),
    languageMix: z.array(
      z.object({ lang: langCodeSchema, percent: z.number() }),
    ),
    repeatRooms: z.array(
      z.object({
        room: z.string(),
        category: z.enum(CATEGORIES),
        count: z.number(),
        last: z.string(),
      }),
    ),
    trend: z.array(
      z.object({
        day: z.string(),
        firstResponseMinutes: z.number().nullable(),
        resolutionMinutes: z.number().nullable(),
      }),
    ),
  }),
});

export type Analytics = z.infer<typeof analyticsSchema>["analytics"];

export function useAnalytics(range: AnalyticsRange) {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void apiGet(`/api/analytics?range=${range}`, analyticsSchema).then(
      (result) => {
        if (isCurrent && result.ok) setData(result.data.analytics);
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [range]);

  return data;
}

export function formatMinutes(minutes: number | null) {
  if (minutes === null) return "—";
  if (minutes < 1) return `${Math.round(minutes * 60)}s`;
  if (minutes < 60) {
    const whole = Math.floor(minutes);
    const seconds = Math.round((minutes - whole) * 60);
    return seconds ? `${whole}m ${seconds}s` : `${whole}m`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${Math.round(minutes % 60)}m`;
}

export function deltaLabel(
  current: number | null,
  previous: number | null,
  lowerIsBetter: boolean,
) {
  if (current === null || previous === null) return "no comparison yet";
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return "same as the period before";
  const sign = diff > 0 ? "+" : "−";
  const value =
    Number.isInteger(current) && Number.isInteger(previous)
      ? String(Math.abs(diff))
      : formatMinutes(Math.abs(diff));
  const better = lowerIsBetter ? diff < 0 : diff > 0;
  return `${sign}${value} vs period before${better ? "" : " · worse"}`;
}
