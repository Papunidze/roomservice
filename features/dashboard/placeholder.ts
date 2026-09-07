import type { DashboardData } from "./types";

const tbilisi = (time: string) => new Date(`2026-06-12T${time}:00+04:00`);

export const dashboardPlaceholder: DashboardData = {
  ownerName: "ნინო",
  revenue: {
    totalTetri: 384_000,
    deltaPercent: 12,
    averageCheckTetri: 9_100,
  },
  bookings: {
    count: 42,
    deltaPercent: 18,
    byAssistant: 9,
  },
  assistant: {
    handled: 318,
    handledPercent: 91,
    handedOff: 29,
  },
  week: [
    { weekday: 0, count: 24 },
    { weekday: 1, count: 31 },
    { weekday: 2, count: 28 },
    { weekday: 3, count: 42 },
    { weekday: 4, count: 38 },
    { weekday: 5, count: 35 },
    { weekday: 6, count: 19 },
  ],
  goal: {
    targetTetri: 1_500_000,
    reachedTetri: 1_134_000,
    todayTetri: 34_500,
    deltaPercent: 24.9,
  },
  today: [
    {
      id: "1",
      startsAt: tbilisi("10:30"),
      clientName: "ანა ბერიძე",
      serviceName: "თმის შეჭრა",
      staffName: "ნინო",
      priceTetri: 4_000,
      source: "assistant",
    },
    {
      id: "2",
      startsAt: tbilisi("11:15"),
      clientName: "ლიკა ჯანაშია",
      serviceName: "მანიკიური",
      staffName: "ნინო",
      priceTetri: 4_500,
      source: "assistant",
    },
    {
      id: "3",
      startsAt: tbilisi("13:00"),
      clientName: "სოფო კაპანაძე",
      serviceName: "შეღებვა",
      staffName: "თამარ",
      priceTetri: 15_000,
      source: "manual",
    },
    {
      id: "4",
      startsAt: tbilisi("15:00"),
      clientName: "ზურა მაისურაძე",
      serviceName: "თმის შეჭრა",
      staffName: "გიორგი",
      priceTetri: 4_000,
      source: "assistant",
    },
    {
      id: "5",
      startsAt: tbilisi("17:30"),
      clientName: "ნათია გელაშვილი",
      serviceName: "ვარცხნილობა",
      staffName: "თამარ",
      priceTetri: 7_000,
      source: "phone",
    },
  ],
  unread: {
    total: 12,
    instagram: 8,
    whatsapp: 4,
  },
  handoff: {
    count: 3,
    reasons: ["ფასდაკლების მოთხოვნა", "პრეტენზია", "ჯგუფური ჯავშანი"],
  },
};
