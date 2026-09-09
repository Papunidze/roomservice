import type { Request } from "express";

import { unauthenticated } from "./http-error.js";

export function currentUser(req: Request) {
  if (!req.user) throw unauthenticated();
  return req.user;
}
