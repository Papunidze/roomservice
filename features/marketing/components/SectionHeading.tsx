import { cn } from "@/shared/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  accent?: string;
  isCentered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  isCentered,
}: SectionHeadingProps) {
  return (
    <div className={cn(isCentered && "mx-auto max-w-190 text-center")}>
      <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3.5 py-1.5 text-[11.5px] font-bold tracking-[0.14em] text-primary-strong uppercase backdrop-blur-[14px]">
        <span className="size-1.5 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h2
        className={cn(
          "text-[30px] leading-[1.1] font-extrabold tracking-[-0.035em] text-balance md:text-[42px]",
          !isCentered && "max-w-190",
        )}
      >
        {title}
        {accent && <span className="text-gradient"> {accent}</span>}
      </h2>
    </div>
  );
}
