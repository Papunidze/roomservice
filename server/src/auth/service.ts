import { MongoServerError, ObjectId } from "mongodb";

import { users } from "../db.js";
import { emailTaken, invalidCredentials } from "../lib/http-error.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import type { LoginInput, RegisterInput } from "./schemas.js";
import type { PublicUser, UserDoc } from "./types.js";

const DUPLICATE_KEY = 11000;

export function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    hotel: user.hotel,
  };
}

export async function registerUser(input: RegisterInput) {
  const user: UserDoc = {
    _id: new ObjectId(),
    name: input.name,
    email: input.email,
    hotel: input.hotel,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date(),
  };

  try {
    await users().insertOne(user);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === DUPLICATE_KEY)
      throw emailTaken();
    throw error;
  }

  return toPublicUser(user);
}

export async function authenticate(input: LoginInput) {
  const user = await users().findOne({ email: input.email });

  if (!user) {
    await hashPassword(input.password);
    throw invalidCredentials();
  }

  const matches = await verifyPassword(input.password, user.passwordHash);
  if (!matches) throw invalidCredentials();

  return toPublicUser(user);
}

export async function findUserById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const user = await users().findOne({ _id: new ObjectId(id) });
  return user ? toPublicUser(user) : null;
}
