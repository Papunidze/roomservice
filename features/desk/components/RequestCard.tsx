"use client";

import { Camera } from "lucide-react";

import {
  CATEGORY_LABEL,
  resolveText,
  UNASSIGNED,
  type Request,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatAgo } from "@/shared/lib/time";
import { Flag } from "@/shared/ui";

const WAITING_AFTER_MINUTES = 15;

interface RequestCardProps {
  request: Request;
  readingLang: LangCode;
  onOpen: (id: number) => void;
}

export function RequestCard({
  request,
  readingLang,
  onOpen,
}: RequestCardProps) {
  const first = request.thread[0];
  const summary = first ? resolveText(first, readingLang) : null;
  const isUnanswered = request.status === "new";
  const isWaiting = isUnanswered && request.minutesAgo >= WAITING_AFTER_MINUTES;
  const hasPhoto = request.thread.some((message) => message.photo);

  return (
    <button
      type="button"
      onClick={() => onOpen(request.id)}
      className={cn(
        "flex min-h-44 cursor-pointer flex-col rounded-tile border bg-surface px-5 py-4.5 text-left transition-colors hover:border-ink/30",
        isUnanswered ? "border-urgent/50" : "border-line",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.14em] text-ghost uppercase">
          {CATEGORY_LABEL[request.category]}
        </span>
        {request.urgency === "high" ? (
          <span className="rounded-full bg-urgent/10 px-2 py-0.5 text-[11px] font-medium text-urgent">
            Urgent
          </span>
        ) : null}
        {isUnanswered ? (
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-urgent/10 px-2.5 py-1 text-[12px] font-bold text-urgent">
            <span className="size-2 rounded-full bg-urgent" />
            Unanswered
          </span>
        ) : null}
      </div>

      <div className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
        {request.room}
      </div>

      {summary ? (
        <p
          dir={DICTIONARY[summary.lang].dir}
          className={cn(
            "mt-1.5 line-clamp-2 text-[13.5px] leading-snug",
            isUnanswered ? "text-ink" : "text-muted",
            scriptFont(summary.lang),
          )}
        >
          {summary.text}
        </p>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-faint">
        <Flag code={request.language.base} className="h-3 w-4" />
        <span>{request.language.name}</span>
        <span>·</span>
        <span className={request.assignee === UNASSIGNED ? "" : "text-muted"}>
          {request.assignee === UNASSIGNED
            ? "Nobody assigned"
            : request.assignee}
        </span>
        {hasPhoto ? <Camera strokeWidth={1.6} className="size-3.5" /> : null}
        <span className={cn("ml-auto", isWaiting && "font-medium text-urgent")}>
          {isWaiting
            ? `waiting ${request.minutesAgo} min`
            : formatAgo(request.minutesAgo)}
        </span>
      </div>
    </button>
  );
}
