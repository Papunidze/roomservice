import { z } from "zod";

import { langCodeSchema, roleSchema } from "../hotels/schemas.js";

const email = z.string().trim().toLowerCase().pipe(z.email());

export const inviteSchema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(80),
  email,
  role: roleSchema,
  lang: langCodeSchema.default("en"),
});

export const memberPatchSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    role: roleSchema,
    lang: langCodeSchema,
    telegram: z.boolean(),
    onShift: z.boolean(),
  })
  .partial();
