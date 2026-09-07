"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Wordmark } from "@/shared/ui/wordmark";

const SECTIONS = [
  { id: "how", label: ka.marketing.nav.how },
  { id: "features", label: ka.marketing.nav.features },
  { id: "pricing", label: ka.marketing.nav.pricing },
  { id: "faq", label: ka.marketing.nav.faq },
];

export function LandingHeader() {
  const [isSolid, setIsSolid] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid
          ? "border-b border-border bg-white/80 shadow-[0_8px_28px_rgb(76_49_168/0.08)] backdrop-blur-[20px]"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-310 items-center gap-3 px-4 md:h-18 md:px-10">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={ka.marketing.nav.openMenu}
              className="md:hidden"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 bg-white/95 backdrop-blur-[20px]"
          >
            <SheetHeader>
              <SheetTitle>
                <Wordmark size={22} />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "rounded-panel px-4 py-3 text-[15px] font-semibold transition-colors",
                    activeId === section.id
                      ? "bg-accent text-accent-foreground"
                      : "text-label hover:bg-muted/80",
                  )}
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Button asChild variant="soft" size="block">
                <Link href="/login">{ka.marketing.nav.login}</Link>
              </Button>
              <Button asChild size="block">
                <Link href="/register">{ka.marketing.nav.cta}</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="link-underline shrink-0">
          <Wordmark size={26} />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-active={activeId === section.id}
              className={cn(
                "link-underline py-1 text-[13.5px] font-semibold transition-colors",
                activeId === section.id
                  ? "text-primary-strong"
                  : "text-label hover:text-primary-strong",
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          <Button asChild size="sm">
            <Link href="/login">{ka.marketing.nav.login}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
