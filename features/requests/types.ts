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

export interface GuestLanguage {
  name: string;
  native: string;
  code: string;
  dir: "ltr" | "rtl";
  base: LangCode;
}

export interface Message {
  from: "guest" | "staff";
  by?: string;
  lang: LangCode;
  text: string;
  translations: Partial<Record<LangCode, string>>;
  photo?: boolean;
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
  thread: Message[];
}

export const STAFF_MEMBERS = [
  "Unassigned",
  "Nino T.",
  "Giorgi K.",
  "Salome B.",
  "Levan M.",
] as const;

export const UNASSIGNED = STAFF_MEMBERS[0];
