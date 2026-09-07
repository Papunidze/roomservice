import { describe, expect, it } from "vitest";

import { LANGUAGES } from "./dictionary";
import { matchesLanguage } from "./search";

const found = (query: string) =>
  LANGUAGES.filter((code) => matchesLanguage(code, query));

describe("matchesLanguage", () => {
  it("matches the language written in its own script", () => {
    expect(found("Русский")).toEqual(["ru"]);
    expect(found("עברית")).toEqual(["he"]);
    expect(found("中文")).toEqual(["zh"]);
  });

  it("matches the English name and the code", () => {
    expect(found("german")).toEqual(["de"]);
    expect(found("ka")).toEqual(["ka"]);
  });

  it("ignores diacritics so a plain keyboard still finds the language", () => {
    expect(found("espanol")).toEqual(["es"]);
    expect(found("portugues")).toEqual(["pt"]);
    expect(found("turkce")).toEqual(["tr"]);
  });

  it("matches on a prefix", () => {
    expect(found("ukr")).toEqual(["uk"]);
  });

  it("returns everything for an empty query", () => {
    expect(found("   ")).toHaveLength(LANGUAGES.length);
  });

  it("returns nothing when there is no match", () => {
    expect(found("klingon")).toEqual([]);
  });
});
