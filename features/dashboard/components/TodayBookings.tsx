import { ka } from "@/shared/i18n/ka";
import { formatTime } from "@/shared/lib/dates";
import { formatGel } from "@/shared/lib/money";
import { Avatar } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardHeader, CardTitle } from "@/shared/ui/card";

import type { BookingSource, TodayBooking } from "../types";

const SOURCE_BADGE: Record<
  BookingSource,
  { label: string; variant: "assistant" | "warning" | "neutral" }
> = {
  assistant: { label: ka.dashboard.source.assistant, variant: "assistant" },
  manual: { label: ka.dashboard.source.manual, variant: "warning" },
  phone: { label: ka.dashboard.source.phone, variant: "neutral" },
};

export function TodayBookings({ bookings }: { bookings: TodayBooking[] }) {
  const total = bookings.reduce((sum, booking) => sum + booking.priceTetri, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{ka.dashboard.today.title}</CardTitle>
        <div className="text-[12.5px] text-muted-foreground">
          {bookings.length} {ka.dashboard.today.bookings} · {formatGel(total)}
        </div>
      </CardHeader>

      {bookings.length === 0 ? (
        <div className="border-t border-black/5 px-6 py-8 text-center text-[13px] text-muted-foreground">
          {ka.dashboard.today.empty}
        </div>
      ) : (
        bookings.map((booking) => {
          const badge = SOURCE_BADGE[booking.source];
          return (
            <div
              key={booking.id}
              className="flex items-center gap-3.5 border-t border-black/5 px-6 py-3"
            >
              <div className="w-11.5 shrink-0 text-[13px] font-bold text-label">
                {formatTime(booking.startsAt)}
              </div>
              <Avatar name={booking.clientName} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">
                  {booking.clientName}
                </div>
                <div className="truncate text-[12.5px] text-muted-foreground">
                  {booking.serviceName} · {booking.staffName}
                </div>
              </div>
              <div className="shrink-0 text-[15px] font-bold">
                {formatGel(booking.priceTetri)}
              </div>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
          );
        })
      )}
    </Card>
  );
}
