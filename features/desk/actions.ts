"use client";

import {
  addRequestNote,
  patchRequest,
  replaceRequest,
  replyToRequest,
  type Message,
  type Request,
  type Status,
} from "@/features/requests";
import { closeRoom as closeRoomOnServer } from "@/features/rooms";
import type { ApiResult } from "@/shared/lib/api";
import { showToast } from "@/shared/ui";

async function apply(result: Promise<ApiResult<{ request: Request }>>) {
  const outcome = await result;
  if (!outcome.ok) {
    showToast(outcome.message);
    return false;
  }
  replaceRequest(outcome.data.request);
  return true;
}

export const sendReply = (
  request: Request,
  message: Pick<Message, "text" | "lang" | "translations" | "photo">,
) => apply(replyToRequest(request.id, message));

export async function addInternalNote(request: Request, text: string) {
  const isSaved = await apply(addRequestNote(request.id, text));
  if (isSaved) showToast("Internal note added · not visible to guest");
  return isSaved;
}

export function assignRequest(request: Request, assignee: string) {
  if (request.assignee === assignee) return;
  void apply(patchRequest(request.id, { assignee }));
}

export function setRequestStatus(request: Request, status: Status) {
  if (request.status === status) return;
  void apply(patchRequest(request.id, { status }));
}

export async function closeRoom(room: string) {
  const archived = await closeRoomOnServer(room);
  if (archived === null) return;
  showToast(
    `Room ${room} closed · ${archived} open ticket${archived === 1 ? "" : "s"} archived`,
  );
}
