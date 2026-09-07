"use client";

import { useSyncExternalStore } from "react";

import { DEMO_REQUESTS } from "./demo-data";
import { storedRequestsSchema } from "./schemas";
import type { Message, Request } from "./types";

const STORAGE_KEY = "roomcall.requests";

const listeners = new Set<() => void>();
let cache: Request[] | null = null;

function load(): Request[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEMO_REQUESTS;

  try {
    const parsed = storedRequestsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEMO_REQUESTS;
  } catch {
    return DEMO_REQUESTS;
  }
}

function getSnapshot() {
  cache ??= load();
  return cache;
}

function getServerSnapshot() {
  return DEMO_REQUESTS;
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cache = null;
  for (const listener of listeners) listener();
}

function commit(next: Request[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
}

export function useRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function createRequest(draft: Omit<Request, "id">) {
  const current = getSnapshot();
  const id = current.reduce((max, item) => Math.max(max, item.id), 200) + 1;
  commit([{ ...draft, id }, ...current]);
  return id;
}

export function updateRequest(id: number, patch: Partial<Request>) {
  commit(
    getSnapshot().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    ),
  );
}

export function appendMessage(id: number, message: Message) {
  commit(
    getSnapshot().map((item) =>
      item.id === id ? { ...item, thread: [...item.thread, message] } : item,
    ),
  );
}
