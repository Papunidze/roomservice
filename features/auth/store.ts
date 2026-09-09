"use client";

import { useSyncExternalStore } from "react";

import { createStore } from "@/shared/lib/store";

import { logout } from "./api";
import { sessionSchema } from "./schemas";
import type { Session } from "./types";

const store = createStore<Session | null>(
  "roomcall.session",
  null,
  sessionSchema,
);

export const useSession = () =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

export function signIn(session: Session) {
  store.set(session);
}

export function signOut() {
  store.set(null);
  void logout();
}
