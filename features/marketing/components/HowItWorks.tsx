import { MessageSquare, Plus, Timer } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { Card } from "@/shared/ui/card";

import { SectionHeading } from "./SectionHeading";

const STEP_ICONS = { "01": Plus, "02": MessageSquare, "03": Timer } as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 py-11 md:py-18">
      <SectionHeading
        eyebrow={ka.marketing.steps.eyebrow}
        title={ka.marketing.steps.title}
      />
      <div className="mt-7.5 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(270px,1fr))]">
        {ka.marketing.steps.items.map((step) => {
          const Icon = STEP_ICONS[step.number];
          return (
            <Card key={step.number} className="hover-lift p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-linear-140 from-primary-light to-primary text-white shadow-[0_10px_22px_rgb(108_60_255/0.3)]">
                  <Icon className="size-5.5" strokeWidth={1.5} />
                </span>
                <span className="text-gradient text-[34px] font-extrabold tracking-[-0.03em] opacity-35">
                  {step.number}
                </span>
              </div>
              <div className="mt-4.5 text-[17px] font-bold">{step.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-label">
                {step.text}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
