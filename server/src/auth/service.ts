import { createHash, randomBytes } from "node:crypto";

import { MongoServerError, ObjectId } from "mongodb";

import { hotels, users } from "../db.js";
import { createHotel } from "../hotels/service.js";
import {
  emailTaken,
  invalidCredentials,
  invalidResetToken,
  twoFactorAlreadyOn,
  wrongCode,
  wrongPassword,
} from "../lib/http-error.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { generateTotpSecret, verifyTotp } from "../lib/totp.js";
import type { GoogleProfile } from "./google.js";
import type { LoginInput, RegisterInput } from "./schemas.js";
import type { PublicUser, UserDoc } from "./types.js";

const DUPLICATE_KEY = 11000;
const RESET_TTL_MS = 60 * 60 * 1000;
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function toPublicUser(user: UserDoc): Promise<PublicUser> {
  const hotel = await hotels().findOne(
    { _id: user.hotelId },
    { projection: { "settings.hotel.name": 1 } },
  );
  return {
    id: user._id.toHexString(),
    hotelId: user.hotelId,
    name: user.name,
    email: user.email,
    hotel: hotel?.settings.hotel.name ?? "",
    role: user.role,
    twoFactorEnabled: Boolean(user.totp?.enabledAt),
  };
}

type NewUser = Pick<UserDoc, "hotelId" | "name" | "email" | "role"> &
  Partial<
    Pick<UserDoc, "passwordHash" | "googleId" | "lang" | "passwordReset">
  >;

export async function insertUser(input: NewUser) {
  const user: UserDoc = {
    _id: new ObjectId(),
    lang: "en",
    telegram: false,
    onShift: false,
    lastActiveAt: null,
    createdAt: new Date(),
    ...input,
  };
  try {
    await users().insertOne(user);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === DUPLICATE_KEY)
      throw emailTaken();
    throw error;
  }
  return user;
}

export async function registerUser(input: RegisterInput) {
  if (await users().findOne({ email: input.email })) throw emailTaken();
  const hotel = await createHotel(input.hotel);
  const user = await insertUser({
    hotelId: hotel._id,
    name: input.name,
    email: input.email,
    role: "Manager",
    passwordHash: await hashPassword(input.password),
  });
  return toPublicUser(user);
}

export async function authenticate(input: LoginInput) {
  const user = await users().findOne({ email: input.email });

  if (!user?.passwordHash) {
    await hashPassword(input.password);
    throw invalidCredentials();
  }

  const matches = await verifyPassword(input.password, user.passwordHash);
  if (!matches) throw invalidCredentials();

  await touchUser(user._id);
  return { user: await toPublicUser(user), needsSecondFactor: Boolean(user.totp?.enabledAt) };
}

export async function startTwoFactor(id: ObjectId) {
  const user = await users().findOne({ _id: id });
  if (user?.totp?.enabledAt) throw twoFactorAlreadyOn();
  const secret = generateTotpSecret();
  await users().updateOne(
    { _id: id },
    { $set: { totp: { secret, enabledAt: null } } },
  );
  return secret;
}

export async function confirmTwoFactor(id: ObjectId, code: string) {
  const user = await users().findOne({ _id: id });
  if (!user?.totp || !verifyTotp(user.totp.secret, code)) throw wrongCode();
  await users().updateOne(
    { _id: id },
    { $set: { "totp.enabledAt": new Date() } },
  );
}

export async function stopTwoFactor(id: ObjectId, code: string) {
  const user = await users().findOne({ _id: id });
  if (!user?.totp?.enabledAt || !verifyTotp(user.totp.secret, code))
    throw wrongCode();
  await users().updateOne({ _id: id }, { $unset: { totp: "" } });
}

export async function completeTwoFactor(id: ObjectId, code: string) {
  const user = await users().findOne({ _id: id });
  if (!user?.totp?.enabledAt || !verifyTotp(user.totp.secret, code))
    throw wrongCode();
  return toPublicUser(user);
}

export async function signInWithGoogle(profile: GoogleProfile) {
  const email = profile.email.toLowerCase();
  const existing = await users().findOneAndUpdate(
    { $or: [{ googleId: profile.sub }, { email }] },
    { $set: { googleId: profile.sub, lastActiveAt: new Date() } },
    { returnDocument: "after" },
  );
  if (existing) return toPublicUser(existing);

  const name = profile.name || email.split("@")[0] || "Staff";
  const hotel = await createHotel("");
  const user = await insertUser({
    hotelId: hotel._id,
    name,
    email,
    role: "Manager",
    googleId: profile.sub,
  });
  return toPublicUser(user);
}

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const generatePassword = () => randomBytes(9).toString("base64url");

export async function changePassword(
  id: ObjectId,
  currentPassword: string,
  newPassword: string,
) {
  const user = await users().findOne({ _id: id });
  if (!user) throw invalidCredentials();
  if (user.passwordHash) {
    const matches = await verifyPassword(currentPassword, user.passwordHash);
    if (!matches) throw wrongPassword();
  }
  await users().updateOne(
    { _id: id },
    { $set: { passwordHash: await hashPassword(newPassword) } },
  );
}

export async function assignPassword(id: ObjectId) {
  const password = generatePassword();
  await users().updateOne(
    { _id: id },
    {
      $set: { passwordHash: await hashPassword(password) },
      $unset: { passwordReset: "" },
    },
  );
  return password;
}

export function issueResetToken(ttlMs = RESET_TTL_MS) {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    passwordReset: {
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + ttlMs),
    },
  };
}

export const INVITE_TTL = INVITE_TTL_MS;

export async function createPasswordReset(email: string) {
  const { token, passwordReset } = issueResetToken();
  const user = await users().findOneAndUpdate(
    { email },
    { $set: { passwordReset } },
  );
  return user ? { user: await toPublicUser(user), token } : null;
}

export async function resetPassword(token: string, password: string) {
  const user = await users().findOneAndUpdate(
    {
      "passwordReset.tokenHash": hashToken(token),
      "passwordReset.expiresAt": { $gt: new Date() },
    },
    {
      $set: { passwordHash: await hashPassword(password) },
      $unset: { passwordReset: "" },
    },
    { returnDocument: "after" },
  );
  if (!user) throw invalidResetToken();
  return toPublicUser(user);
}

export async function findUserById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const user = await users().findOne({ _id: new ObjectId(id) });
  return user ? toPublicUser(user) : null;
}

export function touchUser(id: ObjectId) {
  return users().updateOne({ _id: id }, { $set: { lastActiveAt: new Date() } });
}
