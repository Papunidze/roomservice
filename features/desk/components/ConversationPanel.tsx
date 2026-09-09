"use client";

import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  UNASSIGNED,
  type Message,
  type Request,
  type Status,
} from "@/features/requests";
import type { GuestSession } from "@/features/rooms";
import { useOptionalTeam } from "@/features/team";
import type { LangCode } from "@/shared/i18n";

import { Composer } from "./Composer";
import { ConversationHeader } from "./ConversationHeader";
import { ThreadMessage } from "./ThreadMessage";

interface ConversationPanelProps {
  request: Request | undefined;
  session: GuestSession | null;
  openInRoom: number;
  staffLang: LangCode;
  onStatusChange: (status: Status) => void;
  onAssign: (assignee: string) => void;
  onSend: (
    message: Pick<Message, "text" | "lang" | "translations" | "photo">,
  ) => Promise<boolean>;
  onAddNote: (text: string) => Promise<boolean>;
  onCloseRoom: () => void;
  onClose?: () => void;
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
  onClose,
}: ConversationPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const team = useOptionalTeam();
  const assignees = [
    UNASSIGNED,
    ...(team?.members.map((member) => member.name) ?? []),
  ];
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
          Pick a request on the left, or wait for the next one to arrive.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <ConversationHeader
        request={request}
        session={session}
        openInRoom={openInRoom}
        staffLang={staffLang}
        assignees={assignees}
        onStatusChange={onStatusChange}
        onAssign={onAssign}
        onCloseRoom={onCloseRoom}
        onClose={onClose}
      />

      <div
        ref={threadRef}
        className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-7.5 py-5"
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
