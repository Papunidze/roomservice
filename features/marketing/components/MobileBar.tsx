"use client";

import { CircleHelp, LogIn, Route, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

import { SectionLink, useActiveSection } from "./SectionLink";

const SECTIONS = [
  { href: "/#how", label: "How it works", icon: Route },
  { href: "/#pricing", label: "Pricing", icon: Tag },
  { href: "/#faq", label: "FAQ", icon: CircleHelp },
] as const;

const ITEM =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[11.5px] font-medium transition-colors";

export function MobileBar() {
  const active = useActiveSection();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {SECTIONS.map((section) => {
        const isActive = active === section.href.slice(1);
        return (
          <SectionLink
            key={section.href}
            href={section.href}
            className={cn(ITEM, isActive ? "text-ink" : "text-faint")}
          >
            <section.icon
              strokeWidth={isActive ? 2 : 1.6}
              className="size-5.5"
            />
            {section.label}
          </SectionLink>
        );
      })}
      <Link href="/sign-in" className={cn(ITEM, "text-faint")}>
        <LogIn strokeWidth={1.6} className="size-5.5" />
        Sign in
      </Link>
    </nav>
  );
}
