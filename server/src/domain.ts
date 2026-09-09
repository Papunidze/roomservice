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
  "Manager",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const MESSAGE_KINDS = ["guest", "staff", "system", "note"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

export const ROUTING_GROUPS = {
  maintenance: ["ac", "water", "wifi", "tv"],
  housekeeping: ["cleaning", "items"],
  frontDesk: ["noise", "service", "checkout", "other"],
} as const satisfies Record<string, readonly Category[]>;

export type RoutingGroup = keyof typeof ROUTING_GROUPS;

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
  other: { urgency: "medium", role: "Front desk" },
};

export function routingGroupFor(category: Category): RoutingGroup | null {
  for (const [group, categories] of Object.entries(ROUTING_GROUPS)) {
    if ((categories as readonly Category[]).includes(category))
      return group as RoutingGroup;
  }
  return null;
}

export const minutesAgo = (date: Date, now = Date.now()) =>
  Math.max(0, Math.round((now - date.getTime()) / 60_000));
