"use client";

import type { GuestSettings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

import type { Plate } from "../api";
import { GuestApp } from "./GuestApp";

interface GuestPreviewProps {
  settings: GuestSettings;
  room: string;
  className?: string;
}

export function GuestPreview({ settings, room, className }: GuestPreviewProps) {
  const plate: Plate = { room, session: null, ...settings };

  return (
    <div
      className={cn(
        "mx-auto h-[760px] w-[390px] overflow-hidden rounded-[36px] border-8 border-ink bg-paper",
        className,
      )}
    >
      <div className="scrollbar-slim h-full overflow-y-auto">
        <GuestApp token="" preview={plate} />
      </div>
    </div>
  );
}
