"use client";

import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, showToast } from "@/shared/ui";

import { resetPassword } from "../api";
import { checkPassword, MIN_PASSWORD } from "../credentials";
import { signIn } from "../store";
import { PasswordField } from "./AuthField";
import { AuthLink } from "./AuthLink";
import { FormError } from "./FormError";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkPassword(password);
    setError(found);
    setFormError(undefined);
    if (found) return;

    setIsSubmitting(true);
    const result = await resetPassword(token, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.fields.password);
      setFormError(result.fields.password ? undefined : result.message);
      return;
    }

    signIn(result.data);
    showToast("Password updated");
    router.push("/desk");
  }

  if (!token) {
    return (
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
          Link incomplete
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
          This page needs the link from your email. Open it again, or request a
          new one.
        </p>
        <p className="mt-7 text-[14px] text-soft">
          <AuthLink href="/forgot-password">Request a new link</AuthLink>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
        Choose a new password
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
        You will be signed in straight after.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <FormError message={formError} />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint={`${MIN_PASSWORD} characters or more`}
          value={password}
          error={error}
          onChange={setPassword}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 min-h-13 w-full text-[15px]"
        >
          {isSubmitting ? "Saving…" : "Save password"}
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>
    </form>
  );
}
