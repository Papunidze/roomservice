"use client";

import { watchHotel } from "@/features/requests";
import { createRemoteStore, useRemote } from "@/shared/lib/remote-store";
import { showToast } from "@/shared/ui";

import {
  fetchTeam,
  inviteMemberApi,
  patchMemberApi,
  patchTeamConfig,
  removeMemberApi,
  resetMemberPasswordApi,
} from "./api";
import type { TeamConfig, TeamMember, TeamState } from "./types";

const store = createRemoteStore<TeamState>({
  load: fetchTeam,
  watch: (refresh) => watchHotel("team", refresh),
});

export const useOptionalTeam = () => useRemote(store);

export function useTeam() {
  const team = useRemote(store);
  if (!team) throw new Error("Team is read before it is loaded");
  return team;
}

export async function updateTeam(patch: Partial<TeamConfig>) {
  const current = store.get();
  if (!current) return;

  store.set({ ...current, ...patch });
  const result = await patchTeamConfig(patch);
  if (!result.ok) {
    store.set(current);
    showToast(result.message);
  }
}

export async function patchMember(
  id: string,
  patch: Parameters<typeof patchMemberApi>[1],
) {
  const current = store.get();
  if (!current) return;

  store.set({
    ...current,
    members: current.members.map((member) =>
      member.id === id ? { ...member, ...patch } : member,
    ),
  });
  const result = await patchMemberApi(id, patch);
  if (!result.ok) {
    store.set(current);
    showToast(result.message);
  }
}

export async function inviteMember(
  input: Parameters<typeof inviteMemberApi>[0],
) {
  const result = await inviteMemberApi(input);
  if (!result.ok) return result;

  const current = store.get();
  if (current)
    store.set({
      ...current,
      members: [...current.members, result.data.member],
    });
  return result;
}

export async function removeMember(member: TeamMember) {
  const current = store.get();
  if (!current) return;

  const result = await removeMemberApi(member.id);
  if (!result.ok) {
    showToast(result.message);
    return;
  }
  store.set({
    ...current,
    members: current.members.filter((item) => item.id !== member.id),
  });
}

export async function resetMemberPassword(member: TeamMember) {
  const result = await resetMemberPasswordApi(member.id);
  showToast(
    result.ok ? `New password emailed to ${member.email}` : result.message,
  );
}
