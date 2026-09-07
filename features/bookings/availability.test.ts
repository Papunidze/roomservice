import { describe, expect, it } from "vitest";
import { generateSlots, overlaps } from "./availability";

const at = (iso: string) => new Date(iso);
const range = (start: string, end: string) => ({
  start: at(start),
  end: at(end),
});

describe("overlaps", () => {
  it("is true when ranges intersect", () => {
    expect(
      overlaps(
        range("2026-09-01T10:00:00Z", "2026-09-01T11:00:00Z"),
        range("2026-09-01T10:30:00Z", "2026-09-01T11:30:00Z"),
      ),
    ).toBe(true);
  });

  it("is false when ranges only touch at the boundary", () => {
    expect(
      overlaps(
        range("2026-09-01T10:00:00Z", "2026-09-01T11:00:00Z"),
        range("2026-09-01T11:00:00Z", "2026-09-01T12:00:00Z"),
      ),
    ).toBe(false);
  });
});

describe("generateSlots", () => {
  it("returns every slot that fits when nothing is busy", () => {
    const slots = generateSlots({
      window: range("2026-09-01T09:00:00Z", "2026-09-01T10:00:00Z"),
      durationMinutes: 30,
      stepMinutes: 30,
      busy: [],
    });

    expect(slots.map((slot) => slot.start.toISOString())).toEqual([
      "2026-09-01T09:00:00.000Z",
      "2026-09-01T09:30:00.000Z",
    ]);
  });

  it("drops slots that collide with a booking", () => {
    const slots = generateSlots({
      window: range("2026-09-01T09:00:00Z", "2026-09-01T11:00:00Z"),
      durationMinutes: 60,
      stepMinutes: 60,
      busy: [range("2026-09-01T09:30:00Z", "2026-09-01T10:00:00Z")],
    });

    expect(slots.map((slot) => slot.start.toISOString())).toEqual([
      "2026-09-01T10:00:00.000Z",
    ]);
  });

  it("returns nothing when the window is shorter than the service", () => {
    const slots = generateSlots({
      window: range("2026-09-01T09:00:00Z", "2026-09-01T09:20:00Z"),
      durationMinutes: 30,
      stepMinutes: 15,
      busy: [],
    });

    expect(slots).toEqual([]);
  });
});
