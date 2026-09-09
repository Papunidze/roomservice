import Link from "next/link";

const LINKS = [
  { href: "/r/205", label: "Guest demo" },
  { href: "/desk", label: "Front desk" },
];

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-10 text-[13px] text-faint">
      <span className="font-semibold text-ink">RoomCall</span>
      <span>RoomCall LLC · Batumi, Georgia</span>
      <nav className="flex gap-5 md:ms-auto">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
        <a
          href="mailto:hello@roomcall.ge"
          className="transition-colors hover:text-ink"
        >
          hello@roomcall.ge
        </a>
      </nav>
    </footer>
  );
}
