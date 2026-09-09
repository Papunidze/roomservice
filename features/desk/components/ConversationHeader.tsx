"use client";

import { Link2, LogOut, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  UNASSIGNED,
  type Request,
  type Status,
} from "@/features/requests";
import type { GuestSession } from "@/features/rooms";
import { DICTIONARY, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatAgo, formatWhen } from "@/shared/lib/time";
import { Avatar, Button, showToast } from "@/shared/ui";

import { StatusPill } from "./StatusPill";

const MENU_ITEM =
  "flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-paper";

interface ConversationHeaderProps {
  request: Request;
  session: GuestSession | null;
  openInRoom: number;
  staffLang: LangCode;
  assignees: string[];
  onStatusChange: (status: Status) => void;
  onAssign: (assignee: string) => void;
  onCloseRoom: () => void;
  onClose?: () => void;
}

export function ConversationHeader({
  request,
  session,
  openInRoom,
  staffLang,
  assignees,
  onStatusChange,
  onAssign,
  onCloseRoom,
  onClose,
}: ConversationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Icon = CATEGORY_ICON[request.category];
  const isDone = request.status === "done";

  return (
    <div className="relative border-b border-line px-7.5 pt-4.5 pb-4">
      <div className="flex items-center gap-3">
        <span className="text-[24px] font-semibold tracking-[-0.03em]">
          Room {request.room}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Icon strokeWidth={1.5} className="size-4 text-sage" />
          {CATEGORY_LABEL[request.category]}
        </span>
        {request.urgency === "high" ? (
          <span className="rounded-full bg-urgent/10 px-2.5 py-1 text-[12px] font-medium text-urgent">
            Urgent
          </span>
        ) : null}
        <StatusPill status={request.status} />

        <span className="ml-auto flex items-center gap-2">
          <label className="flex min-h-9.5 cursor-pointer items-center gap-2 rounded-full border border-line-strong pr-2 pl-2">
            <Avatar
              name={request.assignee === UNASSIGNED ? "" : request.assignee}
              className="size-6.5 text-[10px]"
            />
            <span className="sr-only">Assigned to</span>
            <select
              value={request.assignee}
              onChange={(event) => onAssign(event.target.value)}
              className="max-w-36 cursor-pointer bg-transparent text-[12.5px] font-medium outline-none"
            >
              {assignees.map((person) => (
                <option key={person} value={person}>
                  {person === UNASSIGNED ? "Assign to…" : person}
                </option>
              ))}
            </select>
          </label>

          {isDone ? (
            <Button variant="ghost" onClick={() => onStatusChange("progress")}>
              Reopen
            </Button>
          ) : (
            <Button onClick={() => onStatusChange("done")}>Mark as done</Button>
          )}

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
          {onClose ? (
            <button
              type="button"
              aria-label="Close conversation"
              onClick={onClose}
              className="grid size-9.5 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-muted"
            >
              <X strokeWidth={2} className="size-4" />
            </button>
          ) : null}
        </span>
      </div>

      <p className="mt-2 text-[13px] text-muted">
        Guest writes in {request.language.name}, you reply in{" "}
        {DICTIONARY[staffLang].name} ·{" "}
        {session
          ? `checked in ${formatWhen(session.since)}`
          : "no guest session open"}{" "}
        · opened {formatAgo(request.minutesAgo)}
      </p>

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
                showToast(`Guest link copied · room ${request.room}`);
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
                <span className="block text-[13px]">Guest checked out</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-faint">
                  Ends the session for room {request.room} and archives{" "}
                  {openInRoom} open request{openInRoom === 1 ? "" : "s"}.
                </span>
              </span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
