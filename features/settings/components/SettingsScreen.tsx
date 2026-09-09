"use client";

import { useEffect, useState } from "react";

import {
  updateSettings,
  useSettings,
  type Settings,
} from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, showToast } from "@/shared/ui";

import { BillingPanel } from "./BillingPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { GuestInfoPanel } from "./GuestInfoPanel";
import { HotelProfilePanel } from "./HotelProfilePanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { SecurityPanel } from "./SecurityPanel";
import { SessionsPanel } from "./SessionsPanel";

import { SECTIONS, type Section } from "../sections";

export function SettingsScreen({
  initialSection,
}: {
  initialSection?: Section;
}) {
  const settings = useSettings();
  const [section, setSection] = useState<Section>(initialSection ?? "profile");
  const [draft, setDraft] = useState(settings);
  const [base, setBase] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const changedKeys = (Object.keys(draft) as (keyof Settings)[]).filter(
    (key) => JSON.stringify(draft[key]) !== JSON.stringify(base[key]),
  );
  const isDirty = changedKeys.length > 0;

  if (settings !== base) {
    setBase(settings);
    if (!isDirty) setDraft(settings);
  }

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const onChange = (patch: Partial<Settings>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    const patch = Object.fromEntries(
      changedKeys.map((key) => [key, draft[key]]),
    ) as Partial<Settings>;
    setIsSaving(true);
    const isSaved = await updateSettings(patch);
    setIsSaving(false);
    if (isSaved) showToast("Settings saved");
  };

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
          <HotelProfilePanel settings={draft} onChange={onChange} />
        ) : null}
        {section === "info" ? (
          <GuestInfoPanel settings={draft} onChange={onChange} />
        ) : null}
        {section === "categories" ? (
          <CategoriesPanel settings={draft} onChange={onChange} />
        ) : null}
        {section === "notifications" ? (
          <NotificationsPanel settings={draft} onChange={onChange} />
        ) : null}
        {section === "sessions" ? (
          <SessionsPanel settings={draft} onChange={onChange} />
        ) : null}
        {section === "security" ? <SecurityPanel /> : null}
        {section === "billing" ? <BillingPanel /> : null}

        {isDirty ? (
          <div className="sticky bottom-4 mx-auto mt-8 flex w-fit items-center gap-4 rounded-full bg-ink py-2 pr-2 pl-5 text-paper shadow-[0_12px_32px_rgba(17,17,17,0.28)]">
            <span className="animate-pulse-dot size-2 rounded-full bg-sand" />
            <span className="text-[13.5px] font-medium">
              {changedKeys.length === 1
                ? "1 unsaved change"
                : `${changedKeys.length} unsaved changes`}
            </span>
            <button
              type="button"
              onClick={() => setDraft(base)}
              className="min-h-9 cursor-pointer rounded-full px-3.5 text-[13px] text-paper/70 transition-colors hover:text-paper"
            >
              Discard
            </button>
            <Button disabled={isSaving} onClick={save} className="min-h-9">
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
