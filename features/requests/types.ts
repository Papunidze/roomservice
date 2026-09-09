import type { LangCode } from "@/shared/i18n";

export const CATEGORIES = [
  "ac",
  "tv",
  "wifi",
  "water",
  "noise",
  "cleaning",
  "other",
  "items",
  "service",
  "checkout",
  "info",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Urgency = "high" | "medium" | "low";

export type Status = "new" | "progress" | "done";

export const STAFF_ROLES = [
  "Front desk",
  "Housekeeping",
  "Maintenance",
  "Manager",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const UNASSIGNED = "Unassigned";

export interface GuestLanguage {
  name: string;
  native: string;
  code: string;
  dir: "ltr" | "rtl";
  base: LangCode;
}

export const MESSAGE_KINDS = ["guest", "staff", "system", "note"] as const;

export type MessageKind = (typeof MESSAGE_KINDS)[number];

export interface Message {
  from: MessageKind;
  by?: string;
  lang: LangCode;
  text: string;
  translations: Partial<Record<LangCode, string>>;
  photo?: boolean;
  freeText?: boolean;
  minutesAgo: number;
}

export interface Request {
  id: number;
  room: string;
  category: Category;
  urgency: Urgency;
  language: GuestLanguage;
  status: Status;
  minutesAgo: number;
  assignee: string;
  archived?: boolean;
  createdAt?: string;
  thread: Message[];
}

export function isGuestVisible(message: Message) {
  return message.from === "guest" || message.from === "staff";
}
