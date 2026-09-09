import { z } from "zod";

import { langCodeSchema } from "../hotels/schemas.js";

const roomNumber = z
  .string()
  .trim()
  .regex(/^\d{1,5}$/, "Room numbers are digits");

export const roomNumbersSchema = z.object({
  numbers: z.array(roomNumber).min(1).max(500),
});

export const roomPatchSchema = z
  .object({
    printed: z.boolean(),
    session: z.object({ lang: langCodeSchema }).nullable(),
  })
  .partial();
