"use client";

import {
  appendMessage,
  archiveRoom,
  FRONT_DESK_AGENT,
  UNASSIGNED,
  updateRequest,
  type Message,
  type Request,
  type Status,
} from "@/features/requests";
import { patchRoom } from "@/features/rooms";
import { showToast } from "@/shared/ui";

const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  progress: "In progress",
  done: "Done",
};

function note(id: number, text: string) {
  appendMessage(id, {
    from: "system",
    lang: "en",
    text,
    translations: {},
    minutesAgo: 0,
  });
}

export function sendReply(
  request: Request,
  message: Pick<Message, "text" | "lang" | "translations" | "photo">,
) {
  appendMessage(request.id, {
    ...message,
    from: "staff",
    by: FRONT_DESK_AGENT,
    minutesAgo: 0,
  });

  if (request.assignee === UNASSIGNED) {
    updateRequest(request.id, { assignee: FRONT_DESK_AGENT });
    note(request.id, `${FRONT_DESK_AGENT} took the ticket`);
  }

  if (request.status === "new") {
    updateRequest(request.id, { status: "progress" });
    note(request.id, "Status → In progress");
  }
}

export function addInternalNote(request: Request, text: string) {
  appendMessage(request.id, {
    from: "note",
    by: FRONT_DESK_AGENT,
    lang: "en",
    text,
    translations: {},
    minutesAgo: 0,
  });
  showToast("Internal note added · not visible to guest");
}

export function assignRequest(request: Request, assignee: string) {
  if (request.assignee === assignee) return;

  updateRequest(request.id, { assignee });
  note(
    request.id,
    assignee === UNASSIGNED
      ? `${FRONT_DESK_AGENT} unassigned ${request.assignee}`
      : `${FRONT_DESK_AGENT} assigned to ${assignee}`,
  );

  if (request.status === "new" && assignee !== UNASSIGNED) {
    updateRequest(request.id, { status: "progress" });
    note(request.id, "Status → In progress");
  }
}

export function setRequestStatus(request: Request, status: Status) {
  if (request.status === status) return;
  updateRequest(request.id, { status });
  note(request.id, `Status → ${STATUS_LABEL[status]}`);
}

export function closeRoom(room: string) {
  const archived = archiveRoom(room);
  patchRoom(room, { session: null });
  showToast(
    `Room ${room} closed · ${archived} open ticket${archived === 1 ? "" : "s"} archived`,
  );
}
