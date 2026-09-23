import { z } from "zod";

import { PLANS } from "@/features/requests";
import { apiGet, apiPatch } from "@/shared/lib/api";

const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  manager: z.object({ name: z.string(), email: z.string() }).nullable(),
  members: z.number(),
  rooms: z.number(),
  weekRequests: z.number(),
  createdAt: z.string(),
  plan: z.enum(PLANS),
  status: z.enum(["trial", "active", "expired"]),
  trialEndsAt: z.string(),
  paidUntil: z.string().nullable(),
});

export type AdminHotel = z.infer<typeof hotelSchema>;

const hotelsSchema = z.object({ hotels: z.array(hotelSchema) });
const oneHotel = z.object({ hotel: hotelSchema });

export const fetchHotels = () => apiGet("/api/admin/hotels", hotelsSchema);

export const patchHotelBilling = (
  id: string,
  patch: {
    plan?: AdminHotel["plan"];
    trialEndsAt?: string;
    paidUntil?: string | null;
  },
) => apiPatch(`/api/admin/hotels/${id}`, patch, oneHotel);
