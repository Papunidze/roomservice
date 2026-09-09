"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  ChangePasswordModal,
  TwoFactorCard,
  useSession,
} from "@/features/auth";
import { cn } from "@/shared/lib/cn";
import { Avatar, Button } from "@/shared/ui";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

const ROLE_RULES = [
  {
    role: "Manager",
    access: "Everything: inbox, rooms, team, analytics and settings.",
  },
  {
    role: "Front desk, Housekeeping, Maintenance",
    access: "The inbox only. They reply, add notes, assign and close requests.",
  },
];

export function SecurityPanel() {
  const session = useSession();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  return (
    <div className="animate-rise max-w-180">
      <PanelHeading
        title="Security"
        subtitle="Your own sign-in, and what each role on your team can reach."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 px-6 py-5")}>
        <div className="flex items-center gap-3.5">
          <Avatar name={session?.name ?? ""} className="size-10 text-[13px]" />
          <span className="flex-1">
            <span className="block text-sm font-medium">{session?.name}</span>
            <span className="mt-0.5 block text-[12.5px] text-faint">
              {session?.role} · {session?.email}
            </span>
          </span>
          <Button variant="ghost" onClick={() => setIsPasswordOpen(true)}>
            <KeyRound strokeWidth={1.6} className="size-3.5" />
            Change password
          </Button>
        </div>
        <p className="mt-4 border-t border-line-soft pt-4 text-[12.5px] leading-relaxed text-faint">
          Forgot it? Sign out and use “Forgot password?” on the sign-in page. A
          reset link goes to {session?.email}.
        </p>
      </div>

      <TwoFactorCard className={cn(PANEL_CARD, "mt-4")} />

      <div className={cn(PANEL_CARD, "mt-4 px-6 py-5")}>
        <div className="text-[15px] font-semibold">Who can do what</div>
        <div className="mt-3 flex flex-col">
          {ROLE_RULES.map((rule) => (
            <div
              key={rule.role}
              className="grid min-h-13 grid-cols-[220px_1fr] items-center gap-3 border-t border-line-soft text-[13.5px]"
            >
              <span className="font-medium">{rule.role}</span>
              <span className="text-muted">{rule.access}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-faint">
          Team members sign in with a password you send them. Add people and
          reset their passwords from the{" "}
          <Link
            href="/desk/team"
            className="text-ink underline underline-offset-3"
          >
            Team page
          </Link>
          .
        </p>
      </div>

      {isPasswordOpen ? (
        <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />
      ) : null}
    </div>
  );
}
