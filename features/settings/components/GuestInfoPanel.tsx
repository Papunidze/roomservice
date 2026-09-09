"use client";

import type { Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Field, FIELD_CONTROL, TextField } from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

export function GuestInfoPanel({ settings, onChange }: SettingsPanelProps) {
  const { info } = settings;
  const setInfo = (patch: Partial<Settings["info"]>) =>
    onChange({ info: { ...info, ...patch } });

  return (
    <div className="animate-rise max-w-215">
      <PanelHeading
        title="Guest info page"
        subtitle="Written once in English and shown to every guest exactly as written."
      />

      <div className="mt-5.5 grid grid-cols-[1fr_280px] gap-3.5">
        <div className={cn(PANEL_CARD, "flex flex-col gap-4 p-6")}>
          <div className="grid grid-cols-2 gap-3.5">
            <TextField
              label="WiFi network"
              value={info.wifiName}
              inputClassName="font-mono"
              onChange={(wifiName) => setInfo({ wifiName })}
            />
            <TextField
              label="WiFi password"
              value={info.wifiPassword}
              inputClassName="font-mono"
              onChange={(wifiPassword) => setInfo({ wifiPassword })}
            />
          </div>
          <TextField
            label="Breakfast"
            value={info.breakfast}
            onChange={(breakfast) => setInfo({ breakfast })}
          />
          <TextField
            label="Spa"
            value={info.spa}
            onChange={(spa) => setInfo({ spa })}
          />
          <TextField
            label="Reception"
            value={info.reception}
            onChange={(reception) => setInfo({ reception })}
          />
          <Field label="House rules">
            <textarea
              rows={4}
              value={info.rules}
              onChange={(event) => setInfo({ rules: event.target.value })}
              className={cn(
                FIELD_CONTROL,
                "min-h-0 resize-y px-3.5 py-3 leading-relaxed",
              )}
            />
          </Field>
        </div>

        <div className={cn(PANEL_CARD, "self-start px-5.5 py-5")}>
          <div className="text-sm font-semibold">What each guest sees</div>
          <p className="mt-2 text-[13px] leading-relaxed text-soft">
            These values reach every guest exactly as you typed them, in
            English. The labels around them — “Breakfast”, “Reception” and so on
            — are shown in the guest’s language.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Keep them short: a time, a password, a floor number.
          </p>
        </div>
      </div>
    </div>
  );
}
