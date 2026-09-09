import type { CookieOptions, Request, Response } from "express";

import { env, isProduction } from "../env.js";
import { SESSION_MAX_AGE_SECONDS } from "./token.js";

export const SESSION_COOKIE = "roomcall_session";
const STATE_COOKIE = "roomcall_oauth_state";
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

const options: CookieOptions = {
  httpOnly: true,
  secure: isProduction || env.COOKIE_SAMESITE === "none",
  sameSite: env.COOKIE_SAMESITE,
  path: "/",
};

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    ...options,
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, options);
}

const stateOptions: CookieOptions = { ...options, sameSite: "lax" };

export function setStateCookie(res: Response, state: string) {
  res.cookie(STATE_COOKIE, state, { ...stateOptions, maxAge: STATE_MAX_AGE_MS });
}

export function readStateCookie(req: Request) {
  const value: unknown = req.cookies?.[STATE_COOKIE];
  return typeof value === "string" ? value : null;
}

export function clearStateCookie(res: Response) {
  res.clearCookie(STATE_COOKIE, stateOptions);
}
