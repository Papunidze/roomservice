"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/shared/ui";

import { checkEmail } from "../credentials";
import { AuthField } from "./AuthField";
import { AuthLink } from "./AuthLink";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isSent, setIsSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkEmail(email);
    setError(found);
    if (found) return;

    setIsSent(true);
  }

  if (isSent) {
    return (
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
          Check your inbox
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
          If <span className="font-medium text-ink">{email}</span> belongs to a
          RoomCall desk, a reset link is on its way. It works for one hour.
        </p>
        <p className="mt-7 text-[14px] text-soft">
          <AuthLink href="/sign-in">Back to sign in</AuthLink>
        </p>
        <p className="mt-8 border-t border-line-soft pt-5 text-[12px] leading-relaxed text-faint">
          Demo build — no email is sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
        Reset password
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
        Enter your work email and we will send a link that works for one hour.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <AuthField
          label="Work email"
          type="email"
          autoComplete="username"
          value={email}
          error={error}
          onChange={setEmail}
        />
        <Button type="submit" className="mt-2 min-h-13 w-full text-[15px]">
          Send reset link
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>

      <p className="mt-7 text-center text-[14px] text-soft">
        Remembered it? <AuthLink href="/sign-in">Sign in</AuthLink>
      </p>

      <p className="mt-8 border-t border-line-soft pt-5 text-[12px] leading-relaxed text-faint">
        Demo build — no email is sent. The form only checks that the address
        looks valid.
      </p>
    </form>
  );
}
