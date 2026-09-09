import { createHash, randomBytes } from "node:crypto";

import { MongoServerError, ObjectId } from "mongodb";

import { users } from "../db.js";
import {
  emailTaken,
  invalidCredentials,
  invalidResetToken,
} from "../lib/http-error.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import type { GoogleProfile } from "./google.js";
import type { LoginInput, RegisterInput } from "./schemas.js";
import type { PublicUser, UserDoc } from "./types.js";

const DUPLICATE_KEY = 11000;
const RESET_TTL_MS = 60 * 60 * 1000;

export function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    hotel: user.hotel,
  };
}

async function insertUser(user: UserDoc) {
  try {
    await users().insertOne(user);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === DUPLICATE_KEY)
      throw emailTaken();
    throw error;
  }
  return toPublicUser(user);
}

export async function registerUser(input: RegisterInput) {
  return insertUser({
    _id: new ObjectId(),
    name: input.name,
    email: input.email,
    hotel: input.hotel,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date(),
  });
}

export async function authenticate(input: LoginInput) {
  const user = await users().findOne({ email: input.email });

  if (!user?.passwordHash) {
    await hashPassword(input.password);
    throw invalidCredentials();
  }

  const matches = await verifyPassword(input.password, user.passwordHash);
  if (!matches) throw invalidCredentials();

  return toPublicUser(user);
}

export async function signInWithGoogle(profile: GoogleProfile) {
  const email = profile.email.toLowerCase();
  const existing = await users().findOneAndUpdate(
    { $or: [{ googleId: profile.sub }, { email }] },
    { $set: { googleId: profile.sub } },
    { returnDocument: "after" },
  );
  if (existing) return toPublicUser(existing);

  return insertUser({
    _id: new ObjectId(),
    name: profile.name || email.split("@")[0] || "Staff",
    email,
    hotel: "",
    googleId: profile.sub,
    createdAt: new Date(),
  });
}

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createPasswordReset(email: string) {
  const token = randomBytes(32).toString("base64url");
  const user = await users().findOneAndUpdate(
    { email },
    {
      $set: {
        passwordReset: {
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + RESET_TTL_MS),
        },
      },
    },
  );
  return user ? { user: toPublicUser(user), token } : null;
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
