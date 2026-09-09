import { z } from "zod";

import { LANGUAGES } from "@/shared/i18n";

import { CONFIGURABLE_CATEGORIES } from "./catalog";
import { CATEGORIES, MESSAGE_KINDS, STAFF_ROLES } from "./types";

export const langCodeSchema = z.enum(LANGUAGES);

const messageSchema = z.object({
  from: z.enum(MESSAGE_KINDS),
  by: z.string().optional(),
  lang: langCodeSchema,
  text: z.string(),
  translations: z.partialRecord(langCodeSchema, z.string()),
  photo: z.boolean().optional(),
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
    z.object({ key: z.string(), label: z.string(), available: z.boolean() }),
  ),
  notifications: z.object({
    telegram: z.boolean(),
    group: z.string(),
    renotifyMinutes: z.number(),
    quietHours: z.boolean(),
    quietFrom: z.string(),
    quietTo: z.string(),
  }),
  sessions: z.object({
    autoCloseHours: z.number(),
    requireClose: z.boolean(),
  }),
});
