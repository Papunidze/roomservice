import { z } from "zod";

import { CATEGORIES, STATUSES } from "../domain.js";
import { langCodeSchema, urgencySchema } from "../hotels/schemas.js";

const translations = z.partialRecord(langCodeSchema, z.string().max(2000));

export const guestLanguageSchema = z.object({
  name: z.string().max(60),
  native: z.string().max(60),
  code: z.string().max(10),
  dir: z.enum(["ltr", "rtl"]),
  base: langCodeSchema,
});

export const createRequestSchema = z.object({
  category: z.enum(CATEGORIES),
  urgency: urgencySchema,
  language: guestLanguageSchema,
  text: z.string().trim().min(1, "Say what you need").max(2000),
  translations: translations.default({}),
  photo: z.boolean().default(false),
  freeText: z.boolean().default(false),
});

export const guestMessageSchema = z.object({
  text: z.string().trim().min(1).max(2000),
  lang: langCodeSchema,
});

export const staffReplySchema = z.object({
  text: z.string().trim().min(1, "Write a reply").max(2000),
  lang: langCodeSchema,
  translations: translations.default({}),
  photo: z.boolean().default(false),
});

export const noteSchema = z.object({
  text: z.string().trim().min(1, "Write a note").max(2000),
});

export const requestPatchSchema = z
  .object({
    status: z.enum(STATUSES),
    assignee: z.string().trim().min(1).max(80),
  })
  .partial();

export const listQuerySchema = z.object({
  since: z.iso.datetime().optional(),
});
