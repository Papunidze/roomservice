"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutGrid,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";

interface TabItem {
  label: string;
  icon: LucideIcon;
  href?: "/dashboard";
}

const TABS: TabItem[] = [
  { label: ka.nav.dashboard, icon: LayoutGrid, href: "/dashboard" },
  { label: ka.nav.bookings, icon: CalendarDays },
  { label: ka.nav.messages, icon: MessageSquare },
  { label: "AI", icon: Sparkles },
  { label: ka.nav.more, icon: MoreHorizontal },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-80 mx-auto flex max-w-105 gap-1 rounded-full border border-white/95 bg-white/95 p-1.5 shadow-[0_16px_34px_rgb(76_49_168/0.2)] backdrop-blur-[18px] md:hidden">
      {TABS.map((tab) => (
        <Tab key={tab.label} tab={tab} isActive={tab.href === pathname} />
      ))}
    </nav>
  );
}

function Tab({ tab, isActive }: { tab: TabItem; isActive: boolean }) {
  const Icon = tab.icon;

  const className = cn(
    "flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1 rounded-full px-1 py-2.5",
    isActive && "bg-primary text-white",
    !isActive && tab.href && "text-label active:bg-muted",
    !isActive && !tab.href && "text-ghost",
  );

  const content = (
    <>
      <Icon className="size-4.5 shrink-0" />
      <span
        className={cn(
          "max-w-full truncate text-[10px]",
          isActive ? "font-bold" : "font-semibold",
        )}
      >
        {tab.label}
      </span>
    </>
  );

  if (!tab.href) {
    return (
      <button
        type="button"
        disabled
        aria-label={`${tab.label} — ${ka.nav.soon}`}
        className={cn(className, "cursor-default")}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={tab.href}
      aria-current={isActive ? "page" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}
