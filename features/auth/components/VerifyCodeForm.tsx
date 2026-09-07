"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { verifyCode } from "../actions";
import { AuthLayout } from "./AuthLayout";

const LENGTH = 6;

export function VerifyCodeForm({ email }: { email: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [state, formAction, isPending] = useActionState(verifyCode, null);

  useEffect(() => {
    if (state?.ok) router.push("/dashboard");
  }, [state, router]);

  const focusAt = (index: number) => inputs.current[index]?.focus();

  const setDigitAt = (index: number, value: string) => {
    setDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) return setDigitAt(index, "");

    const chars = [...value].slice(0, LENGTH - index);
    setDigits((current) => {
      const next = [...current];
      chars.forEach((char, offset) => (next[index + offset] = char));
      return next;
    });
    focusAt(Math.min(index + chars.length, LENGTH - 1));
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) focusAt(index - 1);
    if (key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (key === "ArrowRight" && index < LENGTH - 1) focusAt(index + 1);
  };

  const code = digits.join("");
  const fields = state?.ok === false ? state.error.fields : undefined;

  return (
    <AuthLayout
      title={ka.auth.verify.title}
      subtitle={`${ka.auth.verify.subtitle} ${email}`}
    >
      <form action={formAction}>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="code" value={code} />

        <div className="mb-5.5 grid grid-cols-6 gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              aria-label={`${ka.auth.verify.title} ${index + 1}`}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              className={cn(
                "h-14 rounded-2xl text-center text-[22px] font-extrabold outline-none",
                digit
                  ? "bg-white shadow-[0_6px_16px_rgb(76_49_168/0.08)]"
                  : "bg-muted/80",
                "focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring",
              )}
            />
          ))}
        </div>

        {fields?.code && (
          <p
            role="alert"
            className="mb-4 text-xs font-semibold text-destructive"
          >
            {fields.code}
          </p>
        )}

        <Button type="submit" size="block" disabled={isPending}>
          {ka.auth.verify.submit}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>{ka.auth.verify.noCode}</span>
        <button
          type="button"
          className="link-underline cursor-pointer font-bold text-primary-strong"
        >
          {ka.auth.verify.resend}
        </button>
      </div>
    </AuthLayout>
  );
}
