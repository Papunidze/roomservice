import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  type Category,
} from "@/features/requests";

import { Section } from "./Section";

const KINDS = [
  { category: "ac", note: "Urgent by default" },
  { category: "water", note: "Urgent by default" },
  { category: "wifi", note: "Password is on the info screen too" },
  { category: "tv", note: "Goes to maintenance" },
  { category: "noise", note: "Goes to the front desk" },
  { category: "cleaning", note: "Goes to housekeeping" },
  { category: "items", note: "Towels, pillow, iron, slippers, water, kit" },
  { category: "service", note: "Menu with prices in ₾" },
  { category: "checkout", note: "13:00 free, later for a surcharge" },
  { category: "info", note: "WiFi, breakfast, spa, house rules" },
] as const satisfies readonly { category: Category; note: string }[];

export function RequestKinds() {
  return (
    <Section
      id="requests"
      eyebrow="What a guest can send"
      title="Ten kinds of request, all of them a tap."
      lead="Every category can be switched off, re-prioritised or routed to a different role in Settings — so the guest only ever sees what your property actually offers."
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {KINDS.map((kind) => {
          const Icon = CATEGORY_ICON[kind.category];
          return (
            <div
              key={kind.category}
              className="flex items-start gap-3.5 rounded-tile border border-line-strong px-4.5 py-4"
            >
              <Icon strokeWidth={1.4} className="mt-0.5 size-5 text-sage" />
              <div className="min-w-0">
                <div className="text-[14px] font-medium tracking-[-0.01em]">
                  {CATEGORY_LABEL[kind.category]}
                </div>
                <div className="mt-0.5 text-[12.5px] text-faint">
                  {kind.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
