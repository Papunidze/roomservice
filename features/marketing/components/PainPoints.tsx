import { ka } from "@/shared/i18n/ka";
import { Card } from "@/shared/ui/card";

import { SectionHeading } from "./SectionHeading";

export function PainPoints() {
  return (
    <section className="py-11 md:py-18">
      <SectionHeading
        eyebrow={ka.marketing.pains.eyebrow}
        title={ka.marketing.pains.title}
      />
      <div className="mt-7.5 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {ka.marketing.pains.items.map((item) => (
          <Card key={item.title} className="hover-lift px-7 py-6.5">
            <div className="text-gradient text-[46px] leading-none font-extrabold tracking-[-0.04em]">
              {item.stat}
            </div>
            <div className="mt-4 text-[17px] font-bold">{item.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-label">
              {item.text}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
