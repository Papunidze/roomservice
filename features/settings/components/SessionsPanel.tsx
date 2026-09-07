"use client";

import { updateSettings, type Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { NumberField, Switch } from "@/shared/ui";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

export function SessionsPanel({ settings }: { settings: Settings }) {
  const { sessions } = settings;
  const setSessions = (patch: Partial<Settings["sessions"]>) =>
    updateSettings({ sessions: { ...sessions, ...patch } });

  const summary = `Right now: a room with no scans or messages for ${sessions.autoCloseHours} hours closes itself. ${
    sessions.requireClose
      ? "On checkout, staff close the room from the ticket menu, which archives its open tickets."
      : "Rooms are closed only by the timer."
  }`;

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Guest sessions"
        subtitle="A session starts at the first scan and ties the room’s tickets to one guest."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 px-6 py-1.5")}>
        <div className="flex min-h-17 items-center gap-3.5">
          <span className="flex-1">
            <span className="block text-sm">Auto-close after inactivity</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              The next scan starts a fresh session with a new guest.
            </span>
          </span>
          <NumberField
            label="Auto-close after hours"
            value={sessions.autoCloseHours}
            max={999}
            onChange={(autoCloseHours) => setSessions({ autoCloseHours })}
          />
          <span className="text-[13px] text-muted">hours</span>
        </div>

        <div className="flex min-h-17 items-center gap-3.5 border-t border-line-soft">
          <span className="flex-1">
            <span className="block text-sm">
              Require “Close room” on checkout
            </span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              Staff must close the room from the ticket menu; open tickets get
              archived.
            </span>
          </span>
          <Switch
            checked={sessions.requireClose}
            label="Require close room on checkout"
            onChange={() =>
              setSessions({ requireClose: !sessions.requireClose })
            }
          />
        </div>
      </div>

      <p className="mt-3.5 rounded-[16px] bg-sand/28 px-5 py-4 text-[12.5px] leading-relaxed text-soft">
        {summary}
      </p>
    </div>
  );
}
