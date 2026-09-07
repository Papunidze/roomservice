import { z } from "zod";

export const sessionSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    hotel: z.string(),
  })
  .nullable();
