"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";
import { Card } from "@/shared/ui/card";

import { SectionHeading } from "./SectionHeading";

const TAB_IDS = ["salon", "dental", "auto", "cafe"] as const;

type IndustryId = (typeof TAB_IDS)[number];

export function Industries() {
  const [active, setActive] = useState<IndustryId>("salon");
  const copy = ka.marketing.industries;
  const industry = copy[active];

  return (
    <section className="py-11 md:py-18">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />

      <div className="my-6 flex w-fit flex-wrap gap-1.5 rounded-full border border-white/90 bg-white/66 p-1.25 backdrop-blur-[14px]">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={cn(
              "cursor-pointer rounded-full px-5 py-2.75 text-[13.5px] font-bold whitespace-nowrap transition-colors",
              active === id
                ? "bg-linear-140 from-primary-light to-primary text-white shadow-nav"
                : "text-label hover:text-primary-strong",
            )}
          >
            {copy.tabs[id]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card className="rounded-[26px] px-8 py-7.5">
          <div className="text-[22px] font-bold tracking-[-0.02em]">
            {industry.title}
          </div>
          <div className="mt-2.5 text-[14.5px] leading-relaxed text-label">
            {industry.text}
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            {industry.points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-2.5 text-sm leading-normal text-ink-soft"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-linear-140 from-primary-light to-primary text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[26px] px-7 py-6.5">
          <div className="mb-3.5 text-[13px] font-bold text-muted-foreground">
            {copy.servicesLabel}
          </div>
          {industry.services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between gap-3 border-t border-black/5 py-3.25"
            >
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold">{service.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {service.duration}
                </div>
              </div>
              <div className="text-[15px] font-bold whitespace-nowrap">
                {formatGel(service.priceTetri)}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
