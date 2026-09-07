import { Sparkles } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/card";

import { SectionHeading } from "./SectionHeading";

const CALENDAR_DAYS = ka.weekdaysShort.slice(0, 5);

export function FeatureCards() {
  const copy = ka.marketing.features;

  return (
    <section id="features" className="scroll-mt-24 py-11 md:py-18">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />
      <div className="mt-7.5 grid gap-4 md:grid-cols-2">
        <Card className="hover-lift rounded-[26px] p-7">
          <FeatureText
            title={copy.assistant.title}
            text={copy.assistant.text}
          />
          <div className="mt-5 flex flex-col gap-2 rounded-[20px] bg-muted/70 p-4">
            <div className="max-w-[86%] self-start rounded-[14px_14px_14px_4px] bg-white px-3 py-2.25 text-[12.5px]">
              {copy.assistant.question}
            </div>
            <div className="max-w-[90%] self-end rounded-[14px_14px_4px_14px] bg-linear-150 from-primary-glow to-primary-strong px-3 py-2.25 text-[12.5px] text-white shadow-[0_10px_20px_rgb(108_60_255/0.25)]">
              {copy.assistant.answer}
            </div>
          </div>
        </Card>

        <Card className="hover-lift rounded-[26px] p-7">
          <FeatureText title={copy.calendar.title} text={copy.calendar.text} />
          <div className="mt-5 rounded-[20px] bg-muted/70 p-3.5">
            <div className="grid grid-cols-5 gap-1.5">
              {CALENDAR_DAYS.map((day, dayIndex) => (
                <div key={day}>
                  <div className="mb-1.5 text-center text-[10.5px] font-bold text-muted-foreground">
                    {day}
                  </div>
                  <div className="flex flex-col gap-1.25">
                    {[0, 1, 2].map((slot) => {
                      const isBusy = (dayIndex + slot) % 3 === 0;
                      return (
                        <div
                          key={slot}
                          className={cn(
                            "h-4 rounded-md",
                            !isBusy && "bg-white/90",
                            isBusy &&
                              dayIndex === 3 &&
                              "bg-linear-150 from-primary-glow to-primary-strong",
                            isBusy && dayIndex !== 3 && "bg-primary/16",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="hover-lift rounded-[26px] p-7">
          <FeatureText title={copy.site.title} text={copy.site.text} />
          <div className="mt-5 overflow-hidden rounded-[18px] bg-white shadow-[0_10px_24px_rgb(76_49_168/0.1)]">
            <div className="flex items-center gap-2 bg-muted/90 px-3.5 py-2.5">
              <span className="size-2 rounded-full bg-[#d8d4e8]" />
              <span className="size-2 rounded-full bg-[#d8d4e8]" />
              <span className="ml-1.5 flex-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] text-muted-foreground">
                {copy.site.domain}
              </span>
            </div>
            <div className="flex gap-2.5 p-4">
              <div className="h-14.5 flex-1 rounded-xl bg-linear-150 from-tone-violet to-[#c9b6ff]" />
              <div className="flex flex-1 flex-col justify-center gap-1.75">
                <div className="h-2.25 w-4/5 rounded-full bg-[#edebf7]" />
                <div className="h-2.25 w-[55%] rounded-full bg-[#edebf7]" />
                <div className="h-5.5 w-[76%] rounded-full bg-linear-90 from-primary-light to-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover-lift rounded-[26px] p-7">
          <FeatureText
            title={copy.reminders.title}
            text={copy.reminders.text}
          />
          <div className="mt-5 flex items-center gap-3.5 rounded-[20px] bg-muted/70 px-4.5 py-4">
            <span className="grid size-10.5 shrink-0 place-items-center rounded-[14px] bg-white text-primary-strong shadow-[0_6px_14px_rgb(76_49_168/0.1)]">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold">
                {copy.reminders.exampleTitle}
              </div>
              <div className="mt-0.75 text-xs text-muted-foreground">
                {copy.reminders.exampleNote}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FeatureText({ title, text }: { title: string; text: string }) {
  return (
    <>
      <div className="text-[19px] font-bold">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-label">{text}</div>
    </>
  );
}
