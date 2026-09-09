import { z } from "zod";

import { sessionSchema } from "./schemas";
import type { Session } from "./types";

const ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:4000";

export const googleSignInUrl = `${ORIGIN}/api/auth/google`;

export interface ApiFailure {
  ok: false;
  code: string;
  message: string;
  fields: Record<string, string>;
}

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

const userSchema = z.object({ user: sessionSchema.unwrap() });

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

async function post(path: string, body: unknown) {
  return fetch(`${ORIGIN}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
}

async function postForUser(
  path: string,
  body: unknown,
): Promise<ApiResult<Session>> {
  const response = await post(path, body);
  if (!response) return NETWORK_FAILURE;
  if (!response.ok) return failure(response);
  return { ok: true, data: userSchema.parse(await response.json()).user };
}

async function postForNothing(
  path: string,
  body: unknown,
): Promise<ApiResult<null>> {
  const response = await post(path, body);
  if (!response) return NETWORK_FAILURE;
  if (!response.ok) return failure(response);
  return { ok: true, data: null };
}

export const register = (values: {
  name: string;
  hotel: string;
  email: string;
  password: string;
}) => postForUser("/api/auth/register", values);

export const login = (values: { email: string; password: string }) =>
  postForUser("/api/auth/login", values);

export const logout = () => postForNothing("/api/auth/logout", {});

export const forgotPassword = (email: string) =>
  postForNothing("/api/auth/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  postForUser("/api/auth/reset-password", { token, password });

export async function fetchMe(): Promise<Session | null> {
  const response = await fetch(`${ORIGIN}/api/auth/me`, {
    credentials: "include",
  }).catch(() => null);
  if (!response?.ok) return null;
  return userSchema.parse(await response.json()).user;
}
