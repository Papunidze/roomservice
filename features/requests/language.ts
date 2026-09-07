import { DICTIONARY, isRtlText, type LangCode } from "@/shared/i18n";

import type { GuestLanguage, Message } from "./types";

export function guestLanguage(code: LangCode): GuestLanguage {
  const phrases = DICTIONARY[code];
  return {
    name: phrases.name,
    native: phrases.native,
    code: phrases.code,
    dir: phrases.dir,
    base: code,
  };
}

export function customGuestLanguage(name: string): GuestLanguage {
  return {
    name,
    native: name,
    code: "XX",
    dir: isRtlText(name) ? "rtl" : "ltr",
    base: "en",
  };
}

export interface ResolvedText {
  text: string;
  lang: LangCode;
}

export function resolveText(message: Message, lang: LangCode): ResolvedText {
  if (message.lang === lang) return { text: message.text, lang };

  const translated = message.translations[lang];
  if (translated) return { text: translated, lang };

  const english = message.translations.en;
  if (english) return { text: english, lang: "en" };

  return { text: message.text, lang: message.lang };
}

export function translateAll(build: (lang: LangCode) => string) {
  const out: Partial<Record<LangCode, string>> = {};
  for (const code of Object.keys(DICTIONARY) as LangCode[]) {
    out[code] = build(code);
  }
  return out;
}
