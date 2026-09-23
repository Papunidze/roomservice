"use client";

import Link from "next/link";

import { NumberField, Switch } from "@/shared/ui";

import { updateTeam } from "../store";
import type { TeamState } from "../types";

export function AssignmentCard({ team }: { team: TeamState }) {
  return (
    <div className="rounded-tile border border-line bg-surface px-6 py-5.5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-base font-semibold tracking-[-0.02em]">
            Who gets each request
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Each category is routed to a role. Change the role per category
            under{" "}
            <Link
              href="/desk/settings?section=categories"
              className="text-ink underline underline-offset-3"
            >
              Settings → Categories
            </Link>
            .
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-line-soft pt-4">
        <span className="min-w-0 flex-1">
          <span className="block text-sm">Hand it to someone on shift</span>
          <span className="mt-0.5 block text-[12.5px] text-faint">
            {team.autoAssign
              ? "On: a new request is assigned to a member of that role who is on shift, so it shows under “Mine” for them. If nobody from the role is on shift, it waits unassigned."
              : "Off: the request waits in the inbox as “Nobody assigned” until someone takes it."}
          </span>
        </span>
        <Switch
          checked={team.autoAssign}
          label="Auto-assign on arrival"
          onChange={() => updateTeam({ autoAssign: !team.autoAssign })}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
        <span className="min-w-48 flex-1">
          <span className="block text-sm">Take people off shift after</span>
          <span className="mt-0.5 block text-[12.5px] text-faint">
            So requests stop landing on someone who went home without switching
            off.
          </span>
        </span>
        <span className="flex items-center gap-2">
          <NumberField
            label="Off shift after hours"
            value={team.offShiftHours}
            max={48}
            onChange={(offShiftHours) => updateTeam({ offShiftHours })}
          />
          <span className="text-[13px] text-muted">hours</span>
        </span>
      </div>
    </div>
  );
}
