"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";

import { requestPasswordCode } from "../actions";
import { AuthField } from "./AuthField";
import { AuthLayout } from "./AuthLayout";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    requestPasswordCode,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      router.push(`/verify?email=${encodeURIComponent(state.data.email)}`);
    }
  }, [state, router]);

  const fields = state?.ok === false ? state.error.fields : undefined;

  return (
    <AuthLayout title={ka.auth.forgot.title} subtitle={ka.auth.forgot.subtitle}>
      <form action={formAction}>
        <AuthField
          name="email"
          type="email"
          autoComplete="email"
          label={ka.auth.fields.email}
          error={fields?.email}
        />
        <Button
          type="submit"
          size="block"
          disabled={isPending}
          className="mt-4"
        >
          {ka.auth.forgot.submit}
        </Button>
      </form>

      <div className="mt-5 flex justify-center text-sm">
        <Link
          href="/login"
          className="link-underline font-bold text-primary-strong"
        >
          {ka.auth.forgot.back}
        </Link>
      </div>
    </AuthLayout>
  );
}
