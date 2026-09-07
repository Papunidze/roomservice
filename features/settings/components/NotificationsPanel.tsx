"use client";

import { Send } from "lucide-react";

import { updateSettings, type Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, NumberField, showToast, Switch } from "@/shared/ui";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

const TIME =
  "min-h-9.5 w-18 rounded-[10px] border border-line-strong bg-surface px-2.5 text-center font-mono text-sm outline-none";

export function NotificationsPanel({ settings }: { settings: Settings }) {
  const notifications = settings.notifications;
  const setNotifications = (patch: Partial<Settings["notifications"]>) =>
    updateSettings({ notifications: { ...notifications, ...patch } });

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Notifications"
        subtitle="Every new ticket and guest reply is posted to your Telegram group."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 p-6")}>
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 place-items-center rounded-full bg-sage/12">
            <Send strokeWidth={1.6} className="size-4.5 text-sage-deep" />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">
              {notifications.telegram
                ? notifications.group
                : "No Telegram group connected"}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              {notifications.telegram
                ? "Connected · every member on shift receives alerts"
                : "Add @RoomCallBot to your staff group and paste the code here."}
            </span>
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
              notifications.telegram
                ? "bg-sage/10 text-sage-deep"
                : "bg-ink/6 text-muted",
            )}
          >
            {notifications.telegram ? "Connected" : "Not connected"}
          </span>
        </div>

        <div className="mt-4.5 flex gap-2 border-t border-line-soft pt-4.5">
          <Button
            variant="ghost"
            onClick={() =>
              showToast(
                notifications.telegram
                  ? `Test message sent to “${notifications.group}”`
                  : "Connect a group first",
              )
            }
          >
            Send test message
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setNotifications({ telegram: !notifications.telegram });
              showToast(
                notifications.telegram
                  ? "Telegram group disconnected"
                  : "Telegram group connected",
              );
            }}
          >
            {notifications.telegram ? "Disconnect" : "Connect group"}
          </Button>
        </div>
      </div>

      <div className={cn(PANEL_CARD, "mt-3.5 px-6 py-1.5")}>
        <div className="flex min-h-16 items-center gap-3.5">
          <span className="flex-1">
            <span className="block text-sm">Re-notify interval</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              Repeat the alert while a ticket stays New and unread.
            </span>
          </span>
          <NumberField
            label="Re-notify interval in minutes"
            value={notifications.renotifyMinutes}
            max={999}
            onChange={(renotifyMinutes) =>
              setNotifications({ renotifyMinutes })
            }
          />
          <span className="text-[13px] text-muted">min</span>
        </div>

        <div className="flex min-h-16 items-center gap-3.5 border-t border-line-soft">
          <span className="flex-1">
            <span className="block text-sm">Quiet hours</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              No chime, still posted to Telegram. Urgent tickets always ring.
            </span>
          </span>
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
        </div>
      </div>
    </div>
  );
}
