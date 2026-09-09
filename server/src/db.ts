import { MongoClient, type Db } from "mongodb";

import type { UserDoc } from "./auth/types.js";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI);

let db: Db | null = null;

export async function connectDb() {
  await client.connect();
  db = client.db(env.MONGODB_DB);
  await users().createIndex({ email: 1 }, { unique: true });
}

export async function closeDb() {
  db = null;
  await client.close();
}

function database() {
  if (!db) throw new Error("connectDb() must run before any query");
  return db;
}

export const users = () => database().collection<UserDoc>("users");
