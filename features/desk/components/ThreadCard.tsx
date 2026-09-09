"use client";

import { Camera, User } from "lucide-react";

import {
  resolveText,
  type GuestLanguage,
  type Message,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatAgo } from "@/shared/lib/time";
import { Avatar } from "@/shared/ui";

interface ThreadCardProps {
  message: Message;
  guestLanguage: GuestLanguage;
  staffLang: LangCode;
}

export function ThreadCard({
  message,
  guestLanguage,
  staffLang,
}: ThreadCardProps) {
  const fromGuest = message.from === "guest";
  const primary = fromGuest
    ? resolveText(message, staffLang)
    : { text: message.text, lang: message.lang };
  const guestCopy = fromGuest ? null : resolveText(message, guestLanguage.base);

  const secondary = fromGuest
    ? primary.lang !== message.lang
      ? {
          label: `Original in ${DICTIONARY[message.lang].name}`,
          text: message.text,
          lang: message.lang,
        }
      : null
    : guestCopy && guestCopy.lang !== message.lang
      ? {
          label: `Guest sees in ${guestLanguage.name}`,
          text: guestCopy.text,
          lang: guestCopy.lang,
        }
      : null;

  const pending = fromGuest
    ? primary.lang !== staffLang &&
      `Translating to ${DICTIONARY[staffLang].name}…`
    : guestCopy?.lang === message.lang &&
      message.lang !== guestLanguage.base &&
      `Translating to ${guestLanguage.name} for the guest…`;

  return (
    <div
      className={cn(
        "rounded-tile border px-5 py-4",
        fromGuest ? "border-sand bg-sand/25" : "border-line-strong bg-paper",
      )}
    >
      <div className="flex items-center gap-2.5 text-[12.5px]">
        {fromGuest ? (
          <span className="grid size-6.5 place-items-center rounded-full bg-sand text-sand-ink">
            <User strokeWidth={1.8} className="size-3.5" />
          </span>
        ) : (
          <Avatar name={message.by ?? ""} className="size-6.5 text-[10px]" />
        )}
        <span className="font-semibold">
          {fromGuest ? "Guest" : (message.by ?? "Front desk")}
        </span>
        <span className="text-faint">
          {fromGuest
            ? `wrote in ${guestLanguage.name}`
            : `replied in ${DICTIONARY[message.lang].name}`}
        </span>
        <span className="ml-auto text-faint">
          {formatAgo(message.minutesAgo)}
        </span>
      </div>

      <div
        dir={DICTIONARY[primary.lang].dir}
        className={cn(
          "mt-3 text-[15px] leading-relaxed",
          scriptFont(primary.lang),
        )}
      >
        {primary.text}
      </div>

      {secondary ? (
        <div className="mt-3 border-t border-ink/10 pt-3">
          <div className="text-[11.5px] text-faint">{secondary.label}</div>
          <div
            dir={DICTIONARY[secondary.lang].dir}
            className={cn(
              "mt-1 text-[13.5px] leading-snug text-soft",
              scriptFont(secondary.lang),
            )}
          >
            {secondary.text}
          </div>
        </div>
      ) : null}

      {pending ? (
        <div className="mt-2.5 text-[12px] text-faint">{pending}</div>
      ) : null}

      {message.photo ? (
        <div className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
          <Camera strokeWidth={1.5} className="size-4" />
          Photo attached
        </div>
      ) : null}
    </div>
  );
}
