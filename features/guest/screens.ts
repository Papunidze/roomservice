export const GUEST_SCREENS = [
  "language",
  "home",
  "problem",
  "items",
  "service",
  "checkout",
  "info",
  "success",
  "track",
] as const;

export type GuestScreen = (typeof GUEST_SCREENS)[number];
