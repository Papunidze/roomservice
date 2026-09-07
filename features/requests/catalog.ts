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

import type { Category } from "./types";

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

export const HOTEL = {
  name: "Batumi Palace",
  wifiNetwork: "Palace_Guest",
  wifiPassword: "sea2025",
  breakfast: "07:00 – 10:30",
  spa: "08:00 – 22:00",
  reception: "24/7",
  checkout: "12:00",
} as const;

export const FRONT_DESK_AGENT = "Nino T.";

export const FRONT_DESK_LANGUAGE: LangCode = "ka";
