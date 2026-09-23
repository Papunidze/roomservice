import { ObjectId } from "mongodb";

import { hotels } from "../db.js";
import {
  CATEGORY_DEFAULT,
  CONFIGURABLE_CATEGORIES,
  isTimezone,
  ITEM_KEYS,
  LANGUAGES,
  TRIAL_DAYS,
  type ConfigurableCategory,
  type LangCode,
} from "../domain.js";
import { publish } from "../lib/events.js";
import { translateCatalogInBackground } from "./translate-catalog.js";
import type { Billing, HotelDoc, Settings, TeamConfig } from "./types.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEZONE = "Asia/Tbilisi";

const capitalise = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

function defaultCategories() {
  return Object.fromEntries(
    CONFIGURABLE_CATEGORIES.map((key) => [
      key,
      { enabled: true, ...CATEGORY_DEFAULT[key] },
    ]),
  ) as Record<
    ConfigurableCategory,
    Settings["categories"][ConfigurableCategory]
  >;
}

export function defaultSettings(name: string): Settings {
  return {
    hotel: {
      name,
      address: "",
      timezone: DEFAULT_TIMEZONE,
      checkout: "12:00",
    },
    staffLang: "ka",
    staffDefaultLang: "ka",
    guestLanguages: Object.fromEntries(
      LANGUAGES.map((code) => [code, true]),
    ) as Record<LangCode, boolean>,
    infoSourceLang: "en",
    info: {
      wifiName: "",
      wifiPassword: "",
      breakfast: "",
      spa: "",
      reception: "24/7",
      rules: "",
    },
    categories: defaultCategories(),
    items: ITEM_KEYS.map((key) => ({
      key,
      label: capitalise(key),
      available: true,
      translations: {},
    })),
    service: { open: "12:00", close: "23:00", deliveryMinutes: 25, dishes: [] },
    lateCheckout: [
      { time: "13:00", surchargeTetri: 0 },
      { time: "14:00", surchargeTetri: 2500 },
      { time: "16:00", surchargeTetri: 5000 },
    ],
    notifications: {
      sound: true,
      renotifyMinutes: 15,
      telegram: false,
      group: "",
    },
    sessions: { autoCloseHours: 24 },
  };
}

const DEFAULT_TEAM: TeamConfig = {
  autoAssign: true,
  offShiftHours: 12,
  escalation: { enabled: true, minutes: 15, target: "Manager" },
};

export const trialBilling = (from = new Date()): Billing => ({
  plan: "trial",
  trialEndsAt: new Date(from.getTime() + TRIAL_DAYS * DAY_MS),
  paidUntil: null,
});

export async function createHotel(name: string) {
  const hotel: HotelDoc = {
    _id: new ObjectId(),
    settings: defaultSettings(name),
    team: DEFAULT_TEAM,
    billing: trialBilling(),
    createdAt: new Date(),
  };
  await hotels().insertOne(hotel);
  return hotel;
}

const ianaOf = (timezone: string) => {
  const bare = timezone.split(" (")[0] ?? timezone;
  return isTimezone(bare) ? bare : DEFAULT_TIMEZONE;
};

export function withDefaults(hotel: HotelDoc): HotelDoc {
  const base = defaultSettings(hotel.settings.hotel.name);
  const settings: Settings = {
    ...base,
    ...hotel.settings,
    hotel: {
      ...hotel.settings.hotel,
      timezone: ianaOf(hotel.settings.hotel.timezone),
    },
    categories: { ...base.categories, ...hotel.settings.categories },
    items: hotel.settings.items.map((item) => ({
      ...item,
      translations: item.translations ?? {},
    })),
    service: hotel.settings.service ?? base.service,
    lateCheckout: hotel.settings.lateCheckout ?? base.lateCheckout,
    notifications: { ...base.notifications, ...hotel.settings.notifications },
    sessions: { ...base.sessions, ...hotel.settings.sessions },
  };
  return {
    ...hotel,
    settings,
    team: { ...DEFAULT_TEAM, ...hotel.team },
    billing: hotel.billing ?? trialBilling(),
  };
}

export async function getHotel(hotelId: ObjectId) {
  const hotel = await hotels().findOne({ _id: hotelId });
  if (!hotel) throw new Error(`Hotel ${hotelId.toHexString()} is missing`);
  const full = withDefaults(hotel);
  if (!hotel.billing)
    await hotels().updateOne({ _id: hotelId }, { $set: { billing: full.billing } });
  return full;
}

export async function updateSettings(
  hotelId: ObjectId,
  patch: Partial<Settings>,
) {
  const $set = Object.fromEntries(
    Object.entries(patch).map(([key, value]) => [`settings.${key}`, value]),
  );
  const hotel = await hotels().findOneAndUpdate(
    { _id: hotelId },
    { $set },
    { returnDocument: "after" },
  );
  if (!hotel) throw new Error("Hotel is missing");
  publish(hotelId.toHexString(), { type: "settings" });
  const full = withDefaults(hotel);
  if (patch.items || patch.service || patch.guestLanguages)
    translateCatalogInBackground(full);
  return full.settings;
}

export async function updateTeamConfig(
  hotelId: ObjectId,
  patch: Partial<TeamConfig>,
) {
  const $set = Object.fromEntries(
    Object.entries(patch).map(([key, value]) => [`team.${key}`, value]),
  );
  const hotel = await hotels().findOneAndUpdate(
    { _id: hotelId },
    { $set },
    { returnDocument: "after" },
  );
  if (!hotel) throw new Error("Hotel is missing");
  publish(hotelId.toHexString(), { type: "team" });
  return withDefaults(hotel).team;
}

export type BillingStatus = "trial" | "active" | "expired";

export function billingStatus(
  billing: Billing,
  now = new Date(),
): BillingStatus {
  if (billing.plan === "trial")
    return billing.trialEndsAt > now ? "trial" : "expired";
  if (billing.paidUntil === null || billing.paidUntil > now) return "active";
  return "expired";
}

export function toPublicBilling(hotel: HotelDoc, roomCount: number) {
  const { billing } = hotel;
  const status = billingStatus(billing);
  const until =
    billing.plan === "trial" ? billing.trialEndsAt : billing.paidUntil;
  return {
    plan: billing.plan,
    status,
    trialEndsAt: billing.trialEndsAt.toISOString(),
    paidUntil: billing.paidUntil?.toISOString() ?? null,
    daysLeft: until
      ? Math.max(0, Math.ceil((until.getTime() - Date.now()) / DAY_MS))
      : null,
    rooms: roomCount,
  };
}

export async function updateBilling(
  hotelId: ObjectId,
  patch: Partial<Billing>,
) {
  const $set = Object.fromEntries(
    Object.entries(patch).map(([key, value]) => [`billing.${key}`, value]),
  );
  const hotel = await hotels().findOneAndUpdate(
    { _id: hotelId },
    { $set },
    { returnDocument: "after" },
  );
  if (!hotel) throw new Error("Hotel is missing");
  publish(hotelId.toHexString(), { type: "settings" });
  return withDefaults(hotel);
}
