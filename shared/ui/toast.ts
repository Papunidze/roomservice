"use client";

import { useSyncExternalStore } from "react";

const VISIBLE_MS = 3200;

const listeners = new Set<() => void>();
let message: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return message;
}

function getServerSnapshot(): string | null {
  return null;
}

export function showToast(text: string) {
  clearTimeout(timer);
  message = text;
  emit();
  timer = setTimeout(() => {
    message = null;
    emit();
  }, VISIBLE_MS);
}

export const useToastMessage = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
