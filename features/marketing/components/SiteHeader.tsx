import { Hotel } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#languages", label: "Languages" },
  { href: "#desk", label: "Front desk" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-6 py-3.5 md:gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Hotel strokeWidth={1.4} className="size-[19px]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            RoomCall
          </span>
        </Link>

        <nav className="mx-auto hidden gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-8.5 items-center rounded-full px-3.5 text-[13px] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Link
            href="/sign-in"
            className="flex min-h-9.5 items-center rounded-full px-3.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/desk"
            className="flex min-h-9.5 items-center rounded-full bg-ink px-4 text-[13px] font-medium whitespace-nowrap text-paper"
          >
            <span className="hidden sm:inline">Open the console</span>
            <span className="sm:hidden">Console</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
