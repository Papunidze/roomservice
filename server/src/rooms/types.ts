import type { ObjectId } from "mongodb";

import type { LangCode } from "../domain.js";

export interface GuestSessionDoc {
  lang: LangCode;
  since: Date;
}

export interface RoomDoc {
  _id: ObjectId;
  hotelId: ObjectId;
  no: string;
  floor: number;
  token: string;
  printed: boolean;
  session: GuestSessionDoc | null;
  lastActivityAt: Date | null;
  createdAt: Date;
}

export interface PublicRoom {
  no: string;
  floor: number;
  printed: boolean;
  session: { lang: LangCode; since: string } | null;
  lastActivity: string | null;
  url: string;
}
