"use client";

import { Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateSettings, type Settings } from "@/features/requests";
import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import {
  Button,
  Field,
  FIELD_CONTROL,
  SegmentedOption,
  showToast,
  TextField,
} from "@/shared/ui";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

export function GuestInfoPanel({ settings }: { settings: Settings }) {
  const router = useRouter();
  const { info, infoSourceLang } = settings;
  const setInfo = (patch: Partial<Settings["info"]>) =>
    updateSettings({ info: { ...info, ...patch } });

  return (
    <div className="animate-rise max-w-215">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <PanelHeading
            title="Guest info page"
            subtitle={`Written once in ${DICTIONARY[infoSourceLang].name} and shown to every guest exactly as written.`}
          />
        </div>
        <Button variant="ghost" onClick={() => router.push("/r/205")}>
          <Smartphone strokeWidth={1.6} className="size-3.5" />
          Preview as guest
        </Button>
      </div>

      <div className="mt-5.5 grid grid-cols-[1fr_280px] gap-3.5">
        <div className={cn(PANEL_CARD, "flex flex-col gap-4 p-6")}>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-faint">Source language</span>
            <span className="flex gap-0.5 rounded-full bg-ink/5 p-0.5">
              {(["en", "ka"] as const).map((code) => (
                <SegmentedOption
                  key={code}
                  active={infoSourceLang === code}
                  onClick={() => updateSettings({ infoSourceLang: code })}
                >
                  {code.toUpperCase()}
                </SegmentedOption>
              ))}
            </span>
          </div>

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
          <div className="mt-1.5 flex flex-col">
            {LANGUAGES.map((code) => (
              <div
                key={code}
                className="flex min-h-11.5 items-center gap-2.5 border-t border-line-soft"
              >
                <span
                  dir={DICTIONARY[code].dir}
                  className={cn("text-start text-sm", scriptFont(code))}
                >
                  {DICTIONARY[code].native}
                </span>
                <span className="flex-1" />
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                    code === infoSourceLang
                      ? "bg-sage/10 text-sage-deep"
                      : "bg-ink/5 text-faint",
                  )}
                >
                  {code === infoSourceLang ? "Source" : "As written"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            This build has no translation model. These values reach every guest
            in the source language, labelled as such — only the surrounding app
            copy is translated.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => showToast("Guest info saved")}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
