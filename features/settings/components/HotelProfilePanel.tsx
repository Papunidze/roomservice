"use client";

import { Hotel } from "lucide-react";

import { TIMEZONES, type Settings } from "@/features/requests";
import {
  DICTIONARY,
  LANGUAGES,
  scriptFont,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import {
  Field,
  FIELD_CONTROL,
  Flag,
  showToast,
  Switch,
  TextField,
} from "@/shared/ui";

import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

export function HotelProfilePanel({ settings, onChange }: SettingsPanelProps) {
  const { hotel } = settings;
  const setHotel = (patch: Partial<Settings["hotel"]>) =>
    onChange({ hotel: { ...hotel, ...patch } });

  return (
    <div className="animate-rise max-w-190">
      <PanelHeading
        title="Hotel profile"
        subtitle="Shown on QR plates and the guest page header."
      />

      <div
        className={cn(PANEL_CARD, "mt-5.5 grid grid-cols-[96px_1fr] gap-5 p-6")}
      >
        <button
          type="button"
          onClick={() =>
            showToast("Logo upload · PNG or SVG, square, min 256 px")
          }
          className="grid size-24 cursor-pointer place-items-center rounded-tile border border-dashed border-line-dashed bg-paper"
        >
          <Hotel strokeWidth={1.4} className="size-6.5" />
        </button>

        <div className="grid grid-cols-2 gap-3.5">
          <TextField
            label="Hotel name"
            value={hotel.name}
            className="col-span-2"
            onChange={(name) => setHotel({ name })}
          />
          <TextField
            label="Address"
            value={hotel.address}
            className="col-span-2"
            onChange={(address) => setHotel({ address })}
          />
          <Field label="Timezone">
            <select
              value={hotel.timezone}
              onChange={(event) => setHotel({ timezone: event.target.value })}
              className={cn(FIELD_CONTROL, "cursor-pointer")}
            >
              {TIMEZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </Field>
          <TextField
            label="Check-out time"
            value={hotel.checkout}
            inputClassName="font-mono"
            onChange={(checkout) => setHotel({ checkout })}
          />
        </div>
      </div>

      <div className={cn(PANEL_CARD, "mt-3.5 p-6")}>
        <div className="text-[15px] font-semibold">Guest languages</div>
        <div className="mt-0.5 text-[12.5px] text-faint">
          Shown on the language screen after a scan. A guest whose language is
          switched off gets English copy.
        </div>

        <div className="mt-2.5 flex flex-col">
          {LANGUAGES.map((code) => {
            const on = settings.guestLanguages[code];
            return (
              <div
                key={code}
                className="flex min-h-13.5 items-center gap-3.5 border-t border-line-soft"
              >
                <Flag
                  code={code}
                  className={cn(on ? "opacity-100" : "opacity-45")}
                />
                <span
                  dir={DICTIONARY[code].dir}
                  className={cn(
                    "w-27.5 text-start text-[15px] font-medium",
                    scriptFont(code),
                    on ? "opacity-100" : "opacity-45",
                  )}
                >
                  {DICTIONARY[code].native}
                </span>
                <span className="text-[13px] text-faint">
                  {DICTIONARY[code].name}
                </span>
                <span className="flex-1" />
                <Switch
                  checked={on}
                  label={`${DICTIONARY[code].name} available to guests`}
                  onChange={() =>
                    onChange({
                      guestLanguages: {
                        ...settings.guestLanguages,
                        [code]: !on,
                      },
                    })
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-4">
          <span>
            <span className="block text-sm">Team language</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              Guest messages are translated into it, and replies are written in
              it. The console itself is always in English.
            </span>
          </span>
          <label>
            <span className="sr-only">Team language</span>
            <select
              value={settings.staffLang}
              onChange={(event) => {
                const staffLang = event.target.value as LangCode;
                onChange({ staffLang, staffDefaultLang: staffLang });
              }}
              className="min-h-9.5 cursor-pointer rounded-full border border-line-strong bg-surface px-3.5 text-[13px] font-medium outline-none"
            >
              {LANGUAGES.map((code) => (
                <option key={code} value={code}>
                  {DICTIONARY[code].name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
