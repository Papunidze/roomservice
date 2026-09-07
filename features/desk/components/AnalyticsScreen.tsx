"use client";

import { DEMO_ANALYTICS, useRequests } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

import { InlineMeter, StackedMeter } from "./Meters";

const CARD = "rounded-tile border border-line bg-surface p-6";

export function AnalyticsScreen() {
  const requests = useRequests();
  const {
    headline,
    firstChartDay,
    requestsPerDay,
    topProblems,
    guestLanguages,
    repeatRooms,
    insight,
  } = DEMO_ANALYTICS;

  const open = requests.filter((request) => request.status !== "done");
  const overdue = open.filter((request) => request.minutesAgo > 20).length;

  const stats = [
    ...headline.slice(0, 2).map((stat) => ({ ...stat, good: true })),
    {
      label: "OPEN NOW",
      value: String(open.length),
      delta:
        overdue > 0 ? `${overdue} over 20 minutes` : "all within 20 minutes",
      good: overdue === 0,
    },
    ...headline.slice(2).map((stat) => ({ ...stat, good: true })),
  ];
  const peak = Math.max(...requestsPerDay);
  const topCount = topProblems[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-4.5 p-6.5">
      <div className="grid grid-cols-4 gap-4.5">
        {stats.map((stat) => (
          <div key={stat.label} className={CARD}>
            <div className="font-mono text-[10px] tracking-[0.14em] text-ghost">
              {stat.label}
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-[-0.035em]">
              {stat.value}
            </div>
            <div
              className={cn(
                "mt-1.5 text-xs",
                stat.good ? "text-sage" : "text-urgent",
              )}
            >
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-4.5">
        <div className={CARD}>
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              Requests per day
            </span>
            <span className="text-xs text-faint">Last 14 days</span>
          </div>
          <div className="mt-6.5 flex h-52 items-end gap-2.5">
            {requestsPerDay.map((value, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2.5"
              >
                <span className="font-mono text-[10px] text-ghost">
                  {value}
                </span>
                <div
                  style={{ height: `${Math.round((value / peak) * 150)}px` }}
                  className={cn(
                    "w-full rounded-full",
                    index === requestsPerDay.length - 1
                      ? "bg-sage"
                      : "bg-sage/30",
                  )}
                />
                <span className="text-[10.5px] text-ghost">
                  {firstChartDay + index}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <div className="mb-5.5 text-[17px] font-semibold tracking-[-0.02em]">
            Top problem categories
          </div>
          <div className="flex flex-col gap-4">
            {topProblems.map((problem) => (
              <StackedMeter
                key={problem.label}
                label={problem.label}
                value={String(problem.count)}
                percent={(problem.count / topCount) * 100}
                fill="bg-sage"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4.5">
        <div className={CARD}>
          <div className="text-[17px] font-semibold tracking-[-0.02em]">
            Rooms with repeat issues
          </div>
          <div className="mt-1.5 mb-2 text-[12.5px] text-faint">
            Three or more requests in one category this week
          </div>
          <div className="flex flex-col">
            {repeatRooms.map((room) => (
              <div
                key={room.room}
                className="flex items-center gap-4 border-b border-line-soft py-3.5"
              >
                <span className="w-12 text-[19px] font-semibold tracking-[-0.03em]">
                  {room.room}
                </span>
                <span className="flex-1 text-[13.5px] text-muted">
                  {room.issue}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs",
                    room.count >= 4 ? "text-urgent" : "text-faint",
                  )}
                >
                  {room.count}×
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <div className="mb-5.5 text-[17px] font-semibold tracking-[-0.02em]">
            Guest languages
          </div>
          <div className="flex flex-col gap-3.5">
            {guestLanguages.map((language) => (
              <InlineMeter
                key={language.label}
                label={language.label}
                value={`${language.percent}%`}
                percent={language.percent}
                fill="bg-sand"
              />
            ))}
          </div>
          <div className="mt-6 rounded-tile bg-sand/25 px-4.5 py-4 text-[12.5px] leading-relaxed text-soft">
            {insight}
          </div>
        </div>
      </div>
    </div>
  );
}
