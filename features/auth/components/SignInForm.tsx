"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useSettings } from "@/features/requests";
import { Button, showToast } from "@/shared/ui";

import {
  checkSignIn,
  displayName,
  hasErrors,
  type SignInErrors,
} from "../credentials";
import { signIn } from "../store";
import { AuthField, PasswordField } from "./AuthField";
import { AuthLink } from "./AuthLink";

export function SignInForm() {
  const router = useRouter();
  const settings = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});

  function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkSignIn({ email, password });
    setErrors(found);
    if (hasErrors(found)) return;

    signIn({
      name: displayName(email),
      email,
      hotel: settings.hotel.name,
    });
    showToast(`Signed in as ${email}`);
    router.push("/desk");
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
        <Button type="submit" className="mt-2 min-h-13 w-full text-[15px]">
          Sign in
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>

      <p className="mt-7 text-center text-[14px] text-soft">
        New hotel? <AuthLink href="/sign-up">Start a free trial</AuthLink>
      </p>

      <p className="mt-8 border-t border-line-soft pt-5 text-[12px] leading-relaxed text-faint">
        Demo build — there is no server behind this form. Any valid email and an
        eight-character password sign you in, and the session is kept in this
        browser only.
      </p>
    </form>
  );
}
