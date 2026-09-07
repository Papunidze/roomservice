"use client";

import { useState } from "react";

import {
  CATEGORY_LABEL,
  FRONT_DESK_AGENT,
  useRequests,
  useSettings,
  type Request,
} from "@/features/requests";
import { useRooms } from "@/features/rooms";

import {
  addInternalNote,
  assignRequest,
  closeRoom,
  sendReply,
  setRequestStatus,
} from "../actions";
import { InboxFilters, type InboxFilter } from "./InboxFilters";
import { ConversationPanel } from "./ConversationPanel";
import { RequestList } from "./RequestList";

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

export function DeskInbox({ initialRoom }: { initialRoom: string }) {
  const requests = useRequests();
  const rooms = useRooms();
  const settings = useSettings();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState(initialRoom);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [mineOnly, setMineOnly] = useState(false);

  const live = requests.filter((request) => !request.archived);
  const needle = query.trim().toLowerCase();
  const isFiltered = needle.length > 0 || filter !== "all" || mineOnly;

  const visible = live.filter((request) => {
    if (filter !== "all" && request.status !== filter) return false;
    if (mineOnly && request.assignee !== FRONT_DESK_AGENT) return false;
    if (needle && !haystack(request).includes(needle)) return false;
    return true;
  });

  const selected =
    visible.find((request) => request.id === selectedId) ??
    live.find((request) => request.id === selectedId) ??
    visible[0];

  const session =
    rooms.find((room) => room.no === selected?.room)?.session ?? null;

  const openInRoom = selected
    ? live.filter(
        (request) =>
          request.room === selected.room && request.status !== "done",
      ).length
    : 0;

  const select = (id: number) => setSelectedId(id);

  return (
    <div className="flex h-[min(860px,calc(100dvh-8rem))] min-h-[560px] items-stretch">
      <div className="flex w-100 shrink-0 flex-col border-r border-line">
        <InboxFilters
          query={query}
          filter={filter}
          mineOnly={mineOnly}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onMineToggle={() => setMineOnly(!mineOnly)}
        />
        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto pb-5">
          <RequestList
            requests={visible}
            isFiltered={isFiltered}
            selectedId={selected?.id ?? null}
            readingLang={settings.staffLang}
            onSelect={select}
          />
        </div>
      </div>

      <ConversationPanel
        request={selected}
        session={session}
        openInRoom={openInRoom}
        staffLang={settings.staffLang}
        onStatusChange={(status) => {
          if (!selected) return;
          setRequestStatus(selected, status);
          select(selected.id);
        }}
        onAssign={(assignee) => {
          if (!selected) return;
          assignRequest(selected, assignee);
          select(selected.id);
        }}
        onSend={(message) => {
          if (!selected) return;
          sendReply(selected, message);
          select(selected.id);
        }}
        onAddNote={(text) => {
          if (!selected) return;
          addInternalNote(selected, text);
          select(selected.id);
        }}
        onCloseRoom={() => {
          if (!selected) return;
          closeRoom(selected.room);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
