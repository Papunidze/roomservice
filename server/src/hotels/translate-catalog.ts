import { hotels } from "../db.js";
import { LANGUAGES, type LangCode } from "../domain.js";
import { publish } from "../lib/events.js";
import { isTranslationEnabled, translate } from "../lib/translate.js";
import type { HotelDoc, Translations } from "./types.js";

interface Entry {
  path: string;
  text: string;
  translations: Translations;
}

function missingFor(entry: Entry, wanted: LangCode[]) {
  return wanted.filter((code) => !entry.translations[code]);
}

export function translateCatalogInBackground(hotel: HotelDoc) {
  if (!isTranslationEnabled()) return;
  const wanted = LANGUAGES.filter(
    (code) => hotel.settings.guestLanguages[code],
  );
  const source = hotel.settings.infoSourceLang;

  const entries: Entry[] = [
    ...hotel.settings.items.map((item, index) => ({
      path: `settings.items.${index}.translations`,
      text: item.label,
      translations: item.translations,
    })),
    ...hotel.settings.service.dishes.map((dish, index) => ({
      path: `settings.service.dishes.${index}.translations`,
      text: dish.name,
      translations: dish.translations,
    })),
  ].filter(
    (entry) => entry.text.trim() && missingFor(entry, wanted).length > 0,
  );
  if (entries.length === 0) return;

  void (async () => {
    const $set: Record<string, Translations> = {};
    for (const entry of entries) {
      const fresh = await translate(
        entry.text,
        source,
        missingFor(entry, wanted),
      );
      $set[entry.path] = {
        ...entry.translations,
        ...fresh,
        [source]: entry.text,
      };
    }
    await hotels().updateOne({ _id: hotel._id }, { $set });
    publish(hotel._id.toHexString(), { type: "settings" });
  })().catch((error: unknown) => console.error("[translate-catalog]", error));
}
