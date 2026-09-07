"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";

import { login } from "../actions";
import { AuthField } from "./AuthField";
import { AuthLayout } from "./AuthLayout";
import { SocialRow } from "./SocialRow";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.ok) router.push("/dashboard");
  }, [state, router]);

  const fields = state?.ok === false ? state.error.fields : undefined;

  return (
    <AuthLayout title={ka.auth.login.title} subtitle={ka.auth.login.subtitle}>
      <form action={formAction}>
        <AuthField
          name="email"
          type="email"
          autoComplete="email"
          label={ka.auth.fields.email}
          error={fields?.email}
        />
        <AuthField
          name="password"
          type="password"
          autoComplete="current-password"
          label={ka.auth.fields.password}
          error={fields?.password}
        />
        <div className="mt-2 mb-5 flex justify-end">
          <Link
            href="/forgot-password"
            className="link-underline text-[13px] font-semibold text-primary-strong"
          >
            {ka.auth.login.forgot}
          </Link>
        </div>
        <Button type="submit" size="block" disabled={isPending}>
          {ka.auth.login.submit}
        </Button>
      </form>

      <SocialRow label={ka.auth.orContinue} />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>{ka.auth.login.noAccount}</span>
        <Link
          href="/register"
          className="link-underline font-bold text-primary-strong"
        >
          {ka.auth.login.register}
        </Link>
      </div>
    </AuthLayout>
  );
}
