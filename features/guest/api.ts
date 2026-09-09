import { z } from "zod";

import {
  langCodeSchema,
  requestSchema,
  settingsSchema,
  type GuestSettings,
  type Request,
} from "@/features/requests";
import { API_ORIGIN, apiGet, apiPost } from "@/shared/lib/api";

const plateSchema = z.object({
  room: z.string(),
  session: z.object({ lang: langCodeSchema, since: z.string() }).nullable(),
  hotel: z.object({ name: z.string(), checkout: z.string() }),
  guestLanguages: settingsSchema.shape.guestLanguages,
  info: settingsSchema.shape.info,
  infoSourceLang: settingsSchema.shape.infoSourceLang,
  categories: settingsSchema.shape.categories,
  items: settingsSchema.shape.items,
});

export type Plate = z.infer<typeof plateSchema>;

export const plateSettings = (plate: Plate): GuestSettings => plate;

const requestsSchema = z.object({ requests: z.array(requestSchema) });
const oneRequest = z.object({ request: requestSchema });

const base = (token: string) => `/api/guest/${encodeURIComponent(token)}`;

export const fetchPlate = (token: string) => apiGet(base(token), plateSchema);

export const openGuestSession = (token: string, lang: string) =>
  apiPost(`${base(token)}/session`, { lang }, z.object({ room: z.unknown() }));

export const fetchRoomRequests = (token: string) =>
  apiGet(`${base(token)}/requests`, requestsSchema);

export function createGuestRequest(token: string, draft: Omit<Request, "id">) {
  const first = draft.thread[0];
  return apiPost(
    `${base(token)}/requests`,
    {
      category: draft.category,
      urgency: draft.urgency,
      language: draft.language,
      text: first?.text ?? "",
      translations: first?.translations ?? {},
      photo: first?.photo ?? false,
      freeText: first?.freeText ?? false,
    },
    oneRequest,
  );
}

export const sendGuestMessage = (
  token: string,
  id: number,
  message: { text: string; lang: string },
) => apiPost(`${base(token)}/requests/${id}/messages`, message, oneRequest);

export function watchRoom(token: string, onChange: () => void) {
  const source = new EventSource(`${API_ORIGIN}${base(token)}/events`);
  source.onmessage = onChange;
  return () => source.close();
}
