import type { ObjectId } from "mongodb";

export interface UserDoc {
  _id: ObjectId;
  name: string;
  email: string;
  hotel: string;
  passwordHash: string;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  hotel: string;
}
