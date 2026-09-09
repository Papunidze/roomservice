import { z } from "zod";

export const sessionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    hotel: z.string(),
  })
  .nullable();
