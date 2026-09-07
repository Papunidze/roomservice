import type { LangCode } from "./dictionary";

const SCRIPT_FONT: Record<LangCode, string> = {
  ar: "font-arabic",
  ka: "font-georgian",
  ru: "font-sans",
  tr: "font-sans",
  en: "font-sans",
};

const RTL_RANGE = /[\u0590-\u08ff]/;

export function scriptFont(lang: LangCode) {
  return SCRIPT_FONT[lang];
}

export function isRtlText(value: string) {
  return RTL_RANGE.test(value);
}
