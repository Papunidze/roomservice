"use client";

import { useState } from "react";

import { CHECKOUT_OPTIONS, type CheckoutOption } from "@/features/requests";
import type { Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";

import { PrimaryAction } from "./PrimaryAction";
import { ScreenHeader } from "./ScreenHeader";

interface LateCheckoutScreenProps {
  phrases: Phrases;
  onBack: () => void;
  onSubmit: (option: CheckoutOption) => void;
}

export function LateCheckoutScreen({
  phrases,
  onBack,
  onSubmit,
}: LateCheckoutScreenProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const selected = CHECKOUT_OPTIONS.find(
    (option) => option.time === selectedTime,
  );

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.checkoutTitle}
        subtitle={phrases.checkoutSub}
        onBack={onBack}
      />

      <div className="flex flex-col gap-2.5">
        {CHECKOUT_OPTIONS.map((option) => {
          const on = option.time === selectedTime;
          return (
            <button
              key={option.time}
              type="button"
              onClick={() => setSelectedTime(option.time)}
              className={cn(
                "flex min-h-[72px] cursor-pointer items-center justify-between rounded-card border px-5.5 text-start transition-colors duration-200",
                on ? "border-sage bg-sage/8" : "border-line-strong",
              )}
            >
              <span className="text-[21px] font-semibold tracking-[-0.02em]">
                {option.time}
              </span>
              <span className="text-[13px] text-faint">
                {option.surchargeTetri === 0
                  ? phrases.free
                  : `+${formatGel(option.surchargeTetri)}`}
              </span>
            </button>
          );
        })}
      </div>

      <PrimaryAction
        label={phrases.sendRequest}
        enabled={Boolean(selected)}
        onClick={() => {
          if (selected) onSubmit(selected);
        }}
      />
    </div>
  );
}
