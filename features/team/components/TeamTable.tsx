"use client";

import { STAFF_ROLES, type StaffRole } from "@/features/requests";
import { DICTIONARY, LANGUAGES, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatWhen } from "@/shared/lib/time";
import { askConfirm, Avatar, Switch } from "@/shared/ui";

import { patchMember, removeMember, resetMemberPassword } from "../store";
import type { TeamMember } from "../types";

const GRID =
  "grid min-w-[920px] grid-cols-[1.4fr_150px_150px_110px_130px_220px] items-center gap-3";

const SELECT =
  "min-h-8 w-full cursor-pointer rounded-full border border-line-strong bg-transparent px-2.5 text-[12.5px] font-medium outline-none";

interface TeamTableProps {
  members: TeamMember[];
  currentEmail: string;
}

const ACTION =
  "min-h-7.5 cursor-pointer rounded-full border border-line px-2.5 text-[11.5px] text-faint transition-colors hover:border-ink/30 hover:text-ink";

export function TeamTable({ members, currentEmail }: TeamTableProps) {
  return (
    <div className="scrollbar-slim overflow-x-auto rounded-tile border border-line bg-surface">
      <div
        className={cn(
          GRID,
          "border-b border-line-soft px-5.5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
        )}
      >
        <span>Member</span>
        <span>Role</span>
        <span>Reads in</span>
        <span>On shift</span>
        <span>Last active</span>
        <span />
      </div>

      {members.map((member) => {
        const isSelf = member.email === currentEmail;
        return (
          <div
            key={member.id}
            className={cn(GRID, "min-h-16 border-b border-line-soft px-5.5")}
          >
            <span className="flex items-center gap-3">
              <Avatar name={member.name} className="size-8.5 text-[13px]" />
              <span>
                <span className="block text-sm font-medium">{member.name}</span>
                <span className="mt-px block text-xs text-faint">
                  {member.email}
                </span>
              </span>
            </span>

            <label>
              <span className="sr-only">Role for {member.name}</span>
              <select
                value={member.role}
                disabled={isSelf}
                onChange={(event) =>
                  patchMember(member.id, {
                    role: event.target.value as StaffRole,
                  })
                }
                className={cn(SELECT, "disabled:cursor-default")}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Language for {member.name}</span>
              <select
                value={member.lang}
                onChange={(event) =>
                  patchMember(member.id, {
                    lang: event.target.value as LangCode,
                  })
                }
                className={SELECT}
              >
                {LANGUAGES.map((code) => (
                  <option key={code} value={code}>
                    {DICTIONARY[code].name}
                  </option>
                ))}
              </select>
            </label>

            <span className="flex items-center gap-2">
              <Switch
                checked={member.onShift}
                label={`${member.name} on shift`}
                onChange={() =>
                  patchMember(member.id, { onShift: !member.onShift })
                }
              />
              {member.onShiftSince ? (
                <span className="font-mono text-[10.5px] text-faint">
                  {formatWhen(member.onShiftSince)}
                </span>
              ) : null}
            </span>

            <span className="font-mono text-[11.5px] text-faint">
              {member.hasPassword ? formatWhen(member.lastActive) : "invited"}
            </span>

            <span className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() =>
                  askConfirm({
                    title: `Reset ${member.name}'s password?`,
                    body: `A new password is generated and emailed to ${member.email}. The old one stops working immediately.`,
                    confirmLabel: "Reset and email",
                    onConfirm: () => resetMemberPassword(member),
                  })
                }
                className={ACTION}
              >
                Reset password
              </button>
              {isSelf ? null : (
                <button
                  type="button"
                  onClick={() =>
                    askConfirm({
                      title: `Remove ${member.name}?`,
                      body: `${member.name} can no longer sign in. Requests they handled stay in the inbox.`,
                      confirmLabel: "Remove",
                      onConfirm: () => removeMember(member),
                    })
                  }
                  className={cn(
                    ACTION,
                    "border-urgent/40 bg-urgent/8 font-medium text-urgent hover:border-urgent hover:text-urgent",
                  )}
                >
                  Remove
                </button>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
