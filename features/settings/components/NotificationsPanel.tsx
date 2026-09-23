"use client";

import { Bell, Send } from "lucide-react";
import { useState } from "react";

import { requestNotificationPermission } from "@/features/desk";
import type { Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, NumberField, Switch, TextField } from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

const ROW = "flex min-h-16 flex-wrap items-center gap-3.5 py-3";

const permissionState = () =>
  typeof Notification === "undefined" ? "unsupported" : Notification.permission;

export function NotificationsPanel({ settings, onChange }: SettingsPanelProps) {
  const notifications = settings.notifications;
  const setNotifications = (patch: Partial<Settings["notifications"]>) =>
    onChange({ notifications: { ...notifications, ...patch } });
  const [permission, setPermission] = useState(permissionState);

  const enableBrowser = async () => {
    await requestNotificationPermission();
    setPermission(permissionState());
  };

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Notifications"
        subtitle="How your team hears about new tickets and guest replies."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 px-5 py-1.5 sm:px-6")}>
        <div className={cn(ROW, "items-start")}>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage/12">
            <Bell strokeWidth={1.6} className="size-4.5 text-sage-deep" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">
              In the console
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-relaxed text-faint">
              Always on. The bell lists unanswered tickets and the browser tab
              flashes when a new one arrives.
            </span>
          </span>
        </div>

        <div className={cn(ROW, "border-t border-line-soft")}>
          <span className="min-w-48 flex-1">
            <span className="block text-sm">Sound</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              A short chime on every console when a ticket arrives.
            </span>
          </span>
          <Switch
            checked={notifications.sound}
            label="Sound on new ticket"
            onChange={() => setNotifications({ sound: !notifications.sound })}
          />
        </div>

        <div className={cn(ROW, "border-t border-line-soft")}>
          <span className="min-w-48 flex-1">
            <span className="block text-sm">Remind again after</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              The chime repeats while a ticket is still unanswered.
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
            <span className="block text-sm">Browser notifications</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              A system notification when this tab is in the background. Set per
              device, so turn it on at each desk.
            </span>
          </span>
          {permission === "granted" ? (
            <span className="text-[12.5px] font-medium text-sage-deep">
              On for this device
            </span>
          ) : permission === "unsupported" ? (
            <span className="text-[12.5px] text-faint">
              Not supported in this browser
            </span>
          ) : (
            <Button variant="ghost" onClick={enableBrowser}>
              {permission === "denied"
                ? "Blocked in browser settings"
                : "Turn on here"}
            </Button>
          )}
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
      </div>
    </div>
  );
}
