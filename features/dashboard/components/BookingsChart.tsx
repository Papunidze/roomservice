import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/card";

import type { BookingsSummary, WeekdayBookings } from "../types";

const HEADROOM = 1.1;

interface BookingsChartProps {
  week: WeekdayBookings[];
  summary: BookingsSummary;
}

export function BookingsChart({ week, summary }: BookingsChartProps) {
  const peak = Math.max(...week.map((day) => day.count));
  const scale = peak * HEADROOM;

  return (
    <Card className="px-6.5 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="text-base font-bold">{ka.dashboard.chart.title}</div>
        <div className="flex gap-1.5 rounded-full bg-muted/80 p-1">
          <span className="rounded-full bg-primary px-3.75 py-1.75 text-[12.5px] font-bold text-white">
            {ka.dashboard.chart.week}
          </span>
          <span
            title={ka.nav.soon}
            className="rounded-full px-3.75 py-1.75 text-[12.5px] font-bold text-ghost"
          >
            {ka.dashboard.chart.month}
          </span>
        </div>
      </div>

      <div className="mb-4.5 flex items-baseline gap-2.5">
        <div className="text-3xl font-extrabold tracking-[-0.03em]">
          {summary.count}
        </div>
        <div className="text-[13px] text-muted-foreground">
          {ka.dashboard.chart.bookings} · {summary.byAssistant}{" "}
          {ka.dashboard.chart.byAssistant}
        </div>
      </div>

      <div className="grid h-52 grid-cols-7 items-end gap-2.5">
        {week.map((day) => {
          const isPeak = day.count === peak;
          return (
            <div
              key={day.weekday}
              className="flex h-full flex-col items-center justify-end gap-2.5"
            >
              {isPeak ? (
                <div className="rounded-full bg-foreground px-2.75 py-1.25 text-[11.5px] font-bold whitespace-nowrap text-white shadow-ink">
                  ↑ {day.count}
                </div>
              ) : (
                <div className="h-0" />
              )}
              <div
                className={cn(
                  "w-full max-w-10.5 rounded-full transition-[height] duration-300",
                  isPeak
                    ? "bg-linear-180 from-primary-light to-primary-strong shadow-primary-lg"
                    : "bg-primary/12",
                )}
                style={{ height: `${(day.count / scale) * 100}%` }}
              />
              <div
                className={cn(
                  "text-xs",
                  isPeak
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground",
                )}
              >
                {ka.weekdaysShort[day.weekday]}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
