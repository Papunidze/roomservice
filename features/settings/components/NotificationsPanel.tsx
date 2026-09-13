"use client";

import { Bell, Send } from "lucide-react";

import type { Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { NumberField, Switch, TextField } from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

const TIME =
  "min-h-9.5 w-18 rounded-[10px] border border-line-strong bg-surface px-2.5 text-center font-mono text-sm outline-none";

const ROW = "flex min-h-16 flex-wrap items-center gap-3.5 py-3";

export function NotificationsPanel({ settings, onChange }: SettingsPanelProps) {
  const notifications = settings.notifications;
  const setNotifications = (patch: Partial<Settings["notifications"]>) =>
    onChange({ notifications: { ...notifications, ...patch } });

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Notifications"
        subtitle="How your team hears about new tickets and guest replies."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 p-5 sm:p-6")}>
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage/12">
            <Bell strokeWidth={1.6} className="size-4.5 text-sage-deep" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">
              In the console
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-relaxed text-faint">
              Always on. The bell in the header lists unanswered tickets, and
              the browser tab flashes when a new one arrives.
            </span>
          </span>
        </div>
      </div>

      <div className={cn(PANEL_CARD, "mt-3.5 p-5 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sand/40">
            <Send strokeWidth={1.6} className="size-4.5 text-sand-ink" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">Telegram</span>
            <span className="mt-0.5 block text-[12.5px] leading-relaxed text-faint">
              Not live yet. Save your staff group now and every new ticket and
              guest reply is posted there the day delivery ships.
            </span>
          </span>
          <span className="rounded-full bg-ink/6 px-2.5 py-0.5 text-[11.5px] font-medium text-muted">
            Coming soon
          </span>
        </div>

        <div className="mt-4.5 border-t border-line-soft pt-4.5">
          <TextField
            label="Staff group"
            value={notifications.group}
            inputClassName="font-mono"
            onChange={(group) =>
              setNotifications({ group, telegram: group.trim().length > 0 })
            }
          />
          <p className="mt-2 text-[12.5px] text-faint">
            The group’s @username, or its ID if it has none.
          </p>
        </div>

        <div className={cn(ROW, "mt-2 border-t border-line-soft")}>
          <span className="min-w-48 flex-1">
            <span className="block text-sm">Remind again after</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              Posts the ticket again while nobody has answered it.
            </span>
          </span>
          <span className="flex items-center gap-2">
            <NumberField
              label="Remind again after minutes"
              value={notifications.renotifyMinutes}
              max={240}
              onChange={(renotifyMinutes) =>
                setNotifications({ renotifyMinutes })
              }
            />
            <span className="text-[13px] text-muted">min</span>
          </span>
        </div>

        <div className={cn(ROW, "border-t border-line-soft")}>
          <span className="min-w-48 flex-1">
            <span className="block text-sm">Quiet hours</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              Only urgent tickets are posted between these times.
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-2 transition-opacity",
                notifications.quietHours ? "opacity-100" : "opacity-40",
              )}
            >
              <input
                aria-label="Quiet hours start"
                value={notifications.quietFrom}
                onChange={(event) =>
                  setNotifications({ quietFrom: event.target.value })
                }
                className={TIME}
              />
              <span className="text-ghost">–</span>
              <input
                aria-label="Quiet hours end"
                value={notifications.quietTo}
                onChange={(event) =>
                  setNotifications({ quietTo: event.target.value })
                }
                className={TIME}
              />
            </span>
            <Switch
              checked={notifications.quietHours}
              label="Quiet hours"
              onChange={() =>
                setNotifications({ quietHours: !notifications.quietHours })
              }
            />
          </span>
        </div>
      </div>
    </div>
  );
}
