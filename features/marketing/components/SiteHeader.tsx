import Link from "next/link";

import { Wordmark } from "@/shared/ui";

import { SectionLink } from "./SectionLink";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-7 px-6 py-3.5 md:px-8 md:py-4">
        <Wordmark />

        <nav className="ms-6 hidden gap-6 text-[14px] text-muted md:flex">
          {LINKS.map((link) => (
            <SectionLink
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden min-h-11 items-center rounded-full border border-line-strong px-4.5 text-[14px] font-medium transition-colors hover:border-ink md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-4.5 text-[14px] font-medium whitespace-nowrap text-paper md:px-5"
          >
            <span className="sm:hidden">Start trial</span>
            <span className="hidden sm:inline">Start free trial</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
