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

import type { LangCode } from "@/shared/i18n";

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

export interface Dish {
  key: string;
  name: string;
  note: string;
  priceTetri: number;
}

export const DISHES: Dish[] = [
  {
    key: "khachapuri",
    name: "Adjarian khachapuri",
    note: "Cheese, butter, egg",
    priceTetri: 2400,
  },
  {
    key: "vegetables",
    name: "Grilled vegetables",
    note: "Aubergine, pepper, walnut",
    priceTetri: 1900,
  },
  {
    key: "soup",
    name: "Chicken soup",
    note: "Served hot, 400 ml",
    priceTetri: 1500,
  },
  {
    key: "fruit",
    name: "Fruit plate",
    note: "Seasonal, for two",
    priceTetri: 1800,
  },
];

export interface CheckoutOption {
  time: string;
  surchargeTetri: number;
}

export const CHECKOUT_OPTIONS: CheckoutOption[] = [
  { time: "13:00", surchargeTetri: 0 },
  { time: "14:00", surchargeTetri: 2500 },
  { time: "16:00", surchargeTetri: 5000 },
];

export const CONFIGURABLE_CATEGORIES = [
  "ac",
  "tv",
  "wifi",
  "water",
  "noise",
  "cleaning",
  "items",
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
  other: { urgency: "medium", role: "Front desk" },
};

export const HOTEL = {
  name: "Batumi Palace",
  address: "Seaside Boulevard 12, Batumi 6000",
  timezone: "Asia/Tbilisi (GMT+4)",
  wifiNetwork: "Palace_Guest",
  wifiPassword: "sea2025",
  breakfast: "07:00 – 10:30",
  spa: "08:00 – 22:00",
  reception: "24/7",
  checkout: "12:00",
  rules:
    "Quiet hours 23:00–08:00. No smoking in rooms. Pool towels are at the spa desk.",
} as const;

export const TIMEZONES = [
  "Asia/Tbilisi (GMT+4)",
  "Europe/Istanbul (GMT+3)",
  "Europe/Moscow (GMT+3)",
];

export const FRONT_DESK_AGENT = "Nino T.";

export const FRONT_DESK_LANGUAGE: LangCode = "ka";
