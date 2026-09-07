import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const VARIANT = {
  primary: "bg-sage text-paper disabled:bg-disabled disabled:text-ghost",
  dark: "bg-ink text-paper disabled:bg-disabled disabled:text-ghost",
  ghost:
    "border border-line-strong text-muted hover:border-ink/30 hover:text-ink",
} as const;

interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANT;
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium whitespace-nowrap transition-colors disabled:cursor-default",
        VARIANT[variant],
        className,
      )}
    />
  );
}
