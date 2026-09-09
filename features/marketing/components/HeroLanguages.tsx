"use client";

import { LANGUAGES } from "@/shared/i18n";
import { useRotatingLanguage } from "@/shared/ui";

import { LanguagePills } from "./LanguagePills";

export function HeroLanguages() {
  const active = useRotatingLanguage();

  return (
    <div className="rounded-[18px] border border-line px-4.5 py-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium">
          Guests pick any of these
        </span>
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted">
          {LANGUAGES.length} · YOU CHOOSE WHICH
        </span>
      </div>
      <div className="mt-3">
        <LanguagePills active={active} tone="light" />
      </div>
    </div>
  );
}
