"use client";

import { refreshRequests, watchHotel } from "@/features/requests";
import type { ApiResult } from "@/shared/lib/api";
import { createRemoteStore, useRemote } from "@/shared/lib/remote-store";
import { showToast } from "@/shared/ui";

import {
  closeRoomApi,
  createRooms,
  deleteRooms,
  fetchRooms,
  patchRoomApi,
  printRooms,
  regenerateRoomToken,
} from "./api";
import type { Room } from "./types";

const EMPTY: Room[] = [];

const store = createRemoteStore<Room[]>({
  load: fetchRooms,
  watch: (refresh) => watchHotel("room", refresh),
});

export const useRooms = () => useRemote(store) ?? EMPTY;

function replaceRoom(next: Room) {
  store.set(
    (store.get() ?? EMPTY).map((room) => (room.no === next.no ? next : room)),
  );
}

async function settle<T>(
  result: Promise<ApiResult<T>>,
  apply: (data: T) => void,
) {
  const outcome = await result;
  if (!outcome.ok) {
    showToast(outcome.message);
    return false;
  }
  apply(outcome.data);
  return true;
}

export const addRooms = (numbers: string[]) =>
  settle(createRooms(numbers), ({ rooms }) => store.set(rooms));

export const markPrinted = (numbers: string[]) =>
  settle(printRooms(numbers), ({ rooms }) => store.set(rooms));

export const setPrinted = (no: string, printed: boolean) =>
  settle(patchRoomApi(no, { printed }), ({ room }) => replaceRoom(room));

export const regenerateRoom = (no: string) =>
  settle(regenerateRoomToken(no), ({ room }) => replaceRoom(room));

export const closeGuestSession = (no: string) =>
  settle(patchRoomApi(no, { session: null }), ({ room }) => replaceRoom(room));

export async function removeRooms(numbers: string[]) {
  const ok = await settle(deleteRooms(numbers), ({ rooms }) =>
    store.set(rooms),
  );
  if (ok) void refreshRequests();
  return ok;
}

export async function closeRoom(no: string) {
  const outcome = await closeRoomApi(no);
  if (!outcome.ok) {
    showToast(outcome.message);
    return null;
  }
  replaceRoom(outcome.data.room);
  void refreshRequests();
  return outcome.data.archived;
}
