"use client";

import { ArrowRight, Globe, Hotel, TriangleAlert } from "lucide-react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  type Request,
  type Status,
} from "@/features/requests";
import type { Phrases } from "@/shared/i18n";

const STATUS_PHRASE: Record<Status, keyof Phrases> = {
  new: "received",
  progress: "inProgress",
  done: "done",
};

import type { GuestScreen } from "../screens";

interface HomeScreenProps {
  room: string;
  phrases: Phrases;
  languageLabel: string;
  active: Request | undefined;
  onOpenLanguage: () => void;
  onNavigate: (screen: GuestScreen) => void;
}

export function HomeScreen({
  room,
  phrases,
  languageLabel,
  active,
  onOpenLanguage,
  onNavigate,
}: HomeScreenProps) {
  const cards = [
    {
      screen: "items",
      category: "items",
      title: phrases.itemT,
      sub: phrases.itemS,
    },
    {
      screen: "service",
      category: "service",
      title: phrases.serviceT,
      sub: phrases.serviceS,
    },
    {
      screen: "checkout",
      category: "checkout",
      title: phrases.checkoutT,
      sub: phrases.checkoutS,
    },
    {
      screen: "info",
      category: "info",
      title: phrases.infoT,
      sub: phrases.infoS,
    },
  ] as const;

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-9">
      <div className="flex items-center justify-between py-1.5 pb-7.5">
        <div className="flex items-center gap-2.5">
          <Hotel strokeWidth={1.4} className="size-[19px]" />
          <span className="font-mono text-[11.5px] tracking-[0.1em] text-faint">
            ROOM {room}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenLanguage}
          className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[12.5px] font-medium hover:border-ink"
        >
          <Globe strokeWidth={1.5} className="size-3.5" />
          <span>{languageLabel}</span>
        </button>
      </div>

      <h1 className="mb-2.5 text-[34px] leading-[1.12] font-semibold tracking-[-0.03em]">
        {phrases.greet}
      </h1>
      <p className="mb-6.5 text-[15.5px] leading-relaxed text-pretty text-muted">
        {phrases.homeSub}
      </p>

      <button
        type="button"
        onClick={() => onNavigate("problem")}
        className="block w-full cursor-pointer rounded-hero bg-sand/30 p-5.5 text-start transition-colors hover:bg-surface"
      >
        <span className="flex items-center justify-between">
          <TriangleAlert strokeWidth={1.4} className="size-6.5 text-sage" />
          <ArrowRight
            strokeWidth={1.4}
            className="size-[17px] rtl:scale-x-[-1]"
          />
        </span>
        <span className="mt-7 block">
          <span className="block text-[19px] font-semibold tracking-[-0.02em]">
            {phrases.reportT}
          </span>
          <span className="mt-1 block text-[13.5px] text-muted">
            {phrases.reportS}
          </span>
        </span>
      </button>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {cards.map((card) => {
          const Icon = CATEGORY_ICON[card.category];
          return (
            <button
              key={card.screen}
              type="button"
              onClick={() => onNavigate(card.screen)}
              className="block rounded-card border border-line-strong p-5 text-start transition-colors hover:bg-surface"
            >
              <Icon strokeWidth={1.4} className="size-[23px] text-sage" />
              <span className="mt-6 block text-[15.5px] leading-tight font-semibold tracking-[-0.01em]">
                {card.title}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-faint">
                {card.sub}
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <button
          type="button"
          onClick={() => onNavigate("track")}
          className="mt-5.5 flex min-h-[60px] w-full cursor-pointer items-center gap-3 rounded-card border border-sage/35 bg-sage/7 px-5 py-4 text-start"
        >
          <span className="animate-pulse-dot size-[7px] shrink-0 rounded-full bg-sage" />
          <span className="flex-1 text-sm font-medium text-sage-ink">
            {CATEGORY_LABEL[active.category]} ·{" "}
            {phrases[STATUS_PHRASE[active.status]]}
          </span>
          <span className="text-[12.5px] text-sage">{phrases.view}</span>
        </button>
      ) : null}
    </div>
  );
}
