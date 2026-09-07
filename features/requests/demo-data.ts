import { CANNED } from "@/shared/i18n";

import { guestLanguage } from "./language";
import type { Request } from "./types";

export const DEMO_REQUESTS: Request[] = [
  {
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
    room: "104",
    category: "wifi",
    urgency: "medium",
    language: guestLanguage("ru"),
    status: "progress",
    minutesAgo: 26,
    assignee: "Giorgi K.",
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
      {
        from: "staff",
        by: "Giorgi K.",
        lang: "ka",
        minutesAgo: 21,
        text: CANNED.ack.ka,
        translations: CANNED.ack,
      },
    ],
  },
  {
    id: 16,
    room: "506",
    category: "service",
    urgency: "medium",
    language: guestLanguage("ar"),
    status: "progress",
    minutesAgo: 33,
    assignee: "Salome B.",
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
    ],
  },
  {
    id: 17,
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
        minutesAgo: 40,
        text: CANNED.fixed.ka,
        translations: CANNED.fixed,
      },
    ],
  },
  {
    id: 18,
    room: "133",
    category: "checkout",
    urgency: "low",
    language: guestLanguage("ka"),
    status: "done",
    minutesAgo: 72,
    assignee: "Levan M.",
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
    ],
  },
];

export const DEMO_ANALYTICS = {
  headline: [
    { label: "REQUESTS TODAY", value: "21", delta: "+18% vs last Tue" },
    { label: "AVG RESOLUTION", value: "17m", delta: "4m faster this week" },
    { label: "AUTO-TRANSLATED", value: "91%", delta: "of all messages" },
  ],
  firstChartDay: 18,
  requestsPerDay: [14, 9, 17, 22, 12, 15, 28, 19, 11, 24, 31, 18, 26, 21],
  topProblems: [
    { label: "Air conditioning", count: 61 },
    { label: "Hot water", count: 44 },
    { label: "WiFi", count: 38 },
    { label: "Towels & linen", count: 29 },
    { label: "Noise", count: 17 },
  ],
  guestLanguages: [
    { label: "Arabic", percent: 38 },
    { label: "Russian", percent: 31 },
    { label: "Turkish", percent: 18 },
    { label: "English", percent: 9 },
    { label: "Georgian", percent: 4 },
  ],
  repeatRooms: [
    { room: "412", issue: "Air conditioning", count: 5 },
    { room: "208", issue: "Hot water", count: 4 },
    { room: "104", issue: "WiFi drops", count: 3 },
    { room: "317", issue: "Towels", count: 3 },
  ],
  insight:
    "Arabic-speaking guests send 2.4× more requests per stay than average, mostly after 21:00 — worth an Arabic speaker on the night shift.",
} as const;
