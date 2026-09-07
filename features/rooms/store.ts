"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { langCodeSchema } from "@/features/requests";
import { createStore } from "@/shared/lib/store";

import { ROOMS_SEED } from "./seed";
import type { Room } from "./types";

const roomsSchema = z.array(
  z.object({
    no: z.string(),
    floor: z.number(),
    printed: z.boolean(),
    session: z
      .object({
        lang: langCodeSchema,
        since: z.string(),
        nights: z.string(),
      })
      .nullable(),
    lastActivity: z.string(),
  }),
);

const store = createStore<Room[]>("roomcall.rooms", ROOMS_SEED, roomsSchema);

export const useRooms = () =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

export function patchRoom(no: string, patch: Partial<Room>) {
  store.set(
    store.get().map((room) => (room.no === no ? { ...room, ...patch } : room)),
  );
}

export function markPrinted(numbers: string[]) {
  const wanted = new Set(numbers);
  store.set(
    store
      .get()
      .map((room) => (wanted.has(room.no) ? { ...room, printed: true } : room)),
  );
}

export function addRooms(rooms: Room[]) {
  store.set(
    [...store.get(), ...rooms].sort((a, b) => Number(a.no) - Number(b.no)),
  );
}
