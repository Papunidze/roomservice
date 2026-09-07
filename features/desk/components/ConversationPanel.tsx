"use client";

import { CircleCheck } from "lucide-react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  STAFF_MEMBERS,
  type Message,
  type Request,
  type Status,
} from "@/features/requests";
import type { LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { Avatar } from "./Avatar";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";

const STATUS_LABEL: { status: Status; label: string }[] = [
  { status: "new", label: "New" },
  { status: "progress", label: "In progress" },
  { status: "done", label: "Done" },
];

const URGENCY_LABEL = { high: "Urgent", medium: "Normal", low: "Low" } as const;

interface ConversationPanelProps {
  request: Request | undefined;
  staffLang: LangCode;
  onStatusChange: (status: Status) => void;
  onAssign: (assignee: string) => void;
  onSend: (message: Pick<Message, "text" | "lang" | "translations">) => void;
}

export function ConversationPanel({
  request,
  staffLang,
  onStatusChange,
  onAssign,
  onSend,
}: ConversationPanelProps) {
  if (!request) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-surface p-10 text-center">
        <CircleCheck strokeWidth={1.5} className="size-8.5 text-stone" />
        <div className="mt-4.5 text-[17px] font-semibold tracking-[-0.02em]">
          Nothing to answer right now
        </div>
        <div className="mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-faint">
          You’ll see a badge here when the next request arrives.
        </div>
      </div>
    );
  }

  const Icon = CATEGORY_ICON[request.category];

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <div className="flex items-start gap-4.5 border-b border-line px-7.5 pt-5.5 pb-4.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[26px] font-semibold tracking-[-0.03em]">
              Room {request.room}
            </span>
            <Icon strokeWidth={1.4} className="size-[18px] text-sage" />
            <span className="text-sm text-muted">
              {CATEGORY_LABEL[request.category]}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                request.urgency === "high"
                  ? "bg-urgent/10 text-urgent"
                  : "bg-ink/6 text-muted",
              )}
            >
              {URGENCY_LABEL[request.urgency]}
            </span>
          </div>
          <div className="mt-1.5 text-[12.5px] text-faint">
            {request.language.name} speaker ·{" "}
            {request.minutesAgo < 1
              ? "just now"
              : `${request.minutesAgo} min ago`}{" "}
            · #{request.id}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {STATUS_LABEL.map((option) => (
            <button
              key={option.status}
              type="button"
              onClick={() => onStatusChange(option.status)}
              className={cn(
                "min-h-9.5 cursor-pointer rounded-full border px-4 text-[12.5px] font-medium transition-colors",
                request.status === option.status
                  ? "border-sage bg-sage text-paper"
                  : "border-line-strong text-muted",
              )}
            >
              {option.label}
            </button>
          ))}
          <label className="ml-1.5 flex min-h-9.5 items-center gap-2 rounded-full border border-line-strong pr-2 pl-2.5">
            <Avatar name={request.assignee} />
            <span className="sr-only">Assignee</span>
            <select
              value={request.assignee}
              onChange={(event) => onAssign(event.target.value)}
              className="cursor-pointer bg-transparent text-[12.5px] font-medium outline-none"
            >
              {STAFF_MEMBERS.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-7.5 py-6.5">
        {request.thread.map((message, index) => (
          <MessageBubble
            key={`${message.from}-${index}`}
            message={message}
            guestLanguage={request.language}
            staffLang={staffLang}
          />
        ))}
      </div>

      <Composer
        key={request.id}
        guestLanguage={request.language}
        staffLang={staffLang}
        onSend={onSend}
      />
    </div>
  );
}
