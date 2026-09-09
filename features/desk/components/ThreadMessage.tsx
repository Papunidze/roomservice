"use client";

import { Lock } from "lucide-react";

import type { GuestLanguage, Message } from "@/features/requests";
import type { LangCode } from "@/shared/i18n";
import { formatAgo } from "@/shared/lib/time";
import { Avatar } from "@/shared/ui";

import { ThreadCard } from "./ThreadCard";

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
      <div className="flex items-center gap-2.5 px-2 text-[12.5px] text-faint">
        <span className="size-1.5 shrink-0 rounded-full bg-ink/25" />
        <span>{message.text}</span>
        <span className="ml-auto">{formatAgo(message.minutesAgo)}</span>
      </div>
    );
  }

  if (message.from === "note") {
    return (
      <div className="rounded-tile border border-sand bg-sand/55 px-5 py-4">
        <div className="flex items-center gap-2.5 text-[12.5px]">
          <Avatar name={message.by ?? ""} className="size-6.5 text-[10px]" />
          <span className="font-semibold">{message.by}</span>
          <span className="flex items-center gap-1 text-note-ink">
            <Lock strokeWidth={1.8} className="size-3" />
            internal note · only your team sees this
          </span>
          <span className="ml-auto text-faint">
            {formatAgo(message.minutesAgo)}
          </span>
        </div>
        <div className="mt-3 text-[15px] leading-relaxed">{message.text}</div>
      </div>
    );
  }

  return (
    <ThreadCard
      message={message}
      guestLanguage={guestLanguage}
      staffLang={staffLang}
    />
  );
}
