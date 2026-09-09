import { z } from "zod";

import { langCodeSchema } from "@/features/requests";
import { apiGet, apiPatch, apiPost, apiRemove, unwrap } from "@/shared/lib/api";

const roomSchema = z.object({
  no: z.string(),
  floor: z.number(),
  printed: z.boolean(),
  session: z.object({ lang: langCodeSchema, since: z.string() }).nullable(),
  lastActivity: z.string().nullable(),
  url: z.string(),
});

const roomsSchema = z.object({ rooms: z.array(roomSchema) });

export const deleteRooms = (numbers: string[]) =>
  apiRemove("/api/rooms", { numbers }, roomsSchema);
const oneRoom = z.object({ room: roomSchema });
const closedSchema = z.object({ room: roomSchema, archived: z.number() });

export const fetchRooms = () =>
  apiGet("/api/rooms", roomsSchema).then((r) => unwrap(r).rooms);

export const createRooms = (numbers: string[]) =>
  apiPost("/api/rooms", { numbers }, roomsSchema);

export const printRooms = (numbers: string[]) =>
  apiPost("/api/rooms/printed", { numbers }, roomsSchema);

export const patchRoomApi = (
  no: string,
  patch: { printed?: boolean; session?: null },
) => apiPatch(`/api/rooms/${no}`, patch, oneRoom);

export const regenerateRoomToken = (no: string) =>
  apiPost(`/api/rooms/${no}/token`, {}, oneRoom);

export const closeRoomApi = (no: string) =>
  apiPost(`/api/rooms/${no}/close`, {}, closedSchema);
