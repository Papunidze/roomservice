import { MongoClient, type Db, type ObjectId } from "mongodb";

import type { UserDoc } from "./auth/types.js";
import { env } from "./env.js";
import type { HotelDoc } from "./hotels/types.js";
import type { RequestDoc } from "./requests/types.js";
import type { RoomDoc } from "./rooms/types.js";

interface CounterDoc {
  hotelId: ObjectId;
  name: string;
  value: number;
}

const client = new MongoClient(env.MONGODB_URI);

let db: Db | null = null;

export async function connectDb() {
  await client.connect();
  db = client.db(env.MONGODB_DB);
  await Promise.all([
    users().createIndex({ email: 1 }, { unique: true }),
    users().createIndex({ googleId: 1 }, { unique: true, sparse: true }),
    users().createIndex({ "passwordReset.tokenHash": 1 }, { sparse: true }),
    users().createIndex({ hotelId: 1 }),
    rooms().createIndex({ hotelId: 1, no: 1 }, { unique: true }),
    rooms().createIndex({ token: 1 }, { unique: true }),
    requests().createIndex({ hotelId: 1, seq: 1 }, { unique: true }),
    requests().createIndex({ hotelId: 1, createdAt: -1 }),
    requests().createIndex({ hotelId: 1, roomNo: 1, archived: 1 }),
    counters().createIndex({ hotelId: 1, name: 1 }, { unique: true }),
  ]);
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
export const hotels = () => database().collection<HotelDoc>("hotels");
export const rooms = () => database().collection<RoomDoc>("rooms");
export const requests = () => database().collection<RequestDoc>("requests");
export const counters = () => database().collection<CounterDoc>("counters");
