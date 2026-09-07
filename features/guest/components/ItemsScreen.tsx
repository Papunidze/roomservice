"use client";

import { useState } from "react";

import { ITEM_KEYS, type ItemKey } from "@/features/requests";
import type { Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { PrimaryAction } from "./PrimaryAction";
import { ScreenHeader } from "./ScreenHeader";

type Counts = Partial<Record<ItemKey, number>>;

interface ItemsScreenProps {
  phrases: Phrases;
  onBack: () => void;
  onSubmit: (counts: Counts) => void;
}

const stepperClass =
  "size-9 shrink-0 cursor-pointer rounded-full border border-line-strong text-base leading-none disabled:cursor-default disabled:text-stone";

export function ItemsScreen({ phrases, onBack, onSubmit }: ItemsScreenProps) {
  const [counts, setCounts] = useState<Counts>({});

  const step = (key: ItemKey, delta: number) =>
    setCounts((current) => ({
      ...current,
      [key]: Math.max(0, (current[key] ?? 0) + delta),
    }));

  const total = ITEM_KEYS.reduce((sum, key) => sum + (counts[key] ?? 0), 0);

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.itemsTitle}
        subtitle={phrases.itemsSub}
        onBack={onBack}
      />

      <div className="flex flex-col">
        {ITEM_KEYS.map((key, index) => {
          const quantity = counts[key] ?? 0;
          return (
            <div
              key={key}
              className={cn(
                "flex min-h-[68px] items-center gap-2.5 px-1",
                index < ITEM_KEYS.length - 1 && "border-b border-line",
              )}
            >
              <span className="flex-1 text-[15.5px] font-medium">
                {phrases[key]}
              </span>
              <button
                type="button"
                aria-label={`${phrases.remove} — ${phrases[key]}`}
                disabled={quantity === 0}
                onClick={() => step(key, -1)}
                className={stepperClass}
              >
                −
              </button>
              <span className="w-6.5 text-center font-mono text-sm">
                {quantity > 0 ? quantity : "—"}
              </span>
              <button
                type="button"
                aria-label={`${phrases.add} — ${phrases[key]}`}
                onClick={() => step(key, 1)}
                className={stepperClass}
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      <PrimaryAction
        label={
          total > 0 ? `${phrases.sendRequest} · ${total}` : phrases.sendRequest
        }
        enabled={total > 0}
        onClick={() => onSubmit(counts)}
      />
    </div>
  );
}
