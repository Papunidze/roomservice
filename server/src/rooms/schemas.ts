import { z } from "zod";

import { langCodeSchema } from "../hotels/schemas.js";

const roomNumber = z
  .string()
  .trim()
  .regex(/^[\p{L}\p{N}-]{1,10}$/u, "Letters, digits and dashes only");

export const roomNumbersSchema = z.object({
  numbers: z.array(roomNumber).min(1).max(500),
});

export const roomPatchSchema = z
  .object({
    printed: z.boolean(),
    name: z.string().trim().max(60),
    floor: z.number().int().min(-5).max(200),
    session: z.object({ lang: langCodeSchema }).nullable(),
  })
  .partial();
