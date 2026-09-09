"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";

type SectionHref = `/#${string}`;

let activeSection = "";
const listeners = new Set<() => void>();

function setActiveSection(hash: string) {
  activeSection = hash;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  const syncFromUrl = () => setActiveSection(window.location.hash);
  syncFromUrl();
  window.addEventListener("popstate", syncFromUrl);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("popstate", syncFromUrl);
  };
}

export const useActiveSection = () =>
  useSyncExternalStore(
    subscribe,
    () => activeSection,
    () => "",
  );

interface SectionLinkProps {
  href: SectionHref;
  className?: string;
  children: ReactNode;
}

export function SectionLink({ href, className, children }: SectionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function scrollToSection(event: MouseEvent) {
    if (pathname !== "/") return;
    const target = document.getElementById(href.slice(2));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    router.push(href, { scroll: false });
    setActiveSection(href.slice(1));
  }

  return (
    <Link href={href} onClick={scrollToSection} className={className}>
      {children}
    </Link>
  );
}
