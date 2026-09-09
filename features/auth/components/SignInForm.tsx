"use client";

import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/shared/ui";

import { login, verifySecondFactor } from "../api";
import { checkSignIn, hasErrors, type SignInErrors } from "../credentials";
import { signIn } from "../store";
import { AuthField, PasswordField } from "./AuthField";
import { CodeField } from "./CodeField";
import { AuthLink } from "./AuthLink";
import { FormError } from "./FormError";
import { GoogleButton } from "./GoogleButton";

const GOOGLE_FAILED =
  "Google sign-in did not complete. Try again or use your password.";

export function SignInForm() {
  const router = useRouter();
  const hadGoogleError = useSearchParams().get("error") === "google";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors & { code?: string }>({});
  const [formError, setFormError] = useState(
    hadGoogleError ? GOOGLE_FAILED : undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [code, setCode] = useState("");

  async function submitCode(event: FormEvent) {
    event.preventDefault();
    if (!ticket) return;

    setIsSubmitting(true);
    const result = await verifySecondFactor(ticket, code);
    setIsSubmitting(false);

    if (!result.ok) {
      if (result.code === "invalid_ticket") setTicket(null);
      setErrors(result.fields);
      setFormError(result.fields.code ? undefined : result.message);
      return;
    }

    signIn(result.data);
    router.push("/desk");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkSignIn({ email, password });
    setErrors(found);
    setFormError(undefined);
    if (hasErrors(found)) return;

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrors(result.fields);
      setFormError(result.message);
      return;
    }

    if (result.data.kind === "second-factor") {
      setTicket(result.data.ticket);
      return;
    }

    signIn(result.data.user);
    router.push("/desk");
  }

  if (ticket) {
    return (
      <form onSubmit={submitCode} noValidate>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
          One more step
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
          Enter the 6-digit code from your authenticator app.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <FormError message={formError} />
          <CodeField value={code} error={errors.code} onChange={setCode} />
          <Button
            type="submit"
            disabled={isSubmitting || code.length < 6}
            className="mt-2 min-h-13 w-full text-[15px]"
          >
            {isSubmitting ? "Checking…" : "Continue"}
            <ArrowRight strokeWidth={1.6} className="size-4" />
          </Button>
        </div>

        <p className="mt-7 text-center text-[14px] text-soft">
          <button
            type="button"
            onClick={() => setTicket(null)}
            className="cursor-pointer font-medium text-ink underline underline-offset-3"
          >
            Start over
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
        Sign in
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
        Staff of a hotel already on RoomCall? Use your work email.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <FormError message={formError} />
        <AuthField
          label="Work email"
          type="email"
          autoComplete="username"
          value={email}
          error={errors.email}
          onChange={setEmail}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          hint={<AuthLink href="/forgot-password">Forgot password?</AuthLink>}
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 min-h-13 w-full text-[15px]"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>

      <GoogleButton />

      <p className="mt-7 text-center text-[14px] text-soft">
        New hotel? <AuthLink href="/sign-up">Start a free trial</AuthLink>
      </p>
    </form>
  );
}
