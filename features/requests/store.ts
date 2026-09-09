"use client";

import { createRemoteStore, useRemote } from "@/shared/lib/remote-store";

import { fetchRequests } from "./api";
import { watchHotel } from "./live";
import type { Request } from "./types";

const EMPTY: Request[] = [];

const store = createRemoteStore<Request[]>({
  load: fetchRequests,
  watch: (refresh) => watchHotel("request", refresh),
  pollMs: 60_000,
});

export const useRequests = () => useRemote(store) ?? EMPTY;

export function replaceRequest(next: Request) {
  const current = store.get() ?? EMPTY;
  const exists = current.some((item) => item.id === next.id);
  store.set(
    exists
      ? current.map((item) => (item.id === next.id ? next : item))
      : [next, ...current],
  );
}

export const refreshRequests = () => store.refresh();
