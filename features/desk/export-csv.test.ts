import { describe, expect, it } from "vitest";

import { guestLanguage, type Request } from "@/features/requests";

import { requestsToCsv } from "./export-csv";

const request: Request = {
  id: 7,
  room: "205",
  category: "ac",
  urgency: "high",
  language: guestLanguage("ar"),
  status: "new",
  minutesAgo: 3,
  assignee: "Unassigned",
  createdAt: "2026-09-09T10:00:00.000Z",
  thread: [
    {
      from: "guest",
      lang: "ar",
      text: "المكيف",
      translations: { en: 'AC is "loud"' },
      minutesAgo: 3,
    },
  ],
};

describe("requestsToCsv", () => {
  it("writes a header and one row per request with quotes escaped", () => {
    const [header, row] = requestsToCsv([request]).split("\n");
    expect(header).toContain('"id","room","category"');
    expect(row).toBe(
      '"7","205","ac","high","new","Unassigned","Arabic","2026-09-09T10:00:00.000Z","AC is ""loud"""',
    );
  });
});
