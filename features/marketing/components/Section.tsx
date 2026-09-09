import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, aside, children }: SectionProps) {
  return (
    <section className="pt-20 md:pt-24">
      <div id={id} className="scroll-mt-24">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-faint uppercase">
          {eyebrow}
        </span>
        <div className="mt-3.5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[620px] text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty md:text-[38px]">
            {title}
          </h2>
          {aside}
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
