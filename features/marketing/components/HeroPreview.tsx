import { AirVent, ArrowDown } from "lucide-react";

import { CATEGORY_LABEL } from "@/features/requests";
import { CANNED, DICTIONARY, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag } from "@/shared/ui";

const guest = DICTIONARY.ar;
const arabic = cn(scriptFont("ar"), "text-start");

export function HeroPreview() {
  return (
    <div className="grid gap-3.5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <div className="flex flex-col rounded-card border border-line-strong bg-paper p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-sand/30 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.1em] text-soft">
            ROOM 205
          </span>
          <Flag code="ar" />
        </div>

        <p
          dir="rtl"
          className={cn(
            "mt-6 text-[24px] leading-tight font-semibold tracking-[-0.02em]",
            arabic,
          )}
        >
          {guest.greet}
        </p>

        <div
          dir="rtl"
          className="mt-4 flex items-center gap-3 rounded-tile bg-sand/25 px-4 py-3.5"
        >
          <AirVent strokeWidth={1.4} className="size-5 shrink-0 text-sage" />
          <span className={cn("min-w-0", arabic)}>
            <span className="block truncate text-[14px] font-medium">
              {guest.reportT}
            </span>
            <span className="block truncate text-[12px] text-muted">
              {guest.ac}
            </span>
          </span>
        </div>

        <p className="mt-auto pt-6 text-[11.5px] text-ghost">
          The guest taps. No app, no account.
        </p>
      </div>

      <div className="relative rounded-card border border-line-strong bg-surface p-5">
        <span className="absolute -top-3 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full border border-line-strong bg-canvas text-faint lg:-left-3 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2">
          <ArrowDown strokeWidth={1.6} className="size-3.5 lg:-rotate-90" />
        </span>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] text-faint">#2058</span>
          <span className="text-[13.5px] font-semibold">Room 205</span>
          <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-urgent/10 px-2.5 py-1 text-[11px] font-medium text-urgent">
            <span className="size-1.5 rounded-full bg-urgent" />
            New
          </span>
        </div>

        <p className="mt-3 text-[17px] font-semibold tracking-[-0.02em]">
          {CATEGORY_LABEL.ac}
        </p>
        <p className="mt-0.5 flex items-center gap-2 text-[12px] text-faint">
          <Flag code="ar" className="h-3 w-4" />
          Sent in Arabic · assigned to Maintenance
        </p>

        <div className="mt-5 flex flex-col gap-2.5 border-t border-line-soft pt-5">
          <p className="rounded-tile bg-panel px-4 py-3 text-[13px] leading-relaxed">
            {CANNED.ack.en}
            <span className="mt-1 block text-[11px] text-ghost">
              You write this once
            </span>
          </p>
          <p
            dir="rtl"
            className={cn(
              "rounded-tile bg-sage/9 px-4 py-3 text-[13px] leading-relaxed",
              arabic,
            )}
          >
            {CANNED.ack.ar}
            <span
              dir="ltr"
              className="mt-1 block text-start font-sans text-[11px] text-sage"
            >
              The guest reads this
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
