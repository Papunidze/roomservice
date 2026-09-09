import { AirVent, Globe } from "lucide-react";

import {
  CATEGORY_LABEL,
  FRONT_DESK_AGENT,
  FRONT_DESK_LANGUAGE,
  HOTEL,
} from "@/features/requests";
import { CANNED, CANNED_LABEL, DICTIONARY } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { HeroLanguages } from "./HeroLanguages";

const en = DICTIONARY.en;
const PROBLEMS = [en.ac, en.tv, en.wifi, en.water, en.noise];
const NOTE = "The AC makes a loud noise at night and the room stays hot.";

export function HeroPreview() {
  return (
    <div className="animate-rise mx-auto grid max-w-[900px] gap-5 [animation-delay:120ms] md:grid-cols-[250px_minmax(0,1fr)] md:items-start">
      <PhoneMock />
      <div className="flex min-w-0 flex-col gap-3.5">
        <DeskCard />
        <ReplyBubble />
        <HeroLanguages />
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="mx-auto h-[480px] w-[250px] overflow-hidden rounded-[36px] border-8 border-ink bg-paper">
      <div className="px-4.5 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold">{HOTEL.name}</span>
          <span className="rounded-full bg-sand/35 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-soft">
            ROOM 205
          </span>
        </div>
        <span className="mt-5.5 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-1.5 text-[11.5px] font-medium">
          <Globe strokeWidth={1.6} className="size-3" />
          {en.native}
        </span>
        <p className="mt-4 text-[23px] font-semibold tracking-[-0.025em]">
          {en.problemTitle}
        </p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {PROBLEMS.map((problem, index) => (
            <span
              key={problem}
              className={cn(
                "rounded-full px-3 py-2 text-[12.5px]",
                index === 0
                  ? "bg-sage font-medium text-paper"
                  : "border border-line-strong",
              )}
            >
              {problem}
            </span>
          ))}
        </div>
        <p className="mt-3.5 min-h-[74px] rounded-2xl border border-line-strong px-3.5 py-3 text-[13px] leading-[1.55]">
          {NOTE}
        </p>
        <div className="mt-3.5 grid min-h-[46px] place-items-center rounded-full bg-sage text-[13.5px] font-medium text-paper">
          {en.send}
        </div>
      </div>
    </div>
  );
}

function DeskCard() {
  return (
    <div className="animate-rise rounded-card border border-line bg-surface px-5 pt-4.5 pb-5 [animation-delay:700ms]">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[20px] font-semibold tracking-[-0.03em]">
          205
        </span>
        <AirVent strokeWidth={1.4} className="size-4 text-sage" />
        <span className="text-[13px] text-soft">{CATEGORY_LABEL.ac}</span>
        <span className="rounded-full bg-urgent/10 px-2.5 py-0.5 text-[11.5px] font-medium text-urgent">
          Urgent
        </span>
        <span className="ms-auto font-mono text-[11px] whitespace-nowrap text-muted">
          just now · EN
        </span>
      </div>
      <p className="mt-3.5 rounded-[16px] rounded-bl-[5px] bg-sand/30 px-4 py-3 text-[14px] leading-[1.55]">
        {NOTE}
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-[12.5px] text-soft">
        <span className="font-medium">Quick replies</span>
        <span className="rounded-full border border-sage bg-sage/10 px-3 py-1.5 text-sage-deep">
          {CANNED_LABEL.ack}
        </span>
        <span className="rounded-full border border-line-strong px-3 py-1.5">
          {CANNED_LABEL.tech}
        </span>
      </div>
    </div>
  );
}

function ReplyBubble() {
  return (
    <div className="animate-rise ms-7 rounded-[18px] rounded-br-[5px] bg-sage-deep px-4 pt-3.5 pb-4 text-paper [animation-delay:1400ms]">
      <p className="text-[14px] leading-[1.55]">{CANNED.tech.en}</p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-dashed border-paper/30 pt-2.5 text-[12px]">
        <span className="text-paper/80">
          Written in {DICTIONARY[FRONT_DESK_LANGUAGE].name} by{" "}
          {FRONT_DESK_AGENT}
        </span>
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-sand">
          GUEST READS · EN
        </span>
      </div>
    </div>
  );
}
