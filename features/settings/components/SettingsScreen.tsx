"use client";

import { useState } from "react";

import { useSettings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

import { BillingPanel } from "./BillingPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { GuestInfoPanel } from "./GuestInfoPanel";
import { HotelProfilePanel } from "./HotelProfilePanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { SessionsPanel } from "./SessionsPanel";

const SECTIONS = [
  { key: "profile", label: "Hotel profile" },
  { key: "info", label: "Guest info page" },
  { key: "categories", label: "Categories & chips" },
  { key: "notifications", label: "Notifications" },
  { key: "sessions", label: "Sessions" },
  { key: "billing", label: "Billing" },
] as const;

type Section = (typeof SECTIONS)[number]["key"];

export function SettingsScreen({
  initialSection,
}: {
  initialSection?: Section;
}) {
  const settings = useSettings();
  const [section, setSection] = useState<Section>(initialSection ?? "profile");

  return (
    <div className="flex h-[min(860px,calc(100dvh-8rem))] min-h-[560px] items-stretch">
      <nav className="flex w-60 shrink-0 flex-col gap-0.5 border-r border-line px-4 py-6">
        <div className="px-3 pb-4 text-[22px] font-semibold tracking-[-0.03em]">
          Settings
        </div>
        {SECTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSection(item.key)}
            className={cn(
              "block min-h-10.5 cursor-pointer rounded-full px-3.5 text-left text-[13.5px] font-medium transition-colors",
              section === item.key
                ? "bg-ink text-paper"
                : "text-muted hover:bg-ink/4",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="scrollbar-slim min-w-0 flex-1 overflow-y-auto px-8 pt-7 pb-10">
        {section === "profile" ? (
          <HotelProfilePanel settings={settings} />
        ) : null}
        {section === "info" ? <GuestInfoPanel settings={settings} /> : null}
        {section === "categories" ? (
          <CategoriesPanel settings={settings} />
        ) : null}
        {section === "notifications" ? (
          <NotificationsPanel settings={settings} />
        ) : null}
        {section === "sessions" ? <SessionsPanel settings={settings} /> : null}
        {section === "billing" ? <BillingPanel /> : null}
      </div>
    </div>
  );
}
