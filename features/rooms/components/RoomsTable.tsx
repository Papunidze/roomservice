"use client";

import { DICTIONARY } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatWhen } from "@/shared/lib/time";

import type { Room } from "../types";

const GRID =
  "grid grid-cols-[36px_84px_64px_130px_1fr_96px_150px_190px] items-center gap-3";

const ACTION =
  "min-h-7.5 cursor-pointer rounded-full border border-line px-2.5 text-[11.5px] text-faint transition-colors hover:border-ink/30 hover:text-ink";

interface RoomsTableProps {
  rooms: Room[];
  openCounts: Record<string, number>;
  selected: Set<string>;
  activeRoom: string | null;
  onToggle: (no: string) => void;
  onToggleAll: () => void;
  onShowPlate: (no: string) => void;
  onCloseSession: (room: Room) => void;
}

export function RoomsTable({
  rooms,
  openCounts,
  selected,
  activeRoom,
  onToggle,
  onToggleAll,
  onShowPlate,
  onCloseSession,
}: RoomsTableProps) {
  const allSelected = selected.size === rooms.length && rooms.length > 0;

  return (
    <>
      <div
        className={cn(
          GRID,
          "px-3.5 pb-2.5 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
        )}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          aria-label="Select all rooms"
          className="size-4 cursor-pointer accent-sage"
        />
        <span>Room</span>
        <span>Floor</span>
        <span>Plate</span>
        <span>Guest</span>
        <span>Open</span>
        <span>Last activity</span>
        <span />
      </div>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto rounded-t-tile border border-b-0 border-line bg-surface">
        {rooms.map((room) => {
          const open = openCounts[room.no] ?? 0;
          return (
            <div
              key={room.no}
              className={cn(
                GRID,
                "min-h-14 border-b border-line-soft px-3.5 transition-colors",
                selected.has(room.no)
                  ? "bg-sage/5"
                  : activeRoom === room.no
                    ? "bg-paper"
                    : "hover:bg-paper/60",
              )}
            >
              <input
                type="checkbox"
                checked={selected.has(room.no)}
                onChange={() => onToggle(room.no)}
                aria-label={`Select room ${room.no}`}
                className="size-4 cursor-pointer accent-sage"
              />
              <span className="text-[17px] font-semibold tracking-[-0.03em]">
                {room.no}
              </span>
              <span className="text-[13px] text-muted">{room.floor}</span>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                  room.printed
                    ? "bg-sage/10 text-sage-deep"
                    : "bg-sand/45 text-sand-ink",
                )}
              >
                {room.printed ? "Printed" : "Not printed"}
              </span>
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "size-[7px] shrink-0 rounded-full",
                    room.session ? "bg-sage" : "bg-ink/15",
                  )}
                />
                <span className="text-[13px]">
                  {room.session
                    ? DICTIONARY[room.session.lang].name
                    : "No guest"}
                </span>
                <span className="truncate text-xs text-faint">
                  {room.session
                    ? `since ${formatWhen(room.session.since)}`
                    : ""}
                </span>
              </span>
              <span
                className={cn(
                  "font-mono text-[13px]",
                  open ? "font-semibold text-urgent" : "text-stone",
                )}
              >
                {open || "—"}
              </span>
              <span className="font-mono text-[11.5px] text-faint">
                {formatWhen(room.lastActivity)}
              </span>
              <span className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onShowPlate(room.no)}
                  className={ACTION}
                >
                  Plate
                </button>
                {room.session ? (
                  <button
                    type="button"
                    onClick={() => onCloseSession(room)}
                    className={ACTION}
                  >
                    Check out
                  </button>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
