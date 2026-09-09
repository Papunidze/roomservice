import { z } from "zod";

import { apiGet, apiPatch, apiPost, unwrap } from "@/shared/lib/api";

import { requestSchema, settingsSchema, storedRequestsSchema } from "./schemas";
import type { Settings } from "./settings";
import type { Message, Status } from "./types";

const requestsSchema = z.object({ requests: storedRequestsSchema });
const oneRequest = z.object({ request: requestSchema });
const oneSettings = z.object({ settings: settingsSchema });

export const fetchRequests = () =>
  apiGet("/api/requests", requestsSchema).then((r) => unwrap(r).requests);

export const replyToRequest = (
  id: number,
  message: Pick<Message, "text" | "lang" | "translations" | "photo">,
) => apiPost(`/api/requests/${id}/reply`, message, oneRequest);

export const addRequestNote = (id: number, text: string) =>
  apiPost(`/api/requests/${id}/notes`, { text }, oneRequest);

export const patchRequest = (
  id: number,
  patch: { status?: Status; assignee?: string },
) => apiPatch(`/api/requests/${id}`, patch, oneRequest);

export const fetchSettings = () =>
  apiGet("/api/settings", oneSettings).then((r) => unwrap(r).settings);

export const patchSettings = (patch: Partial<Settings>) =>
  apiPatch("/api/settings", patch, oneSettings);
