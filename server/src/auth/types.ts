import type { ObjectId } from "mongodb";

import type { LangCode, StaffRole } from "../domain.js";

export interface PasswordReset {
  tokenHash: string;
  expiresAt: Date;
}

export interface TwoFactor {
  secret: string;
  enabledAt: Date | null;
}

export interface UserDoc {
  _id: ObjectId;
  hotelId: ObjectId;
  name: string;
  email: string;
  role: StaffRole;
  lang: LangCode;
  telegram: boolean;
  onShift: boolean;
  lastActiveAt: Date | null;
  passwordHash?: string;
  googleId?: string;
  passwordReset?: PasswordReset;
  totp?: TwoFactor;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  hotelId: ObjectId;
  name: string;
  email: string;
  hotel: string;
  role: StaffRole;
  twoFactorEnabled: boolean;
}
