"use server";

import type { ZodType } from "zod";

import { ka } from "@/shared/i18n/ka";
import type { Result } from "@/shared/types";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyCodeSchema,
} from "./schemas";

export type AuthState = Result<{ email: string }> | null;

function parse<T>(schema: ZodType<T>, formData: FormData): Result<T> {
  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  if ("acceptsTerms" in raw) raw.acceptsTerms = raw.acceptsTerms === "on";

  const parsed = schema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };

  const fields: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const path = String(issue.path[0]);
    if (!fields[path]) fields[path] = issue.message;
  }

  return {
    ok: false,
    error: { code: "validation", message: ka.auth.errors.validation, fields },
  };
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(loginSchema, formData);
  if (!parsed.ok) return parsed;

  return { ok: true, data: { email: parsed.data.email } };
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(registerSchema, formData);
  if (!parsed.ok) return parsed;

  return { ok: true, data: { email: parsed.data.email } };
}

export async function requestPasswordCode(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(forgotPasswordSchema, formData);
  if (!parsed.ok) return parsed;

  return { ok: true, data: { email: parsed.data.email } };
}

export async function verifyCode(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(verifyCodeSchema, formData);
  if (!parsed.ok) return parsed;

  return { ok: true, data: { email: parsed.data.email } };
}
