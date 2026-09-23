import { z } from "zod";

import {
  CONFIGURABLE_CATEGORIES,
  isTimezone,
  LANGUAGES,
  PLANS,
  STAFF_ROLES,
  URGENCIES,
} from "../domain.js";

export const langCodeSchema = z.enum(LANGUAGES);
export const roleSchema = z.enum(STAFF_ROLES);
export const urgencySchema = z.enum(URGENCIES);

const text = (max: number) => z.string().trim().max(max);
const clock = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Use HH:MM");
const translations = z.partialRecord(langCodeSchema, z.string().max(200));

export const settingsSchema = z.object({
  hotel: z.object({
    name: text(120),
    address: text(200),
    timezone: text(60).refine(isTimezone, "Unknown timezone"),
    checkout: text(10),
  }),
  staffLang: langCodeSchema,
  staffDefaultLang: langCodeSchema,
  guestLanguages: z.record(langCodeSchema, z.boolean()),
  infoSourceLang: langCodeSchema,
  info: z.object({
    wifiName: text(80),
    wifiPassword: text(80),
    breakfast: text(80),
    spa: text(80),
    reception: text(80),
    rules: text(600),
  }),
  categories: z.record(
    z.enum(CONFIGURABLE_CATEGORIES),
    z.object({
      enabled: z.boolean(),
      urgency: urgencySchema,
      role: roleSchema,
    }),
  ),
  items: z
    .array(
      z.object({
        key: text(40).min(1),
        label: text(80),
        available: z.boolean(),
        translations: translations.default({}),
      }),
    )
    .max(50),
  service: z.object({
    open: clock,
    close: clock,
    deliveryMinutes: z.number().int().min(5).max(240),
    dishes: z
      .array(
        z.object({
          key: text(40).min(1),
          name: text(80).min(1),
          note: text(120),
          priceTetri: z.number().int().min(0).max(10_000_000),
          available: z.boolean(),
          translations: translations.default({}),
        }),
      )
      .max(100),
  }),
  lateCheckout: z
    .array(
      z.object({
        time: clock,
        surchargeTetri: z.number().int().min(0).max(10_000_000),
      }),
    )
    .max(12),
  notifications: z.object({
    sound: z.boolean(),
    renotifyMinutes: z.number().int().min(1).max(240),
    telegram: z.boolean(),
    group: text(120),
  }),
  sessions: z.object({
    autoCloseHours: z.number().int().min(1).max(168),
  }),
});

export const settingsPatchSchema = settingsSchema.partial();

export const teamConfigSchema = z.object({
  autoAssign: z.boolean(),
  offShiftHours: z.number().int().min(1).max(48),
  escalation: z.object({
    enabled: z.boolean(),
    minutes: z.number().int().min(1).max(720),
    target: roleSchema,
  }),
});

export const teamConfigPatchSchema = teamConfigSchema.partial();

export const billingPatchSchema = z
  .object({
    plan: z.enum(PLANS),
    trialEndsAt: z.iso.datetime(),
    paidUntil: z.iso.datetime().nullable(),
  })
  .partial();
