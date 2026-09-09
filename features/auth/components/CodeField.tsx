"use client";

import { cn } from "@/shared/lib/cn";

interface CodeFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function CodeField({ value, error, onChange }: CodeFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-soft">
        6-digit code
      </span>
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        aria-invalid={Boolean(error)}
        className={cn(
          "block min-h-12 w-full rounded-[14px] border border-line-strong bg-surface px-4 font-mono text-[22px] tracking-[0.35em] outline-none focus-visible:border-sage",
          error && "border-urgent",
        )}
      />
      {error ? (
        <span className="mt-1.5 block text-[12px] text-urgent">{error}</span>
      ) : null}
    </label>
  );
}
