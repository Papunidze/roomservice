"use client";

import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { cn } from "@/shared/lib/cn";
import { Button, QrCode, showToast } from "@/shared/ui";

import {
  disableTwoFactor,
  enableTwoFactor,
  fetchMe,
  setupTwoFactor,
} from "../api";
import { signIn, useSession } from "../store";
import { CodeField } from "./CodeField";
import { FormError } from "./FormError";

type Step =
  | { kind: "idle" }
  | { kind: "setup"; secret: string; otpauthUrl: string }
  | { kind: "turn-off" };

export function TwoFactorCard({ className }: { className?: string }) {
  const session = useSession();
  const [step, setStep] = useState<Step>({ kind: "idle" });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isBusy, setIsBusy] = useState(false);
  const isOn = session?.twoFactorEnabled ?? false;

  const reset = () => {
    setStep({ kind: "idle" });
    setCode("");
    setError(undefined);
    setFormError(undefined);
  };

  async function refreshSession() {
    const user = await fetchMe();
    if (user) signIn(user);
  }

  async function begin() {
    setIsBusy(true);
    const result = await setupTwoFactor();
    setIsBusy(false);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    setStep({ kind: "setup", ...result.data });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    const result =
      step.kind === "turn-off"
        ? await disableTwoFactor(code)
        : await enableTwoFactor(code);
    setIsBusy(false);

    if (!result.ok) {
      setError(result.fields.code);
      setFormError(result.fields.code ? undefined : result.message);
      return;
    }

    await refreshSession();
    showToast(
      step.kind === "turn-off"
        ? "Two-factor authentication is off"
        : "Two-factor authentication is on",
    );
    reset();
  }

  return (
    <div className={cn("px-6 py-5", className)}>
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-full",
            isOn ? "bg-sage/12 text-sage-deep" : "bg-ink/5 text-muted",
          )}
        >
          <ShieldCheck strokeWidth={1.6} className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold">
            Two-factor authentication
          </span>
          <span className="mt-0.5 block text-[12.5px] text-faint">
            {isOn
              ? "On. Signing in asks for a code from your authenticator app."
              : "Off. Add a second step to sign-in with an authenticator app such as Google Authenticator or 1Password."}
          </span>
        </span>
        {step.kind === "idle" ? (
          isOn ? (
            <Button
              variant="ghost"
              onClick={() => setStep({ kind: "turn-off" })}
            >
              Turn off
            </Button>
          ) : (
            <Button disabled={isBusy} onClick={begin}>
              {isBusy ? "Preparing…" : "Turn on"}
            </Button>
          )
        ) : null}
      </div>

      {step.kind !== "idle" ? (
        <form
          onSubmit={submit}
          noValidate
          className="mt-5 flex flex-col gap-4 border-t border-line-soft pt-5"
        >
          {step.kind === "setup" ? (
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="w-44 shrink-0 rounded-xl bg-paper p-2.5">
                <QrCode value={step.otpauthUrl} className="size-full" />
              </div>
              <div className="text-[13.5px] leading-relaxed text-soft">
                <p>
                  1. Open your authenticator app and scan this code, or type the
                  key by hand.
                </p>
                <p className="mt-2 font-mono text-[13px] tracking-[0.12em] break-all text-ink">
                  {step.secret.match(/.{1,4}/g)?.join(" ")}
                </p>
                <p className="mt-2">
                  2. Enter the 6-digit code it shows to finish.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[13.5px] leading-relaxed text-soft">
              Enter a current code from your authenticator app to turn
              two-factor authentication off.
            </p>
          )}

          <FormError message={formError} />
          <CodeField value={code} error={error} onChange={setCode} />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={reset}>
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy || code.length < 6}>
              {step.kind === "turn-off" ? "Turn off" : "Turn on"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
