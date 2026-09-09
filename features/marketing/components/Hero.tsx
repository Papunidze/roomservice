import Link from "next/link";

import { LANGUAGES } from "@/shared/i18n";

const FACTS = ["No card needed", "Set up in an afternoon", "From $49 a month"];

export function Hero() {
  return (
    <section className="animate-rise mx-auto max-w-[800px] pt-14 pb-12 text-center md:pt-18">
      <span className="inline-flex items-center gap-2 rounded-full bg-sand/35 px-4 py-2 text-[13px] font-medium text-soft">
        <span className="animate-pulse-dot size-1.5 rounded-full bg-sage" />
        Guest requests in {LANGUAGES.length} languages · built for hotels in
        Georgia
      </span>

      <h1 className="mt-7 text-[40px] leading-[1.03] font-semibold tracking-[-0.035em] text-balance md:text-[62px]">
        One QR code in the room. Every guest understood.
      </h1>

      <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-relaxed text-pretty text-soft md:text-[19px]">
        Guests scan, pick their language and tap what they need — no app, no
        login. Your desk reads it in its own language, answers in seconds, and
        the guest reads the reply in the language they picked.
      </p>

      <div className="mt-9 flex justify-center">
        <Link
          href="/sign-up"
          className="inline-flex min-h-14 items-center rounded-full bg-sage px-7 text-[16px] font-medium text-paper"
        >
          Start 30-day free trial
        </Link>
      </div>

      <ul className="mt-5.5 flex flex-wrap justify-center gap-x-7 gap-y-1.5 text-[13.5px] text-muted">
        {FACTS.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </section>
  );
}
