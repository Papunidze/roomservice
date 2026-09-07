"use client";

import Link from "next/link";
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
        Set up your hotel
      </h1>
      <p className="mt-2 mb-8 text-sm leading-relaxed text-muted">
        Name the property, print the room plates, and the desk is live.
      </p>

      <div className="flex flex-col gap-4">
        <AuthField
          label="Your name"
          autoComplete="name"
          placeholder="Nino Tsereteli"
          value={name}
          error={errors.name}
          onChange={setName}
        />
        <AuthField
          label="Hotel name"
          autoComplete="organization"
          placeholder="Batumi Palace"
          value={hotel}
          error={errors.hotel}
          onChange={setHotel}
        />
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
          autoComplete="new-password"
          hint={`${MIN_PASSWORD} characters or more`}
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
      </div>

      <Button type="submit" className="mt-7 min-h-12 w-full text-sm">
        Create the desk
      </Button>

      <p className="mt-5 text-center text-[13px] text-muted">
        Already set up?{" "}
        <Link href="/sign-in" className="font-medium text-sage underline">
          Sign in
        </Link>
      </p>

      <p className="mt-8 rounded-tile border border-dashed border-line-dashed px-4 py-3.5 text-[12px] leading-relaxed text-faint">
        Demo build — nothing is sent anywhere. The hotel name you type replaces
        the demo one in Settings, and the session is kept in this browser only.
      </p>
    </form>
  );
}
