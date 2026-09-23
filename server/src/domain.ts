export const LANGUAGES = [
  "ar",
  "fa",
  "tr",
  "ru",
  "uk",
  "he",
  "en",
  "de",
  "fr",
  "it",
  "es",
  "pl",
  "pt",
  "hi",
  "zh",
  "ka",
] as const;

export type LangCode = (typeof LANGUAGES)[number];

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

export const CONFIGURABLE_CATEGORIES = [
  "ac",
  "tv",
  "wifi",
  "water",
  "noise",
  "cleaning",
  "items",
  "service",
  "checkout",
  "info",
  "other",
] as const;

export type ConfigurableCategory = (typeof CONFIGURABLE_CATEGORIES)[number];

export const URGENCIES = ["high", "medium", "low"] as const;
export type Urgency = (typeof URGENCIES)[number];

export const STATUSES = ["new", "progress", "done"] as const;
export type Status = (typeof STATUSES)[number];

export const STAFF_ROLES = [
  "Front desk",
  "Housekeeping",
  "Maintenance",
  "Kitchen",
  "Supervisor",
  "Manager",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const ADMIN_ROLES: readonly StaffRole[] = ["Manager", "Supervisor"];

export const MESSAGE_KINDS = ["guest", "staff", "system", "note"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

export const PLANS = ["trial", "standard", "pro", "enterprise"] as const;
export type Plan = (typeof PLANS)[number];

export const TRIAL_DAYS = 30;

export const ITEM_KEYS = [
  "towels",
  "pillow",
  "iron",
  "slippers",
  "water2",
  "kit",
] as const;

export const UNASSIGNED = "Unassigned";

export const CATEGORY_DEFAULT: Record<
  ConfigurableCategory,
  { urgency: Urgency; role: StaffRole }
> = {
  ac: { urgency: "high", role: "Maintenance" },
  tv: { urgency: "medium", role: "Maintenance" },
  wifi: { urgency: "medium", role: "Maintenance" },
  water: { urgency: "high", role: "Maintenance" },
  noise: { urgency: "medium", role: "Front desk" },
  cleaning: { urgency: "medium", role: "Housekeeping" },
  items: { urgency: "low", role: "Housekeeping" },
  service: { urgency: "medium", role: "Kitchen" },
  checkout: { urgency: "medium", role: "Front desk" },
  info: { urgency: "low", role: "Front desk" },
  other: { urgency: "medium", role: "Front desk" },
};

export const minutesAgo = (date: Date, now = Date.now()) =>
  Math.max(0, Math.round((now - date.getTime()) / 60_000));

export function isTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
