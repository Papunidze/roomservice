import { UNASSIGNED } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

import { initials } from "../initials";

export function Avatar({ name }: { name: string }) {
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full font-mono text-[9.5px] tracking-wide",
        name === UNASSIGNED
          ? "border border-dashed border-line-dashed text-ghost"
          : "bg-sage/15 text-sage-deep",
      )}
    >
      {initials(name)}
    </span>
  );
}
