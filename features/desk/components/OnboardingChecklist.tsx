"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { useSettings } from "@/features/requests";
import { useRooms } from "@/features/rooms";
import { useTeam } from "@/features/team";
import { cn } from "@/shared/lib/cn";

export function OnboardingChecklist() {
  const settings = useSettings();
  const rooms = useRooms();
  const team = useTeam();

  const steps = [
    {
      label: "Add your rooms",
      href: "/desk/rooms",
      isDone: rooms.length > 0,
    },
    {
      label: "Print the QR plates",
      href: "/desk/rooms",
      isDone: rooms.length > 0 && rooms.every((room) => room.printed),
    },
    {
      label: "Fill in WiFi and hotel info",
      href: "/desk/settings?section=info",
      isDone: settings.info.wifiName.trim().length > 0,
    },
    {
      label: "Set up the room service menu",
      href: "/desk/settings?section=menu",
      isDone:
        settings.service.dishes.length > 0 ||
        !settings.categories.service.enabled,
    },
    {
      label: "Invite your team",
      href: "/desk/team",
      isDone: team.members.length > 1,
    },
    {
      label: "Try it as a guest",
      href: "/desk/preview",
      isDone: false,
    },
  ];
  const remaining = steps.filter((step) => !step.isDone);
  if (remaining.length <= 1) return null;

  return (
    <div className="mb-6 rounded-tile border border-sage/35 bg-sage/6 px-5 py-4.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold tracking-[-0.01em]">
          Set up {settings.hotel.name || "your hotel"}
        </span>
        <span className="text-xs text-faint">
          {steps.length - remaining.length} of {steps.length} done
        </span>
      </div>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className={cn(
              "flex min-h-10 items-center gap-2.5 rounded-full border px-3.5 text-[13px] transition-colors",
              step.isDone
                ? "border-transparent text-faint line-through"
                : "border-line-strong bg-surface hover:border-ink/30",
            )}
          >
            <span
              className={cn(
                "grid size-4.5 shrink-0 place-items-center rounded-full border",
                step.isDone
                  ? "border-sage bg-sage text-paper"
                  : "border-line-strong",
              )}
            >
              {step.isDone ? (
                <Check strokeWidth={2.5} className="size-3" />
              ) : null}
            </span>
            {step.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
