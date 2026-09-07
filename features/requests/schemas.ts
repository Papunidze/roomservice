import { z } from "zod";

import { LANGUAGES } from "@/shared/i18n";

import { CATEGORIES } from "./types";

const langCode = z.enum(LANGUAGES);

const messageSchema = z.object({
  from: z.enum(["guest", "staff"]),
  by: z.string().optional(),
  lang: langCode,
  text: z.string(),
  translations: z.partialRecord(langCode, z.string()),
  photo: z.boolean().optional(),
  minutesAgo: z.number(),
});

const requestSchema = z.object({
  id: z.number(),
  room: z.string(),
  category: z.enum(CATEGORIES),
  urgency: z.enum(["high", "medium", "low"]),
  language: z.object({
    name: z.string(),
    native: z.string(),
    code: z.string(),
    dir: z.enum(["ltr", "rtl"]),
    base: langCode,
  }),
  status: z.enum(["new", "progress", "done"]),
  minutesAgo: z.number(),
  assignee: z.string(),
  thread: z.array(messageSchema),
});

export const storedRequestsSchema = z.array(requestSchema);
