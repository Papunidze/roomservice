"use client";

import { createRemoteStore, useRemote } from "@/shared/lib/remote-store";
import { showToast } from "@/shared/ui";

import { fetchSettings, patchSettings } from "./api";
import { watchHotel } from "./live";
import type { Settings } from "./settings";

const store = createRemoteStore<Settings>({
  load: fetchSettings,
  watch: (refresh) => watchHotel("settings", refresh),
});

export const useOptionalSettings = () => useRemote(store);

export function useSettings() {
  const settings = useRemote(store);
  if (!settings) throw new Error("Settings are read before they are loaded");
  return settings;
}

export async function updateSettings(patch: Partial<Settings>) {
  const current = store.get();
  if (!current) return false;

  store.set({ ...current, ...patch });
  const result = await patchSettings(patch);
  if (!result.ok) {
    store.set(current);
    showToast(result.message);
    return false;
  }
  return true;
}
