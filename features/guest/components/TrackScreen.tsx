"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { isGuestVisible, resolveText, type Request } from "@/features/requests";
import {
  DICTIONARY,
  scriptFont,
  type LangCode,
  type Phrases,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

interface TrackScreenProps {
  phrases: Phrases;
  lang: LangCode;
  request: Request;
  onBack: () => void;
  onReply: (text: string) => void;
  onRate: (score: number) => void;
}

const STEP_INDEX = { new: 0, progress: 1, done: 2 } as const;
const SCORES = [1, 2, 3, 4, 5];

export function TrackScreen({
  phrases,
  lang,
  request,
  onBack,
  onReply,
  onRate,
}: TrackScreenProps) {
  const [reply, setReply] = useState("");
  const current = STEP_INDEX[request.status];
  const clock = new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const at = (iso: string | null | undefined) =>
    iso ? clock.format(new Date(iso)) : "—";
  const steps = [
    { label: phrases.received, at: at(request.createdAt) },
    { label: phrases.inProgress, at: at(request.progressAt) },
    { label: phrases.done, at: at(request.resolvedAt) },
  ];

  const send = () => {
    if (!reply.trim()) return;
    onReply(reply.trim());
    setReply("");
  };

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-11 cursor-pointer items-center gap-2 px-0.5 text-sm font-medium text-muted"
        >
          <span className="inline-block text-base rtl:scale-x-[-1]">←</span>
          <span>{phrases.menuShort}</span>
        </button>
        <span className="font-mono text-[11px] tracking-[0.1em] text-ghost">
          #{request.id}
        </span>
      </div>

      <h2 className="mt-4.5 mb-1.5 text-[27px] font-semibold tracking-[-0.025em]">
        {phrases.confirmTitle}
      </h2>
      <p className="mb-6.5 text-[14.5px] leading-relaxed text-muted">
        {request.status === "done" ? phrases.doneNote : phrases.waiting}
      </p>

      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-[11px] shrink-0 rounded-full",
                  index <= current
                    ? "bg-sage"
                    : "border border-ink/20 bg-transparent",
                  index === current && "ring-5 ring-sage/16",
                  index === current && current < 2 && "animate-pulse-dot",
                )}
              />
              <span
                className={cn(
                  "w-px flex-1",
                  index === 2 ? "min-h-0" : "min-h-7.5",
                  index < current ? "bg-sage" : "bg-line-strong",
                )}
              />
            </div>
            <div className="pb-5.5">
              <div
                className={cn(
                  "text-base tracking-[-0.01em]",
                  index === current ? "font-semibold" : "font-normal",
                  index <= current ? "text-ink" : "text-ghost",
                )}
              >
                {step.label}
              </div>
              <div className="mt-0.5 font-mono text-[12.5px] text-ghost">
                {index <= current ? step.at : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {request.status === "done" ? (
        <div className="rounded-tile border border-line-strong px-4.5 py-4">
          <div className="text-[14px] font-medium">
            {request.rating ? phrases.rateThanks : phrases.rateTitle}
          </div>
          <div className="mt-2.5 flex gap-2" dir="ltr">
            {SCORES.map((score) => {
              const on = (request.rating?.score ?? 0) >= score;
              return (
                <button
                  key={score}
                  type="button"
                  aria-label={String(score)}
                  aria-pressed={request.rating?.score === score}
                  onClick={() => onRate(score)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong"
                >
                  <Star
                    strokeWidth={1.6}
                    className={cn(
                      "size-5",
                      on ? "fill-sage text-sage" : "text-ghost",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-3.5 border-t border-line pt-5.5">
        {request.thread.filter(isGuestVisible).map((message, index) => {
          const mine = message.from === "guest";
          const shown = mine
            ? { text: message.text, lang: message.lang }
            : resolveText(message, lang);
          const inGuestLanguage = shown.lang === lang;

          return (
            <div
              key={`${message.from}-${index}`}
              className={cn(
                "flex flex-col",
                mine ? "items-end" : "items-start",
              )}
            >
              <div
                dir={DICTIONARY[shown.lang].dir}
                className={cn(
                  "max-w-[86%] px-4.5 py-3.5 text-[15px] leading-snug",
                  scriptFont(shown.lang),
                  mine
                    ? "rounded-[20px_20px_6px_20px] bg-ink text-paper"
                    : "rounded-[20px_20px_20px_6px] bg-sand/30",
                )}
              >
                {shown.text}
              </div>
              <div className="mt-1.5 text-[11.5px] text-ghost">
                {mine
                  ? phrases.you
                  : `${phrases.frontDesk} · ${
                      inGuestLanguage
                        ? phrases.translated
                        : DICTIONARY[shown.lang].native
                    }`}
                {message.at ? ` · ${at(message.at)}` : ""}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          placeholder={phrases.replyPlaceholder}
          aria-label={phrases.replyPlaceholder}
          className="min-h-14 flex-1 rounded-full border border-line-strong px-5 text-[15px] outline-none"
        />
        <button
          type="button"
          onClick={send}
          aria-label={phrases.sendRequest}
          className="size-14 shrink-0 cursor-pointer rounded-full bg-sage text-[17px] text-paper"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
