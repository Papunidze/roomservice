"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LANGUAGES } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { SegmentedOption } from "@/shared/ui";

import { Section } from "./Section";

type Billing = "monthly" | "yearly";

interface Plan {
  name: string;
  tag?: string;
  sub: string;
  cents: Record<Billing, number>;
  features: string[];
  isDark: boolean;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatUsd = (cents: number) => usd.format(cents / 100);

const PLANS: Plan[] = [
  {
    name: "Standard",
    sub: "Independent hotels up to 100 rooms",
    cents: { monthly: 4900, yearly: 49000 },
    features: [
      "Up to 100 rooms",
      `Guest page in ${LANGUAGES.length} languages`,
      "Front desk inbox with quick replies",
      "Printable QR plates",
      "Up to 5 staff accounts",
      "Email support",
    ],
    isDark: false,
  },
  {
    name: "Pro",
    tag: "Most popular",
    sub: "Teams and hotels up to 250 rooms",
    cents: { monthly: 12900, yearly: 129000 },
    features: [
      "Everything in Standard",
      "Up to 250 rooms",
      "Unlimited staff accounts",
      "Roles, routing rules and escalation",
      "Analytics",
      "Priority support in Georgian",
    ],
    isDark: true,
  },
  {
    name: "Enterprise",
    sub: "Chains and resorts above 250 rooms",
    cents: { monthly: 29900, yearly: 299000 },
    features: [
      "Everything in Pro",
      "Unlimited rooms",
      "Several properties in one account",
      "Onboarding visit in Batumi or Tbilisi",
      "Dedicated account manager",
    ],
    isDark: false,
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="One flat price. Pick the plan that fits your hotel."
      aside={<BillingSwitch billing={billing} onChange={setBilling} />}
    >
      <div className="grid gap-3.5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} billing={billing} />
        ))}
      </div>
      <p className="mt-4.5 text-[13.5px] text-muted">
        Prices in USD. 30-day trial on every plan, no card. Card or bank
        transfer, invoiced monthly or once a year.
      </p>
    </Section>
  );
}

interface BillingSwitchProps {
  billing: Billing;
  onChange: (billing: Billing) => void;
}

function BillingSwitch({ billing, onChange }: BillingSwitchProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-0.5 rounded-full bg-ink/5 p-0.75">
        <SegmentedOption
          active={billing === "monthly"}
          onClick={() => onChange("monthly")}
          className="min-h-8.5 px-4 text-[12.5px]"
        >
          Monthly
        </SegmentedOption>
        <SegmentedOption
          active={billing === "yearly"}
          onClick={() => onChange("yearly")}
          className="min-h-8.5 px-4 text-[12.5px]"
        >
          Yearly
        </SegmentedOption>
      </div>
      <span className="rounded-full bg-sage/10 px-2.5 py-1 text-[12px] font-medium text-sage-deep">
        2 months free on yearly
      </span>
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const subtle = plan.isDark ? "text-paper/65" : "text-muted";

  return (
    <div
      className={cn(
        "flex flex-col rounded-card px-7 pt-7 pb-7.5",
        plan.isDark ? "bg-ink text-paper" : "border border-line bg-surface",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[20px] font-semibold tracking-[-0.02em]">
          {plan.name}
        </span>
        {plan.tag ? (
          <span className="rounded-full bg-sand/22 px-2.5 py-1 text-[12px] font-medium text-sand">
            {plan.tag}
          </span>
        ) : null}
      </div>
      <p className={cn("mt-1 text-[14px]", subtle)}>{plan.sub}</p>

      <Price plan={plan} billing={billing} subtle={subtle} />

      <ul className="mt-6.5 mb-auto flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[14px]">
            <Check strokeWidth={2} className="size-3.5 shrink-0 text-sage" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/sign-up"
        className={cn(
          "mt-7 inline-flex min-h-12.5 w-full items-center justify-center self-end rounded-full text-[15px] font-medium transition-colors",
          plan.isDark
            ? "bg-sage text-paper"
            : "border border-line-strong hover:border-ink",
        )}
      >
        Start free trial
      </Link>
    </div>
  );
}

interface PriceProps {
  plan: Plan;
  billing: Billing;
  subtle: string;
}

function Price({ plan, billing, subtle }: PriceProps) {
  const perMonth =
    billing === "yearly" ? plan.cents.yearly / 12 : plan.cents.monthly;
  const note =
    billing === "yearly"
      ? `${formatUsd(plan.cents.yearly)} billed yearly`
      : "billed monthly";

  return (
    <div className="mt-6.5">
      <div className="flex items-baseline gap-2">
        <span className="text-[44px] font-semibold tracking-[-0.035em]">
          {formatUsd(perMonth)}
        </span>
        <span className={cn("text-[14px]", subtle)}>/ month</span>
      </div>
      <p className={cn("mt-1 text-[13px]", subtle)}>{note}</p>
    </div>
  );
}
