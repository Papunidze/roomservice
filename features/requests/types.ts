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

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
}

export const STAFF: StaffMember[] = [
  { id: "nino", name: "Nino T.", role: "Front desk" },
  { id: "giorgi", name: "Giorgi M.", role: "Maintenance" },
  { id: "leila", name: "Leila A.", role: "Housekeeping" },
  { id: "davit", name: "Davit K.", role: "Manager" },
];

export const UNASSIGNED = "Unassigned";

export const STAFF_MEMBERS = [
  UNASSIGNED,
  ...STAFF.map((person) => person.name),
];

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
  thread: Message[];
}

export function isGuestVisible(message: Message) {
  return message.from === "guest" || message.from === "staff";
}
