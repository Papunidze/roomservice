"use client";

import { useEffect } from "react";

import type { Phrases } from "@/shared/i18n";

const HOLD_MS = 1900;

interface SuccessScreenProps {
  phrases: Phrases;
  onDone: () => void;
}

export function SuccessScreen({ phrases, onDone }: SuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, HOLD_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="animate-fade flex min-h-dvh flex-col items-center justify-center px-6.5 text-center">
      <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="var(--sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          className="animate-draw-ring [stroke-dasharray:176]"
        />
        <path
          d="M21 33l7.5 7.5L43 25.5"
          stroke="var(--sage)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-tick [stroke-dasharray:34]"
        />
      </svg>
      <div className="mt-6.5 text-2xl font-semibold tracking-[-0.025em]">
        {phrases.successTitle}
      </div>
      <div className="mt-2 max-w-[250px] text-[14.5px] leading-relaxed text-muted">
        {phrases.successSub}
      </div>
    </div>
  );
}
