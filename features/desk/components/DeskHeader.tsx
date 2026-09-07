"use client";

import { Hotel, Volume2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { FRONT_DESK_AGENT, HOTEL, useRequests } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

const NAV = [
  { href: "/desk", label: "Inbox" },
  { href: "/desk/analytics", label: "Analytics" },
];

export function DeskHeader() {
  const requests = useRequests();
  const pathname = usePathname();
  const [isAlertsOn, setIsAlertsOn] = useState(true);

  const newCount = requests.filter(
    (request) => request.status === "new",
  ).length;

  return (
    <div className="flex items-center gap-6.5 border-b border-line bg-surface px-6.5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Hotel strokeWidth={1.4} className="size-[19px]" />
        <span className="text-[15px] font-semibold tracking-[-0.02em]">
          {HOTEL.name}
        </span>
        <span className="text-[13px] text-faint">
          Front desk · {FRONT_DESK_AGENT}
        </span>
      </div>

      <nav className="flex gap-0.5 rounded-full bg-ink/5 p-[3px]">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-8.5 items-center rounded-full px-4 text-[13px] font-medium transition-colors",
              pathname === item.href ? "bg-ink text-paper" : "text-muted",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2.5">
        {newCount > 0 ? (
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-urgent/10 px-3.5 text-xs font-medium text-urgent">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-urgent" />
            {newCount} new
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setIsAlertsOn(!isAlertsOn)}
          className={cn(
            "flex min-h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-xs",
            isAlertsOn
              ? "border-sage/40 bg-sage/8 text-sage-deep"
              : "border-line-strong text-faint",
          )}
        >
          <Volume2 strokeWidth={1.5} className="size-3.5" />
          <span>{isAlertsOn ? "Alerts on" : "Alerts muted"}</span>
        </button>
      </div>
    </div>
  );
}
