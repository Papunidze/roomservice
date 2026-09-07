"use client";

import { Camera, CornerDownRight, Lock } from "lucide-react";
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
  onSend: (message: Reply) => void;
  onAddNote: (text: string) => void;
}

const TOGGLE =
  "inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs transition-colors";

export function Composer({
  guestLanguage,
  staffLang,
  onSend,
  onAddNote,
}: ComposerProps) {
  const [cannedKey, setCannedKey] = useState<CannedKey | null>(null);
  const [freeText, setFreeText] = useState("");
  const [isNote, setIsNote] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const draft = cannedKey ? CANNED[cannedKey][staffLang] : freeText;
  const canSend = draft.trim().length > 0;

  const preview = buildPreview({
    isNote,
    cannedKey,
    draft,
    guestLanguage,
    staffLang,
  });

  const send = () => {
    if (!canSend) return;

    if (isNote) {
      onAddNote(draft.trim());
    } else {
      onSend({
        text: draft.trim(),
        lang: staffLang,
        translations: cannedKey ? CANNED[cannedKey] : {},
        photo: hasPhoto,
      });
    }

    setCannedKey(null);
    setFreeText("");
    setHasPhoto(false);
    setIsNote(false);
  };

  return (
    <div className="border-t border-line px-7.5 pt-3 pb-5.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-faint">Quick replies</span>
        {CANNED_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setCannedKey(key);
              setIsNote(false);
            }}
            className={cn(
              "min-h-8 cursor-pointer rounded-full border px-3.5 text-xs font-medium text-sage-deep transition-colors",
              cannedKey === key && !isNote
                ? "border-sage bg-sage/10"
                : "border-line-strong",
            )}
          >
            {CANNED_LABEL[key]}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-2.5 rounded-tile border transition-colors",
          isNote ? "border-sand bg-sand/28" : "border-line-strong bg-paper",
        )}
      >
        <textarea
          rows={3}
          dir={isNote ? "ltr" : DICTIONARY[staffLang].dir}
          value={draft}
          onChange={(event) => {
            setCannedKey(null);
            setFreeText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder={
            isNote
              ? "Write a note for the team…"
              : `Write in ${DICTIONARY[staffLang].name}…`
          }
          aria-label={isNote ? "Internal note" : "Reply to guest"}
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-3.5 pb-1.5 text-sm leading-relaxed outline-none",
            isNote ? "font-sans" : scriptFont(staffLang),
          )}
        />

        <div className="flex items-start gap-2 px-4 pb-2 text-[12.5px] leading-snug">
          <CornerDownRight
            strokeWidth={1.5}
            className="mt-0.5 size-3.5 shrink-0 text-sage"
          />
          <span className="shrink-0 text-faint">{preview.label}</span>
          <span
            dir={preview.dir}
            className={cn(
              preview.emphasised ? "text-ink" : "text-faint",
              preview.font,
            )}
          >
            {preview.text}
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-t border-dashed border-line-dashed py-2.5 pr-2.5 pl-3">
          <button
            type="button"
            disabled={isNote}
            onClick={() => setHasPhoto(!hasPhoto)}
            className={cn(
              TOGGLE,
              "disabled:cursor-default disabled:opacity-40",
              hasPhoto
                ? "border-sage text-sage-deep"
                : "border-line-strong text-muted",
            )}
          >
            <Camera strokeWidth={1.5} className="size-3.5" />
            {hasPhoto ? "IMG_2043.jpg" : "Photo"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsNote(!isNote);
              setCannedKey(null);
            }}
            className={cn(
              TOGGLE,
              isNote
                ? "border-note-ink/60 bg-sand/60 text-note-ink"
                : "border-line-strong text-muted",
            )}
          >
            <Lock strokeWidth={1.6} className="size-3" />
            Internal note
          </button>
          <span className="flex-1" />
          {isNote ? null : (
            <span className="text-[11.5px] text-ghost">
              Enter to send · Shift+Enter for a new line
            </span>
          )}
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className={cn(
              "min-h-9 cursor-pointer rounded-full px-5 text-[12.5px] font-medium text-paper transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-ghost",
              isNote ? "bg-note-ink" : "bg-sage",
            )}
          >
            {isNote ? "Add note" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPreview({
  isNote,
  cannedKey,
  draft,
  guestLanguage,
  staffLang,
}: {
  isNote: boolean;
  cannedKey: CannedKey | null;
  draft: string;
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
}) {
  if (isNote)
    return {
      label: "Internal note —",
      text: "saved to the ticket, never sent to the guest.",
      dir: "ltr" as const,
      font: "",
      emphasised: false,
    };

  if (cannedKey)
    return {
      label: `Guest reads in ${guestLanguage.name}:`,
      text: CANNED[cannedKey][guestLanguage.base],
      dir: guestLanguage.dir,
      font: scriptFont(guestLanguage.base),
      emphasised: true,
    };

  if (draft.trim())
    return {
      label: `Sent as written in ${DICTIONARY[staffLang].name} —`,
      text: "the guest sees your words unchanged.",
      dir: "ltr" as const,
      font: "",
      emphasised: false,
    };

  return {
    label: "",
    text: `Write in ${DICTIONARY[staffLang].name} or pick a quick reply.`,
    dir: "ltr" as const,
    font: "",
    emphasised: false,
  };
}
