import { Bell, Search } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { formatLongDate } from "@/shared/lib/dates";

interface TopbarProps {
  title: string;
  date: Date;
}

export function Topbar({ title, date }: TopbarProps) {
  return (
    <div className="mb-4.5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3.5">
      <div className="flex min-w-0 items-baseline gap-3">
        <div className="truncate text-[19px] font-bold tracking-[-0.025em]">
          {title}
        </div>
        <div className="hidden text-[13px] whitespace-nowrap text-muted-foreground md:block">
          {formatLongDate(date)}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <label className="hidden h-9 w-58 cursor-text items-center gap-2.25 rounded-xl border border-input bg-white px-3.5 md:flex">
          <Search className="size-3.75 shrink-0 text-ghost" />
          <input
            placeholder={ka.topbar.search}
            className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
          />
        </label>
        <button
          type="button"
          aria-label={ka.topbar.notifications}
          className="relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-input bg-white text-label hover:border-primary/40"
        >
          <Bell className="size-4.25" />
          <span className="absolute top-1.5 right-1.5 size-1.75 rounded-full bg-primary ring-2 ring-white" />
        </button>
      </div>
    </div>
  );
}
