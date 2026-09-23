"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PLAN_LABEL, PLANS, type Plan } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { formatWhen } from "@/shared/lib/time";
import { Button, Overlays, showToast } from "@/shared/ui";

import { fetchHotels, patchHotelBilling, type AdminHotel } from "../api";

const DAY_MS = 24 * 60 * 60 * 1000;

const GRID =
  "grid min-w-[1080px] grid-cols-[1.5fr_1.2fr_70px_70px_90px_130px_150px_260px] items-center gap-3";

const SELECT =
  "min-h-8 cursor-pointer rounded-full border border-line-strong bg-transparent px-2.5 text-[12.5px] font-medium outline-none";

const STATUS_CLASS = {
  trial: "bg-sand/50 text-sand-ink",
  active: "bg-sage/10 text-sage-deep",
  expired: "bg-urgent/10 text-urgent",
};

const plusDays = (from: string | null, days: number) =>
  new Date(
    Math.max(Date.now(), from ? new Date(from).getTime() : 0) + days * DAY_MS,
  ).toISOString();

export function AdminScreen() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchHotels().then((result) => {
      setIsLoading(false);
      if (result.ok) setHotels(result.data.hotels);
      else showToast(result.message);
    });
  }, []);

  const update = async (
    hotel: AdminHotel,
    patch: Parameters<typeof patchHotelBilling>[1],
  ) => {
    const result = await patchHotelBilling(hotel.id, patch);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    setHotels((current) =>
      current.map((entry) =>
        entry.id === hotel.id ? result.data.hotel : entry,
      ),
    );
    showToast(`${hotel.name || "Hotel"} updated`);
  };

  const totals = {
    hotels: hotels.length,
    trial: hotels.filter((hotel) => hotel.status === "trial").length,
    active: hotels.filter((hotel) => hotel.status === "active").length,
    expired: hotels.filter((hotel) => hotel.status === "expired").length,
  };

  return (
    <div className="min-h-dvh bg-canvas md:p-7.5">
      <div className="relative mx-auto min-h-dvh w-360 max-w-full bg-panel md:min-h-0 md:rounded-card md:border md:border-line">
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-6.5 py-4">
          <div>
            <div className="text-[22px] font-semibold tracking-[-0.03em]">
              RoomCall admin
            </div>
            <div className="mt-0.5 text-[12.5px] text-faint">
              {totals.hotels} hotels · {totals.trial} on trial · {totals.active}{" "}
              paying · {totals.expired} expired
            </div>
          </div>
          <span className="flex-1" />
          <Link href="/desk" className="text-[13px] text-muted hover:text-ink">
            Back to the desk
          </Link>
        </div>

        <div className="scrollbar-slim overflow-x-auto px-6.5 py-6">
          <div className="rounded-tile border border-line bg-surface">
            <div
              className={cn(
                GRID,
                "border-b border-line-soft px-5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
              )}
            >
              <span>Hotel</span>
              <span>Manager</span>
              <span>Rooms</span>
              <span>Team</span>
              <span>Tickets 7d</span>
              <span>Status</span>
              <span>Until</span>
              <span>Plan</span>
            </div>
            {hotels.map((hotel) => {
              const until =
                hotel.plan === "trial" ? hotel.trialEndsAt : hotel.paidUntil;
              return (
                <div
                  key={hotel.id}
                  className={cn(
                    GRID,
                    "min-h-16 border-b border-line-soft px-5 last:border-b-0",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {hotel.name || "Unnamed hotel"}
                    </span>
                    <span className="block text-xs text-faint">
                      since {formatWhen(hotel.createdAt)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px]">
                      {hotel.manager?.name ?? "—"}
                    </span>
                    <span className="block truncate text-xs text-faint">
                      {hotel.manager?.email ?? ""}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {hotel.rooms}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {hotel.members}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {hotel.weekRequests}
                  </span>
                  <span
                    className={cn(
                      "inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                      STATUS_CLASS[hotel.status],
                    )}
                  >
                    {hotel.status}
                  </span>
                  <span className="font-mono text-[11.5px] text-faint">
                    {until ? formatWhen(until) : "open-ended"}
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <select
                      aria-label={`Plan for ${hotel.name}`}
                      value={hotel.plan}
                      onChange={(event) =>
                        update(hotel, { plan: event.target.value as Plan })
                      }
                      className={SELECT}
                    >
                      {PLANS.map((plan) => (
                        <option key={plan} value={plan}>
                          {PLAN_LABEL[plan]}
                        </option>
                      ))}
                    </select>
                    {hotel.plan === "trial" ? (
                      <Button
                        variant="ghost"
                        className="min-h-8 px-3 text-xs"
                        onClick={() =>
                          update(hotel, {
                            trialEndsAt: plusDays(hotel.trialEndsAt, 30),
                          })
                        }
                      >
                        +30 days
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="min-h-8 px-3 text-xs"
                          onClick={() =>
                            update(hotel, {
                              paidUntil: plusDays(hotel.paidUntil, 31),
                            })
                          }
                        >
                          +1 month
                        </Button>
                        <Button
                          variant="ghost"
                          className="min-h-8 px-3 text-xs"
                          onClick={() =>
                            update(hotel, {
                              paidUntil: plusDays(hotel.paidUntil, 365),
                            })
                          }
                        >
                          +1 year
                        </Button>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
            {!isLoading && hotels.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-faint">
                No hotels yet.
              </p>
            ) : null}
          </div>
        </div>
        <Overlays />
      </div>
    </div>
  );
}
