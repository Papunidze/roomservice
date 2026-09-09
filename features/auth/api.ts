import { z } from "zod";

import {
  API_ORIGIN,
  apiGet,
  apiPost,
  noContent,
  type ApiResult,
} from "@/shared/lib/api";

import { sessionSchema } from "./schemas";
import type { Session } from "./types";

export const googleSignInUrl = `${API_ORIGIN}/api/auth/google`;

const userSchema = z.object({ user: sessionSchema.unwrap() });

const forUser = async (
  result: ReturnType<typeof apiPost<z.infer<typeof userSchema>>>,
) => {
  const outcome = await result;
  return outcome.ok ? { ok: true as const, data: outcome.data.user } : outcome;
};

export const register = (values: {
  name: string;
  hotel: string;
  email: string;
  password: string;
}) => forUser(apiPost("/api/auth/register", values, userSchema));

const loginSchema = z.union([
  userSchema,
  z.object({ secondFactor: z.string() }),
]);

export type LoginOutcome =
  | { kind: "signed-in"; user: Session }
  | { kind: "second-factor"; ticket: string };

export async function login(values: {
  email: string;
  password: string;
}): Promise<ApiResult<LoginOutcome>> {
  const result = await apiPost("/api/auth/login", values, loginSchema);
  if (!result.ok) return result;
  const outcome: LoginOutcome =
    "user" in result.data
      ? { kind: "signed-in", user: result.data.user }
      : { kind: "second-factor", ticket: result.data.secondFactor };
  return { ok: true, data: outcome };
}

export const verifySecondFactor = (ticket: string, code: string) =>
  forUser(apiPost("/api/auth/2fa/verify", { ticket, code }, userSchema));

const setupSchema = z.object({ secret: z.string(), otpauthUrl: z.string() });

export const setupTwoFactor = () =>
  apiPost("/api/auth/2fa/setup", {}, setupSchema);

export const enableTwoFactor = (code: string) =>
  apiPost("/api/auth/2fa/enable", { code }, noContent);

export const disableTwoFactor = (code: string) =>
  apiPost("/api/auth/2fa/disable", { code }, noContent);

export const logout = () => apiPost("/api/auth/logout", {}, noContent);

export const changePassword = (currentPassword: string, newPassword: string) =>
  apiPost(
    "/api/auth/change-password",
    { currentPassword, newPassword },
    noContent,
  );

export const forgotPassword = (email: string) =>
  apiPost("/api/auth/forgot-password", { email }, noContent);

export const resetPassword = (token: string, password: string) =>
  forUser(apiPost("/api/auth/reset-password", { token, password }, userSchema));

export async function fetchMe() {
  const result = await apiGet("/api/auth/me", userSchema);
  return result.ok ? result.data.user : null;
}
