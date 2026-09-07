"use client";

import type { ZodType } from "zod";

export interface PersistedStore<T> {
  subscribe: (listener: () => void) => () => void;
  get: () => T;
  getServer: () => T;
  set: (next: T) => void;
}

export function createStore<T>(
  key: string,
  seed: T,
  schema: ZodType<T>,
): PersistedStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | null = null;

  function load(): T {
    const raw = window.localStorage.getItem(key);
    if (!raw) return seed;

    try {
      const parsed = schema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : seed;
    } catch {
      return seed;
    }
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== key) return;
    cache = null;
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0)
          window.removeEventListener("storage", onStorage);
      };
    },
    get() {
      cache ??= load();
      return cache;
    },
    getServer() {
      return seed;
    },
    set(next) {
      cache = next;
      window.localStorage.setItem(key, JSON.stringify(next));
      for (const listener of listeners) listener();
    },
  };
}
