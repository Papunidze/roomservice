import Link from "next/link";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";
import { Button } from "@/shared/ui/button";

const BAR_HEIGHTS = [40, 62, 48, 100, 78, 66, 34];

const AVATAR_TONES = [
  "bg-tone-violet text-tone-violet-ink",
  "bg-tone-green text-tone-green-ink",
  "bg-tone-amber text-tone-amber-ink",
  "bg-tone-blue text-tone-blue-ink",
];

const MOCKUP_REVENUE_TETRI = 384_000;
const MOCKUP_BOOKINGS = 42;

export function Hero() {
  return (
    <section className="grid items-center gap-8.5 py-11 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12 md:py-21">
      <div className="min-w-0">
        <div className="mb-5.5 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/72 px-3.5 py-1.75 text-[12.5px] font-bold text-primary-strong shadow-[0_6px_18px_rgb(76_49_168/0.08)] backdrop-blur-[14px]">
          <span className="size-1.75 animate-[soft-pulse_1.8s_ease-in-out_infinite] rounded-full bg-success" />
          {ka.marketing.hero.badge}
        </div>

        <h1 className="mb-5 text-[clamp(30px,9vw,38px)] leading-[1.04] font-extrabold tracking-[-0.04em] text-pretty md:text-[clamp(34px,4.4vw,62px)]">
          {ka.marketing.hero.titleTop}{" "}
          <span className="text-gradient-warm">
            {ka.marketing.hero.titleBottom}
          </span>
        </h1>

        <p className="mb-7.5 max-w-140 text-base leading-relaxed text-label md:text-[19px]">
          {ka.marketing.hero.lead}
        </p>

        <div className="mb-6.5 flex flex-wrap gap-2.5">
          <Button asChild className="h-13 px-7 text-[15px]">
            <Link href="/register">{ka.marketing.hero.primaryCta}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-13 rounded-full border-white/90 bg-white/70 px-7 text-[15px] text-foreground backdrop-blur-[14px] hover:bg-white"
          >
            <Link href="/login">{ka.marketing.hero.secondaryCta}</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-[13px] text-label">
          <div className="flex">
            {ka.marketing.hero.avatarInitials.map((initial, index) => (
              <span
                key={initial}
                className={cn(
                  "grid size-8 place-items-center rounded-full border-2 border-white text-xs font-bold",
                  index > 0 && "-ml-2.5",
                  AVATAR_TONES[index],
                )}
              >
                {initial}
              </span>
            ))}
          </div>
          <span>{ka.marketing.hero.socialProof}</span>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-col items-stretch gap-3.5 md:gap-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 -z-1 rounded-[48px] bg-[radial-gradient(circle_at_60%_40%,rgba(108,60,255,.16),transparent_65%)] blur-[30px]"
        />

        <div className="rounded-[28px] border border-white/90 bg-white/72 p-5.5 shadow-[0_30px_64px_rgb(76_49_168/0.18)] backdrop-blur-[22px]">
          <div className="mb-4 flex items-center justify-between gap-2.5">
            <div className="text-[13.5px] font-bold">
              {ka.marketing.hero.mockupTitle}
            </div>
            <div className="flex gap-1.25">
              <span className="size-2 rounded-full bg-[#e4e0f2]" />
              <span className="size-2 rounded-full bg-[#e4e0f2]" />
              <span className="size-2 rounded-full bg-primary" />
            </div>
          </div>
          <div className="mb-3 grid grid-cols-[1.2fr_1fr] gap-3">
            <div className="rounded-[20px] bg-linear-150 from-primary-glow to-primary-strong px-4.5 py-4 text-white shadow-[0_16px_30px_rgb(108_60_255/0.3)]">
              <div className="text-xs text-white/80">
                {ka.marketing.hero.revenue}
              </div>
              <div className="mt-2 text-[30px] font-extrabold tracking-[-0.03em] whitespace-nowrap">
                {formatGel(MOCKUP_REVENUE_TETRI)}
              </div>
            </div>
            <div className="rounded-[20px] bg-muted/85 px-4.5 py-4">
              <div className="text-xs text-label">
                {ka.marketing.hero.bookings}
              </div>
              <div className="mt-2 text-[30px] font-extrabold tracking-[-0.03em]">
                {MOCKUP_BOOKINGS}
              </div>
            </div>
          </div>
          <div className="flex h-28 items-end justify-center gap-2.5 rounded-[20px] bg-muted/60 px-4 py-3.5">
            {BAR_HEIGHTS.map((height, index) => (
              <div
                key={index}
                style={{ height: `${height}%` }}
                className={cn(
                  "w-full max-w-9 flex-1 rounded-full",
                  height === 100
                    ? "bg-linear-180 from-primary-light to-primary-strong shadow-[0_10px_20px_rgb(108_60_255/0.3)]"
                    : "bg-primary/14",
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative z-2 rounded-3xl border border-white/95 bg-white/90 p-4.5 shadow-[0_26px_56px_rgb(76_49_168/0.2)] backdrop-blur-[22px] md:mt-4.5 md:-mr-3.5 md:w-[min(300px,86%)] md:self-end">
          <div className="mb-3 flex items-center gap-2.25">
            <span className="grid size-6.5 place-items-center rounded-full bg-linear-140 from-tone-violet to-[#d9ccff] text-[11px] font-bold text-primary-strong">
              {ka.marketing.hero.chatInitial}
            </span>
            <span className="text-[12.5px] font-bold">
              {ka.marketing.hero.chatName}
            </span>
            <span className="ml-auto rounded-full bg-success-bg px-2.25 py-0.75 text-[10.5px] font-bold text-success-ink">
              {ka.marketing.hero.chatBadge}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="max-w-[88%] self-start rounded-[16px_16px_16px_5px] bg-muted/90 px-3.25 py-2.5 text-[12.5px] leading-normal">
              {ka.marketing.hero.chatIncoming}
            </div>
            <div className="max-w-[92%] self-end rounded-[16px_16px_5px_16px] bg-linear-150 from-primary-glow to-primary-strong px-3.25 py-2.5 text-[12.5px] leading-normal text-white shadow-[0_10px_20px_rgb(108_60_255/0.28)]">
              {ka.marketing.hero.chatReply}
            </div>
            <div className="max-w-[88%] self-start rounded-[16px_16px_16px_5px] bg-muted/90 px-3.25 py-2.5 text-[12.5px] leading-normal">
              {ka.marketing.hero.chatConfirm}
            </div>
            <div className="mt-1 self-center rounded-full bg-success-bg px-3 py-1.5 text-[11px] font-bold text-success-ink">
              {ka.marketing.hero.chatDone}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
