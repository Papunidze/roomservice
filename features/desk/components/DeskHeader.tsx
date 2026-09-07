"use client";

import { Bell, BellOff, CreditCard, Hotel, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  FRONT_DESK_AGENT,
  updateSettings,
  useRequests,
  useSettings,
} from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Avatar, SegmentedOption, showToast } from "@/shared/ui";

const NAV = [
  { href: "/desk", label: "Inbox" },
  { href: "/desk/rooms", label: "Rooms" },
  { href: "/desk/team", label: "Team" },
  { href: "/desk/analytics", label: "Analytics" },
  { href: "/desk/settings", label: "Settings" },
];

const MENU_ITEM =
  "flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-[13px] hover:bg-paper";

export function DeskHeader() {
  const requests = useRequests();
  const settings = useSettings();
  const pathname = usePathname();
  const [isAlertsOn, setIsAlertsOn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const newCount = requests.filter(
    (request) => !request.archived && request.status === "new",
  ).length;

  return (
    <div className="relative flex items-center gap-5 border-b border-line bg-surface px-6.5 py-3.5">
      <div className="flex w-80 items-center gap-2.5">
        <Hotel strokeWidth={1.4} className="size-[19px]" />
        <span className="text-[15px] font-semibold tracking-[-0.02em]">
          {settings.hotel.name}
        </span>
        <span className="text-[13px] text-faint">
          {FRONT_DESK_AGENT} · Front desk
        </span>
      </div>

      <nav className="mx-auto flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-8.5 items-center rounded-full px-4 text-[13px] font-medium transition-colors",
              pathname === item.href ? "bg-ink text-paper" : "text-muted",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex w-80 items-center justify-end gap-2.5">
        {newCount > 0 ? (
          <span className="inline-flex min-h-8.5 items-center gap-1.5 rounded-full bg-urgent/10 px-3.5 text-[12.5px] font-medium text-urgent">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-urgent" />
            {newCount} new
          </span>
        ) : null}

        <button
          type="button"
          title="New-request alerts"
          aria-label={isAlertsOn ? "Mute alerts" : "Unmute alerts"}
          onClick={() => {
            setIsAlertsOn(!isAlertsOn);
            showToast(
              isAlertsOn
                ? "Alerts muted for this device"
                : "Alerts on · chime for new requests",
            );
          }}
          className={cn(
            "grid size-9.5 cursor-pointer place-items-center rounded-full border border-line-strong",
            isAlertsOn ? "text-ink" : "text-ghost",
          )}
        >
          {isAlertsOn ? (
            <Bell strokeWidth={1.5} className="size-[15px]" />
          ) : (
            <BellOff strokeWidth={1.5} className="size-[15px]" />
          )}
        </button>

        <button
          type="button"
          aria-label="Account menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "cursor-pointer rounded-full",
            isMenuOpen && "ring-1 ring-sage",
          )}
        >
          <Avatar name={FRONT_DESK_AGENT} className="size-9.5 text-xs" />
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
          <div className="animate-rise absolute top-14.5 right-6.5 z-50 w-68 rounded-tile border border-line-strong bg-surface p-2">
            <div className="border-b border-line-soft px-3 pt-2.5 pb-3">
              <div className="text-sm font-semibold">{FRONT_DESK_AGENT}</div>
              <div className="mt-0.5 text-[12.5px] text-faint">
                Front desk · nino@batumipalace.ge
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 px-3 pt-3 pb-2.5">
              <span className="text-[13px]">Interface language</span>
              <span className="flex gap-0.5 rounded-full bg-ink/5 p-0.5">
                {(["ka", "en"] as const).map((code) => (
                  <SegmentedOption
                    key={code}
                    active={settings.staffLang === code}
                    onClick={() => updateSettings({ staffLang: code })}
                  >
                    {code.toUpperCase()}
                  </SegmentedOption>
                ))}
              </span>
            </div>

            <div className="my-1 h-px bg-line-soft" />

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
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                showToast("Signed out on this device (demo build)");
              }}
              className={MENU_ITEM}
            >
              <LogOut strokeWidth={1.5} className="size-[15px] text-muted" />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
