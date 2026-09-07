import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-label",
        assistant: "bg-primary/10 text-primary-strong",
        success: "bg-success-bg text-success-ink",
        warning: "bg-warning-bg text-warning-ink",
        onDark: "bg-white/20 text-white",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
