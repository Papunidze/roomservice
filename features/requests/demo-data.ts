import { CANNED, type LangCode } from "@/shared/i18n";

import { guestLanguage } from "./language";
import type { Category, Message, Request } from "./types";

function system(text: string, minutesAgo: number): Message {
  return { from: "system", lang: "en", text, translations: {}, minutesAgo };
}

export const DEMO_REQUESTS: Request[] = [
  {
    id: 2041,
    room: "412",
    category: "ac",
    urgency: "high",
    language: guestLanguage("ar"),
    status: "new",
    minutesAgo: 4,
    assignee: "Unassigned",
    thread: [
      {
        from: "guest",
        lang: "ar",
        minutesAgo: 4,
        photo: true,
        text: "المكيف لا يعمل والغرفة حارة جداً",
        translations: {
          en: "The AC is not working and the room is very hot",
          ka: "კონდიციონერი არ მუშაობს და ოთახი ძალიან ცხელა",
          ru: "Кондиционер не работает, в номере очень жарко",
          tr: "Klima çalışmıyor ve oda çok sıcak",
        },
      },
    ],
  },
  {
    id: 2040,
    room: "305",
    category: "cleaning",
    urgency: "medium",
    language: guestLanguage("ar"),
    status: "new",
    minutesAgo: 8,
    assignee: "Unassigned",
    thread: [
      {
        from: "guest",
        lang: "ar",
        minutesAgo: 8,
        text: "الغرفة لم تُنظّف اليوم",
        translations: {
          en: "The room was not cleaned today",
          ka: "ოთახი დღეს არ დასუფთავდა",
          ru: "Номер сегодня не убирали",
          tr: "Oda bugün temizlenmedi",
        },
      },
    ],
  },
  {
    id: 2039,
    room: "208",
    category: "water",
    urgency: "high",
    language: guestLanguage("ru"),
    status: "new",
    minutesAgo: 11,
    assignee: "Unassigned",
    thread: [
      {
        from: "guest",
        lang: "ru",
        minutesAgo: 11,
        text: "Нет горячей воды со вчерашнего вечера",
        translations: {
          en: "No hot water since yesterday evening",
          ka: "გუშინ საღამოდან ცხელი წყალი არ არის",
          tr: "Dün akşamdan beri sıcak su yok",
          ar: "لا يوجد ماء ساخن منذ مساء أمس",
        },
      },
    ],
  },
  {
    id: 2038,
    room: "317",
    category: "items",
    urgency: "low",
    language: guestLanguage("tr"),
    status: "new",
    minutesAgo: 19,
    assignee: "Unassigned",
    thread: [
      {
        from: "guest",
        lang: "tr",
        minutesAgo: 19,
        text: "İki havlu ve bir ekstra yastık lütfen",
        translations: {
          en: "Two towels and one extra pillow please",
          ka: "ორი პირსახოცი და ერთი დამატებითი ბალიში, გთხოვთ",
          ru: "Два полотенца и одну дополнительную подушку, пожалуйста",
          ar: "منشفتان ووسادة إضافية من فضلكم",
        },
      },
    ],
  },
  {
    id: 2036,
    room: "104",
    category: "wifi",
    urgency: "medium",
    language: guestLanguage("ru"),
    status: "progress",
    minutesAgo: 26,
    assignee: "Giorgi M.",
    thread: [
      {
        from: "guest",
        lang: "ru",
        minutesAgo: 26,
        text: "WiFi постоянно отключается в номере",
        translations: {
          en: "The WiFi keeps disconnecting in the room",
          ka: "WiFi ოთახში მუდმივად წყდება",
          tr: "Odada WiFi sürekli kesiliyor",
          ar: "الواي فاي ينقطع باستمرار في الغرفة",
        },
      },
      system("Nino T. assigned to Giorgi M.", 24),
      system("Status → In progress", 24),
      {
        from: "staff",
        by: "Giorgi M.",
        lang: "ka",
        minutesAgo: 21,
        text: CANNED.tech.ka,
        translations: CANNED.tech,
      },
      {
        from: "note",
        by: "Nino T.",
        lang: "en",
        minutesAgo: 18,
        translations: {},
        text: "Router on floor 1 rebooted twice this week — check the cabling in the corridor cabinet, not just the access point.",
      },
    ],
  },
  {
    id: 2035,
    room: "506",
    category: "service",
    urgency: "medium",
    language: guestLanguage("ar"),
    status: "progress",
    minutesAgo: 33,
    assignee: "Leila A.",
    thread: [
      {
        from: "guest",
        lang: "ar",
        minutesAgo: 33,
        text: "طبقان من الخضار المشوي وزجاجة ماء",
        translations: {
          en: "Two grilled vegetable plates and a bottle of water",
          ka: "ორი შემწვარი ბოსტნეულის კერძი და ერთი ბოთლი წყალი",
          ru: "Две тарелки овощей на гриле и бутылку воды",
          tr: "İki ızgara sebze tabağı ve bir şişe su",
        },
      },
      system("Auto-assigned to Leila A. · Housekeeping", 33),
      {
        from: "staff",
        by: "Leila A.",
        lang: "en",
        minutesAgo: 30,
        text: CANNED.ack.en,
        translations: CANNED.ack,
      },
    ],
  },
  {
    id: 2031,
    room: "221",
    category: "noise",
    urgency: "medium",
    language: guestLanguage("tr"),
    status: "done",
    minutesAgo: 58,
    assignee: "Nino T.",
    thread: [
      {
        from: "guest",
        lang: "tr",
        minutesAgo: 58,
        text: "Yan odadan çok gürültü geliyor",
        translations: {
          en: "A lot of noise coming from the next room",
          ka: "მეზობელი ოთახიდან ძლიერი ხმაურია",
          ru: "Из соседнего номера очень шумно",
          ar: "هناك ضجيج كبير من الغرفة المجاورة",
        },
      },
      {
        from: "staff",
        by: "Nino T.",
        lang: "ka",
        minutesAgo: 56,
        text: CANNED.ack.ka,
        translations: CANNED.ack,
      },
      {
        from: "staff",
        by: "Nino T.",
        lang: "ka",
        minutesAgo: 40,
        text: CANNED.fixed.ka,
        translations: CANNED.fixed,
      },
      system("Status → Done", 40),
    ],
  },
  {
    id: 2028,
    room: "133",
    category: "checkout",
    urgency: "low",
    language: guestLanguage("ka"),
    status: "done",
    minutesAgo: 72,
    assignee: "Davit K.",
    thread: [
      {
        from: "guest",
        lang: "ka",
        minutesAgo: 72,
        text: "14:00-მდე გასვლა შესაძლებელია?",
        translations: {
          en: "Is checkout until 14:00 possible?",
          ru: "Можно выехать до 14:00?",
          tr: "14:00’e kadar çıkış mümkün mü?",
          ar: "هل يمكن المغادرة حتى الساعة 14:00؟",
        },
      },
      {
        from: "staff",
        by: "Davit K.",
        lang: "en",
        minutesAgo: 67,
        text: "Yes — 14:00 is confirmed, no extra charge.",
        translations: {
          ka: "დიახ — 14:00 დადასტურებულია, დამატებითი გადასახადის გარეშე.",
          ru: "Да — 14:00 подтверждено, без доплаты.",
          tr: "Evet — 14:00 onaylandı, ek ücret yok.",
          ar: "نعم — تم تأكيد الساعة 14:00 دون رسوم إضافية.",
        },
      },
      system("Status → Done", 67),
    ],
  },
];

export const ANALYTICS_RANGES = ["today", "7d", "30d", "custom"] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

interface RangeFigures {
  chip: string;
  label: string;
  scale: number;
  tickets: number;
  firstResponse: string;
  resolution: string;
  satisfaction: number;
  deltas: {
    tickets: string;
    firstResponse: string;
    resolution: string;
    satisfaction: string;
  };
}

export const ANALYTICS_BY_RANGE: Record<AnalyticsRange, RangeFigures> = {
  today: {
    chip: "Today",
    label: "today",
    scale: 1,
    tickets: 21,
    firstResponse: "3m 40s",
    resolution: "17m",
    satisfaction: 94,
    deltas: {
      tickets: "+18% vs last Tue",
      firstResponse: "−40s vs last week",
      resolution: "−4m vs last week",
      satisfaction: "+2 pts · thumbs up",
    },
  },
  "7d": {
    chip: "7d",
    label: "7 days",
    scale: 6.4,
    tickets: 134,
    firstResponse: "4m 10s",
    resolution: "19m",
    satisfaction: 92,
    deltas: {
      tickets: "+9% vs prev. 7d",
      firstResponse: "−1m 05s",
      resolution: "−3m",
      satisfaction: "+1 pt · thumbs up",
    },
  },
  "30d": {
    chip: "30d",
    label: "30 days",
    scale: 27,
    tickets: 566,
    firstResponse: "4m 55s",
    resolution: "22m",
    satisfaction: 91,
    deltas: {
      tickets: "+14% vs prev. 30d",
      firstResponse: "−1m 30s",
      resolution: "−6m",
      satisfaction: "±0 · thumbs up",
    },
  },
  custom: {
    chip: "Custom",
    label: "Aug 1 – Sep 7",
    scale: 34,
    tickets: 712,
    firstResponse: "5m 05s",
    resolution: "23m",
    satisfaction: 91,
    deltas: {
      tickets: "over the whole period",
      firstResponse: "over the whole period",
      resolution: "over the whole period",
      satisfaction: "thumbs up",
    },
  },
};

export const DEMO_ANALYTICS = {
  categoryTotals: [
    { category: "ac", count: 61 },
    { category: "water", count: 44 },
    { category: "wifi", count: 38 },
    { category: "items", count: 29 },
    { category: "cleaning", count: 24 },
    { category: "noise", count: 17 },
    { category: "other", count: 9 },
  ] satisfies { category: Category; count: number }[],
  ticketsByHour: [
    3, 2, 1, 1, 1, 2, 4, 7, 12, 10, 8, 9, 11, 9, 8, 10, 13, 15, 17, 19, 22, 18,
    11, 6,
  ],
  firstResponseTrend: [
    6.2, 5.8, 6.4, 5.1, 5.5, 4.9, 5.2, 4.6, 4.4, 4.8, 4.1, 4.3, 3.9, 4.2, 3.8,
    4.0, 3.6, 3.9, 3.5, 3.7, 3.4, 3.6, 3.3, 3.5, 3.2, 3.4, 3.1, 3.3, 3.0, 3.2,
  ],
  resolutionTrend: [
    31, 29, 30, 27, 28, 26, 27, 25, 24, 26, 23, 24, 22, 23, 22, 21, 22, 20, 21,
    19, 20, 19, 18, 19, 18, 17, 18, 17, 17, 16,
  ],
  trendDays: ["Aug 9", "Aug 16", "Aug 23", "Aug 30", "Sep 7"],
  repeatRooms: [
    { room: "412", category: "ac", count: 5, last: "today 12:12" },
    { room: "208", category: "water", count: 4, last: "today 12:05" },
    { room: "104", category: "wifi", count: 3, last: "today 11:50" },
    { room: "317", category: "items", count: 3, last: "Sep 5 · 09:40" },
  ] satisfies {
    room: string;
    category: Category;
    count: number;
    last: string;
  }[],
  insight:
    "Arabic-speaking guests send 2.4× more tickets per stay, mostly after 21:00. Leila and Giorgi cover the night shift only until 22:00.",
};

export const LANGUAGE_MIX: { lang: LangCode; percent: number }[] = [
  { lang: "ar", percent: 31 },
  { lang: "ru", percent: 24 },
  { lang: "tr", percent: 14 },
  { lang: "fa", percent: 9 },
  { lang: "uk", percent: 6 },
];

export const LANGUAGE_MIX_OTHER = 16;
