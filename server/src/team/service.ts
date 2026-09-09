import { ObjectId } from "mongodb";
import type { z } from "zod";

import {
  assignPassword,
  generatePassword,
  insertUser,
} from "../auth/service.js";
import type { UserDoc } from "../auth/types.js";
import { users } from "../db.js";
import { clientOrigin } from "../env.js";
import { publish } from "../lib/events.js";
import { HttpError } from "../lib/http-error.js";
import { sendMail } from "../lib/mail.js";
import { hashPassword } from "../lib/password.js";
import type { inviteSchema, memberPatchSchema } from "./schemas.js";

export interface PublicMember {
  id: string;
  name: string;
  email: string;
  role: UserDoc["role"];
  lang: UserDoc["lang"];
  telegram: boolean;
  onShift: boolean;
  lastActive: string | null;
  hasPassword: boolean;
}

const memberNotFound = () =>
  new HttpError(404, "member_not_found", "No such team member");

const lastMember = () =>
  new HttpError(400, "last_member", "A hotel needs at least one member");

export function toPublicMember(user: UserDoc): PublicMember {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    lang: user.lang,
    telegram: user.telegram,
    onShift: user.onShift,
    lastActive: user.lastActiveAt?.toISOString() ?? null,
    hasPassword: Boolean(user.passwordHash || user.googleId),
  };
}

export async function listMembers(hotelId: ObjectId) {
  const docs = await users().find({ hotelId }).sort({ createdAt: 1 }).toArray();
  return docs.map(toPublicMember);
}

function credentialsMail(
  user: Pick<UserDoc, "name" | "email" | "role">,
  hotelName: string,
  password: string,
  intro: string,
) {
  return {
    to: user.email,
    subject: `Your RoomCall sign-in for ${hotelName || "the hotel"}`,
    text: `Hi ${user.name},\n\n${intro}\n\nSign in at ${clientOrigin}/sign-in\nEmail: ${user.email}\nPassword: ${password}\n\nYou can change the password any time from your menu in the top-right corner.`,
  };
}

export async function inviteMember(
  hotelId: ObjectId,
  hotelName: string,
  invitedBy: string,
  input: z.infer<typeof inviteSchema>,
) {
  const password = generatePassword();
  const user = await insertUser({
    hotelId,
    name: input.name,
    email: input.email,
    role: input.role,
    lang: input.lang,
    passwordHash: await hashPassword(password),
  });

  await sendMail(
    credentialsMail(
      user,
      hotelName,
      password,
      `${invitedBy} added you to the ${hotelName || "hotel"} front desk on RoomCall as ${input.role}.`,
    ),
  );

  publish(hotelId.toHexString(), { type: "team" });
  return toPublicMember(user);
}

export async function resetMemberPassword(
  hotelId: ObjectId,
  id: string,
  hotelName: string,
  resetBy: string,
) {
  if (!ObjectId.isValid(id)) throw memberNotFound();
  const user = await users().findOne({ _id: new ObjectId(id), hotelId });
  if (!user) throw memberNotFound();

  const password = await assignPassword(user._id);
  await sendMail(
    credentialsMail(
      user,
      hotelName,
      password,
      `${resetBy} reset your RoomCall password. Here is the new one.`,
    ),
  );
}

export async function patchMember(
  hotelId: ObjectId,
  id: string,
  patch: z.infer<typeof memberPatchSchema>,
) {
  if (!ObjectId.isValid(id)) throw memberNotFound();
  const user = await users().findOneAndUpdate(
    { _id: new ObjectId(id), hotelId },
    { $set: patch },
    { returnDocument: "after" },
  );
  if (!user) throw memberNotFound();
  publish(hotelId.toHexString(), { type: "team" });
  return toPublicMember(user);
}

export async function removeMember(hotelId: ObjectId, id: string) {
  if (!ObjectId.isValid(id)) throw memberNotFound();
  if ((await users().countDocuments({ hotelId })) <= 1) throw lastMember();
  const result = await users().deleteOne({ _id: new ObjectId(id), hotelId });
  if (result.deletedCount === 0) throw memberNotFound();
  publish(hotelId.toHexString(), { type: "team" });
}
