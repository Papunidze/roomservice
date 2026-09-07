"use client";

import { useSyncExternalStore } from "react";

import { createStore } from "@/shared/lib/store";

import { settingsSchema } from "./schemas";
import { SETTINGS_SEED, type Settings } from "./settings";

const store = createStore<Settings>(
  "roomcall.settings",
  SETTINGS_SEED,
  settingsSchema,
);

export const useSettings = () =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

export function updateSettings(patch: Partial<Settings>) {
  store.set({ ...store.get(), ...patch });
}
