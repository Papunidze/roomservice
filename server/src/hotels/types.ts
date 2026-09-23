import type { ObjectId } from "mongodb";

import type {
  ConfigurableCategory,
  LangCode,
  Plan,
  StaffRole,
  Urgency,
} from "../domain.js";

export type Translations = Partial<Record<LangCode, string>>;

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

export interface Dish {
  key: string;
  name: string;
  note: string;
  priceTetri: number;
  available: boolean;
  translations: Translations;
}

export interface CheckoutOption {
  time: string;
  surchargeTetri: number;
}

export interface Settings {
  hotel: { name: string; address: string; timezone: string; checkout: string };
  staffLang: LangCode;
  staffDefaultLang: LangCode;
  guestLanguages: Record<LangCode, boolean>;
  infoSourceLang: LangCode;
  info: {
    wifiName: string;
    wifiPassword: string;
    breakfast: string;
    spa: string;
    reception: string;
    rules: string;
  };
  categories: Record<ConfigurableCategory, CategorySetting>;
  items: MenuItem[];
  service: {
    open: string;
    close: string;
    deliveryMinutes: number;
    dishes: Dish[];
  };
  lateCheckout: CheckoutOption[];
  notifications: {
    sound: boolean;
    renotifyMinutes: number;
    telegram: boolean;
    group: string;
  };
  sessions: { autoCloseHours: number };
}

export interface TeamConfig {
  autoAssign: boolean;
  offShiftHours: number;
  escalation: { enabled: boolean; minutes: number; target: StaffRole };
}

export interface Billing {
  plan: Plan;
  trialEndsAt: Date;
  paidUntil: Date | null;
}

export interface HotelDoc {
  _id: ObjectId;
  settings: Settings;
  team: TeamConfig;
  billing: Billing;
  createdAt: Date;
}
