import { MessagesSquare, QrCode, Smartphone } from "lucide-react";

import { Section } from "./Section";

const STEPS = [
  {
    icon: QrCode,
    title: "Print the plates",
    body: "Add your rooms in the console and print a QR plate for each. The code carries the room number, so guests never type it.",
  },
  {
    icon: Smartphone,
    title: "Guests scan and tap",
    body: "The page opens in the browser, offers the languages you enabled, then big chips for problems, items, room service and late checkout. A note and a photo if they want.",
  },
  {
    icon: MessagesSquare,
    title: "Staff answer in their own language",
    body: "The request lands in the inbox, routed to the right role and labelled with the guest's language. Reply once; the guest reads it in the language they picked.",
  },
];

export function FlowSteps() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Three steps. No training for guests, one afternoon for staff."
    >
      <ol className="grid gap-3.5 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-card border border-line bg-surface px-6.5 pt-6.5 pb-7"
          >
            <div className="flex items-center justify-between">
              <step.icon strokeWidth={1.4} className="size-6.5 text-sage" />
              <span className="font-mono text-[11px] tracking-[0.12em] text-ghost">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-7 text-[19px] font-semibold tracking-[-0.02em]">
              {step.title}
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-pretty text-soft">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
