import type { ObjectId } from "mongodb";

import type {
  ConfigurableCategory,
  LangCode,
  RoutingGroup,
  StaffRole,
  Urgency,
} from "../domain.js";

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
  notifications: {
    telegram: boolean;
    group: string;
    renotifyMinutes: number;
    quietHours: boolean;
    quietFrom: string;
    quietTo: string;
  };
  sessions: { autoCloseHours: number; requireClose: boolean };
}

export interface TeamConfig {
  routing: Record<RoutingGroup, StaffRole>;
  autoAssign: boolean;
  escalation: { enabled: boolean; minutes: number; target: StaffRole };
}

export interface HotelDoc {
  _id: ObjectId;
  settings: Settings;
  team: TeamConfig;
  createdAt: Date;
}
