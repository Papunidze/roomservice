"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  LayoutGrid,
  List,
  MessageSquare,
  Settings,
  Sparkles,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { WordmarkMark } from "@/shared/ui/wordmark";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: "/dashboard";
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: ka.nav.groups.daily,
    items: [
      { label: ka.nav.dashboard, icon: LayoutGrid, href: "/dashboard" },
      { label: ka.nav.bookings, icon: CalendarDays, badge: "3" },
      { label: ka.nav.messages, icon: MessageSquare, badge: "12" },
      { label: ka.nav.clients, icon: Users },
    ],
  },
  {
    label: ka.nav.groups.manage,
    items: [
      { label: ka.nav.assistant, icon: Sparkles },
      { label: ka.nav.site, icon: Globe },
      { label: ka.nav.services, icon: List },
      { label: ka.nav.staff, icon: UserCog },
    ],
  },
  {
    label: ka.nav.groups.system,
    items: [{ label: ka.nav.settings, icon: Settings }],
  },
];

interface SidebarProps {
  businessName: string;
  planLabel: string;
}

export function Sidebar({ businessName, planLabel }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col self-start border-r border-border bg-white/70 pb-3.5 backdrop-blur-[20px] transition-[width] duration-200 md:flex",
        isCollapsed ? "w-[74px] px-2.5" : "w-58 px-3",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b border-border",
          isCollapsed ? "py-4" : "px-1 pt-3.5 pb-3.5",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8.5 shrink-0 place-items-center rounded-[11px] bg-linear-140 from-primary-light to-primary text-white">
            <WordmarkMark size={18} dotClassName="fill-[#c9b6ff]" />
          </span>
          {!isCollapsed && (
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-extrabold">
                {businessName}
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-bold tracking-[0.1em] text-ghost uppercase">
                Tanda · {planLabel}
              </span>
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label={ka.nav.collapse}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-[10px] bg-muted/90 text-label"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label={ka.nav.expand}
          className="mx-auto mt-3 grid size-7 cursor-pointer place-items-center rounded-[10px] bg-muted/90 text-label"
        >
          <ChevronRight className="size-3.5" />
        </button>
      )}

      <nav className="flex min-w-0 flex-col gap-3.5 pt-3.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex min-w-0 flex-col gap-px">
            {!isCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.13em] text-ghost uppercase">
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <NavButton
                key={item.label}
                item={item}
                isActive={item.href === pathname}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="relative mt-auto flex min-w-0 flex-col gap-2 border-t border-border pt-3">
        {isProfileOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-0 z-30 flex min-w-48 flex-col gap-0.5 rounded-panel border border-glass-border bg-popover p-1.5 shadow-raised backdrop-blur-[18px]">
            <button
              type="button"
              className="cursor-pointer rounded-[14px] px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-ink-soft hover:bg-muted/90"
            >
              {ka.nav.settings}
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-[14px] px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-destructive hover:bg-destructive/8"
            >
              {ka.nav.signOut}
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2.5 rounded-panel py-2.5",
            isCollapsed ? "justify-center px-0" : "px-3",
            isProfileOpen ? "bg-white shadow-raised" : "bg-muted/75",
          )}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-140 from-tone-violet to-[#d9ccff] text-sm font-bold text-primary-strong">
            {[...businessName][0]}
          </span>
          {!isCollapsed && (
            <>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[13px] font-bold">
                  {businessName}
                </span>
                <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] font-bold text-primary-strong">
                  {planLabel}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-ghost transition-transform",
                  isProfileOpen && "rotate-180",
                )}
              />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavButton({ item, isActive, isCollapsed }: NavButtonProps) {
  const Icon = item.icon;
  const className = cn(
    "flex w-full items-center gap-2.5 rounded-[11px] py-2.25 text-[13.5px] whitespace-nowrap transition-colors",
    isCollapsed ? "justify-center px-0" : "px-3",
    isActive && "bg-primary font-bold text-white shadow-nav",
    !isActive &&
      item.href &&
      "font-semibold text-label hover:bg-muted/80 hover:text-ink-soft",
    !isActive && !item.href && "font-semibold text-ghost",
  );

  const content = (
    <>
      <Icon className={cn("size-4.25 shrink-0", !isActive && "opacity-70")} />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "rounded-full px-2 py-px text-[11px] font-bold",
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </>
  );

  if (!item.href) {
    return (
      <button
        type="button"
        disabled
        title={`${item.label} — ${ka.nav.soon}`}
        className={cn(className, "cursor-default")}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} title={item.label} className={className}>
      {content}
    </Link>
  );
}
