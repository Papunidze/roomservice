"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Button, Field, FIELD_CONTROL, Modal } from "@/shared/ui";

import type { Room } from "../types";

interface EditRoomModalProps {
  room: Room;
  onClose: () => void;
  onSave: (patch: { name: string; floor: number }) => Promise<boolean>;
}

export function EditRoomModal({ room, onClose, onSave }: EditRoomModalProps) {
  const [name, setName] = useState(room.name);
  const [floor, setFloor] = useState(String(room.floor));
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    const isSaved = await onSave({
      name: name.trim(),
      floor: Number(floor) || 0,
    });
    setIsSaving(false);
    if (isSaved) onClose();
  };

  return (
    <Modal
      title={`Room ${room.no}`}
      description="A name helps staff, for example “Sea view suite”. Guests only see the number."
      onClose={onClose}
    >
      <div className="mt-4.5 flex gap-2.5">
        <Field label="Name (optional)" className="flex-1">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={FIELD_CONTROL}
          />
        </Field>
        <Field label="Floor" className="w-24">
          <input
            inputMode="numeric"
            value={floor}
            onChange={(event) =>
              setFloor(event.target.value.replace(/[^\d-]/g, ""))
            }
            className={cn(FIELD_CONTROL, "font-mono")}
          />
        </Field>
      </div>
      <div className="mt-5.5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isSaving} onClick={save}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
