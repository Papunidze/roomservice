"use client";

import { Hotel, Printer, X } from "lucide-react";

import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Button, Flag, showToast } from "@/shared/ui";

import { platePattern } from "../plate-pattern";
import type { Room } from "../types";

interface QrPlatePanelProps {
  room: Room;
  hotelName: string;
  languages: LangCode[];
  onClose: () => void;
  onRegenerate: () => void;
  onPrinted: () => void;
}

export function QrPlatePanel({
  room,
  hotelName,
  languages,
  onClose,
  onRegenerate,
  onPrinted,
}: QrPlatePanelProps) {
  return (
    <div className="scrollbar-slim animate-rise w-105 shrink-0 overflow-y-auto border-l border-line bg-surface px-6.5 pt-6 pb-7">
      <div className="flex items-center gap-2.5">
        <div className="flex-1">
          <div className="text-[17px] font-semibold tracking-[-0.02em]">
            QR plate · Room {room.no}
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            {room.printed ? "Printed" : "Not printed"} · floor {room.floor}
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

      <div className="mx-auto mt-5.5 w-85 rounded-[18px] border border-line-strong bg-paper px-6.5 pt-7 pb-5.5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Hotel strokeWidth={1.4} className="size-4" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            {hotelName}
          </span>
        </div>

        <div className="mx-auto mt-5.5 size-44 rounded-xl bg-surface p-2.5">
          <div
            aria-hidden
            style={{
              backgroundImage: platePattern(
                `${room.no}-${room.printed ? "v1" : "v2"}`,
              ),
              backgroundSize: "100% 100%",
            }}
            className="size-full"
          />
        </div>

        <div className="mt-5 flex flex-col gap-1">
          {languages.map((code, index) => (
            <div
              key={code}
              dir={DICTIONARY[code].dir}
              className="flex items-center justify-center gap-2"
            >
              <Flag code={code} className="h-3 w-4" />
              <span
                className={cn(
                  index === 0
                    ? "text-[15px] font-medium"
                    : "text-[12.5px] text-soft",
                  scriptFont(code),
                )}
              >
                {DICTIONARY[code].scanPlate}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4.5 flex justify-between border-t border-line-strong pt-3 font-mono text-[10px] tracking-[0.12em] text-faint">
          <span>ROOM {room.no}</span>
          <span>roomcall.ge</span>
        </div>
      </div>

      <div className="mt-4.5 flex gap-2">
        <Button
          onClick={() => {
            onPrinted();
            showToast(`Sent to printer · room ${room.no} marked as printed`);
          }}
        >
          <Printer strokeWidth={1.6} className="size-3.5" />
          Print plate
        </Button>
        <Button variant="ghost" onClick={onRegenerate}>
          Regenerate
        </Button>
      </div>

      <p className="mt-3.5 text-xs leading-relaxed text-faint">
        A5 plate, 300 dpi. It lists the guest languages enabled in Settings —
        keep that list short and the plate stays readable. The pattern above is
        a placeholder: real per-room tokens are issued once the backend exists,
        and regenerating one disables the plate already in the room.
      </p>
    </div>
  );
}
