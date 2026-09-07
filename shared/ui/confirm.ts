"use client";

import { useSyncExternalStore } from "react";

export interface ConfirmRequest {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
}

const listeners = new Set<() => void>();
let pending: ConfirmRequest | null = null;

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
  return pending;
}

function getServerSnapshot(): ConfirmRequest | null {
  return null;
}

export function askConfirm(request: ConfirmRequest) {
  pending = request;
  emit();
}

export function dismissConfirm() {
  pending = null;
  emit();
}

export const usePendingConfirm = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
