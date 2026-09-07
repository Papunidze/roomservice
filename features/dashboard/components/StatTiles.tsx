import { ArrowUpRight } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { formatGel } from "@/shared/lib/money";
import { formatPercent, formatSignedPercent } from "@/shared/lib/number";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

import type {
  AssistantSummary,
  BookingsSummary,
  RevenueSummary,
} from "../types";

interface StatTilesProps {
  revenue: RevenueSummary;
  bookings: BookingsSummary;
  assistant: AssistantSummary;
}

export function StatTiles({ revenue, bookings, assistant }: StatTilesProps) {
  return (
    <div className="mb-4 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(232px,1fr))]">
      <Card variant="primary" className="px-6 py-5.5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[13.5px] font-semibold text-white/80">
            {ka.dashboard.revenue.label}
          </div>
          <span className="grid size-8.5 shrink-0 place-items-center rounded-full bg-white/20">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="mt-3.5 text-[clamp(30px,3.4vw,48px)] leading-[1.05] font-extrabold tracking-[-0.035em] whitespace-nowrap">
          {formatGel(revenue.totalTetri)}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="onDark" className="text-xs">
            {formatSignedPercent(revenue.deltaPercent)}
          </Badge>
          <span className="text-[12.5px] text-white/80">
            {ka.dashboard.revenue.averageCheck}{" "}
            {formatGel(revenue.averageCheckTetri)}
          </span>
        </div>
      </Card>

      <StatCard
        label={ka.dashboard.stats.bookings}
        value={String(bookings.count)}
        delta={formatSignedPercent(bookings.deltaPercent)}
        deltaTone="success"
        note={`${bookings.byAssistant} ${ka.dashboard.stats.bookingsNote}`}
      />

      <StatCard
        label={ka.dashboard.stats.handled}
        value={String(assistant.handled)}
        delta={formatPercent(assistant.handledPercent)}
        deltaTone="warning"
        note={`${assistant.handedOff} ${ka.dashboard.stats.handledNote}`}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  deltaTone: "success" | "warning";
  note: string;
}

function StatCard({ label, value, delta, deltaTone, note }: StatCardProps) {
  return (
    <Card className="px-6 py-5.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-[13.5px] font-semibold text-label">
          {label}
        </div>
        <Badge variant={deltaTone} className="text-xs">
          {delta}
        </Badge>
      </div>
      <div className="mt-3.5 text-[clamp(30px,3.4vw,48px)] leading-[1.05] font-extrabold tracking-[-0.035em] whitespace-nowrap">
        {value}
      </div>
      <div className="mt-3 text-[12.5px] text-muted-foreground">{note}</div>
    </Card>
  );
}
