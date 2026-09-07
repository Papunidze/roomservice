"use client";

import { Check, Send } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Avatar, SegmentedOption, showToast, Switch } from "@/shared/ui";

import { patchMember } from "../store";
import type { TeamMember } from "../types";

const GRID =
  "grid grid-cols-[1.4fr_130px_110px_170px_110px_150px] items-center gap-3";

export function TeamTable({ members }: { members: TeamMember[] }) {
  return (
    <div className="overflow-hidden rounded-tile border border-line bg-surface">
      <div
        className={cn(
          GRID,
          "border-b border-line-soft px-5.5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
        )}
      >
        <span>Member</span>
        <span>Role</span>
        <span>Language</span>
        <span>Telegram</span>
        <span>On shift</span>
        <span>Last active</span>
      </div>

      {members.map((member) => (
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

          <span className="inline-flex w-fit rounded-full border border-line-strong px-2.5 py-1 text-xs font-medium">
            {member.role}
          </span>

          <span className="flex w-fit gap-0.5 rounded-full bg-ink/5 p-0.5">
            {(["ka", "en"] as const).map((code) => (
              <SegmentedOption
                key={code}
                active={member.lang === code}
                onClick={() => patchMember(member.id, { lang: code })}
              >
                {code.toUpperCase()}
              </SegmentedOption>
            ))}
          </span>

          <span className="flex items-center gap-2">
            {member.telegram ? (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-sage-deep">
                <Check strokeWidth={2} className="size-3.5" />
                Linked
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  showToast(`Telegram link sent to ${member.name} by SMS`)
                }
                className="inline-flex min-h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-line-strong px-3 text-xs text-muted"
              >
                <Send strokeWidth={1.6} className="size-3" />
                Send link
              </button>
            )}
          </span>

          <Switch
            checked={member.onShift}
            label={`${member.name} on shift`}
            onChange={() =>
              patchMember(member.id, {
                onShift: !member.onShift,
                lastActive: member.onShift ? member.lastActive : "Active now",
              })
            }
          />

          <span className="font-mono text-[11.5px] text-faint">
            {member.lastActive}
          </span>
        </div>
      ))}
    </div>
  );
}
