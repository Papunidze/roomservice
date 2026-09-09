"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { useSession } from "@/features/auth";
import {
  CATEGORY_LABEL,
  useRequests,
  useSettings,
  type Request,
  type Status,
} from "@/features/requests";
import { useRooms } from "@/features/rooms";
import { cn } from "@/shared/lib/cn";
import { Avatar, Chip } from "@/shared/ui";

import {
  addInternalNote,
  assignRequest,
  closeRoom,
  sendReply,
  setRequestStatus,
} from "../actions";
import { ConversationSheet } from "./ConversationSheet";
import { RequestCard } from "./RequestCard";
import { STATUS_TITLE } from "./StatusPill";

type Filter = Status | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "Unanswered" },
  { key: "progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const ORDER: Status[] = ["new", "progress", "done"];

function haystack(request: Request) {
  return [
    request.room,
    CATEGORY_LABEL[request.category],
    request.assignee,
    ...request.thread.flatMap((message) => [
      message.text,
      ...Object.values(message.translations),
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

interface DeskInboxProps {
  initialRoom: string;
  initialOpenId: number | null;
}

export function DeskInbox({ initialRoom, initialOpenId }: DeskInboxProps) {
  const requests = useRequests();
  const rooms = useRooms();
  const settings = useSettings();
  const agent = useSession()?.name ?? "";
  const [selectedId, setSelectedId] = useState(initialOpenId);
  const [seenOpenId, setSeenOpenId] = useState(initialOpenId);
  if (initialOpenId !== seenOpenId) {
    setSeenOpenId(initialOpenId);
    setSelectedId(initialOpenId);
  }
  const [query, setQuery] = useState(initialRoom);
  const [filter, setFilter] = useState<Filter>("all");
  const [mineOnly, setMineOnly] = useState(false);

  const live = requests.filter((request) => !request.archived);
  const needle = query.trim().toLowerCase();
  const isFiltered = needle.length > 0 || filter !== "all" || mineOnly;

  const visible = live.filter((request) => {
    if (filter !== "all" && request.status !== filter) return false;
    if (mineOnly && request.assignee !== agent) return false;
    if (needle && !haystack(request).includes(needle)) return false;
    return true;
  });

  const selected = live.find((request) => request.id === selectedId);
  const session =
    rooms.find((room) => room.no === selected?.room)?.session ?? null;
  const openInRoom = selected
    ? live.filter((r) => r.room === selected.room && r.status !== "done").length
    : 0;

  const counts = ORDER.map((status) => ({
    status,
    count: live.filter((request) => request.status === status).length,
  }));
  const summary = counts
    .map(
      ({ status, count }) => `${count} ${STATUS_TITLE[status].toLowerCase()}`,
    )
    .join(" · ");

  return (
    <div className="scrollbar-slim h-[min(860px,calc(100dvh-8rem))] min-h-[560px] overflow-y-auto px-7 pt-6 pb-8">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <div className="text-[22px] font-semibold tracking-[-0.03em]">
            Inbox
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">{summary}</div>
        </div>
        <span className="flex-1" />
        <label className="flex min-h-10 w-64 items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4">
          <Search strokeWidth={1.6} className="size-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by room or words"
            aria-label="Search requests"
            spellCheck={false}
            className="w-0 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
          />
        </label>
        <div className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
          {FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={cn(
                "min-h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
                filter === option.key ? "bg-ink text-paper" : "text-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Chip
          active={mineOnly}
          onClick={() => setMineOnly(!mineOnly)}
          className="pl-1.5"
        >
          <Avatar name={agent} className="size-4.5 text-[8.5px]" />
          Mine
        </Chip>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-tile border border-line bg-surface px-6 py-14 text-center">
          <div className="text-sm font-semibold">
            {isFiltered ? "Nothing matches" : "All quiet"}
          </div>
          <div className="mt-1.5 text-[12.5px] text-faint">
            {isFiltered
              ? "Try another filter or clear the search."
              : "New requests appear here the moment a guest sends one."}
          </div>
        </div>
      ) : null}

      {ORDER.map((status) => {
        const cards = visible.filter((request) => request.status === status);
        if (cards.length === 0) return null;
        return (
          <section key={status} className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[13px] font-semibold">
                {STATUS_TITLE[status]}
              </span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium",
                  status === "new"
                    ? "bg-urgent text-paper"
                    : "bg-ink/6 text-faint",
                )}
              >
                {cards.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3.5">
              {cards.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  readingLang={settings.staffLang}
                  onOpen={setSelectedId}
                />
              ))}
            </div>
          </section>
        );
      })}

      {selected ? (
        <ConversationSheet
          request={selected}
          session={session}
          openInRoom={openInRoom}
          staffLang={settings.staffLang}
          onClose={() => setSelectedId(null)}
          onStatusChange={(status) => setRequestStatus(selected, status)}
          onAssign={(assignee) => assignRequest(selected, assignee)}
          onSend={(message) => sendReply(selected, message)}
          onAddNote={(text) => addInternalNote(selected, text)}
          onCloseRoom={() => {
            void closeRoom(selected.room);
            setSelectedId(null);
          }}
        />
      ) : null}
    </div>
  );
}
