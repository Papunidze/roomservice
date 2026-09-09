import type { ZodType, z } from "zod";

import { badRequest, type FieldErrors } from "./http-error.js";

export function parseBody<T extends ZodType>(
  schema: T,
  body: unknown,
): z.infer<T> {
  const result = schema.safeParse(body);
  if (result.success) return result.data;

  const fields: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fields))
      fields[field] = issue.message;
  }

  throw badRequest("Check the highlighted fields", fields);
}
