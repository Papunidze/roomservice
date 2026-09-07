"use client";

import { useState } from "react";

import { itemLabel, useSettings } from "@/features/requests";
import type { LangCode, Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import type { ItemPick } from "../build-request";
import { PrimaryAction } from "./PrimaryAction";
import { ScreenHeader } from "./ScreenHeader";

interface ItemsScreenProps {
  phrases: Phrases;
  lang: LangCode;
  onBack: () => void;
  onSubmit: (picks: ItemPick[]) => void;
}

const stepperClass =
  "size-9 shrink-0 cursor-pointer rounded-full border border-line-strong text-base leading-none disabled:cursor-default disabled:text-stone";

export function ItemsScreen({
  phrases,
  lang,
  onBack,
  onSubmit,
}: ItemsScreenProps) {
  const settings = useSettings();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const offered = settings.items.filter((item) => item.available);
  const total = offered.reduce((sum, item) => sum + (counts[item.key] ?? 0), 0);

  const step = (key: string, delta: number) =>
    setCounts((current) => ({
      ...current,
      [key]: Math.max(0, (current[key] ?? 0) + delta),
    }));

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.itemsTitle}
        subtitle={phrases.itemsSub}
        onBack={onBack}
      />

      <div className="flex flex-col">
        {offered.map((item, index) => {
          const quantity = counts[item.key] ?? 0;
          const label = itemLabel(item, lang);
          return (
            <div
              key={item.key}
              className={cn(
                "flex min-h-[68px] items-center gap-2.5 px-1",
                index < offered.length - 1 && "border-b border-line",
              )}
            >
              <span className="flex-1 text-[15.5px] font-medium">{label}</span>
              <button
                type="button"
                aria-label={`${phrases.remove} — ${label}`}
                disabled={quantity === 0}
                onClick={() => step(item.key, -1)}
                className={stepperClass}
              >
                −
              </button>
              <span className="w-6.5 text-center font-mono text-sm">
                {quantity > 0 ? quantity : "—"}
              </span>
              <button
                type="button"
                aria-label={`${phrases.add} — ${label}`}
                onClick={() => step(item.key, 1)}
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
        onClick={() =>
          onSubmit(
            offered
              .filter((item) => (counts[item.key] ?? 0) > 0)
              .map((item) => ({ item, count: counts[item.key] ?? 0 })),
          )
        }
      />
    </div>
  );
}
