import { Router } from "express";

import { clearSessionCookie, setSessionCookie } from "../lib/cookie.js";
import { parseBody } from "../lib/parse-body.js";
import { signSessionToken } from "../lib/token.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "./schemas.js";
import { authenticate, registerUser } from "./service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const user = await registerUser(parseBody(registerSchema, req.body));
  setSessionCookie(res, await signSessionToken(user.id));
  res.status(201).json({ user });
});

authRouter.post("/login", async (req, res) => {
  const user = await authenticate(parseBody(loginSchema, req.body));
  setSessionCookie(res, await signSessionToken(user.id));
  res.json({ user });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
