"use client";

interface PrimaryActionProps {
  label: string;
  enabled: boolean;
  onClick: () => void;
}

export function PrimaryAction({ label, enabled, onClick }: PrimaryActionProps) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className="mt-6.5 min-h-[58px] w-full cursor-pointer rounded-full bg-sage text-base font-medium tracking-[-0.01em] text-paper transition-colors duration-200 disabled:cursor-default disabled:bg-disabled disabled:text-ghost"
    >
      {label}
    </button>
  );
}
