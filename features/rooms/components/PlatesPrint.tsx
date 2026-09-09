"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useOptionalSettings } from "@/features/requests";
import { Button, QrCode } from "@/shared/ui";

import { useRooms } from "../store";

export function PlatesPrint() {
  const wanted =
    useSearchParams().get("rooms")?.split(",").filter(Boolean) ?? [];
  const rooms = useRooms();
  const settings = useOptionalSettings();

  const plates =
    wanted.length > 0
      ? rooms.filter((room) => wanted.includes(room.no))
      : rooms;
  const isReady = settings !== null && plates.length > 0;

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, [isReady]);

  if (!settings) return null;

  return (
    <div className="min-h-dvh bg-canvas print:bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-paper px-6 py-3 print:hidden">
        <span className="text-[14px] font-semibold">
          {plates.length} plate{plates.length === 1 ? "" : "s"}
        </span>
        <span className="text-[12.5px] text-faint">
          QR code only, one A5 page each. Choose “Save as PDF” in the print
          dialog to keep a file.
        </span>
        <span className="flex-1" />
        <Link
          href="/desk/rooms"
          className="text-[13px] text-muted hover:text-ink"
        >
          Back to rooms
        </Link>
        <Button onClick={() => window.print()}>
          <Printer strokeWidth={1.6} className="size-3.5" />
          Print
        </Button>
      </div>

      <div className="mx-auto grid max-w-[820px] gap-6 p-6 md:grid-cols-2 print:block print:max-w-none print:p-0">
        {plates.map((room) => (
          <div
            key={room.no}
            className="flex justify-center print:h-screen print:items-center print:break-after-page"
          >
            <div className="flex flex-col items-center rounded-tile border border-line bg-paper p-8 print:border-0 print:p-0">
              <QrCode value={room.url} className="size-64 print:size-[110mm]" />
              <span className="mt-3 font-mono text-[11px] tracking-[0.14em] text-faint print:mt-6 print:text-[14px] print:text-ink">
                ROOM {room.no}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
