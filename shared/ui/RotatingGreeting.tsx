"use client";

import { useEffect, useState } from "react";

import { DICTIONARY, LANGUAGES, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

const INTERVAL_MS = 2600;

export function useRotatingLanguage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((current) => current + 1),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return LANGUAGES[index % LANGUAGES.length] ?? LANGUAGES[0];
}

export function RotatingGreeting({ className }: { className?: string }) {
  const code = useRotatingLanguage();
  const phrases = DICTIONARY[code];

  return (
    <p
      key={code}
      dir={phrases.dir}
      className={cn(
        "animate-greet w-full text-left font-semibold leading-[1.15] tracking-[-0.03em]",
        scriptFont(code),
        className,
      )}
    >
      {phrases.greet}
    </p>
  );
}
