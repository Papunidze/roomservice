"use client";

import { useSyncExternalStore } from "react";

import { createStore } from "@/shared/lib/store";

import { DEMO_REQUESTS } from "./demo-data";
import { storedRequestsSchema } from "./schemas";
import type { Message, Request } from "./types";

const store = createStore<Request[]>(
  "roomcall.requests",
  DEMO_REQUESTS,
  storedRequestsSchema,
);

export const useRequests = () =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

export function createRequest(draft: Omit<Request, "id">) {
  const current = store.get();
  const id = current.reduce((max, item) => Math.max(max, item.id), 200) + 1;
  store.set([{ ...draft, id }, ...current]);
  return id;
}

export function updateRequest(id: number, patch: Partial<Request>) {
  store.set(
    store.get().map((item) => (item.id === id ? { ...item, ...patch } : item)),
  );
}

export function appendMessage(id: number, message: Message) {
  store.set(
    store
      .get()
      .map((item) =>
        item.id === id ? { ...item, thread: [...item.thread, message] } : item,
      ),
  );
}

export function archiveRoom(room: string) {
  const open = store
    .get()
    .filter(
      (item) => item.room === room && !item.archived && item.status !== "done",
    );

  store.set(
    store
      .get()
      .map((item) =>
        item.room === room && !item.archived && item.status !== "done"
          ? { ...item, archived: true }
          : item,
      ),
  );

  return open.length;
}
