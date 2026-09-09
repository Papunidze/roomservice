"use client";

import { Wifi } from "lucide-react";
import { useState } from "react";

import type { GuestSettings } from "@/features/requests";
import { DICTIONARY, scriptFont, type Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { ScreenHeader } from "./ScreenHeader";

interface HotelInfoScreenProps {
  phrases: Phrases;
  settings: GuestSettings;
  onBack: () => void;
}

export function HotelInfoScreen({
  phrases,
  settings,
  onBack,
}: HotelInfoScreenProps) {
  const { hotel, info, infoSourceLang } = settings;
  const [copied, setCopied] = useState(false);

  const rows = [
    { label: phrases.breakfast, value: info.breakfast },
    { label: phrases.spa, value: info.spa },
    { label: phrases.reception, value: info.reception },
    { label: phrases.checkoutRow, value: hotel.checkout },
  ];

  const copyPassword = () => {
    navigator.clipboard
      ?.writeText(info.wifiPassword)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.infoTitle}
        onBack={onBack}
      />

      <button
        type="button"
        onClick={copyPassword}
        className="w-full cursor-pointer rounded-card border border-line-strong bg-sand/15 p-6 text-start"
      >
        <span className="flex items-center gap-2.5">
          <Wifi strokeWidth={1.4} className="size-[18px] text-sage" />
          <span className="font-mono text-[10.5px] tracking-[0.16em] text-faint">
            WI-FI
          </span>
        </span>
        <span className="mt-4 block text-2xl font-semibold tracking-[-0.02em]">
          {info.wifiName}
        </span>
        <span className="mt-4 flex items-baseline justify-between border-t border-line-strong pt-4">
          <span className="font-mono text-[17px] tracking-[0.08em]">
            {info.wifiPassword}
          </span>
          <span className="text-xs text-faint">
            {copied ? phrases.copied : phrases.tapCopy}
          </span>
        </span>
      </button>

      <div className="mt-5.5 flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-line px-1 py-4"
          >
            <span className="text-[14.5px] text-muted">{row.label}</span>
            <span className="text-[14.5px] font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 px-1">
        <div className="text-[12.5px] font-medium text-faint">
          {phrases.houseRules} · {DICTIONARY[infoSourceLang].native}
        </div>
        <p
          dir={DICTIONARY[infoSourceLang].dir}
          className={cn(
            "mt-2 text-start text-[14.5px] leading-relaxed",
            scriptFont(infoSourceLang),
          )}
        >
          {info.rules}
        </p>
      </div>
    </div>
  );
}
