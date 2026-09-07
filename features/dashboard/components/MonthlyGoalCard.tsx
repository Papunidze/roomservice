import { ArrowUpRight } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { formatGel } from "@/shared/lib/money";
import { formatPercent, formatSignedPercent } from "@/shared/lib/number";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

import type { MonthlyGoal } from "../types";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MonthlyGoalCard({
  targetTetri,
  reachedTetri,
  todayTetri,
  deltaPercent,
}: MonthlyGoal) {
  const reachedPercent = (reachedTetri / targetTetri) * 100;

  const cells = [
    { label: ka.dashboard.goal.target, value: formatGel(targetTetri) },
    { label: ka.dashboard.goal.reached, value: formatGel(reachedTetri) },
    { label: ka.dashboard.goal.today, value: formatGel(todayTetri) },
  ];

  return (
    <Card className="px-6.5 py-6 text-center">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="text-base font-bold">{ka.dashboard.goal.title}</div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted/90 text-label">
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>

      <div className="relative mx-auto mt-2 mb-1 aspect-square w-[min(210px,100%)]">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#EDEBF7"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - reachedPercent / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[38px] font-extrabold tracking-[-0.03em]">
            {formatPercent(reachedPercent)}
          </div>
          <Badge variant="success" className="mt-1.5 text-xs">
            {formatSignedPercent(deltaPercent)}
          </Badge>
        </div>
      </div>

      <div className="mb-4.5 text-[13px] leading-relaxed text-label">
        {formatGel(targetTetri)}-იანი {ka.dashboard.goal.summaryPrefix}{" "}
        {formatGel(reachedTetri)}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(84px,1fr))] gap-x-3 gap-y-2 border-t border-border pt-4">
        {cells.map((cell) => (
          <div key={cell.label}>
            <div className="mb-1 text-[11.5px] text-muted-foreground">
              {cell.label}
            </div>
            <div className="text-[14.5px] font-bold break-words">
              {cell.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
