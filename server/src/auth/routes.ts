import { randomBytes } from "node:crypto";

import { Router } from "express";

import { env } from "../env.js";
import {
  clearSessionCookie,
  clearStateCookie,
  readStateCookie,
  setSessionCookie,
  setStateCookie,
} from "../lib/cookie.js";
import { sendMail } from "../lib/mail.js";
import { parseBody } from "../lib/parse-body.js";
import { signSessionToken } from "../lib/token.js";
import { requireAuth } from "../middleware/auth.js";
import { fetchGoogleProfile, googleAuthUrl } from "./google.js";
import {
  forgotPasswordSchema,
  googleCallbackSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./schemas.js";
import {
  authenticate,
  createPasswordReset,
  registerUser,
  resetPassword,
  signInWithGoogle,
} from "./service.js";

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

authRouter.get("/google", (_req, res) => {
  const state = randomBytes(16).toString("hex");
  setStateCookie(res, state);
  res.redirect(googleAuthUrl(state));
});

authRouter.get("/google/callback", async (req, res) => {
  const failed = () => res.redirect(`${env.CLIENT_ORIGIN}/sign-in?error=google`);

  const query = googleCallbackSchema.safeParse(req.query);
  const expectedState = readStateCookie(req);
  clearStateCookie(res);
  if (!query.success || query.data.state !== expectedState) return failed();

  const profile = await fetchGoogleProfile(query.data.code);
  if (!profile) return failed();

  const user = await signInWithGoogle(profile);
  setSessionCookie(res, await signSessionToken(user.id));
  res.redirect(`${env.CLIENT_ORIGIN}/desk`);
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = parseBody(forgotPasswordSchema, req.body);
  const reset = await createPasswordReset(email);

  if (reset) {
    const link = `${env.CLIENT_ORIGIN}/reset-password?token=${reset.token}`;
    await sendMail({
      to: reset.user.email,
      subject: "Reset your RoomCall password",
      text: `Hi ${reset.user.name},\n\nOpen this link to choose a new password. It works for one hour.\n\n${link}\n\nIf you did not ask for this, ignore this email.`,
    });
  }

  res.status(204).end();
});

authRouter.post("/reset-password", async (req, res) => {
  const input = parseBody(resetPasswordSchema, req.body);
  const user = await resetPassword(input.token, input.password);
  setSessionCookie(res, await signSessionToken(user.id));
  res.json({ user });
});
