import type { LangCode } from "./dictionary";

export const CANNED_KEYS = ["ack", "tech", "fixed"] as const;

export type CannedKey = (typeof CANNED_KEYS)[number];

export const CANNED_LABEL: Record<CannedKey, string> = {
  ack: "On our way",
  tech: "Technician in 10 min",
  fixed: "Resolved, please check",
};

export const CANNED: Record<CannedKey, Record<LangCode, string>> = {
  ack: {
    en: "On our way — we’ll be with you in a few minutes.",
    ar: "نحن في الطريق — سنكون عندك خلال دقائق.",
    ru: "Уже идём — будем у вас через несколько минут.",
    tr: "Yola çıktık — birkaç dakika içinde yanınızdayız.",
    ka: "უკვე მოვდივართ — რამდენიმე წუთში თქვენთან ვიქნებით.",
    fa: "در راه هستیم — تا چند دقیقه دیگر پیش شما خواهیم بود.",
    he: "אנחנו בדרך — נהיה אצלכם בעוד כמה דקות.",
    uk: "Уже йдемо — будемо у вас за кілька хвилин.",
    pl: "Już idziemy — będziemy u Państwa za kilka minut.",
    de: "Wir sind unterwegs — in wenigen Minuten bei Ihnen.",
    fr: "Nous arrivons — nous serons là dans quelques minutes.",
    pt: "Estamos a caminho — chegamos em poucos minutos.",
    hi: "हम आ रहे हैं — कुछ ही मिनटों में आपके पास होंगे।",
    zh: "我们已经在路上，几分钟内到达。",
    it: "Stiamo arrivando — saremo da te tra pochi minuti.",
    es: "Vamos en camino — estaremos contigo en unos minutos.",
  },
  tech: {
    en: "A technician will be with you in 10 minutes.",
    ar: "سيصل الفني خلال 10 دقائق.",
    ru: "Техник будет у вас через 10 минут.",
    tr: "Teknisyen 10 dakika içinde gelecek.",
    ka: "ტექნიკოსი 10 წუთში მოვა.",
    fa: "تکنسین تا ۱۰ دقیقه دیگر می‌آید.",
    he: "טכנאי יגיע אליכם בעוד 10 דקות.",
    uk: "Технік буде у вас за 10 хвилин.",
    pl: "Technik będzie u Państwa za 10 minut.",
    de: "Ein Techniker ist in 10 Minuten bei Ihnen.",
    fr: "Un technicien sera là dans 10 minutes.",
    pt: "Um técnico chega em 10 minutos.",
    hi: "तकनीशियन 10 मिनट में पहुँच जाएगा।",
    zh: "维修人员将在 10 分钟内到达。",
    it: "Un tecnico arriverà tra 10 minuti.",
    es: "Un técnico llegará en 10 minutos.",
  },
  fixed: {
    en: "Resolved — please check and tell us if anything is still wrong.",
    ar: "تم الحل — يرجى التحقق وإخبارنا إن بقي شيء.",
    ru: "Готово — проверьте, пожалуйста, и напишите, если что-то не так.",
    tr: "Çözüldü — lütfen kontrol edin, sorun sürerse yazın.",
    ka: "გამოსწორებულია — გთხოვთ შეამოწმოთ და მოგვწეროთ, თუ რამე კიდევ არ არის რიგზე.",
    fa: "برطرف شد — لطفاً بررسی کنید و اگر هنوز مشکلی هست به ما بگویید.",
    he: "טופל — אנא בדקו ועדכנו אותנו אם משהו עדיין לא תקין.",
    uk: "Готово — перевірте, будь ласка, і напишіть, якщо щось не так.",
    pl: "Naprawione — prosimy sprawdzić i dać znać, jeśli coś jest nie tak.",
    de: "Erledigt — bitte prüfen Sie kurz und sagen Sie uns Bescheid, falls noch etwas fehlt.",
    fr: "C’est réglé — merci de vérifier et de nous dire s’il reste un souci.",
    pt: "Resolvido — confira, por favor, e avise se algo ainda estiver errado.",
    hi: "ठीक कर दिया गया — कृपया देख लें और कुछ बाकी हो तो बताएँ।",
    zh: "已解决，请查看，如仍有问题请告知我们。",
    it: "Risolto — controlla e dicci se qualcosa non va ancora.",
    es: "Resuelto — compruébalo y dinos si algo sigue mal.",
  },
};
