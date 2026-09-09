"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { STAFF_ROLES, type StaffRole } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import {
  Button,
  Chip,
  Field,
  FIELD_CONTROL,
  Modal,
  showToast,
} from "@/shared/ui";

import { inviteMember } from "../store";

export function InviteModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Housekeeping");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  async function send() {
    setIsSending(true);
    const result = await inviteMember({ name, email, role });
    setIsSending(false);

    if (!result.ok) {
      setErrors(
        result.code === "email_taken"
          ? { email: result.message }
          : result.fields,
      );
      if (result.code !== "email_taken" && !Object.keys(result.fields).length)
        showToast(result.message);
      return;
    }

    showToast(`Sign-in details emailed to ${result.data.member.email}`);
    onClose();
  }

  return (
    <Modal
      title="Invite a team member"
      description="They get an email with their sign-in and a generated password."
      onClose={onClose}
      className="w-115"
    >
      <div className="mt-4.5 flex gap-2.5">
        <Field label="Name" className="flex-1">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={cn(FIELD_CONTROL, errors.name && "border-urgent")}
          />
        </Field>
        <Field label="Work email" className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn(FIELD_CONTROL, errors.email && "border-urgent")}
          />
        </Field>
      </div>
      {errors.name || errors.email ? (
        <p className="mt-1.5 text-xs text-urgent">
          {errors.name ?? errors.email}
        </p>
      ) : null}

      <div className="mt-4 mb-2 text-xs text-faint">Role</div>
      <div className="flex flex-wrap gap-1.5">
        {STAFF_ROLES.map((option) => (
          <Chip
            key={option}
            active={role === option}
            onClick={() => setRole(option)}
          >
            {option}
          </Chip>
        ))}
      </div>

      <div className="mt-5.5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isSending} onClick={send}>
          <Send strokeWidth={1.6} className="size-3.5" />
          {isSending ? "Sending…" : "Send invite"}
        </Button>
      </div>
    </Modal>
  );
}
