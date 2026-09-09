import type { Request, RequestHandler } from "express";

import { findUserById } from "../auth/service.js";
import { SESSION_COOKIE } from "../lib/cookie.js";
import { forbidden, unauthenticated } from "../lib/http-error.js";
import { readSessionToken } from "../lib/token.js";

const BEARER = "Bearer ";

function tokenFrom(req: Request) {
  const cookie: unknown = req.cookies?.[SESSION_COOKIE];
  if (typeof cookie === "string" && cookie.length > 0) return cookie;

  const header = req.get("authorization");
  if (header?.startsWith(BEARER)) return header.slice(BEARER.length);

  return null;
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = tokenFrom(req);
  if (!token) throw unauthenticated();

  const userId = await readSessionToken(token).catch(() => null);
  if (!userId) throw unauthenticated();

  const user = await findUserById(userId);
  if (!user) throw unauthenticated();

  req.user = user;
  next();
};

export const requireManager: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== "Manager") throw forbidden();
  next();
};
