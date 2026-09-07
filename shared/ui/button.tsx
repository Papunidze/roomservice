import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-primary hover:bg-primary-strong",
        ink: "bg-foreground text-white hover:bg-ink-soft",
        soft: "rounded-panel bg-secondary text-ink-soft hover:bg-accent hover:text-accent-foreground",
        outline:
          "rounded-xl border border-input bg-white text-label hover:border-primary/40 hover:text-foreground",
        ghost: "text-label hover:bg-accent hover:text-accent-foreground",
        destructive: "text-destructive hover:bg-destructive/8",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-[13px]",
        pill: "h-8 px-4 text-xs",
        block: "h-12 w-full px-5 text-[13.5px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
