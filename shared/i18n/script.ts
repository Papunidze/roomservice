import type { LangCode } from "./dictionary";

const SCRIPT_FONT: Record<LangCode, string> = {
  ar: "font-arabic",
  fa: "font-arabic",
  he: "font-hebrew",
  hi: "font-devanagari",
  zh: "font-cjk",
  ka: "font-georgian",
  ru: "font-sans",
  uk: "font-sans",
  tr: "font-sans",
  en: "font-sans",
  de: "font-sans",
  fr: "font-sans",
  it: "font-sans",
  es: "font-sans",
  pl: "font-sans",
  pt: "font-sans",
};

export function scriptFont(lang: LangCode) {
  return SCRIPT_FONT[lang];
}
