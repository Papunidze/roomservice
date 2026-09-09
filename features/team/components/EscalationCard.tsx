"use client";

import type { StaffRole } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { NumberField, Switch } from "@/shared/ui";

import { updateTeam } from "../store";
import type { TeamState } from "../types";

const TARGETS: StaffRole[] = ["Manager", "Front desk"];

export function EscalationCard({ team }: { team: TeamState }) {
  const { escalation } = team;

  const summary = escalation.enabled
    ? `Right now: a request nobody has answered after ${escalation.minutes} minutes gets an “Escalated to ${escalation.target}” line in its history and stays in the Unanswered group, so the ${escalation.target} sees it needs a hand.`
    : "Off: unanswered requests are not flagged. They still stay in the Unanswered group.";

  return (
    <div className="rounded-tile border border-line bg-surface px-6 py-5.5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-base font-semibold tracking-[-0.02em]">
            If nobody answers
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Flag a request that has waited too long, so a manager steps in.
          </div>
        </div>
        <Switch
          checked={escalation.enabled}
          label="Escalation"
          onChange={() =>
            updateTeam({
              escalation: { ...escalation, enabled: !escalation.enabled },
            })
          }
        />
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap items-center gap-2 rounded-[16px] bg-paper px-4 py-3.5 text-[13.5px] leading-relaxed transition-opacity",
          escalation.enabled ? "opacity-100" : "opacity-45",
        )}
      >
        <span>If a request is still</span>
        <span className="rounded-full bg-urgent/10 px-2.5 py-0.5 font-medium text-urgent">
          Unanswered
        </span>
        <span>after</span>
        <NumberField
          label="Escalation delay in minutes"
          value={escalation.minutes}
          max={999}
          onChange={(minutes) =>
            updateTeam({ escalation: { ...escalation, minutes } })
          }
        />
        <span>minutes, flag it for the</span>
        <label>
          <span className="sr-only">Escalation target</span>
          <select
            value={escalation.target}
            onChange={(event) =>
              updateTeam({
                escalation: {
                  ...escalation,
                  target: event.target.value as StaffRole,
                },
              })
            }
            className="min-h-9 cursor-pointer rounded-full border border-line-strong bg-surface px-3 text-[13px] font-medium outline-none"
          >
            {TARGETS.map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>
        </label>
        <span>.</span>
      </div>

      <p className="mt-3.5 text-[12.5px] leading-relaxed text-faint">
        {summary}
      </p>
    </div>
  );
}
