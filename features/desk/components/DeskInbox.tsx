"use client";

import { useState } from "react";

import {
  appendMessage,
  FRONT_DESK_AGENT,
  FRONT_DESK_LANGUAGE,
  UNASSIGNED,
  updateRequest,
  useRequests,
  type Message,
  type Status,
} from "@/features/requests";

import { ConversationPanel } from "./ConversationPanel";
import { RequestList } from "./RequestList";

export function DeskInbox() {
  const requests = useRequests();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected =
    requests.find((request) => request.id === selectedId) ??
    requests.find((request) => request.status === "new") ??
    requests[0];

  const reply = (message: Pick<Message, "text" | "lang" | "translations">) => {
    if (!selected) return;
    appendMessage(selected.id, {
      ...message,
      from: "staff",
      by: FRONT_DESK_AGENT,
      minutesAgo: 0,
    });
    updateRequest(selected.id, {
      status: selected.status === "new" ? "progress" : selected.status,
      assignee:
        selected.assignee === UNASSIGNED ? FRONT_DESK_AGENT : selected.assignee,
    });
    setSelectedId(selected.id);
  };

  const assign = (assignee: string) => {
    if (!selected) return;
    updateRequest(selected.id, {
      assignee,
      status:
        selected.status === "new" && assignee !== UNASSIGNED
          ? "progress"
          : selected.status,
    });
    setSelectedId(selected.id);
  };

  const changeStatus = (status: Status) => {
    if (!selected) return;
    updateRequest(selected.id, { status });
    setSelectedId(selected.id);
  };

  return (
    <div className="flex h-[min(840px,calc(100dvh-8rem))] min-h-[560px] items-stretch">
      <div className="scrollbar-slim w-100 shrink-0 overflow-y-auto border-r border-line pb-6">
        <RequestList
          requests={requests}
          selectedId={selected?.id ?? null}
          readingLang={FRONT_DESK_LANGUAGE}
          onSelect={setSelectedId}
        />
      </div>

      <ConversationPanel
        request={selected}
        staffLang={FRONT_DESK_LANGUAGE}
        onStatusChange={changeStatus}
        onAssign={assign}
        onSend={reply}
      />
    </div>
  );
}
