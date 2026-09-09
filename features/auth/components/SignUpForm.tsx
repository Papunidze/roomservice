"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { updateSettings, useSettings } from "@/features/requests";
import { Button, showToast } from "@/shared/ui";

import { register } from "../api";
import {
  checkSignUp,
  hasErrors,
  MIN_PASSWORD,
  type SignUpErrors,
} from "../credentials";
import { signIn } from "../store";
import { AuthField, PasswordField } from "./AuthField";
import { AuthLink } from "./AuthLink";
import { FormError } from "./FormError";
import { GoogleButton } from "./GoogleButton";

export function SignUpForm() {
  const router = useRouter();
  const settings = useSettings();
  const [name, setName] = useState("");
  const [hotel, setHotel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkSignUp({ name, hotel, email, password });
    setErrors(found);
    setFormError(undefined);
    if (hasErrors(found)) return;

    setIsSubmitting(true);
    const result = await register({ name, hotel, email, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrors(
        result.code === "email_taken"
          ? { email: result.message }
          : result.fields,
      );
      setFormError(result.code === "email_taken" ? undefined : result.message);
      return;
    }

    signIn(result.data);
    updateSettings({ hotel: { ...settings.hotel, name: result.data.hotel } });
    showToast(`${result.data.hotel} is set up — start with Rooms`);
    router.push("/desk/rooms");
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">
        Start your free trial
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-soft">
        30 days, every feature, no card. You will be the hotel&apos;s first
        manager.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <FormError message={formError} />
        <AuthField
          label="Your name"
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={setName}
        />
        <AuthField
          label="Hotel name"
          autoComplete="organization"
          value={hotel}
          error={errors.hotel}
          onChange={setHotel}
        />
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
          autoComplete="new-password"
          hint={`${MIN_PASSWORD} characters or more`}
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 min-h-13 w-full text-[15px]"
        >
          {isSubmitting ? "Creating…" : "Create hotel"}
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>

      <GoogleButton />

      <p className="mt-7 text-center text-[14px] text-soft">
        Already on RoomCall? <AuthLink href="/sign-in">Sign in</AuthLink>
      </p>
    </form>
  );
}
