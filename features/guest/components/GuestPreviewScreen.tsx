"use client";

import { useState } from "react";

import { useSettings } from "@/features/requests";
import { useRooms } from "@/features/rooms";
import { cn } from "@/shared/lib/cn";

import { GuestApp } from "./GuestApp";
import { GuestPreview } from "./GuestPreview";

const tokenOf = (url: string) => new URL(url).searchParams.get("t") ?? "";

export function GuestPreviewScreen() {
  const settings = useSettings();
  const rooms = useRooms();
  const [isLive, setIsLive] = useState(false);
  const liveRoom = rooms[0];

  return (
    <div className="scrollbar-slim md:min-h-0 md:flex-1 md:overflow-y-auto px-4 pt-5 pb-8 md:px-7 md:pt-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <div className="text-[22px] font-semibold tracking-[-0.03em]">
            Guest preview
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            {isLive && liveRoom
              ? `Live: this phone is room ${liveRoom.no}. Anything you send lands in your inbox.`
              : "Exactly what a guest sees after scanning a plate, with your current settings. Nothing sent here reaches the inbox."}
          </div>
        </div>
        <span className="flex-1" />
        <div className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
          <button
            type="button"
            onClick={() => setIsLive(false)}
            className={cn(
              "min-h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
              !isLive ? "bg-ink text-paper" : "text-muted",
            )}
          >
            Sandbox
          </button>
          <button
            type="button"
            disabled={!liveRoom}
            title={liveRoom ? undefined : "Add a room first"}
            onClick={() => setIsLive(true)}
            className={cn(
              "min-h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors disabled:cursor-default disabled:opacity-40",
              isLive ? "bg-ink text-paper" : "text-muted",
            )}
          >
            Send to my inbox
          </button>
        </div>
      </div>

      {isLive && liveRoom ? (
        <div className="mx-auto h-[760px] w-[390px] overflow-hidden rounded-[36px] border-8 border-ink bg-paper">
          <div className="scrollbar-slim h-full overflow-y-auto">
            <GuestApp
              key={liveRoom.no}
              token={tokenOf(liveRoom.url)}
              embedded
            />
          </div>
        </div>
      ) : (
        <GuestPreview settings={settings} room="205" />
      )}
    </div>
  );
}
