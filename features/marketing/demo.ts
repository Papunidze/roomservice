import {
  CATEGORY_DEFAULT,
  CONFIGURABLE_CATEGORIES,
  ITEM_KEYS,
  type GuestSettings,
} from "@/features/requests";
import { LANGUAGES, type LangCode } from "@/shared/i18n";

export const DEMO_HOTEL = "Batumi Palace";
export const DEMO_AGENT = "Nino T.";
export const DEMO_AGENT_LANGUAGE: LangCode = "ka";

const capitalise = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

export const DEMO_SETTINGS: GuestSettings = {
  hotel: { name: DEMO_HOTEL, checkout: "12:00" },
  guestLanguages: Object.fromEntries(
    LANGUAGES.map((code) => [code, true]),
  ) as Record<LangCode, boolean>,
  infoSourceLang: "en",
  info: {
    wifiName: "Palace_Guest",
    wifiPassword: "sea2025",
    breakfast: "07:00 – 10:30",
    spa: "08:00 – 22:00",
    reception: "24/7",
    rules:
      "Quiet hours 23:00–08:00. No smoking in rooms. Pool towels are at the spa desk.",
  },
  categories: Object.fromEntries(
    CONFIGURABLE_CATEGORIES.map((key) => [
      key,
      { enabled: true, ...CATEGORY_DEFAULT[key] },
    ]),
  ) as GuestSettings["categories"],
  items: ITEM_KEYS.map((key) => ({
    key,
    label: capitalise(key),
    available: true,
    translations: {},
  })),
  service: {
    open: "12:00",
    close: "23:00",
    deliveryMinutes: 25,
    dishes: [
      {
        key: "khachapuri",
        name: "Adjarian khachapuri",
        note: "Cheese, butter, egg",
        priceTetri: 2400,
        available: true,
        translations: {},
      },
      {
        key: "vegetables",
        name: "Grilled vegetables",
        note: "Aubergine, pepper, walnut",
        priceTetri: 1900,
        available: true,
        translations: {},
      },
      {
        key: "soup",
        name: "Chicken soup",
        note: "Served hot, 400 ml",
        priceTetri: 1500,
        available: true,
        translations: {},
      },
    ],
  },
  lateCheckout: [
    { time: "13:00", surchargeTetri: 0 },
    { time: "14:00", surchargeTetri: 2500 },
    { time: "16:00", surchargeTetri: 5000 },
  ],
};
