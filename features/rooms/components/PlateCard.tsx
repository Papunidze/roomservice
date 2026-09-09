import { Hotel } from "lucide-react";

import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag, QrCode } from "@/shared/ui";

import type { Room } from "../types";

interface PlateCardProps {
  room: Room;
  hotelName: string;
  languages: LangCode[];
  className?: string;
}

export function PlateCard({
  room,
  hotelName,
  languages,
  className,
}: PlateCardProps) {
  return (
    <div
      className={cn(
        "w-85 rounded-[18px] border border-line-strong bg-paper px-6.5 pt-7 pb-5.5 text-center",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Hotel strokeWidth={1.4} className="size-4" />
        <span className="text-[15px] font-semibold tracking-[-0.02em]">
          {hotelName}
        </span>
      </div>

      <div className="mx-auto mt-5.5 size-44 rounded-xl bg-surface p-2.5">
        <QrCode value={room.url} className="size-full" />
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
  );
}
