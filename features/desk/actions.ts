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

type OnSaved = (request: Request) => void;

async function apply(
  result: Promise<ApiResult<{ request: Request }>>,
  onSaved: OnSaved = replaceRequest,
) {
  const outcome = await result;
  if (!outcome.ok) {
    showToast(outcome.message);
    return false;
  }
  onSaved(outcome.data.request);
  replaceRequest(outcome.data.request);
  return true;
}

export const sendReply = (
  request: Request,
  message: Pick<Message, "text" | "lang" | "translations">,
  onSaved?: OnSaved,
) => apply(replyToRequest(request.id, message), onSaved);

export async function addInternalNote(
  request: Request,
  text: string,
  onSaved?: OnSaved,
) {
  const isSaved = await apply(addRequestNote(request.id, text), onSaved);
  if (isSaved) showToast("Internal note added · not visible to guest");
  return isSaved;
}

export function assignRequest(
  request: Request,
  assignee: string,
  onSaved?: OnSaved,
) {
  if (request.assignee === assignee) return;
  void apply(patchRequest(request.id, { assignee }), onSaved);
}

export function setRequestStatus(
  request: Request,
  status: Status,
  onSaved?: OnSaved,
) {
  if (request.status === status) return;
  void apply(patchRequest(request.id, { status }), onSaved);
}

export async function closeRoom(room: string) {
  const archived = await closeRoomOnServer(room);
  if (archived === null) return;
  showToast(
    `Room ${room} closed · ${archived} open ticket${archived === 1 ? "" : "s"} archived`,
  );
}
