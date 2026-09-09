"use client";

import { Plus, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";

import { useRequests, useSettings } from "@/features/requests";
import { LANGUAGES } from "@/shared/i18n";
import { askConfirm, Button, showToast } from "@/shared/ui";

import { openPlatePrint } from "../print";
import {
  addRooms,
  closeGuestSession,
  markPrinted,
  regenerateRoom,
  removeRooms,
  useRooms,
} from "../store";
import type { Room } from "../types";
import { AddRoomsModal } from "./AddRoomsModal";
import { QrPlatePanel } from "./QrPlatePanel";
import { RoomsTable } from "./RoomsTable";

export function RoomsScreen() {
  const rooms = useRooms();
  const requests = useRequests();
  const settings = useSettings();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [plateRoom, setPlateRoom] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const openCounts: Record<string, number> = {};
  for (const request of requests) {
    if (request.archived || request.status === "done") continue;
    openCounts[request.room] = (openCounts[request.room] ?? 0) + 1;
  }

  const active = rooms.find((room) => room.no === plateRoom);
  const plateLanguages = LANGUAGES.filter(
    (code) => settings.guestLanguages[code],
  );
  const withGuest = rooms.filter((room) => room.session).length;
  const unprinted = rooms.filter((room) => !room.printed).length;

  const toggle = (no: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(no)) next.add(no);
      return next;
    });

  const toggleAll = () =>
    setSelected((current) =>
      current.size === rooms.length
        ? new Set()
        : new Set(rooms.map((room) => room.no)),
    );

  const printPlates = (numbers: string[]) => {
    openPlatePrint(numbers);
    void markPrinted(numbers);
    setSelected(new Set());
  };

  const regenerate = (no: string) =>
    askConfirm({
      title: `Issue a new code for room ${no}?`,
      body: "The plate currently in the room stops working the moment you confirm. Print and replace it before the next check-in.",
      confirmLabel: "Issue new code",
      onConfirm: async () => {
        if (await regenerateRoom(no))
          showToast(`New code issued for room ${no} · old plate disabled`);
      },
    });

  const deleteSelected = () => {
    const numbers = [...selected];
    askConfirm({
      title: `Delete ${numbers.length} room${numbers.length === 1 ? "" : "s"}?`,
      body: "Their plates stop working and their open requests are archived. This cannot be undone.",
      confirmLabel: "Delete rooms",
      onConfirm: async () => {
        if (!(await removeRooms(numbers))) return;
        setSelected(new Set());
        if (plateRoom && numbers.includes(plateRoom)) setPlateRoom(null);
        showToast(
          `${numbers.length} room${numbers.length === 1 ? "" : "s"} deleted`,
        );
      },
    });
  };

  const checkOut = async (room: Room) => {
    if (await closeGuestSession(room.no))
      showToast(`Room ${room.no} checked out`);
  };

  return (
    <div className="flex h-[min(860px,calc(100dvh-8rem))] min-h-[560px] items-stretch">
      <div className="flex min-w-0 flex-1 flex-col px-7 pt-6">
        <div className="mb-4.5 flex items-center gap-3">
          <div>
            <div className="text-[22px] font-semibold tracking-[-0.03em]">
              Rooms
            </div>
            <div className="mt-0.5 text-[12.5px] text-faint">
              {rooms.length} rooms · {withGuest} with a guest ·{" "}
              {unprinted === 0
                ? "all plates printed"
                : `${unprinted} plate${unprinted === 1 ? "" : "s"} not printed yet`}
            </div>
          </div>
          <span className="flex-1" />
          <Button
            variant="ghost"
            disabled={rooms.length === 0}
            onClick={() => printPlates(rooms.map((room) => room.no))}
          >
            <Printer strokeWidth={1.6} className="size-3.5" />
            Print all plates
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus strokeWidth={1.8} className="size-3.5" />
            Add rooms
          </Button>
        </div>

        {selected.size > 0 ? (
          <div className="mb-3.5 flex items-center gap-3 rounded-full border border-sage/40 bg-sage/10 py-2 pr-2 pl-4.5 text-[13px]">
            <span className="font-medium text-sage-deep">
              {selected.size} room{selected.size === 1 ? "" : "s"} selected
            </span>
            <span className="text-muted">
              Print their plates, then put one in each room.
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              onClick={deleteSelected}
              className="text-urgent hover:border-urgent/50 hover:text-urgent"
            >
              <Trash2 strokeWidth={1.6} className="size-3.5" />
              Delete
            </Button>
            <Button onClick={() => printPlates([...selected])}>
              <Printer strokeWidth={1.6} className="size-3.5" />
              Print {selected.size} plate{selected.size === 1 ? "" : "s"}
            </Button>
            <button
              type="button"
              aria-label="Clear selection"
              onClick={() => setSelected(new Set())}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-muted hover:text-ink"
            >
              <X strokeWidth={1.6} className="size-4" />
            </button>
          </div>
        ) : null}

        <RoomsTable
          rooms={rooms}
          openCounts={openCounts}
          selected={selected}
          activeRoom={plateRoom}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onShowPlate={setPlateRoom}
          onCloseSession={checkOut}
        />
      </div>

      {active ? (
        <QrPlatePanel
          room={active}
          hotelName={settings.hotel.name}
          languages={plateLanguages}
          onClose={() => setPlateRoom(null)}
          onRegenerate={() => regenerate(active.no)}
          onPrint={() => printPlates([active.no])}
        />
      ) : null}

      {isAddOpen ? (
        <AddRoomsModal
          rooms={rooms}
          onClose={() => setIsAddOpen(false)}
          onCreate={async (added) => {
            if (!(await addRooms(added))) return;
            setIsAddOpen(false);
            showToast(
              `${added.length} room${added.length === 1 ? "" : "s"} added · select them and print the plates`,
            );
          }}
        />
      ) : null}
    </div>
  );
}
