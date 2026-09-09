import type { CookieOptions, Response } from "express";

import { env, isProduction } from "../env.js";
import { SESSION_MAX_AGE_SECONDS } from "./token.js";

export const SESSION_COOKIE = "roomcall_session";

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
