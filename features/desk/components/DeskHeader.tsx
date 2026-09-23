"use client";

import {
  CreditCard,
  Hotel,
  KeyRound,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { ChangePasswordModal, signOut, useSession } from "@/features/auth";
import { useBilling, useRequests, useSettings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui";

import { useTicketAlerts } from "../use-ticket-alerts";
import { allowedPath } from "./DeskBoot";
import { NotificationsMenu } from "./NotificationsMenu";

const NAV = [
  { href: "/desk", label: "Inbox" },
  { href: "/desk/history", label: "History" },
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
  const billing = useBilling();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const unanswered = requests.filter(
    (request) => !request.archived && request.status === "new",
  );
  const openRequest = useCallback(
    (id: number) => router.push(`/desk?open=${id}`),
    [router],
  );
  useTicketAlerts(unanswered, settings.notifications, openRequest);
  const role = session?.role ?? "Front desk";
  const isManager = role === "Manager";
  const nav = NAV.filter((item) => allowedPath(role, item.href));

  const agent = session?.name ?? "";
  const email = session?.email ?? "";

  return (
    <>
      {billing && billing.status !== "active" ? (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[12.5px]",
            billing.status === "expired"
              ? "bg-urgent text-paper"
              : "bg-sand/40 text-sand-ink",
          )}
        >
          {billing.status === "expired"
            ? "Your plan has ended. The inbox is read-only until it is renewed."
            : `Free trial · ${billing.daysLeft ?? 0} day${billing.daysLeft === 1 ? "" : "s"} left`}
          {isManager ? (
            <Link
              href="/desk/settings?section=billing"
              className="font-medium underline underline-offset-3"
            >
              {billing.status === "expired" ? "Renew" : "See plans"}
            </Link>
          ) : null}
        </div>
      ) : null}
      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line bg-surface px-4 py-3 md:px-6.5 md:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5 lg:w-80">
          <Hotel strokeWidth={1.4} className="size-[19px] shrink-0" />
          <span className="truncate text-[15px] font-semibold tracking-[-0.02em]">
            {settings.hotel.name}
          </span>
          <span className="hidden text-[13px] whitespace-nowrap text-faint md:inline">
            {agent} · {role}
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
                  {role} · {email}
                </div>
              </div>

              <div className="my-1 h-px bg-line-soft" />

              {isManager ? (
                <Link
                  href="/desk/settings?section=billing"
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
              {session?.isOwner ? (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={MENU_ITEM}
                >
                  <ShieldCheck
                    strokeWidth={1.5}
                    className="size-[15px] text-muted"
                  />
                  RoomCall admin
                </Link>
              ) : null}
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
                  <LogOut
                    strokeWidth={1.5}
                    className="size-[15px] text-muted"
                  />
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
    </>
  );
}
