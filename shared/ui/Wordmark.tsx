import Link from "next/link";

import { cn } from "@/shared/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-baseline gap-2.5 whitespace-nowrap",
        className,
      )}
    >
      <span className="text-[19px] font-semibold tracking-[-0.02em]">
        RoomCall
      </span>
      <span className="hidden font-mono text-[10px] tracking-[0.16em] opacity-60 sm:inline">
        FOR HOTELS
      </span>
    </Link>
  );
}
