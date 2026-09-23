"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useSession } from "@/features/auth";
import {
  isAdminRole,
  updateSettings,
  useOptionalSettings,
} from "@/features/requests";
import { useOptionalTeam } from "@/features/team";
import { Button, Field, FIELD_CONTROL, Modal } from "@/shared/ui";

const MANAGER_ONLY = ["/desk/settings"];

export function allowedPath(role: string, pathname: string) {
  if (role === "Manager") return true;
  if (isAdminRole(role)) return !MANAGER_ONLY.includes(pathname);
  return pathname === "/desk";
}

export function DeskBoot({ children }: { children: ReactNode }) {
  const settings = useOptionalSettings();
  const team = useOptionalTeam();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isOffLimits = session !== null && !allowedPath(session.role, pathname);

  useEffect(() => {
    if (isOffLimits) router.replace("/desk");
  }, [isOffLimits, router]);

  if (!settings || !team || isOffLimits) return null;
  const needsName =
    settings.hotel.name.trim().length === 0 && session?.role === "Manager";
  return (
    <>
      {children}
      {needsName ? <HotelNameModal /> : null}
    </>
  );
}

function HotelNameModal() {
  const settings = useOptionalSettings();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  if (!settings) return null;

  const save = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    await updateSettings({ hotel: { ...settings.hotel, name: name.trim() } });
    setIsSaving(false);
  };

  return (
    <Modal
      title="What is your hotel called?"
      description="Guests see this name on the QR plates and on their phone."
      onClose={() => undefined}
    >
      <Field label="Hotel name" className="mt-4.5">
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void save();
          }}
          className={FIELD_CONTROL}
        />
      </Field>
      <div className="mt-5 flex justify-end">
        <Button disabled={isSaving || !name.trim()} onClick={save}>
          {isSaving ? "Saving…" : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}
