import { z } from "zod";

import {
  CONFIGURABLE_CATEGORIES,
  LANGUAGES,
  STAFF_ROLES,
  URGENCIES,
} from "../domain.js";

export const langCodeSchema = z.enum(LANGUAGES);
export const roleSchema = z.enum(STAFF_ROLES);
export const urgencySchema = z.enum(URGENCIES);

const text = (max: number) => z.string().trim().max(max);

export const settingsSchema = z.object({
  hotel: z.object({
    name: text(120),
    address: text(200),
    timezone: text(60),
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
      }),
    )
    .max(50),
  notifications: z.object({
    telegram: z.boolean(),
    group: text(120),
    renotifyMinutes: z.number().int().min(1).max(240),
    quietHours: z.boolean(),
    quietFrom: text(5),
    quietTo: text(5),
  }),
  sessions: z.object({
    autoCloseHours: z.number().int().min(1).max(168),
    requireClose: z.boolean(),
  }),
});

export const settingsPatchSchema = settingsSchema.partial();

export const teamConfigSchema = z.object({
  routing: z.object({
    maintenance: roleSchema,
    housekeeping: roleSchema,
    frontDesk: roleSchema,
  }),
  autoAssign: z.boolean(),
  escalation: z.object({
    enabled: z.boolean(),
    minutes: z.number().int().min(1).max(720),
    target: roleSchema,
  }),
});

export const teamConfigPatchSchema = teamConfigSchema.partial();
