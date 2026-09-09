"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { updateSettings, useSettings } from "@/features/requests";
import { Button, showToast } from "@/shared/ui";

import {
  checkSignUp,
  hasErrors,
  MIN_PASSWORD,
  type SignUpErrors,
} from "../credentials";
import { signIn } from "../store";
import { AuthField, PasswordField } from "./AuthField";
import { AuthLink } from "./AuthLink";

export function SignUpForm() {
  const router = useRouter();
  const settings = useSettings();
  const [name, setName] = useState("");
  const [hotel, setHotel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});

  function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkSignUp({ name, hotel, email, password });
    setErrors(found);
    if (hasErrors(found)) return;

    signIn({ name: name.trim(), email, hotel: hotel.trim() });
    updateSettings({ hotel: { ...settings.hotel, name: hotel.trim() } });
    showToast(`${hotel.trim()} is set up — start with Rooms`);
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
        <Button type="submit" className="mt-2 min-h-13 w-full text-[15px]">
          Create hotel
          <ArrowRight strokeWidth={1.6} className="size-4" />
        </Button>
      </div>

      <p className="mt-7 text-center text-[14px] text-soft">
        Already on RoomCall? <AuthLink href="/sign-in">Sign in</AuthLink>
      </p>

      <p className="mt-8 border-t border-line-soft pt-5 text-[12px] leading-relaxed text-faint">
        Demo build — nothing is sent anywhere. The hotel name you type replaces
        the demo one in Settings, and the session is kept in this browser only.
      </p>
    </form>
  );
}
