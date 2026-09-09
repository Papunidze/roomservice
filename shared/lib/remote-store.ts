"use client";

import { useSyncExternalStore } from "react";

export interface RemoteStore<T> {
  subscribe: (listener: () => void) => () => void;
  get: () => T | null;
  getServer: () => null;
  set: (next: T) => void;
  refresh: () => Promise<T>;
}

interface Options<T> {
  load: () => Promise<T>;
  watch?: (refresh: () => void) => () => void;
  pollMs?: number;
}

export function createRemoteStore<T>({
  load,
  watch,
  pollMs,
}: Options<T>): RemoteStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | null = null;
  let inFlight: Promise<T> | null = null;
  let stopWatching: (() => void) | null = null;

  const notify = () => {
    for (const listener of listeners) listener();
  };

  function refresh() {
    inFlight ??= load()
      .then((next) => {
        cache = next;
        notify();
        return next;
      })
      .catch((error: unknown) => {
        console.error(error);
        if (cache === null) throw error;
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  }

  function startWatching() {
    const unwatch = watch?.(() => void refresh());
    const timer = pollMs ? setInterval(() => void refresh(), pollMs) : null;
    stopWatching = () => {
      unwatch?.();
      if (timer) clearInterval(timer);
    };
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) {
        void refresh();
        startWatching();
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) stopWatching?.();
      };
    },
    get: () => cache,
    getServer: () => null,
    set(next) {
      cache = next;
      notify();
    },
    refresh,
  };
}

export function useRemote<T>(store: RemoteStore<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
