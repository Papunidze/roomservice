"use client";

import type { Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { NumberField } from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

export function SessionsPanel({ settings, onChange }: SettingsPanelProps) {
  const { sessions } = settings;
  const setSessions = (patch: Partial<Settings["sessions"]>) =>
    onChange({ sessions: { ...sessions, ...patch } });

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Guest sessions"
        subtitle="A session starts at the first scan and ties the room’s tickets to one guest."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 px-5 py-1.5 sm:px-6")}>
        <div className="flex min-h-17 flex-wrap items-center gap-3.5 py-3">
          <span className="min-w-48 flex-1">
            <span className="block text-sm">Auto-close after inactivity</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              A room with no scans or messages for this long ends its session.
              The next scan starts a fresh one with a new guest.
            </span>
          </span>
          <NumberField
            label="Auto-close after hours"
            value={sessions.autoCloseHours}
            max={168}
            onChange={(autoCloseHours) => setSessions({ autoCloseHours })}
          />
          <span className="text-[13px] text-muted">hours</span>
        </div>
      </div>

      <p className="mt-3.5 rounded-[16px] bg-sand/28 px-5 py-4 text-[12.5px] leading-relaxed text-soft">
        On checkout, staff can also end a session right away with “Guest checked
        out” in the ticket menu or “Check out” on the Rooms page. That archives
        the room’s open tickets so the next guest starts clean.
      </p>
    </div>
  );
}
