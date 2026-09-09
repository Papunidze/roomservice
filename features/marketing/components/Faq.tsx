"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { DICTIONARY, LANGUAGES } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const LANGUAGE_NAMES = LANGUAGES.map((code) => DICTIONARY[code].name).join(
  ", ",
);

const FAQS = [
  {
    question: "Do guests need to install anything?",
    answer:
      "No. They scan the QR plate in the room with their camera and a web page opens. They pick a language on the first screen — no app, no account, no password.",
  },
  {
    question: "How does the translation work?",
    answer:
      "Everything a guest taps — categories, items, dishes, checkout times — comes from a phrasebook written by people, and so do the quick replies. Free text is passed through as written and labelled with its language, so the desk is never shown a translation that was not actually made.",
  },
  {
    question: "Which languages are supported?",
    answer: `${LANGUAGE_NAMES}. You choose per hotel which of them guests see, and staff pick their own language in Settings.`,
  },
  {
    question: "What if a guest speaks something else?",
    answer:
      "They get English. There is no free-text “other” language, so the desk always knows exactly what the guest saw.",
  },
  {
    question: "Is there a contract?",
    answer:
      "Monthly or yearly, cancel any time. 30-day free trial with no card; after that we invoice in USD, by card or bank transfer. Yearly plans get two months free.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="grid gap-8 pt-20 md:grid-cols-[1fr_1.4fr] md:gap-12 md:pt-24">
      <div id="faq" className="scroll-mt-24">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-faint uppercase">
          Questions
        </span>
        <h2 className="mt-3.5 text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] md:text-[38px]">
          Things hoteliers ask us first.
        </h2>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
          Anything else — write to us at{" "}
          <a
            href="mailto:hello@roomcall.ge"
            className="underline underline-offset-3 transition-colors hover:text-ink"
          >
            hello@roomcall.ge
          </a>
          .
        </p>
      </div>

      <div className="flex flex-col">
        {FAQS.map((faq, index) => {
          const isOpen = index === openIndex;
          return (
            <div key={faq.question} className="border-t border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-start text-[16.5px] font-medium tracking-[-0.01em]"
              >
                {faq.question}
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-transform",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus strokeWidth={1.6} className="size-3.5" />
                </span>
              </button>
              {isOpen ? (
                <p className="animate-fade max-w-[600px] pb-5 text-[14.5px] leading-[1.65] text-muted">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
