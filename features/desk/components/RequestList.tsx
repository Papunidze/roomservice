"use client";

import { Mail } from "lucide-react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  resolveText,
  type Request,
  type Status,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { Avatar } from "./Avatar";

const GROUPS: { status: Status; title: string }[] = [
  { status: "new", title: "New" },
  { status: "progress", title: "In progress" },
  { status: "done", title: "Done" },
];

const URGENCY_DOT = {
  high: "bg-urgent",
  medium: "bg-caution",
  low: "bg-ink/20",
} as const;

interface RequestListProps {
  requests: Request[];
  selectedId: number | null;
  readingLang: LangCode;
  onSelect: (id: number) => void;
}

export function RequestList({
  requests,
  selectedId,
  readingLang,
  onSelect,
}: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="px-11 pt-30 text-center">
        <Mail strokeWidth={1.4} className="mx-auto size-6.5 text-stone" />
        <div className="mt-4 text-sm font-semibold">Inbox is clear</div>
        <div className="mt-1.5 text-[12.5px] leading-relaxed text-faint">
          Requests appear here the moment a guest scans the code in their room
          and sends one.
        </div>
      </div>
    );
  }

  return (
    <>
      {GROUPS.map((group) => {
        const rows = requests.filter((item) => item.status === group.status);
        const hot = group.status === "new" && rows.length > 0;
        return (
          <div key={group.status}>
            <div className="flex items-center gap-2 px-5.5 pt-5 pb-2">
              <span className="text-xs font-semibold">{group.title}</span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[10.5px]",
                  hot ? "bg-urgent text-paper" : "bg-ink/6 text-faint",
                )}
              >
                {rows.length}
              </span>
            </div>
            {rows.map((request) => (
              <Row
                key={request.id}
                request={request}
                selected={request.id === selectedId}
                readingLang={readingLang}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}

function Row({
  request,
  selected,
  readingLang,
  onSelect,
}: {
  request: Request;
  selected: boolean;
  readingLang: LangCode;
  onSelect: (id: number) => void;
}) {
  const Icon = CATEGORY_ICON[request.category];
  const first = request.thread[0];
  const summary = first ? resolveText(first, readingLang) : null;
  const overdue = request.minutesAgo > 20 && request.status !== "done";

  return (
    <button
      type="button"
      onClick={() => onSelect(request.id)}
      className={cn(
        "block w-full cursor-pointer border-b border-line-soft py-3.5 pr-5.5 pl-5 text-left transition-colors",
        selected
          ? "bg-surface shadow-[inset_2px_0_0_var(--sage)]"
          : "hover:bg-surface",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className="text-xl font-semibold tracking-[-0.03em]">
          {request.room}
        </span>
        <Icon strokeWidth={1.4} className="size-4 text-sage" />
        <span className="text-[12.5px] text-muted">
          {CATEGORY_LABEL[request.category]}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span
            className={cn(
              "size-[7px] shrink-0 rounded-full",
              URGENCY_DOT[request.urgency],
            )}
          />
          <span
            className={cn(
              "font-mono text-[11.5px]",
              overdue ? "text-urgent" : "text-faint",
            )}
          >
            {request.minutesAgo < 1 ? "just now" : `${request.minutesAgo} min`}
          </span>
        </span>
      </span>

      {summary ? (
        <span
          dir={DICTIONARY[summary.lang].dir}
          className={cn(
            "mt-2 line-clamp-2 text-start text-[13.5px] leading-snug",
            scriptFont(summary.lang),
          )}
        >
          {summary.text}
        </span>
      ) : null}

      <span className="mt-2.5 flex items-center gap-2">
        <Avatar name={request.assignee} />
        <span className="text-xs text-faint">{request.assignee}</span>
        <span className="ml-auto font-mono text-[10.5px] tracking-[0.12em] text-ghost">
          {request.language.code}
        </span>
      </span>
    </button>
  );
}
