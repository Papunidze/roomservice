import { Hotel } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { href: "/r/205", label: "Guest app (room 205)" },
  { href: "/desk", label: "Front desk" },
  { href: "/desk/analytics", label: "Analytics" },
  { href: "/sign-in", label: "Sign in" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Hotel strokeWidth={1.4} className="size-[18px]" />
            <span className="text-[14.5px] font-semibold tracking-[-0.02em]">
              RoomCall
            </span>
          </div>
          <p className="mt-3 max-w-[420px] text-[12.5px] leading-relaxed text-faint">
            Demo build. Requests, settings, rooms and team live in this browser
            — there is no server yet, and translated content comes from a fixed
            phrasebook rather than a model.
          </p>
        </div>

        <nav className="flex flex-col gap-2.5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
