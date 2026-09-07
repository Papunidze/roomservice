import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { LANGUAGES } from "@/shared/i18n";

import { HeroPreview } from "./HeroPreview";

const FACTS = [
  `${LANGUAGES.length} languages`,
  "No app for guests",
  "One QR card per room",
];

export function Hero() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-14 pb-16 md:pt-20 md:pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <div>
          <span className="font-mono text-[10.5px] tracking-[0.16em] text-sage uppercase">
            Guest requests for hotels
          </span>

          <h1 className="mt-4 text-[38px] leading-[1.08] font-semibold tracking-[-0.035em] text-balance md:text-[52px]">
            Your guest asks in their language. Your desk reads it in yours.
          </h1>

          <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-pretty text-muted">
            A card in every room carries a QR code with the room number. The
            guest scans it, picks a language and taps what they need — a broken
            air conditioner, extra towels, room service, a later checkout. It
            lands at the front desk immediately, already translated, with a
            thread to answer back.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link
              href="/r/205"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sage px-5 text-[13.5px] font-medium text-paper"
            >
              Try the guest app
              <ArrowRight strokeWidth={1.6} className="size-4" />
            </Link>
            <Link
              href="/desk"
              className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-[13.5px] font-medium text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              See the front desk
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
