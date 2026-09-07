import { Plus } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { formatLongDate } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";

import { BookingsChart } from "./BookingsChart";
import { HandoffBanner } from "./HandoffBanner";
import { MonthlyGoalCard } from "./MonthlyGoalCard";
import { QuickActions } from "./QuickActions";
import { StatTiles } from "./StatTiles";
import { TodayBookings } from "./TodayBookings";
import { UnreadMessagesCard } from "./UnreadMessagesCard";
import type { DashboardData } from "../types";

interface DashboardScreenProps {
  data: DashboardData;
  today: Date;
}

export function DashboardScreen({ data, today }: DashboardScreenProps) {
  return (
    <div>
      <div className="mb-5.5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 text-[12.5px] font-semibold text-muted-foreground">
            {formatLongDate(today)}
          </div>
          <h1 className="text-[34px] leading-tight font-extrabold tracking-[-0.03em]">
            {ka.dashboard.greeting}, {data.ownerName}
          </h1>
        </div>
        <Button>
          <Plus className="size-4" />
          {ka.dashboard.newBooking}
        </Button>
      </div>

      {data.handoff && <HandoffBanner {...data.handoff} />}

      <StatTiles
        revenue={data.revenue}
        bookings={data.bookings}
        assistant={data.assistant}
      />

      <div className="mb-4 grid items-start gap-4 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <BookingsChart week={data.week} summary={data.bookings} />
        <MonthlyGoalCard {...data.goal} />
      </div>

      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <TodayBookings bookings={data.today} />
        <div className="flex min-w-0 flex-col gap-4">
          <UnreadMessagesCard {...data.unread} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
