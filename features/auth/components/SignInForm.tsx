"use client";

import Link from "next/link";
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
        Sign in to your desk
      </h1>
      <p className="mt-2 mb-8 text-sm leading-relaxed text-muted">
        The console where guest requests arrive, get assigned and get answered.
      </p>

      <div className="flex flex-col gap-4">
        <AuthField
          label="Work email"
          type="email"
          autoComplete="username"
          placeholder="nino@batumipalace.ge"
          value={email}
          error={errors.email}
          onChange={setEmail}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
      </div>

      <Button type="submit" className="mt-7 min-h-12 w-full text-sm">
        Sign in
      </Button>

      <p className="mt-5 text-center text-[13px] text-muted">
        No account yet?{" "}
        <Link href="/sign-up" className="font-medium text-sage underline">
          Set up your hotel
        </Link>
      </p>

      <p className="mt-8 rounded-tile border border-dashed border-line-dashed px-4 py-3.5 text-[12px] leading-relaxed text-faint">
        Demo build — there is no server behind this form. Any valid email and an
        eight-character password sign you in, and the session is kept in this
        browser only.
      </p>
    </form>
  );
}
