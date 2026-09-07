"use client";

import { Camera } from "lucide-react";

import {
  resolveText,
  type GuestLanguage,
  type Message,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

interface MessageBubbleProps {
  message: Message;
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
}

function ago(minutes: number) {
  return minutes < 1 ? "just now" : `${minutes} min ago`;
}

export function MessageBubble({
  message,
  guestLanguage,
  staffLang,
}: MessageBubbleProps) {
  const fromGuest = message.from === "guest";
  const mainLang = message.lang;
  const sub = resolveText(message, fromGuest ? staffLang : guestLanguage.base);
  const showSub = sub.lang !== mainLang;

  const meta = fromGuest
    ? `Guest · ${guestLanguage.name} · ${ago(message.minutesAgo)}`
    : `${message.by ?? "Front desk"} · wrote in ${DICTIONARY[mainLang].name} · ${ago(message.minutesAgo)}`;

  return (
    <div
      className={cn("flex flex-col", fromGuest ? "items-start" : "items-end")}
    >
      <div
        className={cn(
          "max-w-[68%] px-4.5 py-3.5",
          fromGuest
            ? "rounded-[20px_20px_20px_6px] bg-sand/30"
            : "rounded-[20px_20px_6px_20px] bg-sage-deep text-paper",
        )}
      >
        <div
          dir={DICTIONARY[mainLang].dir}
          className={cn("text-sm leading-relaxed", scriptFont(mainLang))}
        >
          {message.text}
        </div>

        {showSub ? (
          <div
            className={cn(
              "mt-2.5 border-t border-dashed pt-2.5",
              fromGuest ? "border-ink/15" : "border-paper/30",
            )}
          >
            <div
              className={cn(
                "mb-1 font-mono text-[9.5px] tracking-[0.12em] uppercase",
                fromGuest ? "text-ghost" : "text-paper/55",
              )}
            >
              {fromGuest
                ? DICTIONARY[sub.lang].native
                : `Guest reads · ${DICTIONARY[sub.lang].native}`}
            </div>
            <div
              dir={DICTIONARY[sub.lang].dir}
              className={cn(
                "text-[13px] leading-snug",
                scriptFont(sub.lang),
                fromGuest ? "text-soft" : "text-paper/85",
              )}
            >
              {sub.text}
            </div>
          </div>
        ) : null}

        {message.photo ? (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <Camera strokeWidth={1.4} className="size-[15px]" />
            <span>IMG_2043.jpg</span>
          </div>
        ) : null}
      </div>
      <div className="mt-1.5 text-[11px] text-ghost">{meta}</div>
    </div>
  );
}
