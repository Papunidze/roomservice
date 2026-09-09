"use client";

import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { useRotatingLanguage } from "@/shared/ui";

import { LanguagePills } from "./LanguagePills";

const RTL_NAMES = LANGUAGES.filter((code) => DICTIONARY[code].dir === "rtl")
  .map((code) => DICTIONARY[code].name)
  .join(", ");

export function LanguagesCard() {
  const active = useRotatingLanguage();
  const phrases = DICTIONARY[active];

  return (
    <div className="rounded-card bg-ink px-7.5 pt-7.5 pb-8 text-paper">
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-paper/65 uppercase">
        Languages
      </span>
      <div className="mt-5.5 flex min-h-13 items-end">
        <p
          key={active}
          dir={phrases.dir}
          className={cn(
            "animate-greet w-full text-left text-[40px] leading-[1.15] font-semibold tracking-[-0.03em]",
            scriptFont(active),
          )}
        >
          {phrases.greet}
        </p>
      </div>
      <p className="mt-4 max-w-[440px] text-[14.5px] leading-relaxed text-paper/80">
        {LANGUAGES.length} languages on the first screen, from Arabic and
        Russian to Hindi and Georgian. {RTL_NAMES} run right to left, each
        script in its own typeface. A guest whose language is not on the list
        gets English.
      </p>
      <div className="mt-5.5">
        <LanguagePills active={active} tone="dark" />
      </div>
    </div>
  );
}
