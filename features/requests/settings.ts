import { DICTIONARY, LANGUAGES, type LangCode } from "@/shared/i18n";

import {
  CATEGORY_DEFAULT,
  CONFIGURABLE_CATEGORIES,
  FRONT_DESK_LANGUAGE,
  HOTEL,
  isItemKey,
  ITEM_KEYS,
  type ConfigurableCategory,
} from "./catalog";
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

const categories = Object.fromEntries(
  CONFIGURABLE_CATEGORIES.map((key) => [
    key,
    { enabled: true, ...CATEGORY_DEFAULT[key] },
  ]),
) as Record<ConfigurableCategory, CategorySetting>;

const guestLanguages = Object.fromEntries(
  LANGUAGES.map((code) => [code, true]),
) as Record<LangCode, boolean>;

export const SETTINGS_SEED: Settings = {
  hotel: {
    name: HOTEL.name,
    address: HOTEL.address,
    timezone: HOTEL.timezone,
    checkout: HOTEL.checkout,
  },
  staffLang: FRONT_DESK_LANGUAGE,
  staffDefaultLang: FRONT_DESK_LANGUAGE,
  guestLanguages,
  infoSourceLang: "en",
  info: {
    wifiName: HOTEL.wifiNetwork,
    wifiPassword: HOTEL.wifiPassword,
    breakfast: HOTEL.breakfast,
    spa: HOTEL.spa,
    reception: HOTEL.reception,
    rules: HOTEL.rules,
  },
  categories,
  items: ITEM_KEYS.map((key) => ({
    key,
    label: DICTIONARY.en[key],
    available: true,
  })),
  notifications: {
    telegram: true,
    group: "Batumi Palace — Reception",
    renotifyMinutes: 15,
    quietHours: true,
    quietFrom: "22:00",
    quietTo: "07:00",
  },
  sessions: {
    autoCloseHours: 24,
    requireClose: true,
  },
};
