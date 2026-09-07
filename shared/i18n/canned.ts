import type { LangCode } from "./dictionary";

export const CANNED_KEYS = ["ack", "fixed", "wait"] as const;

export type CannedKey = (typeof CANNED_KEYS)[number];

export const CANNED: Record<CannedKey, Record<LangCode, string>> = {
  ack: {
    en: "On our way — someone will be with you in about 15 minutes.",
    ar: "نحن في الطريق — سيصل أحد الموظفين خلال 15 دقيقة تقريباً.",
    ru: "Уже идём — сотрудник будет у вас примерно через 15 минут.",
    tr: "Yola çıktık — biri yaklaşık 15 dakika içinde sizde olacak.",
    ka: "უკვე მოვდივართ — თანამშრომელი 15 წუთში იქნება.",
  },
  fixed: {
    en: "Fixed, please check. Tell us if anything is still not right.",
    ar: "تم الإصلاح، تفضل بالتحقق. أخبرنا إن بقي شيء.",
    ru: "Исправлено, проверьте, пожалуйста. Напишите, если что-то не так.",
    tr: "Düzeltildi, kontrol edebilir misiniz. Bir sorun varsa yazın.",
    ka: "გამოსწორებულია, გთხოვთ შეამოწმოთ.",
  },
  wait: {
    en: "Sorry for the wait — housekeeping is finishing another room and comes next.",
    ar: "نعتذر عن التأخير — التدبير المنزلي ينهي غرفة أخرى ثم يأتي إليك.",
    ru: "Извините за ожидание — горничная заканчивает другой номер и придёт следом.",
    tr: "Beklettiğimiz için üzgünüz — kat görevlisi başka bir odayı bitirip geliyor.",
    ka: "ბოდიშს გიხდით ლოდინისთვის — დამლაგებელი მალე მოვა.",
  },
};
