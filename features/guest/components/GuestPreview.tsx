"use client";

import type { GuestSettings } from "@/features/requests";

import type { Plate } from "../api";
import { GuestApp } from "./GuestApp";

interface GuestPreviewProps {
  settings: GuestSettings;
  room: string;
}

export function GuestPreview({ settings, room }: GuestPreviewProps) {
  const plate: Plate = { room, session: null, ...settings };

  return (
    <div className="mx-auto h-[760px] w-[390px] overflow-hidden rounded-[36px] border-8 border-ink bg-paper">
      <div className="scrollbar-slim h-full overflow-y-auto">
        <GuestApp token="" preview={plate} />
      </div>
    </div>
  );
}
