import { minutesAgo } from "../domain.js";
import type { PublicRequest, RequestDoc } from "./types.js";

const iso = (date: Date | null | undefined) => date?.toISOString() ?? null;

export function toPublicRequest(
  doc: RequestDoc,
  now = Date.now(),
): PublicRequest {
  return {
    id: doc.seq,
    room: doc.roomNo,
    category: doc.category,
    urgency: doc.urgency,
    language: doc.language,
    status: doc.status,
    assignee: doc.assignee,
    archived: doc.archived,
    createdAt: doc.createdAt.toISOString(),
    firstResponseAt: iso(doc.firstResponseAt),
    progressAt: iso(doc.progressAt),
    resolvedAt: iso(doc.resolvedAt),
    rating: doc.rating
      ? { ...doc.rating, at: doc.rating.at.toISOString() }
      : null,
    minutesAgo: minutesAgo(doc.createdAt, now),
    thread: doc.thread.map((message) => ({
      ...message,
      at: message.at.toISOString(),
      minutesAgo: minutesAgo(message.at, now),
    })),
  };
}

export function forGuest(request: PublicRequest): PublicRequest {
  return {
    ...request,
    thread: request.thread.filter(
      (message) => message.from === "guest" || message.from === "staff",
    ),
  };
}
