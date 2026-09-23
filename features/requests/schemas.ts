import { z } from "zod";

import { LANGUAGES } from "@/shared/i18n";

import { CONFIGURABLE_CATEGORIES } from "./catalog";
import { CATEGORIES, MESSAGE_KINDS, STAFF_ROLES } from "./types";

export const langCodeSchema = z.enum(LANGUAGES);

const translations = z.partialRecord(langCodeSchema, z.string());

const messageSchema = z.object({
  from: z.enum(MESSAGE_KINDS),
  by: z.string().optional(),
  lang: langCodeSchema,
  text: z.string(),
  translations,
  at: z.string().optional(),
  minutesAgo: z.number(),
});

export const requestSchema = z.object({
  id: z.number(),
  room: z.string(),
  category: z.enum(CATEGORIES),
  urgency: z.enum(["high", "medium", "low"]),
  language: z.object({
    name: z.string(),
    native: z.string(),
    code: z.string(),
    dir: z.enum(["ltr", "rtl"]),
    base: langCodeSchema,
  }),
  status: z.enum(["new", "progress", "done"]),
  minutesAgo: z.number(),
  assignee: z.string(),
  archived: z.boolean().optional(),
  createdAt: z.string().optional(),
  firstResponseAt: z.string().nullable().optional(),
  progressAt: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),
  rating: z
    .object({ score: z.number(), comment: z.string(), at: z.string() })
    .nullable()
    .optional(),
  thread: z.array(messageSchema),
});

export const storedRequestsSchema = z.array(requestSchema);

const categorySettingSchema = z.object({
  enabled: z.boolean(),
  urgency: z.enum(["high", "medium", "low"]),
  role: z.enum(STAFF_ROLES),
});

export const settingsSchema = z.object({
  hotel: z.object({
    name: z.string(),
    address: z.string(),
    timezone: z.string(),
    checkout: z.string(),
  }),
  staffLang: langCodeSchema,
  staffDefaultLang: langCodeSchema,
  guestLanguages: z.record(langCodeSchema, z.boolean()),
  infoSourceLang: langCodeSchema,
  info: z.object({
    wifiName: z.string(),
    wifiPassword: z.string(),
    breakfast: z.string(),
    spa: z.string(),
    reception: z.string(),
    rules: z.string(),
  }),
  categories: z.record(z.enum(CONFIGURABLE_CATEGORIES), categorySettingSchema),
  items: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      available: z.boolean(),
      translations,
    }),
  ),
  service: z.object({
    open: z.string(),
    close: z.string(),
    deliveryMinutes: z.number(),
    dishes: z.array(
      z.object({
        key: z.string(),
        name: z.string(),
        note: z.string(),
        priceTetri: z.number(),
        available: z.boolean(),
        translations,
      }),
    ),
  }),
  lateCheckout: z.array(
    z.object({ time: z.string(), surchargeTetri: z.number() }),
  ),
  notifications: z.object({
    sound: z.boolean(),
    renotifyMinutes: z.number(),
    telegram: z.boolean(),
    group: z.string(),
  }),
  sessions: z.object({
    autoCloseHours: z.number(),
  }),
});
