import { ArrowLeft, Hotel } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag } from "@/shared/ui";

const POINTS = [
  "A guest scans the QR card in the room and asks in their own language.",
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
    <div className="min-h-dvh bg-canvas p-4 md:p-7.5">
      <div className="mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-card border border-line bg-paper md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-sage-ink p-9 text-paper md:flex">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Hotel strokeWidth={1.4} className="size-[19px]" />
              <span className="text-[15px] font-semibold tracking-[-0.02em]">
                RoomCall
              </span>
            </Link>

            <p className="mt-11 text-[26px] leading-[1.2] font-semibold tracking-[-0.03em] text-balance">
              Every guest request, in a language your desk can read.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[13.5px] leading-relaxed text-paper/70"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-sand" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap gap-2.5">
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
            </div>
            <p className="mt-4 font-mono text-[10.5px] tracking-[0.14em] text-paper/45 uppercase">
              {LANGUAGES.length} languages shipped
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-10 md:px-11">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 self-start text-[12.5px] text-faint hover:text-ink"
          >
            <ArrowLeft strokeWidth={1.6} className="size-3.5" />
            Back to the site
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
