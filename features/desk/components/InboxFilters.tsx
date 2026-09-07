"use client";

import { Search } from "lucide-react";

import { FRONT_DESK_AGENT, type Status } from "@/features/requests";
import { Avatar, Chip } from "@/shared/ui";

export type InboxFilter = Status | "all";

const FILTERS: { key: InboxFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "progress", label: "In progress" },
  { key: "done", label: "Done" },
];

interface InboxFiltersProps {
  query: string;
  filter: InboxFilter;
  mineOnly: boolean;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: InboxFilter) => void;
  onMineToggle: () => void;
}

export function InboxFilters({
  query,
  filter,
  mineOnly,
  onQueryChange,
  onFilterChange,
  onMineToggle,
}: InboxFiltersProps) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-line-soft px-5 pt-4 pb-3">
      <div className="flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4">
        <Search strokeWidth={1.6} className="size-3.5 text-faint" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search room, category or text"
          aria-label="Search requests"
          spellCheck={false}
          className="w-0 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((option) => (
          <Chip
            key={option.key}
            active={filter === option.key}
            onClick={() => onFilterChange(option.key)}
          >
            {option.label}
          </Chip>
        ))}
        <Chip
          active={mineOnly}
          onClick={onMineToggle}
          className="ml-auto pl-1.5"
        >
          <Avatar name={FRONT_DESK_AGENT} className="size-4.5 text-[8.5px]" />
          Assigned to me
        </Chip>
      </div>
    </div>
  );
}
