import type { Request, RequestHandler } from "express";

import { findUserById } from "../auth/service.js";
import { ADMIN_ROLES } from "../domain.js";
import { billingStatus, getHotel } from "../hotels/service.js";
import { SESSION_COOKIE } from "../lib/cookie.js";
import {
  forbidden,
  subscriptionExpired,
  unauthenticated,
} from "../lib/http-error.js";
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

export const requireAdminRole: RequestHandler = (req, _res, next) => {
  if (!req.user || !ADMIN_ROLES.includes(req.user.role)) throw forbidden();
  next();
};

export const requireOwner: RequestHandler = (req, _res, next) => {
  if (!req.user?.isOwner) throw forbidden();
  next();
};

async function assertActive(req: Request) {
  if (!req.user) throw unauthenticated();
  const hotel = await getHotel(req.user.hotelId);
  if (billingStatus(hotel.billing) === "expired") throw subscriptionExpired();
}

export const requireActive: RequestHandler = async (req, _res, next) => {
  await assertActive(req);
  next();
};

export const writesRequireActive: RequestHandler = async (req, _res, next) => {
  if (req.method !== "GET") await assertActive(req);
  next();
};
