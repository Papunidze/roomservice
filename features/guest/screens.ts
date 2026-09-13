export const GUEST_SCREENS = [
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
