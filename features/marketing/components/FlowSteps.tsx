import { MessagesSquare, QrCode, SquareMousePointer } from "lucide-react";

import { Section } from "./Section";

const STEPS = [
  {
    icon: QrCode,
    title: "The guest scans the plate",
    body: "Each room has its own QR code with the room number baked in. It opens a page — nothing to install, nothing to sign up for. The first screen is a language picker that already suggests the phone's own language.",
  },
  {
    icon: SquareMousePointer,
    title: "They tap, they don't type",
    body: "Problems, items, room service, late checkout and hotel info are all built from lists. Because the guest chooses rather than writes, the desk receives a request that is already understood — and priced, where it costs something.",
  },
  {
    icon: MessagesSquare,
    title: "The desk answers in one language",
    body: "The request appears in the inbox in the staff language, grouped under its room, with a status and an assignee. A reply is written once; the guest reads it in the language they picked.",
  },
];

export function FlowSteps() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Three steps, and nobody has to share a language."
    >
      <ol className="grid gap-3.5 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-card border border-line-strong bg-paper p-6"
          >
            <div className="flex items-center justify-between">
              <step.icon strokeWidth={1.4} className="size-6 text-sage" />
              <span className="font-mono text-[11px] text-ghost">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-8 text-[17px] leading-tight font-semibold tracking-[-0.02em]">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
