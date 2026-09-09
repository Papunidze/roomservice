import type { ObjectId } from "mongodb";

import type {
  Category,
  LangCode,
  MessageKind,
  Status,
  Urgency,
} from "../domain.js";

export interface GuestLanguage {
  name: string;
  native: string;
  code: string;
  dir: "ltr" | "rtl";
  base: LangCode;
}

export interface MessageDoc {
  id: string;
  from: MessageKind;
  by?: string;
  lang: LangCode;
  text: string;
  translations: Partial<Record<LangCode, string>>;
  photo?: boolean;
  at: Date;
}

export interface RequestDoc {
  _id: ObjectId;
  hotelId: ObjectId;
  seq: number;
  roomNo: string;
  category: Category;
  urgency: Urgency;
  language: GuestLanguage;
  status: Status;
  assignee: string;
  archived: boolean;
  escalatedAt: Date | null;
  firstResponseAt: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  thread: MessageDoc[];
}

export interface PublicMessage extends Omit<MessageDoc, "at"> {
  at: string;
  minutesAgo: number;
}

export interface PublicRequest {
  id: number;
  room: string;
  category: Category;
  urgency: Urgency;
  language: GuestLanguage;
  status: Status;
  assignee: string;
  archived: boolean;
  createdAt: string;
  minutesAgo: number;
  thread: PublicMessage[];
}
