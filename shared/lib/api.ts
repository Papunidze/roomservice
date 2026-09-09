import type { ZodType } from "zod";
import { z } from "zod";

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:4000";

export interface ApiFailure {
  ok: false;
  code: string;
  message: string;
  fields: Record<string, string>;
}

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fields: z.record(z.string(), z.string()).optional(),
  }),
});

const NETWORK_FAILURE: ApiFailure = {
  ok: false,
  code: "network",
  message: "Could not reach the server. Check your connection and try again.",
  fields: {},
};

async function failure(response: Response): Promise<ApiFailure> {
  const parsed = errorSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success)
    return {
      ...NETWORK_FAILURE,
      code: "unexpected",
      message: "Something went wrong",
    };
  const { code, message, fields = {} } = parsed.data.error;
  return { ok: false, code, message, fields };
}

async function request<T>(
  method: string,
  path: string,
  schema: ZodType<T>,
  body?: unknown,
): Promise<ApiResult<T>> {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    method,
    credentials: "include",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => null);

  if (!response) return NETWORK_FAILURE;
  if (!response.ok) return failure(response);
  if (response.status === 204) return { ok: true, data: schema.parse(null) };
  return { ok: true, data: schema.parse(await response.json()) };
}

export const apiGet = <T>(path: string, schema: ZodType<T>) =>
  request("GET", path, schema);

export const apiPost = <T>(path: string, body: unknown, schema: ZodType<T>) =>
  request("POST", path, schema, body);

export const apiPatch = <T>(path: string, body: unknown, schema: ZodType<T>) =>
  request("PATCH", path, schema, body);

export const apiDelete = (path: string) => request("DELETE", path, z.null());

export const apiRemove = <T>(path: string, body: unknown, schema: ZodType<T>) =>
  request("DELETE", path, schema, body);

export const noContent = z.null();

export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new Error(result.message);
  return result.data;
}
