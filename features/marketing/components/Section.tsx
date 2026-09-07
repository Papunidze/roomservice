import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 border-t border-line py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-[1120px] px-6">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-sage uppercase">
          {eyebrow}
        </span>
        <h2 className="mt-3 max-w-[620px] text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] text-balance md:text-[33px]">
          {title}
        </h2>
        {lead ? (
          <p className="mt-3.5 max-w-[580px] text-[15px] leading-relaxed text-muted">
            {lead}
          </p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
