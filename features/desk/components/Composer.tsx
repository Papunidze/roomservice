"use client";

import { CornerDownRight } from "lucide-react";
import { useState } from "react";

import type { GuestLanguage, Message } from "@/features/requests";
import {
  CANNED,
  CANNED_KEYS,
  DICTIONARY,
  scriptFont,
  type CannedKey,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

interface ComposerProps {
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
  onSend: (message: Pick<Message, "text" | "lang" | "translations">) => void;
}

export function Composer({ guestLanguage, staffLang, onSend }: ComposerProps) {
  const [cannedKey, setCannedKey] = useState<CannedKey | null>(null);
  const [freeText, setFreeText] = useState("");

  const draft = cannedKey ? CANNED[cannedKey][staffLang] : freeText;
  const canSend = draft.trim().length > 0;

  const previewLabel = cannedKey
    ? `Guest reads in ${guestLanguage.name}:`
    : draft
      ? `Sent as written in ${DICTIONARY[staffLang].name} —`
      : "";

  const previewText = cannedKey
    ? CANNED[cannedKey][guestLanguage.base]
    : draft
      ? "the guest sees your words unchanged."
      : `Write in ${DICTIONARY[staffLang].name} or pick a suggestion.`;

  const send = () => {
    if (!canSend) return;
    onSend({
      text: draft,
      lang: staffLang,
      translations: cannedKey ? CANNED[cannedKey] : {},
    });
    setCannedKey(null);
    setFreeText("");
  };

  return (
    <div className="border-t border-line px-7.5 pt-4 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-faint">Suggestions</span>
        {CANNED_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCannedKey(key)}
            className={cn(
              "min-h-9 cursor-pointer rounded-full border px-3.5 text-[12.5px] hover:border-sage hover:text-sage-deep",
              scriptFont(staffLang),
              cannedKey === key
                ? "border-sage bg-sage/10 text-sage-deep"
                : "border-line-strong text-muted",
            )}
          >
            {CANNED[key][staffLang]}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-tile border border-line-strong bg-paper">
        <textarea
          rows={3}
          dir={DICTIONARY[staffLang].dir}
          value={draft}
          onChange={(event) => {
            setCannedKey(null);
            setFreeText(event.target.value);
          }}
          placeholder={DICTIONARY[staffLang].replyPlaceholder}
          aria-label="Reply to guest"
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm leading-relaxed outline-none",
            scriptFont(staffLang),
          )}
        />

        <div className="flex items-center gap-3 border-t border-dashed border-line-dashed px-3 py-3 pl-4">
          <CornerDownRight
            strokeWidth={1.5}
            className="size-[15px] shrink-0 text-sage"
          />
          <span className="min-w-0 flex-1 text-[12.5px] leading-snug">
            <span className="text-faint">{previewLabel} </span>
            <span
              dir={cannedKey ? guestLanguage.dir : "ltr"}
              className={cn(
                cannedKey
                  ? cn(scriptFont(guestLanguage.base), "text-ink")
                  : "text-faint",
              )}
            >
              {previewText}
            </span>
          </span>
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="min-h-9 cursor-pointer rounded-full bg-sage px-5 text-[12.5px] font-medium text-paper transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-ghost"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
