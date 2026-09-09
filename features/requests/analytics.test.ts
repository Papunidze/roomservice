import { describe, expect, it } from "vitest";

import { deltaLabel, formatMinutes } from "./analytics";

describe("formatMinutes", () => {
  it("shows seconds under a minute", () => {
    expect(formatMinutes(0.5)).toBe("30s");
  });

  it("shows minutes and seconds under an hour", () => {
    expect(formatMinutes(3.67)).toBe("3m 40s");
    expect(formatMinutes(17)).toBe("17m");
  });

  it("shows hours above sixty minutes", () => {
    expect(formatMinutes(95)).toBe("1h 35m");
  });

  it("shows a dash when there is no figure", () => {
    expect(formatMinutes(null)).toBe("—");
  });
});

describe("deltaLabel", () => {
  it("needs both periods", () => {
    expect(deltaLabel(4, null, false)).toBe("no comparison yet");
  });

  it("counts whole tickets", () => {
    expect(deltaLabel(21, 18, false)).toBe("+3 vs period before");
    expect(deltaLabel(18, 21, false)).toBe("−3 vs period before · worse");
  });

  it("treats a faster response as better", () => {
    expect(deltaLabel(3, 4.5, true)).toBe("−1m 30s vs period before");
  });

  it("calls a tiny change unchanged", () => {
    expect(deltaLabel(4.01, 4, true)).toBe("same as the period before");
  });
});
