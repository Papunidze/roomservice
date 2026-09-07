"use client";

import { Download, Plus, X } from "lucide-react";
import { useState } from "react";

import { useRequests, useSettings } from "@/features/requests";
import { LANGUAGES } from "@/shared/i18n";
import { askConfirm, Button, showToast } from "@/shared/ui";

import { addRooms, markPrinted, patchRoom, useRooms } from "../store";
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
  const withSession = rooms.filter((room) => room.session).length;
  const unprinted = rooms.filter((room) => !room.printed).length;
  const floors = new Set(rooms.map((room) => room.floor)).size;

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

  const regenerate = (no: string) =>
    askConfirm({
      title: `Regenerate QR for room ${no}?`,
      body: "The plate currently in the room stops working the moment you confirm. Print and replace it before the next check-in.",
      confirmLabel: "Regenerate",
      onConfirm: () => {
        patchRoom(no, { printed: false });
        showToast(`QR regenerated for room ${no} · old code disabled`);
      },
    });

  const closeSession = (room: Room) => {
    patchRoom(room.no, { session: null });
    showToast(`Session closed for room ${room.no}`);
  };

  const bulkPrinted = () => {
    markPrinted([...selected]);
    showToast(`${selected.size} rooms marked as printed`);
    setSelected(new Set());
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
              {rooms.length} rooms · {floors} floors · {withSession} active
              sessions · {unprinted} plates not printed
            </div>
          </div>
          <span className="flex-1" />

          {selected.size > 0 ? (
            <span className="inline-flex min-h-10 items-center gap-2.5 rounded-full bg-ink pr-1.5 pl-3.5 text-[12.5px] text-paper">
              <span>{selected.size} selected</span>
              <button
                type="button"
                onClick={bulkPrinted}
                className="min-h-7.5 cursor-pointer rounded-full border border-paper/25 px-3 text-xs"
              >
                Mark printed
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(`QR pack · ${selected.size} plates · preparing PDF`)
                }
                className="min-h-7.5 cursor-pointer rounded-full border border-paper/25 px-3 text-xs"
              >
                QR pack
              </button>
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => setSelected(new Set())}
                className="grid size-7.5 cursor-pointer place-items-center rounded-full text-paper/70"
              >
                <X strokeWidth={1.6} className="size-3.5" />
              </button>
            </span>
          ) : null}

          <Button
            variant="ghost"
            onClick={() =>
              showToast(`QR pack · ${rooms.length} plates · preparing PDF`)
            }
          >
            <Download strokeWidth={1.6} className="size-3.5" />
            Download QR pack (PDF)
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus strokeWidth={1.8} className="size-3.5" />
            Add rooms
          </Button>
        </div>

        <RoomsTable
          rooms={rooms}
          openCounts={openCounts}
          selected={selected}
          activeRoom={plateRoom}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onShowPlate={setPlateRoom}
          onRegenerate={regenerate}
          onCloseSession={closeSession}
        />
      </div>

      {active ? (
        <QrPlatePanel
          room={active}
          hotelName={settings.hotel.name}
          languages={plateLanguages}
          onClose={() => setPlateRoom(null)}
          onRegenerate={() => regenerate(active.no)}
          onPrinted={() => patchRoom(active.no, { printed: true })}
        />
      ) : null}

      {isAddOpen ? (
        <AddRoomsModal
          rooms={rooms}
          onClose={() => setIsAddOpen(false)}
          onCreate={(added) => {
            addRooms(added);
            setIsAddOpen(false);
            showToast(
              `${added.length} room${added.length === 1 ? "" : "s"} added · plates ready to print`,
            );
          }}
        />
      ) : null}
    </div>
  );
}
