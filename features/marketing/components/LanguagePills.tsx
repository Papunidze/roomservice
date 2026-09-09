import {
  DICTIONARY,
  LANGUAGES,
  scriptFont,
  type LangCode,
} from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const TONE = {
  light: {
    pill: "px-2.5 py-1.5 text-[12.5px]",
    idle: "border-line-strong",
    active: "border-sage bg-sage/12 text-sage-deep",
  },
  dark: {
    pill: "px-3.5 py-2 text-[13.5px]",
    idle: "border-paper/28",
    active: "border-sand/90 bg-sand/18",
  },
} as const;

interface LanguagePillsProps {
  active: LangCode;
  tone: keyof typeof TONE;
}

export function LanguagePills({ active, tone }: LanguagePillsProps) {
  const style = TONE[tone];

  return (
    <div className="flex flex-wrap gap-1.5">
      {LANGUAGES.map((code) => (
        <span
          key={code}
          dir={DICTIONARY[code].dir}
          className={cn(
            "rounded-full border font-medium transition-colors duration-500",
            style.pill,
            scriptFont(code),
            code === active ? style.active : style.idle,
          )}
        >
          {DICTIONARY[code].native}
        </span>
      ))}
    </div>
  );
}
