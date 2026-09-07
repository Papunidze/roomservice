"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { STAFF_ROLES, type StaffRole } from "@/features/requests";
import type { LangCode } from "@/shared/i18n";
import { Button, Chip, Modal, SegmentedOption, showToast } from "@/shared/ui";

export function InviteModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<StaffRole>("Housekeeping");
  const [lang, setLang] = useState<LangCode>("ka");

  const slug = role.toLowerCase().replace(" ", "-");
  const link = `roomcall.ge/join/batumi-palace/${slug}-${lang}-7f3k2`;

  return (
    <Modal
      title="Invite a team member"
      description="They open the link, pick a name, and are in — no password."
      onClose={onClose}
      className="w-115"
    >
      <div className="mt-4.5 mb-2 text-xs text-faint">Role</div>
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

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-faint">Interface language</span>
        <span className="flex gap-0.5 rounded-full bg-ink/5 p-0.5">
          {(["ka", "en"] as const).map((code) => (
            <SegmentedOption
              key={code}
              active={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </SegmentedOption>
          ))}
        </span>
      </div>

      <div className="mt-4.5 flex min-h-11.5 items-center gap-2 rounded-full border border-line-strong bg-paper pr-1.5 pl-3.5">
        <span className="flex-1 truncate font-mono text-xs text-muted">
          {link}
        </span>
        <Button
          variant="dark"
          className="min-h-8.5 px-3.5 text-xs"
          onClick={() =>
            showToast(`Invite link copied · ${role} · expires in 7 days`)
          }
        >
          Copy link
        </Button>
      </div>

      <div className="mt-4.5 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            showToast(`Opening Telegram with the invite for ${role}`)
          }
        >
          <Send strokeWidth={1.6} className="size-3.5" />
          Send via Telegram
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
