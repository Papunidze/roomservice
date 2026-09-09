import { describe, expect, it } from "vitest";

import {
  checkEmail,
  checkPassword,
  checkSignIn,
  checkSignUp,
} from "./credentials";

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

describe("checkEmail", () => {
  it("returns nothing for a valid email", () => {
    expect(checkEmail(valid.email)).toBeUndefined();
  });

  it("returns a message for a malformed email", () => {
    expect(checkEmail("nino@")).toEqual(expect.any(String));
  });
});

describe("checkPassword", () => {
  it("returns nothing for a long enough password", () => {
    expect(checkPassword(valid.password)).toBeUndefined();
  });

  it("returns a message for a short password", () => {
    expect(checkPassword("sea")).toEqual(expect.any(String));
  });
});
