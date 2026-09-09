"use client";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  type Analytics,
} from "@/features/requests";
import { DICTIONARY } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const SHIFT_START = 8;
const SHIFT_END = 22;

const MIX_FILL = [
  "bg-sage",
  "bg-sage-deep",
  "bg-sand",
  "bg-ink/55",
  "bg-ink/20",
];

const MIX_OTHER_FILL = "bg-ink/8";

export function CategoryBars({ rows }: { rows: Analytics["categoryTotals"] }) {
  const peak = rows[0]?.count ?? 1;
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold tracking-[-0.02em]">
          Tickets by category
        </span>
        <span className="text-xs text-faint">{total} tickets</span>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {rows.map((row) => {
          const Icon = CATEGORY_ICON[row.category];
          return (
            <div
              key={row.category}
              className="grid grid-cols-[140px_1fr_44px] items-center gap-3"
            >
              <span className="flex items-center gap-2 text-[13px]">
                <Icon strokeWidth={1.6} className="size-3.5 text-sage" />
                {CATEGORY_LABEL[row.category]}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-ink/6">
                <div
                  style={{ width: `${Math.round((row.count / peak) * 100)}%` }}
                  className="h-full rounded-full bg-sage"
                />
              </div>
              <span className="text-right font-mono text-xs text-muted">
                {row.count}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function HourChart({ hours }: { hours: number[] }) {
  const peak = Math.max(1, ...hours);
  const peakHour = hours.indexOf(peak);

  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold tracking-[-0.02em]">
          Tickets by hour of day
        </span>
        <span className="text-xs text-faint">
          Peak {String(peakHour).padStart(2, "0")}:00–
          {String(peakHour + 1).padStart(2, "0")}:00
        </span>
      </div>
      <div className="mt-6 flex h-37.5 items-end gap-1">
        {hours.map((value, hour) => (
          <div
            key={hour}
            title={`${String(hour).padStart(2, "0")}:00 · ${value} tickets`}
            style={{ height: `${Math.round((value / peak) * 100)}%` }}
            className={cn(
              "flex-1 rounded-t-[4px] rounded-b-[2px]",
              hour >= SHIFT_START && hour < SHIFT_END ? "bg-sage" : "bg-sand",
              hour === peakHour ? "opacity-100" : "opacity-80",
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-ghost">
        {["00", "06", "12", "18", "23"].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2.5 text-xs text-faint">
        <span className="size-2.5 rounded-[3px] bg-sage" />
        <span>Shift hours 08–22</span>
        <span className="ml-2 size-2.5 rounded-[3px] bg-sand" />
        <span>Night · escalation active</span>
      </div>
    </>
  );
}

function path(values: number[], max: number) {
  return values
    .map(
      (value, index) =>
        `${index ? "L" : "M"}${((index / (values.length - 1)) * 600).toFixed(1)} ${(
          170 -
          (value / max) * 160
        ).toFixed(1)}`,
    )
    .join(" ");
}

interface TrendChartProps {
  points: Analytics["trend"];
  label: string;
}

export function TrendChart({ points, label }: TrendChartProps) {
  const firstResponseTrend = points.map((p) => p.firstResponseMinutes ?? 0);
  const resolutionTrend = points.map((p) => p.resolutionMinutes ?? 0);
  const max = Math.max(30, ...firstResponseTrend, ...resolutionTrend);
  const ticks = [max, (max * 2) / 3, max / 3, 0].map(
    (v) => `${Math.round(v)}m`,
  );
  const trendDays = points
    .filter(
      (_, index) => index % Math.max(1, Math.ceil(points.length / 5)) === 0,
    )
    .map((p) => p.day.slice(5));

  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold tracking-[-0.02em]">
          Response time · {label}
        </span>
        <span className="flex gap-3.5 text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-sage" />
            First response
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-sand" />
            Resolution
          </span>
        </span>
      </div>

      <div className="relative mt-5 h-42.5">
        <div className="absolute inset-0 flex flex-col justify-between">
          {ticks.map((tick, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span className="w-8.5 text-right font-mono text-[10px] text-ghost">
                {tick}
              </span>
              <span className="h-px flex-1 bg-ink/6" />
            </div>
          ))}
        </div>
        <svg
          viewBox="0 0 600 170"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute top-0 left-11 h-42.5 w-[calc(100%-2.75rem)] overflow-visible"
        >
          <path
            d={path(resolutionTrend, max)}
            fill="none"
            stroke="var(--sand)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path(firstResponseTrend, max)}
            fill="none"
            stroke="var(--sage)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-2 ml-11 flex justify-between font-mono text-[10px] text-ghost">
        {trendDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </>
  );
}

export function LanguageMix({
  entries,
}: {
  entries: Analytics["languageMix"];
}) {
  const top = entries.slice(0, MIX_FILL.length);
  const other = Math.max(
    0,
    100 - top.reduce((sum, entry) => sum + entry.percent, 0),
  );
  return (
    <>
      <div className="text-base font-semibold tracking-[-0.02em]">
        Language mix
      </div>
      <div className="mt-5 flex h-3.5 gap-0.5 overflow-hidden rounded-full">
        {top.map((entry, index) => (
          <div
            key={entry.lang}
            style={{ width: `${entry.percent}%` }}
            className={MIX_FILL[index]}
          />
        ))}
        <div style={{ width: `${other}%` }} className={MIX_OTHER_FILL} />
      </div>
      <div className="mt-4.5 flex flex-col gap-2.5">
        {top.map((entry, index) => (
          <div
            key={entry.lang}
            className="flex items-center gap-2.5 text-[13px]"
          >
            <span
              className={cn("size-2.5 shrink-0 rounded-[3px]", MIX_FILL[index])}
            />
            <span className="flex-1">{DICTIONARY[entry.lang].name}</span>
            <span className="font-mono text-xs text-muted">
              {entry.percent}%
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2.5 text-[13px]">
          <span
            className={cn("size-2.5 shrink-0 rounded-[3px]", MIX_OTHER_FILL)}
          />
          <span className="flex-1 text-muted">Other languages</span>
          <span className="font-mono text-xs text-muted">{other}%</span>
        </div>
      </div>
    </>
  );
}
