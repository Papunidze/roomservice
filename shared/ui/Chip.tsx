import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

interface ChipProps extends ComponentProps<"button"> {
  active: boolean;
}

export function Chip({ active, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-8.5 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-medium whitespace-nowrap transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line-strong text-muted",
        className,
      )}
    />
  );
}

export function SegmentedOption({ active, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "min-h-7 cursor-pointer rounded-full px-3 font-mono text-[11px] font-medium transition-colors",
        active ? "bg-ink text-paper" : "text-muted",
        className,
      )}
    />
  );
}
