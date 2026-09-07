import { describe, expect, it } from "vitest";

import { customGuestLanguage, guestLanguage } from "@/features/requests";

import {
  checkoutRequest,
  itemsRequest,
  problemRequest,
  serviceRequest,
} from "./build-request";

const arabicGuest = { room: "205", language: guestLanguage("ar") };

describe("problemRequest", () => {
  it("uses the first picked chip as the category", () => {
    const request = problemRequest(arabicGuest, {
      keys: ["wifi", "noise"],
      note: "",
      photo: false,
    });

    expect(request.category).toBe("wifi");
  });

  it("falls back to other when nothing is picked", () => {
    const request = problemRequest(arabicGuest, {
      keys: [],
      note: "المكيف",
      photo: false,
    });

    expect(request.category).toBe("other");
  });

  it("marks AC and hot water as high urgency", () => {
    expect(
      problemRequest(arabicGuest, { keys: ["ac"], note: "", photo: false })
        .urgency,
    ).toBe("high");
    expect(
      problemRequest(arabicGuest, { keys: ["water"], note: "", photo: false })
        .urgency,
    ).toBe("high");
    expect(
      problemRequest(arabicGuest, { keys: ["tv"], note: "", photo: false })
        .urgency,
    ).toBe("medium");
  });

  it("translates the chips into every language and appends the note verbatim", () => {
    const [message] = problemRequest(arabicGuest, {
      keys: ["ac"],
      note: "very hot",
      photo: true,
    }).thread;

    expect(message?.text).toBe("التكييف — very hot");
    expect(message?.translations.en).toBe("AC — very hot");
    expect(message?.translations.ka).toBe("კონდიციონერი — very hot");
    expect(message?.photo).toBe(true);
  });

  it("writes the guest message in the guest language", () => {
    const [message] = problemRequest(
      { room: "205", language: guestLanguage("tr") },
      { keys: ["noise"], note: "", photo: false },
    ).thread;

    expect(message?.lang).toBe("tr");
    expect(message?.text).toBe("Gürültü");
  });
});

describe("itemsRequest", () => {
  it("lists only items with a positive count", () => {
    const [message] = itemsRequest(arabicGuest, {
      towels: 2,
      pillow: 0,
      iron: 1,
    }).thread;

    expect(message?.translations.en).toBe("Towels ×2, Iron ×1");
    expect(message?.translations.ru).toBe("Полотенца ×2, Утюг ×1");
  });

  it("is always a low-urgency item request", () => {
    const request = itemsRequest(arabicGuest, { towels: 1 });

    expect(request.category).toBe("items");
    expect(request.urgency).toBe("low");
  });
});

describe("serviceRequest", () => {
  it("keeps the dish name and price identical across languages", () => {
    const [message] = serviceRequest(arabicGuest, {
      key: "soup",
      name: "Chicken soup",
      note: "Served hot",
      priceTetri: 1500,
    }).thread;

    expect(message?.translations.en).toBe("Chicken soup — 15 ₾");
    expect(message?.translations.ar).toBe("Chicken soup — 15 ₾");
  });
});

describe("checkoutRequest", () => {
  it("translates the label and keeps the time", () => {
    const [message] = checkoutRequest(arabicGuest, {
      time: "14:00",
      surchargeTetri: 2500,
    }).thread;

    expect(message?.translations.en).toBe("Late checkout — 14:00");
    expect(message?.translations.tr).toBe("Geç çıkış — 14:00");
  });
});

describe("custom languages", () => {
  it("falls back to English text and detects RTL scripts", () => {
    const language = customGuestLanguage("فارسی");
    const [message] = problemRequest(
      { room: "205", language },
      { keys: ["tv"], note: "", photo: false },
    ).thread;

    expect(language.dir).toBe("rtl");
    expect(language.code).toBe("XX");
    expect(message?.lang).toBe("en");
    expect(message?.text).toBe("TV");
  });
});
