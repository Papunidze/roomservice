"use client";

import { useState, type FormEvent } from "react";

import { Button, Modal, showToast } from "@/shared/ui";

import { changePassword } from "../api";
import { checkPassword } from "../credentials";
import { PasswordField } from "./AuthField";
import { FormError } from "./FormError";

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    const found = checkPassword(newPassword);
    setErrors(found ? { newPassword: found } : {});
    setFormError(undefined);
    if (found) return;

    setIsSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSaving(false);

    if (!result.ok) {
      setErrors(result.fields);
      setFormError(
        Object.keys(result.fields).length ? undefined : result.message,
      );
      return;
    }

    showToast("Password changed");
    onClose();
  }

  return (
    <Modal
      title="Change password"
      description="Pick a new password for your own account."
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="mt-4.5 flex flex-col gap-4">
        <FormError message={formError} />
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          value={currentPassword}
          error={errors.currentPassword}
          onChange={setCurrentPassword}
        />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint="8 characters or more"
          value={newPassword}
          error={errors.newPassword}
          onChange={setNewPassword}
        />
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save password"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
