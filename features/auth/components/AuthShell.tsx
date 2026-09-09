import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag, RotatingGreeting, Wordmark } from "@/shared/ui";

const POINTS = [
  "A guest scans the QR plate in the room and asks in their own language.",
  "The request reaches your desk in yours, with the room already attached.",
  "You answer once; the guest reads the reply in the language they picked.",
];

const STRIP: (typeof LANGUAGES)[number][] = [
  "ar",
  "tr",
  "ru",
  "he",
  "zh",
  "ka",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="hidden flex-col bg-ink px-10 py-7 text-paper lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <Wordmark />

        <div className="my-auto max-w-[460px] py-12">
          <span className="font-mono text-[10.5px] tracking-[0.16em] text-paper/55 uppercase">
            Guests say hello in {LANGUAGES.length} languages
          </span>
          <div className="mt-4 flex min-h-16 items-end">
            <RotatingGreeting className="text-[38px] text-sand" />
          </div>
          <p className="mt-5 text-[32px] leading-[1.12] font-semibold tracking-[-0.03em] text-pretty">
            Every guest understood. Every request answered in their language.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[14px] leading-relaxed text-paper/70"
              >
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-sand" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STRIP.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-2 rounded-full bg-paper/10 py-1.5 pe-3.5 ps-2"
            >
              <Flag code={code} className="h-3.5 w-4.5" />
              <span
                dir={DICTIONARY[code].dir}
                className={cn("text-[12.5px]", scriptFont(code))}
              >
                {DICTIONARY[code].native}
              </span>
            </span>
          ))}
          <span className="ms-auto text-[12.5px] text-paper/50">
            RoomCall LLC · Batumi, Georgia
          </span>
        </div>
      </aside>

      <main className="flex flex-col bg-canvas px-5 py-6 md:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <Wordmark className="lg:hidden" />
          <Link
            href="/"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] whitespace-nowrap text-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ArrowLeft strokeWidth={1.6} className="size-3.5" />
            <span className="hidden sm:inline">Back to the site</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
        <div className="animate-rise mx-auto my-auto w-full max-w-[460px] py-8">
          <div className="rounded-sheet border border-line bg-paper p-6 md:p-9">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
