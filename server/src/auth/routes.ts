import { randomBytes } from "node:crypto";

import { Router } from "express";
import { ObjectId } from "mongodb";

import { clientOrigin, env } from "../env.js";
import {
  clearSessionCookie,
  clearStateCookie,
  readStateCookie,
  setSessionCookie,
  setStateCookie,
} from "../lib/cookie.js";
import { sendMail } from "../lib/mail.js";
import { parseBody } from "../lib/parse-body.js";
import {
  readSecondFactorTicket,
  signSecondFactorTicket,
  signSessionToken,
} from "../lib/token.js";
import { otpauthUrl } from "../lib/totp.js";
import { currentUser } from "../lib/current-user.js";
import { invalidTicket } from "../lib/http-error.js";
import { requireAuth } from "../middleware/auth.js";
import { fetchGoogleProfile, googleAuthUrl } from "./google.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  secondFactorSchema,
  twoFactorCodeSchema,
  googleCallbackSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./schemas.js";
import {
  authenticate,
  changePassword,
  completeTwoFactor,
  confirmTwoFactor,
  createPasswordReset,
  registerUser,
  resetPassword,
  signInWithGoogle,
  startTwoFactor,
  stopTwoFactor,
} from "./service.js";
import type { PublicUser } from "./types.js";

const toSession = ({ hotelId, ...user }: PublicUser) => ({
  ...user,
  hotelId: hotelId.toHexString(),
});

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const user = await registerUser(parseBody(registerSchema, req.body));
  setSessionCookie(res, await signSessionToken(user.id));
  res.status(201).json({ user: toSession(user) });
});

authRouter.post("/login", async (req, res) => {
  const { user, needsSecondFactor } = await authenticate(
    parseBody(loginSchema, req.body),
  );
  if (needsSecondFactor) {
    res.json({ secondFactor: await signSecondFactorTicket(user.id) });
    return;
  }
  setSessionCookie(res, await signSessionToken(user.id));
  res.json({ user: toSession(user) });
});

authRouter.post("/2fa/verify", async (req, res) => {
  const input = parseBody(secondFactorSchema, req.body);
  const userId = await readSecondFactorTicket(input.ticket).catch(() => null);
  if (!userId) throw invalidTicket();
  const user = await completeTwoFactor(new ObjectId(userId), input.code);
  setSessionCookie(res, await signSessionToken(user.id));
  res.json({ user: toSession(user) });
});

authRouter.post("/2fa/setup", requireAuth, async (req, res) => {
  const user = currentUser(req);
  const secret = await startTwoFactor(new ObjectId(user.id));
  res.json({ secret, otpauthUrl: otpauthUrl(secret, user.email) });
});

authRouter.post("/2fa/enable", requireAuth, async (req, res) => {
  const { code } = parseBody(twoFactorCodeSchema, req.body);
  await confirmTwoFactor(new ObjectId(currentUser(req).id), code);
  res.status(204).end();
});

authRouter.post("/2fa/disable", requireAuth, async (req, res) => {
  const { code } = parseBody(twoFactorCodeSchema, req.body);
  await stopTwoFactor(new ObjectId(currentUser(req).id), code);
  res.status(204).end();
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.post("/change-password", requireAuth, async (req, res) => {
  const user = currentUser(req);
  const input = parseBody(changePasswordSchema, req.body);
  await changePassword(
    new ObjectId(user.id),
    input.currentPassword,
    input.newPassword,
  );
  res.status(204).end();
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: toSession(currentUser(req)) });
});

authRouter.get("/google", (_req, res) => {
  const state = randomBytes(16).toString("hex");
  setStateCookie(res, state);
  res.redirect(googleAuthUrl(state));
});

authRouter.get("/google/callback", async (req, res) => {
  const failed = () => res.redirect(`${clientOrigin}/sign-in?error=google`);

  const query = googleCallbackSchema.safeParse(req.query);
  const expectedState = readStateCookie(req);
  clearStateCookie(res);
  if (!query.success || query.data.state !== expectedState) return failed();

  const profile = await fetchGoogleProfile(query.data.code);
  if (!profile) return failed();

  const user = await signInWithGoogle(profile);
  setSessionCookie(res, await signSessionToken(user.id));
  res.redirect(`${clientOrigin}/desk`);
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = parseBody(forgotPasswordSchema, req.body);
  const reset = await createPasswordReset(email);

  if (reset) {
    const link = `${clientOrigin}/reset-password?token=${reset.token}`;
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
  res.json({ user: toSession(user) });
});
