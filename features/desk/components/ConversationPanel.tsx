"use client";

import { CircleCheck, Link2, LogOut, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  STAFF_MEMBERS,
  UNASSIGNED,
  type Message,
  type Request,
  type Status,
} from "@/features/requests";
import type { GuestSession } from "@/features/rooms";
import type { LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Avatar, Flag, showToast } from "@/shared/ui";

import { Composer } from "./Composer";
import { ThreadMessage } from "./ThreadMessage";

const STATUSES: { status: Status; label: string }[] = [
  { status: "new", label: "New" },
  { status: "progress", label: "In progress" },
  { status: "done", label: "Done" },
];

const URGENCY_LABEL = { high: "Urgent", medium: "Normal", low: "Low" } as const;

const MENU_ITEM =
  "flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-paper";

interface ConversationPanelProps {
  request: Request | undefined;
  session: GuestSession | null;
  openInRoom: number;
  staffLang: LangCode;
  onStatusChange: (status: Status) => void;
  onAssign: (assignee: string) => void;
  onSend: (
    message: Pick<Message, "text" | "lang" | "translations" | "photo">,
  ) => void;
  onAddNote: (text: string) => void;
  onCloseRoom: () => void;
}

export function ConversationPanel({
  request,
  session,
  openInRoom,
  staffLang,
  onStatusChange,
  onAssign,
  onSend,
  onAddNote,
  onCloseRoom,
}: ConversationPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const messageCount = request?.thread.length ?? 0;

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messageCount, request?.id]);

  if (!request) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-surface p-10 text-center">
        <CircleCheck strokeWidth={1.5} className="size-8.5 text-stone" />
        <div className="mt-4.5 text-[17px] font-semibold tracking-[-0.02em]">
          Nothing to answer right now
        </div>
        <div className="mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-faint">
          You’ll see the counter turn red when the next request arrives.
        </div>
      </div>
    );
  }

  const Icon = CATEGORY_ICON[request.category];

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <div className="relative border-b border-line px-7.5 pt-4.5 pb-3.5">
        <div className="flex items-center gap-3">
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

          <span className="ml-auto flex items-center gap-2">
            {STATUSES.map((option) => (
              <button
                key={option.status}
                type="button"
                onClick={() => onStatusChange(option.status)}
                className={cn(
                  "min-h-9.5 cursor-pointer rounded-full border px-3.5 text-[12.5px] font-medium transition-colors",
                  request.status === option.status
                    ? "border-sage bg-sage/12 text-sage-deep"
                    : "border-line-strong text-muted",
                )}
              >
                {option.label}
              </button>
            ))}

            <label className="ml-1.5 flex min-h-9.5 cursor-pointer items-center gap-2 rounded-full border border-line-strong pr-1.5 pl-2">
              <Avatar
                name={request.assignee === UNASSIGNED ? "" : request.assignee}
                className="size-6.5 text-[10px]"
              />
              <span className="sr-only">Assignee</span>
              <select
                value={request.assignee}
                onChange={(event) => onAssign(event.target.value)}
                className="max-w-30 cursor-pointer bg-transparent text-[12.5px] font-medium outline-none"
              >
                {STAFF_MEMBERS.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              aria-label="More actions"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "grid size-9.5 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-muted",
                isMenuOpen && "bg-paper",
              )}
            >
              <MoreHorizontal strokeWidth={2} className="size-4" />
            </button>
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[12.5px] text-faint">
          <span className="font-medium text-muted">Guest session</span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Flag code={request.language.base} className="h-3 w-4" />
            {request.language.name} · {request.language.native}
          </span>
          {session ? (
            <>
              <span>·</span>
              <span>checked in {session.since}</span>
              <span>·</span>
              <span>{session.nights}</span>
            </>
          ) : (
            <>
              <span>·</span>
              <span>no open session for this room</span>
            </>
          )}
          <span className="ml-auto font-mono text-[11px]">
            #{request.id} · opened{" "}
            {request.minutesAgo < 1
              ? "just now"
              : `${request.minutesAgo} min ago`}
          </span>
        </div>

        {isMenuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="animate-rise absolute top-14.5 right-7.5 z-50 w-75 rounded-tile border border-line-strong bg-surface p-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  showToast(
                    `Guest link copied · roomcall.ge/r/${request.room}`,
                  );
                }}
                className={cn(MENU_ITEM, "items-center text-[13px]")}
              >
                <Link2 strokeWidth={1.5} className="size-[15px] text-muted" />
                Copy guest link
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onCloseRoom();
                }}
                className={MENU_ITEM}
              >
                <LogOut
                  strokeWidth={1.5}
                  className="mt-0.5 size-[15px] shrink-0 text-muted"
                />
                <span>
                  <span className="block text-[13px]">
                    Close room · checkout
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-faint">
                    Ends the guest session for room {request.room} and archives{" "}
                    {openInRoom} open ticket{openInRoom === 1 ? "" : "s"}.
                  </span>
                </span>
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div
        ref={threadRef}
        className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-7.5 py-6"
      >
        {request.thread.map((message, index) => (
          <ThreadMessage
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
        onAddNote={onAddNote}
      />
    </div>
  );
}
