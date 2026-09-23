import { DICTIONARY, type LangCode } from "@/shared/i18n";

import { isItemKey, type ConfigurableCategory } from "./catalog";
import type { StaffRole, Urgency } from "./types";

export type Translations = Partial<Record<LangCode, string>>;

export interface HotelProfile {
  name: string;
  address: string;
  timezone: string;
  checkout: string;
}

export interface GuestInfo {
  wifiName: string;
  wifiPassword: string;
  breakfast: string;
  spa: string;
  reception: string;
  rules: string;
}

export interface CategorySetting {
  enabled: boolean;
  urgency: Urgency;
  role: StaffRole;
}

export interface MenuItem {
  key: string;
  label: string;
  available: boolean;
  translations: Translations;
}

export function itemLabel(item: MenuItem, lang: LangCode) {
  if (isItemKey(item.key)) return DICTIONARY[lang][item.key];
  return item.translations[lang] ?? item.label;
}

export interface Dish {
  key: string;
  name: string;
  note: string;
  priceTetri: number;
  available: boolean;
  translations: Translations;
}

export const dishName = (dish: Dish, lang: LangCode) =>
  dish.translations[lang] ?? dish.name;

export interface ServiceSettings {
  open: string;
  close: string;
  deliveryMinutes: number;
  dishes: Dish[];
}

export interface CheckoutOption {
  time: string;
  surchargeTetri: number;
}

export interface NotificationSettings {
  sound: boolean;
  renotifyMinutes: number;
  telegram: boolean;
  group: string;
}

export interface SessionSettings {
  autoCloseHours: number;
}

export interface Settings {
  hotel: HotelProfile;
  staffLang: LangCode;
  staffDefaultLang: LangCode;
  guestLanguages: Record<LangCode, boolean>;
  infoSourceLang: LangCode;
  info: GuestInfo;
  categories: Record<ConfigurableCategory, CategorySetting>;
  items: MenuItem[];
  service: ServiceSettings;
  lateCheckout: CheckoutOption[];
  notifications: NotificationSettings;
  sessions: SessionSettings;
}

export type GuestSettings = Pick<
  Settings,
  | "guestLanguages"
  | "info"
  | "infoSourceLang"
  | "categories"
  | "items"
  | "service"
  | "lateCheckout"
> & { hotel: Pick<HotelProfile, "name" | "checkout"> };

export const fillIn = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
