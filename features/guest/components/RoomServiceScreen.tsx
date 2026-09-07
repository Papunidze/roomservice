"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { DISHES, type Dish } from "@/features/requests";
import type { Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";

import { PrimaryAction } from "./PrimaryAction";
import { ScreenHeader } from "./ScreenHeader";

interface RoomServiceScreenProps {
  phrases: Phrases;
  onBack: () => void;
  onSubmit: (dish: Dish) => void;
}

export function RoomServiceScreen({
  phrases,
  onBack,
  onSubmit,
}: RoomServiceScreenProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = DISHES.find((dish) => dish.key === selectedKey);

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.serviceTitle}
        subtitle={phrases.serviceSub}
        onBack={onBack}
      />

      <div className="flex flex-col">
        {DISHES.map((dish, index) => {
          const on = dish.key === selectedKey;
          return (
            <button
              key={dish.key}
              type="button"
              onClick={() => setSelectedKey(on ? null : dish.key)}
              className={cn(
                "flex min-h-16 cursor-pointer items-center gap-2.5 px-1 text-start",
                index < DISHES.length - 1 && "border-b border-line",
                on && "text-sage-ink",
              )}
            >
              <span className="flex-1">
                <span className="block text-[15.5px] font-medium">
                  {dish.name}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-faint">
                  {dish.note}
                </span>
              </span>
              <span className="font-mono text-[13.5px] text-muted">
                {formatGel(dish.priceTetri)}
              </span>
              <span
                className={cn(
                  "grid size-6.5 shrink-0 place-items-center rounded-full",
                  on ? "bg-sage text-paper" : "border border-line-strong",
                )}
              >
                {on ? <Check strokeWidth={2} className="size-3.5" /> : null}
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
