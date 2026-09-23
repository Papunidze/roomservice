"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Button, Field, FIELD_CONTROL, Modal } from "@/shared/ui";

import { nextRoomNumbers } from "../numbers";
import type { Room } from "../types";

const MODES = [
  { key: "single", label: "Single room" },
  { key: "range", label: "Range" },
] as const;

const ROOM_NUMBER = /^[\p{L}\p{N}-]{1,10}$/u;

interface AddRoomsModalProps {
  rooms: Room[];
  onClose: () => void;
  onCreate: (added: string[]) => void;
}

export function AddRoomsModal({
  rooms,
  onClose,
  onCreate,
}: AddRoomsModalProps) {
  const [mode, setMode] = useState<"single" | "range">("range");
  const [fromValue, setFromValue] = useState("601");
  const [toValue, setToValue] = useState("610");
  const [single, setSingle] = useState("");

  const from = Number(fromValue);
  const to = Number(toValue);
  const isRangeValid = from > 0 && to >= from && to - from < 200;
  const taken = new Set(rooms.map((room) => room.no));
  const singleNo = single.trim();
  const isSingleValid = ROOM_NUMBER.test(singleNo) && !taken.has(singleNo);

  const added =
    mode === "range"
      ? isRangeValid
        ? nextRoomNumbers(from, to, rooms)
        : []
      : isSingleValid
        ? [singleNo]
        : [];
  const skipped =
    mode === "range" && isRangeValid ? to - from + 1 - added.length : 0;

  const preview =
    mode === "single"
      ? taken.has(singleNo)
        ? `Room ${singleNo} already exists.`
        : "Digits, letters and dashes, like 101, 12A or P-3."
      : !isRangeValid
        ? "Enter a range like 601 – 610."
        : `${added.length} new room${added.length === 1 ? "" : "s"}${
            skipped ? ` · ${skipped} already exist and will be skipped` : ""
          }`;

  return (
    <Modal
      title="Add rooms"
      description="Each room gets its own QR plate. Print them afterwards."
      onClose={onClose}
    >
      <div className="mt-4.5 flex w-fit gap-0.5 rounded-full bg-ink/5 p-[3px]">
        {MODES.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setMode(option.key)}
            className={cn(
              "min-h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
              mode === option.key ? "bg-ink text-paper" : "text-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-end gap-2.5">
        {mode === "range" ? (
          <>
            <Field label="From" className="flex-1">
              <input
                inputMode="numeric"
                value={fromValue}
                onChange={(event) =>
                  setFromValue(event.target.value.replace(/\D/g, ""))
                }
                className={cn(FIELD_CONTROL, "font-mono")}
              />
            </Field>
            <span className="pb-3 text-ghost">–</span>
            <Field label="To" className="flex-1">
              <input
                inputMode="numeric"
                value={toValue}
                onChange={(event) =>
                  setToValue(event.target.value.replace(/\D/g, ""))
                }
                className={cn(FIELD_CONTROL, "font-mono")}
              />
            </Field>
          </>
        ) : (
          <Field label="Room number" className="flex-1">
            <input
              autoFocus
              value={single}
              onChange={(event) => setSingle(event.target.value)}
              className={cn(FIELD_CONTROL, "font-mono")}
            />
          </Field>
        )}
      </div>

      <div className="mt-3 text-[12.5px] text-muted">{preview}</div>

      <div className="mt-5.5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={added.length === 0} onClick={() => onCreate(added)}>
          {added.length > 0
            ? `Create ${added.length} room${added.length === 1 ? "" : "s"}`
            : "Create"}
        </Button>
      </div>
    </Modal>
  );
}
