import type { ObjectId } from "mongodb";

export interface PasswordReset {
  tokenHash: string;
  expiresAt: Date;
}

export interface UserDoc {
  _id: ObjectId;
  name: string;
  email: string;
  hotel: string;
  passwordHash?: string;
  googleId?: string;
  passwordReset?: PasswordReset;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  hotel: string;
}
