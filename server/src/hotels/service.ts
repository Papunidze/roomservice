import { ObjectId } from "mongodb";

import { hotels } from "../db.js";
import {
  CATEGORY_DEFAULT,
  CONFIGURABLE_CATEGORIES,
  ITEM_KEYS,
  LANGUAGES,
  type ConfigurableCategory,
  type LangCode,
} from "../domain.js";
import { publish } from "../lib/events.js";
import type { HotelDoc, Settings, TeamConfig } from "./types.js";

const capitalise = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

export function defaultSettings(name: string): Settings {
  return {
    hotel: {
      name,
      address: "",
      timezone: "Asia/Tbilisi (GMT+4)",
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
    categories: Object.fromEntries(
      CONFIGURABLE_CATEGORIES.map((key) => [
        key,
        { enabled: true, ...CATEGORY_DEFAULT[key] },
      ]),
    ) as Record<
      ConfigurableCategory,
      Settings["categories"][ConfigurableCategory]
    >,
    items: ITEM_KEYS.map((key) => ({
      key,
      label: capitalise(key),
      available: true,
    })),
    notifications: {
      telegram: false,
      group: "",
      renotifyMinutes: 15,
      quietHours: true,
      quietFrom: "22:00",
      quietTo: "07:00",
    },
    sessions: { autoCloseHours: 24, requireClose: true },
  };
}

const DEFAULT_TEAM: TeamConfig = {
  routing: {
    maintenance: "Maintenance",
    housekeeping: "Housekeeping",
    frontDesk: "Front desk",
  },
  autoAssign: true,
  escalation: { enabled: true, minutes: 15, target: "Manager" },
};

export async function createHotel(name: string) {
  const hotel: HotelDoc = {
    _id: new ObjectId(),
    settings: defaultSettings(name),
    team: DEFAULT_TEAM,
    createdAt: new Date(),
  };
  await hotels().insertOne(hotel);
  return hotel;
}

export async function getHotel(hotelId: ObjectId) {
  const hotel = await hotels().findOne({ _id: hotelId });
  if (!hotel) throw new Error(`Hotel ${hotelId.toHexString()} is missing`);
  return hotel;
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
  return hotel.settings;
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
  return hotel.team;
}
