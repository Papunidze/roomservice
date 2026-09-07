"use client";

import { Check } from "lucide-react";

import {
  DICTIONARY,
  LANGUAGES,
  scriptFont,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag } from "@/shared/ui";

interface LanguageSheetProps {
  title: string;
  current: LangCode;
  onPick: (code: LangCode) => void;
  onClose: () => void;
}

export function LanguageSheet({
  title,
  current,
  onPick,
  onClose,
}: LanguageSheetProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade absolute inset-0 w-full cursor-default bg-ink/30"
      />
      <div className="animate-sheet absolute inset-x-0 bottom-0 mx-auto flex max-h-[85dvh] max-w-[430px] flex-col rounded-t-sheet bg-paper px-5.5 pt-5 pb-7.5">
        <div className="mx-auto mb-5 h-[3px] w-9 rounded-full bg-ink/20" />
        <div className="mb-3.5 text-[12.5px] text-faint">{title}</div>
        <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-px overflow-y-auto bg-line">
          {LANGUAGES.map((code) => {
            const phrases = DICTIONARY[code];
            const on = code === current;
            return (
              <button
                key={code}
                type="button"
                onClick={() => onPick(code)}
                className={cn(
                  "flex min-h-[68px] cursor-pointer items-center gap-3 px-5.5",
                  on ? "bg-sage/9" : "bg-paper hover:bg-surface",
                )}
              >
                <span
                  dir={phrases.dir}
                  className="flex flex-1 items-center gap-3"
                >
                  <Flag code={code} className="h-6 w-8" />
                  <span
                    className={cn(
                      "text-[21px] font-medium tracking-[-0.02em]",
                      scriptFont(code),
                    )}
                  >
                    {phrases.native}
                  </span>
                </span>
                {on ? (
                  <Check strokeWidth={2} className="size-4 text-sage" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
