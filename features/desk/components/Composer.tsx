"use client";

import { Camera, Lock } from "lucide-react";
import { useState } from "react";

import type { GuestLanguage, Message } from "@/features/requests";
import {
  CANNED,
  CANNED_KEYS,
  CANNED_LABEL,
  DICTIONARY,
  scriptFont,
  type CannedKey,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

type Reply = Pick<Message, "text" | "lang" | "translations" | "photo">;

interface ComposerProps {
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
  onSend: (message: Reply) => Promise<boolean>;
  onAddNote: (text: string) => Promise<boolean>;
}

const TAB =
  "min-h-8.5 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors";

export function Composer({
  guestLanguage,
  staffLang,
  onSend,
  onAddNote,
}: ComposerProps) {
  const [isNote, setIsNote] = useState(false);
  const [cannedKey, setCannedKey] = useState<CannedKey | null>(null);
  const [freeText, setFreeText] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const draft = cannedKey ? CANNED[cannedKey][staffLang] : freeText;
  const canSend = draft.trim().length > 0 && !isSending;
  const staffName = DICTIONARY[staffLang].name;

  const send = async () => {
    if (!canSend) return;

    setIsSending(true);
    const isSent = isNote
      ? await onAddNote(draft.trim())
      : await onSend({
          text: draft.trim(),
          lang: staffLang,
          translations: cannedKey ? CANNED[cannedKey] : {},
          photo: hasPhoto,
        });
    setIsSending(false);
    if (!isSent) return;

    setCannedKey(null);
    setFreeText("");
    setHasPhoto(false);
  };

  return (
    <div className="border-t border-line bg-surface px-7.5 pt-3.5 pb-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
          <button
            type="button"
            onClick={() => setIsNote(false)}
            className={cn(TAB, !isNote ? "bg-ink text-paper" : "text-muted")}
          >
            Reply to guest
          </button>
          <button
            type="button"
            onClick={() => {
              setIsNote(true);
              setCannedKey(null);
            }}
            className={cn(
              TAB,
              "flex items-center gap-1.5",
              isNote ? "bg-note-ink text-paper" : "text-muted",
            )}
          >
            <Lock strokeWidth={1.8} className="size-3" />
            Internal note
          </button>
        </div>

        {isNote ? null : (
          <>
            <span className="ml-2 text-[12px] text-faint">Quick replies</span>
            {CANNED_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCannedKey(cannedKey === key ? null : key)}
                className={cn(
                  "min-h-8 cursor-pointer rounded-full border px-3.5 text-xs font-medium transition-colors",
                  cannedKey === key
                    ? "border-sage bg-sage/10 text-sage-deep"
                    : "border-line-strong text-muted",
                )}
              >
                {CANNED_LABEL[key]}
              </button>
            ))}
          </>
        )}
      </div>

      <div
        className={cn(
          "mt-3 rounded-tile border transition-colors",
          isNote ? "border-sand bg-sand/28" : "border-line-strong bg-paper",
        )}
      >
        <textarea
          rows={2}
          dir={isNote ? "ltr" : DICTIONARY[staffLang].dir}
          value={draft}
          onChange={(event) => {
            setCannedKey(null);
            setFreeText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          placeholder={
            isNote
              ? "A note for your team. The guest never sees it."
              : `Write in ${staffName}. The guest gets it in ${guestLanguage.name}.`
          }
          aria-label={isNote ? "Internal note" : "Reply to guest"}
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14.5px] leading-relaxed outline-none",
            isNote ? "font-sans" : scriptFont(staffLang),
          )}
        />

        <div className="flex items-center gap-2 px-3 pb-3">
          {cannedKey ? (
            <span className="flex min-w-0 items-center gap-2 pl-1 text-[12.5px]">
              <span className="shrink-0 text-faint">Guest gets:</span>
              <span
                dir={guestLanguage.dir}
                className={cn("truncate", scriptFont(guestLanguage.base))}
              >
                {CANNED[cannedKey][guestLanguage.base]}
              </span>
            </span>
          ) : null}
          <span className="flex-1" />
          {isNote ? null : (
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className={cn(
                "inline-flex min-h-8.5 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
                hasPhoto
                  ? "border-sage text-sage-deep"
                  : "border-line-strong text-muted",
              )}
            >
              <Camera strokeWidth={1.5} className="size-3.5" />
              {hasPhoto ? "Photo attached" : "Add photo"}
            </button>
          )}
          <button
            type="button"
            onClick={() => void send()}
            disabled={!canSend}
            className={cn(
              "min-h-9 cursor-pointer rounded-full px-5 text-[13px] font-medium text-paper transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-ghost",
              isNote ? "bg-note-ink" : "bg-sage",
            )}
          >
            {isSending ? "Sending…" : isNote ? "Save note" : "Send reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
