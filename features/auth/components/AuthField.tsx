"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

const CONTROL =
  "block min-h-12 w-full rounded-[14px] border border-line-strong bg-surface px-4 text-[15px] transition-[border-color,box-shadow] outline-none focus-visible:border-sage focus-visible:shadow-[0_0_0_3px] focus-visible:shadow-sage/15 focus-visible:outline-none";

const LABEL = "text-[12.5px] font-medium text-soft";

interface AuthFieldProps {
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email";
  autoComplete?: string;
  onChange: (value: string) => void;
}

export function AuthField({
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className={cn("mb-1.5 block", LABEL)}>{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
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
  hint?: ReactNode;
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
        <span className={LABEL}>{label}</span>
        {hint ? (
          <span className="text-[11.5px] whitespace-nowrap text-ghost">
            {hint}
          </span>
        ) : null}
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
          className="absolute inset-y-1.5 end-1.5 grid w-9 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
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
