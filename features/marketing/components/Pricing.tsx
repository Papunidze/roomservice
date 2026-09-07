"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

import { annualMonthlyTetri, annualTotalTetri, PLANS } from "../plans";
import { SectionHeading } from "./SectionHeading";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const copy = ka.marketing.pricing;

  return (
    <section id="pricing" className="scroll-mt-24 py-11 md:py-18">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />

      <div className="my-6.5 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "text-sm",
            isAnnual ? "font-semibold text-muted-foreground" : "font-bold",
          )}
        >
          {copy.monthly}
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          aria-label={copy.annual}
        />
        <span
          className={cn(
            "text-sm",
            isAnnual ? "font-bold" : "font-semibold text-muted-foreground",
          )}
        >
          {copy.annual}
        </span>
        <Badge variant="warning">{copy.annualBadge}</Badge>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-[repeat(auto-fit,minmax(272px,1fr))]">
        {PLANS.map((plan) => {
          const isRecommended = "isRecommended" in plan;
          const planCopy = copy.plans[plan.id];
          const price = isAnnual
            ? annualMonthlyTetri(plan.monthlyTetri)
            : plan.monthlyTetri;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-[26px] px-7 pt-6.5 pb-7.5",
                isRecommended
                  ? "bg-linear-150 from-primary-glow to-[#5024ce] text-white shadow-[0_28px_58px_rgb(108_60_255/0.36)] md:-translate-y-2.5"
                  : "glass-panel hover-lift",
              )}
            >
              {isRecommended && (
                <Badge variant="onDark" className="mb-3.5 text-[11.5px]">
                  {copy.recommended}
                </Badge>
              )}
              <div className="text-[15.5px] font-bold">{ka.plans[plan.id]}</div>
              <div
                className={cn(
                  "mt-1.25 min-h-8.5 text-[12.5px]",
                  isRecommended ? "text-white/78" : "text-muted-foreground",
                )}
              >
                {planCopy.tagline}
              </div>
              <div className="mt-4 mb-1 flex items-baseline gap-1.75">
                <div
                  className={cn(
                    "text-[46px] leading-none font-extrabold tracking-[-0.035em] whitespace-nowrap",
                    !isRecommended && "text-gradient",
                  )}
                >
                  {formatGel(price)}
                </div>
                <div
                  className={cn(
                    "text-[13px]",
                    isRecommended ? "text-white/75" : "text-muted-foreground",
                  )}
                >
                  {copy.per}
                </div>
              </div>
              <div
                className={cn(
                  "min-h-4.5 text-xs",
                  isRecommended ? "text-white/70" : "text-muted-foreground",
                )}
              >
                {isAnnual
                  ? `${copy.annualNotePrefix} ${formatGel(annualTotalTetri(plan.monthlyTetri))}`
                  : copy.monthlyNote}
              </div>

              <Button
                asChild
                size="block"
                className={cn(
                  "mt-5",
                  isRecommended &&
                    "bg-white text-[#4b25c4] shadow-[0_12px_24px_rgb(20_18_31/0.18)] hover:bg-white/90",
                )}
              >
                <Link href="/register">{planCopy.cta}</Link>
              </Button>

              <div className="mt-5 flex flex-col gap-2.5">
                {planCopy.features.map((feature) => (
                  <div
                    key={feature}
                    className={cn(
                      "flex items-start gap-2.5 text-[13.5px] leading-snug",
                      isRecommended ? "text-white/92" : "text-ink-soft",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full",
                        isRecommended
                          ? "bg-white/22 text-white"
                          : "bg-primary/12 text-primary-strong",
                      )}
                    >
                      <Check className="size-2.5" strokeWidth={3.5} />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
