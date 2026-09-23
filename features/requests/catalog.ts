import {
  AirVent,
  CircleHelp,
  Clock,
  ConciergeBell,
  Droplets,
  Hotel,
  ShoppingBag,
  SprayCan,
  Tv,
  Volume2,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { Category, StaffRole, Urgency } from "./types";

export const CATEGORY_LABEL: Record<Category, string> = {
  ac: "Air conditioning",
  tv: "Television",
  wifi: "WiFi",
  water: "Hot water",
  noise: "Noise",
  cleaning: "Cleaning",
  other: "Other",
  items: "Item request",
  service: "Room service",
  checkout: "Late checkout",
  info: "Hotel info",
};

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  ac: AirVent,
  tv: Tv,
  wifi: Wifi,
  water: Droplets,
  noise: Volume2,
  cleaning: SprayCan,
  other: CircleHelp,
  items: ShoppingBag,
  service: ConciergeBell,
  checkout: Clock,
  info: Hotel,
};

export const PROBLEM_KEYS = [
  "ac",
  "tv",
  "wifi",
  "water",
  "noise",
  "cleaning",
  "other",
] as const;

export type ProblemKey = (typeof PROBLEM_KEYS)[number];

export const URGENT_PROBLEMS: ProblemKey[] = ["ac", "water"];

export const ITEM_KEYS = [
  "towels",
  "pillow",
  "iron",
  "slippers",
  "water2",
  "kit",
] as const;

export type ItemKey = (typeof ITEM_KEYS)[number];

const ITEM_KEY_SET = new Set<string>(ITEM_KEYS);

export function isItemKey(key: string): key is ItemKey {
  return ITEM_KEY_SET.has(key);
}

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
] as const satisfies readonly Category[];

export type ConfigurableCategory = (typeof CONFIGURABLE_CATEGORIES)[number];

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
