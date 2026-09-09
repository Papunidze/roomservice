export const SECTIONS = [
  { key: "profile", label: "Hotel profile" },
  { key: "info", label: "Guest info page" },
  { key: "categories", label: "Categories & chips" },
  { key: "notifications", label: "Notifications" },
  { key: "sessions", label: "Sessions" },
  { key: "security", label: "Security" },
  { key: "billing", label: "Billing" },
] as const;

export type Section = (typeof SECTIONS)[number]["key"];

export const isSection = (value: unknown): value is Section =>
  SECTIONS.some((item) => item.key === value);
