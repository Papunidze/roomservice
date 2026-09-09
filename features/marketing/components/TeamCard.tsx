import { Check } from "lucide-react";

const POINTS = [
  "Original text and translation side by side",
  "Routing by category: AC → Maintenance, towels → Housekeeping",
  "Escalation when a request waits too long",
  "Internal notes the guest never sees",
];

export function TeamCard() {
  return (
    <div className="rounded-card border border-line bg-surface px-7.5 pt-7.5 pb-8">
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-faint uppercase">
        For the team
      </span>
      <p className="mt-5.5 text-[24px] leading-[1.15] font-semibold tracking-[-0.025em]">
        One inbox, roles, and rules that route each request to the right person.
      </p>
      <ul className="mt-5.5 flex flex-col">
        {POINTS.map((point) => (
          <li
            key={point}
            className="flex min-h-11.5 items-center gap-3 border-t border-line-soft text-[14.5px]"
          >
            <Check strokeWidth={2} className="size-3.5 shrink-0 text-sage" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
