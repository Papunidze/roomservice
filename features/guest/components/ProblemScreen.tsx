"use client";

import { Info } from "lucide-react";
import { useState } from "react";

import {
  PROBLEM_KEYS,
  type GuestSettings,
  type ProblemKey,
} from "@/features/requests";
import type { Phrases } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import { PrimaryAction } from "./PrimaryAction";
import { ScreenHeader } from "./ScreenHeader";

interface ProblemScreenProps {
  phrases: Phrases;
  settings: GuestSettings;
  isSending: boolean;
  onBack: () => void;
  onSubmit: (input: { keys: ProblemKey[]; note: string }) => void;
}

export function ProblemScreen({
  phrases,
  settings,
  isSending,
  onBack,
  onSubmit,
}: ProblemScreenProps) {
  const [keys, setKeys] = useState<ProblemKey[]>([]);
  const offered = PROBLEM_KEYS.filter(
    (key) => settings.categories[key].enabled,
  );
  const [note, setNote] = useState("");

  const toggleKey = (key: ProblemKey) =>
    setKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  return (
    <div className="animate-rise px-5.5 pt-3.5 pb-10">
      <ScreenHeader
        backLabel={phrases.back}
        title={phrases.problemTitle}
        subtitle={phrases.problemSub}
        onBack={onBack}
      />

      <div className="mb-7 flex flex-wrap gap-2">
        {offered.map((key) => {
          const selected = keys.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleKey(key)}
              className={cn(
                "min-h-12 cursor-pointer rounded-full border px-5 text-[14.5px] font-medium transition-colors duration-200",
                selected
                  ? "border-sage bg-sage text-paper"
                  : "border-line-strong",
              )}
            >
              {phrases[key]}
            </button>
          );
        })}
      </div>

      <label
        htmlFor="problem-note"
        className="mb-2.5 block text-[12.5px] font-medium text-faint"
      >
        {phrases.describe}
      </label>
      <textarea
        id="problem-note"
        rows={4}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={phrases.placeholder}
        className="w-full resize-none rounded-tile border border-line-strong px-4.5 py-4 text-[15.5px] leading-snug outline-none"
      />

      <PrimaryAction
        label={phrases.send}
        enabled={!isSending && (keys.length > 0 || note.length > 0)}
        onClick={() => onSubmit({ keys, note })}
      />

      <div className="mt-4.5 flex gap-2.5 px-1">
        <Info strokeWidth={1.4} className="mt-0.5 size-4 shrink-0 text-sage" />
        <span className="text-[12.5px] leading-relaxed text-faint">
          {phrases.reassure}
        </span>
      </div>
    </div>
  );
}
