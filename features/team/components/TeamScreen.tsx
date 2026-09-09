"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useSession } from "@/features/auth";
import { Button } from "@/shared/ui";

import { useTeam } from "../store";
import { EscalationCard } from "./EscalationCard";
import { InviteModal } from "./InviteModal";
import { RoutingCard } from "./RoutingCard";
import { TeamTable } from "./TeamTable";

export function TeamScreen() {
  const team = useTeam();
  const currentEmail = useSession()?.email ?? "";
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const onShift = team.members.filter((member) => member.onShift).length;
  const withoutTelegram = team.members.filter(
    (member) => !member.telegram,
  ).length;

  return (
    <div className="scrollbar-slim h-[min(860px,calc(100dvh-8rem))] min-h-[560px] overflow-y-auto px-7 pt-6 pb-8">
      <div className="mb-4.5 flex items-center gap-3">
        <div>
          <div className="text-[22px] font-semibold tracking-[-0.03em]">
            Team
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            {team.members.length} members · {onShift} on shift ·{" "}
            {withoutTelegram} without Telegram
          </div>
        </div>
        <span className="flex-1" />
        <Button onClick={() => setIsInviteOpen(true)}>
          <Plus strokeWidth={1.8} className="size-3.5" />
          Invite member
        </Button>
      </div>

      <TeamTable members={team.members} currentEmail={currentEmail} />

      <div className="mt-4.5 grid grid-cols-[1.3fr_1fr] gap-4.5">
        <RoutingCard team={team} />
        <EscalationCard team={team} />
      </div>

      {isInviteOpen ? (
        <InviteModal onClose={() => setIsInviteOpen(false)} />
      ) : null}
    </div>
  );
}
