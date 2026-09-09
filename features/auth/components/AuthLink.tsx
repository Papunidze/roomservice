import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface AuthLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function AuthLink({ href, className, children }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-medium text-ink transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-sage hover:after:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}
