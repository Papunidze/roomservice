"use client";

interface ScreenHeaderProps {
  backLabel: string;
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export function ScreenHeader({
  backLabel,
  title,
  subtitle,
  onBack,
}: ScreenHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 cursor-pointer items-center gap-2 px-0.5 text-sm font-medium text-muted"
      >
        <span className="inline-block text-base rtl:scale-x-[-1]">←</span>
        <span>{backLabel}</span>
      </button>
      <h2 className="mt-4 mb-2 text-[27px] font-semibold tracking-[-0.025em]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mb-6 text-[14.5px] leading-relaxed text-muted">
          {subtitle}
        </p>
      ) : null}
    </>
  );
}
