"use client";

import { PLAN_LABEL, useBilling, type Plan } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const PLANS: { plan: Plan; cents: number; rooms: string; note: string }[] = [
  {
    plan: "standard",
    cents: 4900,
    rooms: "up to 100 rooms",
    note: "5 staff accounts",
  },
  {
    plan: "pro",
    cents: 12900,
    rooms: "up to 250 rooms",
    note: "Unlimited staff, analytics",
  },
  {
    plan: "enterprise",
    cents: 29900,
    rooms: "unlimited rooms",
    note: "Several properties, account manager",
  },
];

const date = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function BillingPanel() {
  const billing = useBilling();
  if (!billing) return null;

  const statusLine =
    billing.status === "trial"
      ? `Free trial · ends ${date.format(new Date(billing.trialEndsAt))} (${billing.daysLeft} day${billing.daysLeft === 1 ? "" : "s"} left)`
      : billing.status === "expired"
        ? "Plan ended · the console is read-only until it is renewed"
        : billing.paidUntil
          ? `Paid until ${date.format(new Date(billing.paidUntil))}`
          : "Active";

  return (
    <div className="animate-rise max-w-215">
      <PanelHeading
        title="Billing"
        subtitle="One flat monthly price per hotel, invoiced in USD by card or bank transfer."
      />

      <div className="mt-5.5 rounded-card bg-ink px-6.5 py-6 text-paper">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-[0.14em] text-paper/50">
            CURRENT PLAN
          </span>
          <span
            className={cn(
              "ml-auto rounded-full px-2.5 py-1 text-xs font-medium",
              billing.status === "expired"
                ? "bg-urgent text-paper"
                : "bg-sand/22 text-sand",
            )}
          >
            {statusLine}
          </span>
        </div>
        <div className="mt-3.5 text-[28px] font-semibold tracking-[-0.03em]">
          {PLAN_LABEL[billing.plan]}
        </div>
        <div className="mt-1 text-[13.5px] text-paper/65">
          {billing.rooms} room{billing.rooms === 1 ? "" : "s"} · all languages ·
          every feature during the trial
        </div>
      </div>

      <div className="mt-3.5 grid gap-3.5 md:grid-cols-3">
        {PLANS.map((option) => (
          <div
            key={option.plan}
            className={cn(
              PANEL_CARD,
              "px-5.5 py-5",
              option.plan === billing.plan && "border-sage",
            )}
          >
            <div className="text-[17px] font-semibold tracking-[-0.02em]">
              {PLAN_LABEL[option.plan]}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[28px] font-semibold tracking-[-0.03em]">
                {usd.format(option.cents / 100)}
              </span>
              <span className="text-[12.5px] text-faint">/ month</span>
            </div>
            <div className="mt-1.5 text-[13px] text-muted">{option.rooms}</div>
            <div className="text-[12.5px] text-faint">{option.note}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[16px] bg-sand/28 px-5 py-4 text-[13px] leading-relaxed text-soft">
        To start or change a plan, write to{" "}
        <a
          href="mailto:hello@roomcall.ge"
          className="underline underline-offset-3"
        >
          hello@roomcall.ge
        </a>{" "}
        with your hotel name. We send an invoice, and your plan is switched on
        the same day the payment arrives. Yearly plans get two months free.
      </p>
    </div>
  );
}
