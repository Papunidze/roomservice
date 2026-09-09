import { DICTIONARY, type LangCode } from "@/shared/i18n";

import { isItemKey, type ConfigurableCategory } from "./catalog";
import type { StaffRole, Urgency } from "./types";

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
}

export function itemLabel(item: MenuItem, lang: LangCode) {
  return isItemKey(item.key) ? DICTIONARY[lang][item.key] : item.label;
}

export interface NotificationSettings {
  telegram: boolean;
  group: string;
  renotifyMinutes: number;
  quietHours: boolean;
  quietFrom: string;
  quietTo: string;
}

export interface SessionSettings {
  autoCloseHours: number;
  requireClose: boolean;
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
  notifications: NotificationSettings;
  sessions: SessionSettings;
}

export type GuestSettings = Pick<
  Settings,
  "guestLanguages" | "info" | "infoSourceLang" | "categories" | "items"
> & { hotel: Pick<HotelProfile, "name" | "checkout"> };
