import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { Flag } from "@/shared/ui";

import { Section } from "./Section";

const RTL = LANGUAGES.filter((code) => DICTIONARY[code].dir === "rtl");

export function LanguageWall() {
  return (
    <Section
      id="languages"
      eyebrow="Languages"
      title={`${LANGUAGES.length} languages, written the way they are read.`}
      lead="Arabic, Persian and Hebrew run right to left, and every script gets its own typeface rather than a fallback that mangles it. You choose per property which of these the picker offers."
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {LANGUAGES.map((code) => {
          const phrases = DICTIONARY[code];
          return (
            <div
              key={code}
              className="rounded-tile border border-line-strong bg-paper px-4 py-3.5"
            >
              <span dir={phrases.dir} className="flex items-center gap-2.5">
                <Flag code={code} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[16px] leading-tight font-medium tracking-[-0.02em]",
                      scriptFont(code),
                    )}
                  >
                    {phrases.native}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-faint">
                    {phrases.name}
                  </span>
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 max-w-[640px] text-[13px] leading-relaxed text-faint">
        {RTL.map((code) => DICTIONARY[code].name).join(", ")} are right to left.
        A guest whose language is not on the list gets English. Everything a
        guest taps is translated; anything a guest types is passed through as
        written and labelled as such — the desk is never shown a translation the
        app did not actually produce.
      </p>
    </Section>
  );
}
