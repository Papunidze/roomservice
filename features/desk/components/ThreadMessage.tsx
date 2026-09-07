"use client";

import { Lock } from "lucide-react";

import type { GuestLanguage, Message } from "@/features/requests";
import type { LangCode } from "@/shared/i18n";

import { MessageBubble } from "./MessageBubble";

interface ThreadMessageProps {
  message: Message;
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
}

export function ThreadMessage({
  message,
  guestLanguage,
  staffLang,
}: ThreadMessageProps) {
  if (message.from === "system") {
    return (
      <div className="flex items-center gap-3 py-0.5">
        <span className="h-px flex-1 bg-ink/8" />
        <span className="font-mono text-[11px] text-faint">
          {message.text} ·{" "}
          {message.minutesAgo < 1
            ? "just now"
            : `${message.minutesAgo} min ago`}
        </span>
        <span className="h-px flex-1 bg-ink/8" />
      </div>
    );
  }

  if (message.from === "note") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[68%] rounded-[20px_20px_6px_20px] border border-sand bg-sand/55 px-4 pt-3 pb-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.12em] text-note-ink uppercase">
            <Lock strokeWidth={1.8} className="size-2.5" />
            Internal — not visible to guest
          </div>
          <div className="mt-2 text-sm leading-relaxed">{message.text}</div>
        </div>
        <div className="mt-1.5 text-[11px] text-ghost">
          {message.by} · internal note
        </div>
      </div>
    );
  }

  return (
    <MessageBubble
      message={message}
      guestLanguage={guestLanguage}
      staffLang={staffLang}
    />
  );
}
