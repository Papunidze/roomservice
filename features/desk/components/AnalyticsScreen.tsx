"use client";

import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ANALYTICS_BY_RANGE,
  ANALYTICS_RANGES,
  CATEGORY_ICON,
  CATEGORY_LABEL,
  DEMO_ANALYTICS,
  useRequests,
  type AnalyticsRange,
} from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, showToast } from "@/shared/ui";

import {
  CategoryBars,
  HourChart,
  LanguageMix,
  TrendChart,
} from "./AnalyticsCharts";

const CARD = "rounded-tile border border-line bg-surface px-6 py-5.5";

const REPEAT_GRID =
  "grid grid-cols-[90px_1fr_120px_160px_120px] items-center gap-3";

export function AnalyticsScreen() {
  const requests = useRequests();
  const router = useRouter();
  const [range, setRange] = useState<AnalyticsRange>("7d");
  const figures = ANALYTICS_BY_RANGE[range];

  const overdue = requests.filter(
    (request) =>
      !request.archived && request.status !== "done" && request.minutesAgo > 15,
  ).length;

  const tiles = [
    {
      label: "Tickets",
      value: String(figures.tickets),
      delta: figures.deltas.tickets,
      alert: false,
    },
    {
      label: "Avg first response",
      value: figures.firstResponse,
      delta: figures.deltas.firstResponse,
      alert: false,
    },
    {
      label: "Avg resolution",
      value: figures.resolution,
      delta: figures.deltas.resolution,
      alert: false,
    },
    {
      label: "Open > 15 min",
      value: String(overdue),
      delta: overdue > 0 ? "needs attention" : "all answered",
      alert: overdue > 0,
    },
    {
      label: "Guest satisfaction",
      value: `${figures.satisfaction}%`,
      delta: figures.deltas.satisfaction,
      alert: false,
    },
  ];

  return (
    <div className="scrollbar-slim h-[min(860px,calc(100dvh-8rem))] min-h-[560px] overflow-y-auto px-7 pt-6 pb-8">
      <div className="mb-4.5 flex items-center gap-3">
        <div>
          <div className="text-[22px] font-semibold tracking-[-0.03em]">
            Analytics
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Demo figures · {figures.label}
          </div>
        </div>
        <span className="flex-1" />
        <div className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
          {ANALYTICS_RANGES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={cn(
                "min-h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
                range === key ? "bg-ink text-paper" : "text-muted",
              )}
            >
              {ANALYTICS_BY_RANGE[key].chip}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() =>
            showToast(
              `CSV export · ${figures.tickets} tickets · ${figures.label}`,
            )
          }
        >
          <Download strokeWidth={1.6} className="size-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-3.5">
        {tiles.map((tile) => (
          <div key={tile.label} className={cn(CARD, "px-5 py-4.5")}>
            <div className="font-mono text-[10px] tracking-[0.14em] text-ghost uppercase">
              {tile.label}
            </div>
            <div
              className={cn(
                "mt-2.5 text-3xl font-semibold tracking-[-0.035em]",
                tile.alert && "text-urgent",
              )}
            >
              {tile.value}
            </div>
            <div
              className={cn(
                "mt-1.5 text-xs",
                tile.alert ? "text-urgent" : "text-faint",
              )}
            >
              {tile.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        <div className={CARD}>
          <CategoryBars scale={figures.scale} />
        </div>
        <div className={CARD}>
          <HourChart scale={figures.scale} />
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-[1.6fr_1fr] gap-3.5">
        <div className={CARD}>
          <TrendChart />
        </div>
        <div className={CARD}>
          <LanguageMix />
        </div>
      </div>

      <div className={cn(CARD, "mt-3.5")}>
        <div className="flex items-baseline justify-between">
          <span className="text-base font-semibold tracking-[-0.02em]">
            Rooms with repeat issues
          </span>
          <span className="text-xs text-faint">
            Same category, 3+ times in {figures.label}
          </span>
        </div>
        <div
          className={cn(
            REPEAT_GRID,
            "pt-3.5 pb-2 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
          )}
        >
          <span>Room</span>
          <span>Issue</span>
          <span>Count</span>
          <span>Last issue</span>
          <span />
        </div>
        {DEMO_ANALYTICS.repeatRooms.map((row) => {
          const Icon = CATEGORY_ICON[row.category];
          return (
            <div
              key={row.room}
              className={cn(REPEAT_GRID, "min-h-13 border-t border-line-soft")}
            >
              <span className="text-[17px] font-semibold tracking-[-0.03em]">
                {row.room}
              </span>
              <span className="flex items-center gap-2 text-[13.5px]">
                <Icon strokeWidth={1.6} className="size-3.5 text-sage" />
                {CATEGORY_LABEL[row.category]}
              </span>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold",
                  row.count >= 4
                    ? "bg-urgent/10 text-urgent"
                    : "bg-ink/6 text-muted",
                )}
              >
                {row.count}×
              </span>
              <span className="font-mono text-[11.5px] text-faint">
                {row.last}
              </span>
              <Button
                variant="ghost"
                className="min-h-8 justify-self-end px-3 text-xs"
                onClick={() => router.push(`/desk?room=${row.room}`)}
              >
                Open tickets
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
