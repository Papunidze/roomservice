"use client";

import { useState } from "react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  CONFIGURABLE_CATEGORIES,
  ITEM_KEYS,
  STAFF_ROLES,
  type StaffRole,
  type Urgency,
  type Settings,
} from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, showToast, Switch } from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

const URGENCIES: { value: Urgency; label: string }[] = [
  { value: "high", label: "Urgent" },
  { value: "medium", label: "Normal" },
  { value: "low", label: "Low" },
];

const SELECT =
  "min-h-9 w-fit cursor-pointer rounded-full border border-line-strong bg-transparent px-3 text-[12.5px] font-medium outline-none";

const GRID = "grid grid-cols-[1fr_150px_160px_60px] items-center gap-3";

const CATALOGUE = new Set<string>(ITEM_KEYS);

export function CategoriesPanel({ settings, onChange }: SettingsPanelProps) {
  const [draft, setDraft] = useState("");

  const setCategory = (
    key: (typeof CONFIGURABLE_CATEGORIES)[number],
    patch: Partial<Settings["categories"][typeof key]>,
  ) =>
    onChange({
      categories: {
        ...settings.categories,
        [key]: { ...settings.categories[key], ...patch },
      },
    });

  const addItem = () => {
    const label = draft.trim();
    if (!label) return;
    onChange({
      items: [
        ...settings.items,
        {
          key: `custom-${label.toLowerCase().replace(/\s+/g, "-")}`,
          label,
          available: true,
        },
      ],
    });
    setDraft("");
    showToast(`“${label}” added · shown to guests exactly as typed`);
  };

  return (
    <div className="animate-rise max-w-215">
      <PanelHeading
        title="Categories & quick chips"
        subtitle="What guests can tap on “Report a problem”, and where each one is routed."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 overflow-hidden")}>
        <div
          className={cn(
            GRID,
            "border-b border-line-soft px-5.5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
          )}
        >
          <span>Category</span>
          <span>Default urgency</span>
          <span>Default role</span>
          <span>Shown</span>
        </div>

        {CONFIGURABLE_CATEGORIES.map((key) => {
          const setting = settings.categories[key];
          const Icon = CATEGORY_ICON[key];
          return (
            <div
              key={key}
              className={cn(
                GRID,
                "min-h-15 border-b border-line-soft px-5.5 transition-opacity last:border-b-0",
                setting.enabled ? "opacity-100" : "opacity-55",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="grid size-8.5 place-items-center rounded-[10px] bg-sage/10">
                  <Icon strokeWidth={1.5} className="size-4 text-sage" />
                </span>
                <span className="text-sm font-medium">
                  {CATEGORY_LABEL[key]}
                </span>
              </span>

              <label>
                <span className="sr-only">
                  Urgency for {CATEGORY_LABEL[key]}
                </span>
                <select
                  value={setting.urgency}
                  onChange={(event) =>
                    setCategory(key, { urgency: event.target.value as Urgency })
                  }
                  className={SELECT}
                >
                  {URGENCIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sr-only">Role for {CATEGORY_LABEL[key]}</span>
                <select
                  value={setting.role}
                  onChange={(event) =>
                    setCategory(key, { role: event.target.value as StaffRole })
                  }
                  className={SELECT}
                >
                  {STAFF_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <Switch
                checked={setting.enabled}
                label={`${CATEGORY_LABEL[key]} shown to guests`}
                onChange={() => setCategory(key, { enabled: !setting.enabled })}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6.5 flex items-end gap-3">
        <div className="flex-1">
          <div className="text-[15px] font-semibold">Item request menu</div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Unavailable items disappear from the guest’s list. Items you add
            here are shown as typed — only the catalogue items are translated.
          </div>
        </div>
        <div className="flex min-h-10 items-center gap-2 rounded-full border border-line-strong bg-surface pr-1.5 pl-3.5">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addItem();
            }}
            placeholder="Add an item…"
            aria-label="Add an item"
            spellCheck={false}
            className="w-37.5 bg-transparent text-[13px] outline-none"
          />
          <Button
            variant="dark"
            disabled={draft.trim().length === 0}
            onClick={addItem}
            className="min-h-7.5 px-3 text-xs"
          >
            Add
          </Button>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {settings.items.map((item) => (
          <div
            key={item.key}
            className={cn(
              PANEL_CARD,
              "flex min-h-14 items-center justify-between gap-2.5 rounded-[16px] pr-3 pl-4.5",
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                item.available ? "text-ink" : "text-ghost",
              )}
            >
              {item.label}
              {CATALOGUE.has(item.key) ? null : (
                <span className="ml-1.5 font-mono text-[9.5px] tracking-[0.12em] text-ghost uppercase">
                  as typed
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() =>
                onChange({
                  items: settings.items.map((entry) =>
                    entry.key === item.key
                      ? { ...entry, available: !entry.available }
                      : entry,
                  ),
                })
              }
              className={cn(
                "min-h-7.5 cursor-pointer rounded-full px-2.5 text-[11.5px] font-medium",
                item.available
                  ? "bg-sage/10 text-sage-deep"
                  : "bg-ink/5 text-faint",
              )}
            >
              {item.available ? "Available" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
