import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

const avatarVariants = cva(
  "grid shrink-0 place-items-center rounded-full font-bold",
  {
    variants: {
      tone: {
        violet: "bg-tone-violet text-tone-violet-ink",
        green: "bg-tone-green text-tone-green-ink",
        amber: "bg-tone-amber text-tone-amber-ink",
        blue: "bg-tone-blue text-tone-blue-ink",
        slate: "bg-tone-slate text-tone-slate-ink",
        pink: "bg-tone-pink text-tone-pink-ink",
      },
      size: {
        sm: "size-8 text-[13px]",
        default: "size-9 text-[13px]",
        lg: "size-13 text-[15px]",
      },
    },
    defaultVariants: {
      tone: "violet",
      size: "default",
    },
  },
);

const TONES = ["violet", "green", "amber", "blue", "slate", "pink"] as const;

export function toneFor(seed: string) {
  let sum = 0;
  for (const char of seed) sum += char.codePointAt(0) ?? 0;
  return TONES[sum % TONES.length];
}

interface AvatarProps
  extends React.ComponentProps<"span">, VariantProps<typeof avatarVariants> {
  name: string;
}

export function Avatar({ name, tone, size, className, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      aria-hidden
      className={cn(
        avatarVariants({ tone: tone ?? toneFor(name), size }),
        className,
      )}
      {...props}
    >
      {[...name][0]}
    </span>
  );
}
