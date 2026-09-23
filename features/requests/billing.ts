"use client";

import { z } from "zod";

import { apiGet, unwrap } from "@/shared/lib/api";
import { createRemoteStore, useRemote } from "@/shared/lib/remote-store";

import { watchHotel } from "./live";

export const PLANS = ["trial", "standard", "pro", "enterprise"] as const;

export type Plan = (typeof PLANS)[number];

export const PLAN_LABEL: Record<Plan, string> = {
  trial: "Trial",
  standard: "Standard",
  pro: "Pro",
  enterprise: "Enterprise",
};

const billingSchema = z.object({
  billing: z.object({
    plan: z.enum(PLANS),
    status: z.enum(["trial", "active", "expired"]),
    trialEndsAt: z.string(),
    paidUntil: z.string().nullable(),
    daysLeft: z.number().nullable(),
    rooms: z.number(),
  }),
});

export type Billing = z.infer<typeof billingSchema>["billing"];

const store = createRemoteStore<Billing>({
  load: () =>
    apiGet("/api/billing", billingSchema).then((r) => unwrap(r).billing),
  watch: (refresh) => watchHotel("settings", refresh),
});

export const useBilling = () => useRemote(store);
