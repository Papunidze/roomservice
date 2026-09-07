import type { LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const COUNTRY: Record<LangCode, string> = {
  ar: "Saudi Arabia",
  fa: "Iran",
  tr: "Türkiye",
  ru: "Russia",
  uk: "Ukraine",
  he: "Israel",
  en: "United Kingdom",
  de: "Germany",
  fr: "France",
  it: "Italy",
  es: "Spain",
  pl: "Poland",
  pt: "Brazil",
  hi: "India",
  zh: "China",
  ka: "Georgia",
};

interface FlagProps {
  code: LangCode;
  className?: string;
}

export function Flag({ code, className }: FlagProps) {
  return (
    <span
      aria-hidden
      title={COUNTRY[code]}
      style={{ backgroundImage: `url(/flags/${code}.svg)` }}
      className={cn(
        "h-4.5 w-6 shrink-0 rounded-[3px] bg-cover bg-center ring-1 ring-ink/10 ring-inset",
        className,
      )}
    />
  );
}
