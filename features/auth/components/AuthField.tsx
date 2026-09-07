"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { FIELD_CONTROL } from "@/shared/ui";

const CONTROL = cn(FIELD_CONTROL, "min-h-12 rounded-2xl bg-surface px-4");

interface AuthFieldProps {
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  autoComplete?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function AuthField({
  label,
  value,
  error,
  type = "text",
  autoComplete,
  placeholder,
  onChange,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-faint">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        spellCheck={false}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(CONTROL, error && "border-urgent")}
      />
      <FieldError message={error} />
    </label>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  error?: string;
  autoComplete: string;
  hint?: string;
  onChange: (value: string) => void;
}

export function PasswordField({
  label,
  value,
  error,
  autoComplete,
  hint,
  onChange,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs text-faint">{label}</span>
        {hint ? <span className="text-[11px] text-ghost">{hint}</span> : null}
      </span>
      <span className="relative block">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
          className={cn(CONTROL, "pe-12", error && "border-urgent")}
        />
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible(!isVisible)}
          className="absolute inset-y-0 end-1.5 grid w-9 cursor-pointer place-items-center rounded-full text-faint hover:text-ink"
        >
          <Icon strokeWidth={1.6} className="size-4" />
        </button>
      </span>
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="mt-1.5 block text-[12px] text-urgent">{message}</span>
  );
}
