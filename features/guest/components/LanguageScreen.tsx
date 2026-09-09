"use client";

import { Hotel, Search, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import type { GuestSettings } from "@/features/requests";
import {
  DICTIONARY,
  LANGUAGES,
  matchesLanguage,
  scriptFont,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag } from "@/shared/ui";

const GREET_INTERVAL_MS = 2600;
const GREET_STRIP = 4;

const neverChanges = () => () => {};

function useDeviceLanguages() {
  const tags = useSyncExternalStore(
    neverChanges,
    () => navigator.languages.join(","),
    () => "",
  );

  return tags ? tags.split(",").map((tag) => tag.split("-")[0] ?? tag) : [];
}

interface LanguageScreenProps {
  room: string;
  settings: GuestSettings;
  onPick: (code: LangCode) => void;
}

export function LanguageScreen({
  room,
  settings,
  onPick,
}: LanguageScreenProps) {
  const deviceTags = useDeviceLanguages();
  const [greetIndex, setGreetIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(
      () => setGreetIndex((current) => current + 1),
      GREET_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  const offered = LANGUAGES.filter((code) => settings.guestLanguages[code]);
  const spotlight = offered[greetIndex % offered.length] ?? "en";
  const strip = Array.from(
    { length: Math.min(GREET_STRIP, offered.length - 1) },
    (_, step) =>
      DICTIONARY[offered[(greetIndex + step + 1) % offered.length] ?? "en"]
        .greet,
  ).join("   ·   ");

  const suggested =
    deviceTags.find((tag): tag is LangCode =>
      offered.includes(tag as LangCode),
    ) ?? null;

  const matches = offered.filter((code) => matchesLanguage(code, query));
  const showSuggested = suggested !== null && query.trim().length === 0;

  return (
    <div className="animate-fade flex min-h-dvh flex-col px-6.5 pt-6.5 pb-8.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Hotel strokeWidth={1.4} className="size-5" />
          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">
            {settings.hotel.name}
          </span>
        </div>
        <span className="rounded-full bg-sand/30 px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-soft">
          ROOM {room}
        </span>
      </div>

      <div className="mt-9 flex min-h-[46px] items-end">
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
      <div className="mt-2.5 truncate text-[13.5px] text-ghost">{strip}</div>

      <div className="mt-7 flex min-h-12 items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4.5">
        <Search strokeWidth={1.6} className="size-4 shrink-0 text-faint" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your language"
          aria-label="Search your language"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          className="w-0 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-faint"
          >
            <X strokeWidth={1.8} className="size-3.5" />
          </button>
        ) : null}
      </div>

      {showSuggested ? (
        <button
          type="button"
          onClick={() => onPick(suggested)}
          className="mt-4 flex min-h-[76px] cursor-pointer flex-col justify-center rounded-tile border border-sage bg-sage/6 px-4.5 py-3 text-start transition-colors hover:bg-sage/10"
        >
          <span className="font-mono text-[10px] tracking-[0.14em] text-sage uppercase">
            Suggested for your phone
          </span>
          <span
            dir={DICTIONARY[suggested].dir}
            className="mt-1.5 flex items-center gap-2.5"
          >
            <Flag code={suggested} className="h-6 w-8" />
            <span
              className={cn(
                "text-[21px] leading-tight font-medium tracking-[-0.02em]",
                scriptFont(suggested),
              )}
            >
              {DICTIONARY[suggested].native}
            </span>
          </span>
        </button>
      ) : null}

      <div className="mt-6 mb-3 text-[12.5px] text-faint">
        {query ? `${matches.length} of ${offered.length}` : "All languages"}
      </div>

      {matches.length === 0 ? (
        <p className="rounded-tile border border-dashed border-line-dashed px-5 py-8 text-center text-[13.5px] leading-relaxed text-faint">
          Nothing matched “{query.trim()}”. Try the language’s own name, or its
          English name.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {matches.map((code) => {
            const phrases = DICTIONARY[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => onPick(code)}
                className="flex min-h-[72px] cursor-pointer flex-col justify-center rounded-tile border border-line-strong px-4 py-3 text-start transition-colors hover:border-ink/30 hover:bg-surface"
              >
                <span dir={phrases.dir} className="flex items-center gap-2.5">
                  <Flag code={code} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-[18px] leading-tight font-medium tracking-[-0.02em]",
                        scriptFont(code),
                      )}
                    >
                      {phrases.native}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-faint">
                      {phrases.name}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-auto pt-7 text-xs leading-[1.65] text-ghost">
        No app, no account. Everything you tap is translated for the front desk;
        anything you type is passed on as written.
      </p>
    </div>
  );
}
