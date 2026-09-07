"use client";

import { Hotel } from "lucide-react";
import { useEffect, useState } from "react";

import { HOTEL } from "@/features/requests";
import {
  DICTIONARY,
  LANGUAGES,
  scriptFont,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const GREET_INTERVAL_MS = 2600;

interface LanguageScreenProps {
  room: string;
  onPick: (code: LangCode) => void;
  onPickCustom: (name: string) => void;
}

export function LanguageScreen({
  room,
  onPick,
  onPickCustom,
}: LanguageScreenProps) {
  const [greetIndex, setGreetIndex] = useState(0);
  const [customLang, setCustomLang] = useState("");

  useEffect(() => {
    const timer = setInterval(
      () => setGreetIndex((current) => current + 1),
      GREET_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  const spotlight = LANGUAGES[greetIndex % LANGUAGES.length] ?? "en";
  const others = LANGUAGES.filter((code) => code !== spotlight)
    .map((code) => DICTIONARY[code].greet)
    .join("   ·   ");

  const customName = customLang.trim();

  return (
    <div className="animate-fade flex min-h-dvh flex-col px-6.5 pt-6.5 pb-8.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Hotel strokeWidth={1.4} className="size-5" />
          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">
            {HOTEL.name}
          </span>
        </div>
        <span className="rounded-full bg-sand/30 px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-soft">
          ROOM {room}
        </span>
      </div>

      <div className="mt-10 flex min-h-[46px] items-end">
        <span
          dir={DICTIONARY[spotlight].dir}
          className={cn(
            "animate-greet w-full text-[34px] leading-[1.15] font-semibold tracking-[-0.03em]",
            scriptFont(spotlight),
          )}
        >
          {DICTIONARY[spotlight].greet}
        </span>
      </div>
      <div className="mt-3 text-[13.5px] leading-[1.7] text-ghost">
        {others}
      </div>

      <div className="mt-7.5 mb-3 text-[12.5px] text-faint">
        Choose your language
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LANGUAGES.map((code) => {
          const phrases = DICTIONARY[code];
          return (
            <button
              key={code}
              type="button"
              onClick={() => onPick(code)}
              className="flex min-h-[76px] cursor-pointer flex-col justify-between rounded-tile border border-line-strong px-4 pt-3.5 pb-3 text-start transition-colors hover:border-ink/30 hover:bg-surface"
            >
              <span
                dir={phrases.dir}
                className={cn(
                  "block text-xl leading-tight font-medium tracking-[-0.02em]",
                  scriptFont(code),
                )}
              >
                {phrases.native}
              </span>
              <span className="block min-h-3.5 text-right text-[10.5px] font-medium tracking-wide text-sage">
                {code === "ar" ? "Suggested" : ""}
              </span>
            </button>
          );
        })}

        <div
          className={cn(
            "flex min-h-[72px] min-w-0 items-center gap-1.5 rounded-tile pr-2 pl-4 transition-colors",
            customName
              ? "border border-sage"
              : "border border-dashed border-line-dashed",
          )}
        >
          <input
            value={customLang}
            onChange={(event) => setCustomLang(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && customName) onPickCustom(customName);
            }}
            placeholder="Other language…"
            aria-label="Other language"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            className="min-h-11 w-0 min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none"
          />
          {customName ? (
            <button
              type="button"
              onClick={() => onPickCustom(customName)}
              aria-label="Continue"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-sage text-[17px] text-paper"
            >
              →
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-auto pt-6 text-xs leading-[1.65] text-ghost">
        No app, no account. We translate automatically — write in any language
        and the front desk answers in it.
      </p>
    </div>
  );
}
