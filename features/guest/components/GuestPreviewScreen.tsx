"use client";

import { useSettings } from "@/features/requests";

import { GuestPreview } from "./GuestPreview";

export function GuestPreviewScreen() {
  const settings = useSettings();

  return (
    <div className="scrollbar-slim h-[min(860px,calc(100dvh-8rem))] min-h-[560px] overflow-y-auto px-7 pt-6 pb-8">
      <div className="mb-5">
        <div className="text-[22px] font-semibold tracking-[-0.03em]">
          Guest preview
        </div>
        <div className="mt-0.5 text-[12.5px] text-faint">
          Exactly what a guest sees after scanning the plate in room 205, with
          your current settings. Try it: nothing sent here reaches the inbox.
        </div>
      </div>
      <GuestPreview settings={settings} room="205" />
    </div>
  );
}
