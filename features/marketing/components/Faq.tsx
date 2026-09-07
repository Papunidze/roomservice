import { ka } from "@/shared/i18n/ka";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-11 md:py-18">
      <SectionHeading
        eyebrow={ka.marketing.faq.eyebrow}
        title={ka.marketing.faq.title}
      />
      <Accordion
        type="single"
        collapsible
        defaultValue="0"
        className="mt-7 max-w-215"
      >
        {ka.marketing.faq.items.map((item, index) => (
          <AccordionItem key={item.question} value={String(index)}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
