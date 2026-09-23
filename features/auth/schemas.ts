import { z } from "zod";

import { LANGUAGES } from "@/shared/i18n";

export const sessionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    hotel: z.string(),
    role: z.string(),
    lang: z.enum(LANGUAGES).default("en"),
    isOwner: z.boolean().default(false),
    twoFactorEnabled: z.boolean().default(false),
  })
  .nullable();
