"use client";

import { CreditCard, Hotel, KeyRound, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { ChangePasswordModal, signOut, useSession } from "@/features/auth";
import { useRequests, useSettings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui";

import { useTitleAlert } from "../use-title-alert";
import { NotificationsMenu } from "./NotificationsMenu";

const NAV = [
  { href: "/desk", label: "Inbox" },
  { href: "/desk/rooms", label: "Rooms" },
  { href: "/desk/team", label: "Team" },
  { href: "/desk/analytics", label: "Analytics" },
  { href: "/desk/preview", label: "Preview" },
  { href: "/desk/settings", label: "Settings" },
];

const MENU_ITEM =
  "flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-[13px] hover:bg-paper";

export function DeskHeader() {
  const requests = useRequests();
  const settings = useSettings();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const newCount = requests.filter(
    (request) => !request.archived && request.status === "new",
  ).length;
  useTitleAlert(newCount);
  const isManager = session?.role === "Manager";
  const nav = isManager ? NAV : NAV.filter((item) => item.href === "/desk");

  const agent = session?.name ?? "";
  const email = session?.email ?? "";

  return (
    <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line bg-surface px-4 py-3 md:px-6.5 md:py-3.5">
      <div className="flex min-w-0 items-center gap-2.5 lg:w-80">
        <Hotel strokeWidth={1.4} className="size-[19px] shrink-0" />
        <span className="truncate text-[15px] font-semibold tracking-[-0.02em]">
          {settings.hotel.name}
        </span>
        <span className="hidden text-[13px] whitespace-nowrap text-faint md:inline">
          {agent} · {session?.role ?? "Front desk"}
        </span>
      </div>

      <nav className="order-last flex w-full gap-0.5 overflow-x-auto rounded-full bg-ink/5 p-[3px] md:order-none md:mx-auto md:w-auto">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-8.5 shrink-0 items-center rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition-colors",
              pathname === item.href ? "bg-ink text-paper" : "text-muted",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center justify-end gap-2.5 lg:w-80">
        <NotificationsMenu />

        <button
          type="button"
          aria-label="Account menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "cursor-pointer rounded-full",
            isMenuOpen && "ring-1 ring-sage",
          )}
        >
          <Avatar name={agent} className="size-9.5 text-xs" />
        </button>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="animate-rise absolute top-14 right-4 z-50 w-68 max-w-[calc(100vw-2rem)] rounded-tile border border-line-strong bg-surface p-2 md:top-14.5 md:right-6.5">
            <div className="border-b border-line-soft px-3 pt-2.5 pb-3">
              <div className="text-sm font-semibold">{agent}</div>
              <div className="mt-0.5 text-[12.5px] text-faint">
                {session?.role ?? "Front desk"} · {email}
              </div>
            </div>

            <div className="my-1 h-px bg-line-soft" />

            {isManager ? (
              <Link
                href="/desk/settings"
                onClick={() => setIsMenuOpen(false)}
                className={MENU_ITEM}
              >
                <CreditCard
                  strokeWidth={1.5}
                  className="size-[15px] text-muted"
                />
                Billing
              </Link>
            ) : null}
            {isManager ? null : (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsPasswordOpen(true);
                }}
                className={MENU_ITEM}
              >
                <KeyRound
                  strokeWidth={1.5}
                  className="size-[15px] text-muted"
                />
                Change password
              </button>
            )}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                  router.push("/");
                }}
                className={MENU_ITEM}
              >
                <LogOut strokeWidth={1.5} className="size-[15px] text-muted" />
                Sign out
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className={MENU_ITEM}
              >
                <LogIn strokeWidth={1.5} className="size-[15px] text-muted" />
                Sign in
              </Link>
            )}
          </div>
        </>
      ) : null}
      {isPasswordOpen ? (
        <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />
      ) : null}
    </div>
  );
}
