"use client";

import { Printer, X } from "lucide-react";

import type { LangCode } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import type { Room } from "../types";
import { PlateCard } from "./PlateCard";

interface QrPlatePanelProps {
  room: Room;
  hotelName: string;
  languages: LangCode[];
  onClose: () => void;
  onRegenerate: () => void;
  onPrint: () => void;
}

export function QrPlatePanel({
  room,
  hotelName,
  languages,
  onClose,
  onRegenerate,
  onPrint,
}: QrPlatePanelProps) {
  return (
    <div className="scrollbar-slim animate-rise w-105 shrink-0 overflow-y-auto border-l border-line bg-surface px-6.5 pt-6 pb-7">
      <div className="flex items-center gap-2.5">
        <div className="flex-1">
          <div className="text-[17px] font-semibold tracking-[-0.02em]">
            Plate for room {room.no}
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            {room.printed ? "Printed" : "Not printed yet"} · floor {room.floor}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close plate preview"
          className="grid size-8.5 cursor-pointer place-items-center rounded-full border border-line-strong text-faint"
        >
          <X strokeWidth={1.6} className="size-3.5" />
        </button>
      </div>

      <PlateCard
        room={room}
        hotelName={hotelName}
        languages={languages}
        className="mx-auto mt-5.5"
      />

      <Button onClick={onPrint} className="mt-4.5 w-full">
        <Printer strokeWidth={1.6} className="size-3.5" />
        Print this plate
      </Button>

      <p className="mt-3.5 text-xs leading-relaxed text-faint">
        A5, 300 dpi. It lists the guest languages enabled in Settings — keep
        that list short and the plate stays readable.
      </p>

      <div className="mt-6 rounded-tile border border-line bg-paper px-4.5 py-4">
        <div className="text-[13px] font-semibold">Lost or stolen plate?</div>
        <p className="mt-1 text-xs leading-relaxed text-faint">
          Issue a new code for this room. The plate currently in the room stops
          working immediately, so print and replace it before the next check-in.
        </p>
        <Button variant="ghost" onClick={onRegenerate} className="mt-3">
          Issue a new code
        </Button>
      </div>
    </div>
  );
}
