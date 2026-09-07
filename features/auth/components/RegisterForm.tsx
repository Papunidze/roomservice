"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

import { register } from "../actions";
import { AuthField } from "./AuthField";
import { AuthLayout } from "./AuthLayout";
import { SocialRow } from "./SocialRow";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(register, null);

  useEffect(() => {
    if (state?.ok) router.push("/dashboard");
  }, [state, router]);

  const fields = state?.ok === false ? state.error.fields : undefined;

  return (
    <AuthLayout
      title={ka.auth.register.title}
      subtitle={ka.auth.register.subtitle}
    >
      <form action={formAction}>
        <AuthField
          name="businessName"
          label={ka.auth.fields.businessName}
          autoComplete="organization"
          error={fields?.businessName}
        />
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
          autoComplete="new-password"
          label={ka.auth.fields.password}
          error={fields?.password}
        />

        <div className="mt-4 mb-5">
          <div className="flex items-start gap-2.75">
            <Checkbox id="acceptsTerms" name="acceptsTerms" className="mt-px" />
            <Label
              htmlFor="acceptsTerms"
              className="cursor-pointer text-[13px] leading-normal font-normal text-ink-soft"
            >
              {ka.auth.register.terms}
            </Label>
          </div>
          {fields?.acceptsTerms && (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-destructive"
            >
              {fields.acceptsTerms}
            </p>
          )}
        </div>

        <Button type="submit" size="block" disabled={isPending}>
          {ka.auth.register.submit}
        </Button>
      </form>

      <SocialRow label={ka.auth.orSignUp} />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>{ka.auth.register.hasAccount}</span>
        <Link
          href="/login"
          className="link-underline font-bold text-primary-strong"
        >
          {ka.auth.register.login}
        </Link>
      </div>
    </AuthLayout>
  );
}
