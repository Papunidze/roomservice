import { DICTIONARY, type LangCode } from "./dictionary";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function matchesLanguage(code: LangCode, query: string) {
  const needle = fold(query);
  if (!needle) return true;

  const phrases = DICTIONARY[code];
  return [code, phrases.code, phrases.name, phrases.native, phrases.greet].some(
    (candidate) => fold(candidate).includes(needle),
  );
}
