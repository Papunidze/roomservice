export const ANNUAL_MONTHS_CHARGED = 10;

export const PLANS = [
  { id: "start", monthlyTetri: 9_900 },
  { id: "business", monthlyTetri: 24_900, isRecommended: true },
  { id: "pro", monthlyTetri: 39_900 },
] as const;

export function annualTotalTetri(monthlyTetri: number) {
  return monthlyTetri * ANNUAL_MONTHS_CHARGED;
}

export function annualMonthlyTetri(monthlyTetri: number) {
  return Math.round(annualTotalTetri(monthlyTetri) / 12);
}

export type PlanId = (typeof PLANS)[number]["id"];
