"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export const FIELD_CONTROL =
  "block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm outline-none";

interface FieldProps {
  label: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, className, children }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs text-faint">{label}</span>
      {children}
    </label>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  className?: string;
  inputClassName?: string;
  onChange: (value: string) => void;
}

export function TextField({
  label,
  value,
  className,
  inputClassName,
  onChange,
}: TextFieldProps) {
  return (
    <Field label={label} className={className}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className={cn(FIELD_CONTROL, inputClassName)}
      />
    </Field>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function NumberField({ label, value, max, onChange }: NumberFieldProps) {
  return (
    <input
      aria-label={label}
      inputMode="numeric"
      value={String(value)}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
        onChange(Math.min(max, Number(digits)));
      }}
      className="min-h-9.5 w-18 rounded-[10px] border border-line-strong bg-surface px-2.5 text-center font-mono text-sm outline-none"
    />
  );
}
