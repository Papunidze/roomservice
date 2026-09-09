"use client";

import { ArrowRight } from "lucide-react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  STAFF_ROLES,
  type StaffRole,
} from "@/features/requests";
import { Switch } from "@/shared/ui";

import { updateTeam } from "../store";
import { ROUTING_GROUPS, type TeamState } from "../types";

const SELECT =
  "min-h-9 cursor-pointer rounded-full border border-line-strong bg-transparent px-3 text-[12.5px] font-medium outline-none";

export function RoutingCard({ team }: { team: TeamState }) {
  return (
    <div className="rounded-tile border border-line bg-surface px-6 py-5.5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-base font-semibold tracking-[-0.02em]">
            Who gets each request
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            A new request is sent to one role, chosen by what the guest asked
            for.
          </div>
        </div>
        <span className="text-[12.5px] text-muted">
          Hand it to someone on shift
        </span>
        <Switch
          checked={team.autoAssign}
          label="Auto-assign on arrival"
          onChange={() => updateTeam({ autoAssign: !team.autoAssign })}
        />
      </div>

      <p className="mt-3 rounded-[14px] bg-paper px-4 py-3 text-[12.5px] leading-relaxed text-soft">
        {team.autoAssign
          ? "On: the request is assigned straight to a member of that role who is on shift, so it shows up under “Mine” for them. If nobody from the role is on shift, it waits unassigned."
          : "Off: the request waits in the inbox as “Nobody assigned” until someone takes it."}
      </p>

      <div className="mt-3.5 flex flex-col">
        {ROUTING_GROUPS.map((group) => (
          <div
            key={group.key}
            className="flex min-h-14 items-center gap-3 border-t border-line-soft"
          >
            <span className="flex flex-1 flex-wrap gap-1.5">
              {group.categories.map((category) => {
                const Icon = CATEGORY_ICON[category];
                return (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[12.5px]"
                  >
                    <Icon strokeWidth={1.6} className="size-3 text-sage" />
                    {CATEGORY_LABEL[category]}
                  </span>
                );
              })}
            </span>
            <ArrowRight strokeWidth={1.6} className="size-3.5 text-ghost" />
            <label>
              <span className="sr-only">Role for {group.key}</span>
              <select
                value={team.routing[group.key]}
                onChange={(event) =>
                  updateTeam({
                    routing: {
                      ...team.routing,
                      [group.key]: event.target.value as StaffRole,
                    },
                  })
                }
                className={SELECT}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
