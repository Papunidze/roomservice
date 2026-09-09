import {
  itemLabel,
  URGENT_PROBLEMS,
  translateAll,
  type CheckoutOption,
  type Dish,
  type GuestLanguage,
  type MenuItem,
  type ProblemKey,
  type Request,
} from "@/features/requests";
import { DICTIONARY, type LangCode } from "@/shared/i18n";
import { formatGel } from "@/shared/lib/money";

export interface ItemPick {
  item: MenuItem;
  count: number;
}

type Draft = Omit<Request, "id">;

interface Base {
  room: string;
  language: GuestLanguage;
}

interface DraftInput {
  category: Request["category"];
  urgency: Request["urgency"];
  build: (lang: LangCode) => string;
  photo?: boolean;
  freeText?: boolean;
}

function draft(
  { room, language }: Base,
  { category, urgency, build, photo, freeText }: DraftInput,
): Draft {
  const translations = translateAll(build);
  return {
    room,
    category,
    urgency,
    language,
    status: "new",
    minutesAgo: 0,
    assignee: "Unassigned",
    thread: [
      {
        from: "guest",
        lang: language.base,
        text: build(language.base),
        translations,
        photo: photo ?? false,
        freeText: freeText ?? false,
        minutesAgo: 0,
      },
    ],
  };
}

export function problemRequest(
  base: Base,
  input: { keys: ProblemKey[]; note: string; photo: boolean },
) {
  const urgent = input.keys.some((key) => URGENT_PROBLEMS.includes(key));
  return draft(base, {
    category: input.keys[0] ?? "other",
    urgency: urgent ? "high" : "medium",
    photo: input.photo,
    freeText: input.note.trim().length > 0,
    build: (lang) => {
      const phrases = DICTIONARY[lang];
      const chips =
        input.keys.map((key) => phrases[key]).join(", ") || phrases.other;
      return input.note ? `${chips} — ${input.note}` : chips;
    },
  });
}

export function itemsRequest(base: Base, picks: ItemPick[]) {
  return draft(base, {
    category: "items",
    urgency: "low",
    build: (lang) =>
      picks
        .map((pick) => `${itemLabel(pick.item, lang)} ×${pick.count}`)
        .join(", "),
  });
}

export function serviceRequest(base: Base, dish: Dish) {
  return draft(base, {
    category: "service",
    urgency: "medium",
    build: () => `${dish.name} — ${formatGel(dish.priceTetri)}`,
  });
}

export function checkoutRequest(base: Base, option: CheckoutOption) {
  return draft(base, {
    category: "checkout",
    urgency: "low",
    build: (lang) => `${DICTIONARY[lang].checkoutTitle} — ${option.time}`,
  });
}
