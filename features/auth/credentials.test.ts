import { describe, expect, it } from "vitest";

import { checkSignIn, checkSignUp, displayName } from "./credentials";

const valid = {
  name: "Nino Tsereteli",
  hotel: "Batumi Palace",
  email: "nino@batumipalace.ge",
  password: "seaside2025",
};

describe("checkSignIn", () => {
  it("passes a valid email and password", () => {
    expect(checkSignIn(valid)).toEqual({});
  });

  it("rejects a malformed email", () => {
    expect(checkSignIn({ ...valid, email: "nino@" }).email).toBeDefined();
  });

  it("rejects a short password", () => {
    expect(checkSignIn({ ...valid, password: "sea" }).password).toBeDefined();
  });

  it("reports every bad field at once", () => {
    expect(checkSignIn({ email: "", password: "" })).toEqual({
      email: expect.any(String),
      password: expect.any(String),
    });
  });
});

describe("checkSignUp", () => {
  it("passes a complete form", () => {
    expect(checkSignUp(valid)).toEqual({});
  });

  it("rejects a blank hotel name", () => {
    expect(checkSignUp({ ...valid, hotel: "   " }).hotel).toBeDefined();
  });
});

describe("displayName", () => {
  it("splits the local part on separators", () => {
    expect(displayName("nino.tsereteli@batumipalace.ge")).toBe(
      "Nino Tsereteli",
    );
  });

  it("keeps a single-word local part", () => {
    expect(displayName("nino@batumipalace.ge")).toBe("Nino");
  });

  it("falls back to the email when the local part is only separators", () => {
    expect(displayName("-@example.com")).toBe("-@example.com");
  });
});
