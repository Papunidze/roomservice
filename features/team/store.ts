"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { langCodeSchema, STAFF, STAFF_ROLES } from "@/features/requests";
import { createStore } from "@/shared/lib/store";

import type { TeamMember, TeamState } from "./types";

const PROFILE: Record<
  string,
  Pick<TeamMember, "lang" | "telegram" | "onShift" | "lastActive">
> = {
  nino: { lang: "ka", telegram: true, onShift: true, lastActive: "Active now" },
  giorgi: {
    lang: "ka",
    telegram: true,
    onShift: true,
    lastActive: "2 min ago",
  },
  leila: {
    lang: "en",
    telegram: false,
    onShift: true,
    lastActive: "14 min ago",
  },
  davit: {
    lang: "en",
    telegram: true,
    onShift: false,
    lastActive: "Yesterday 21:40",
  },
};

export const TEAM_SEED: TeamState = {
  members: STAFF.map((person) => ({
    ...person,
    email: `${person.id}@batumipalace.ge`,
    ...(PROFILE[person.id] ?? {
      lang: "en" as const,
      telegram: false,
      onShift: false,
      lastActive: "never",
    }),
  })),
  routing: {
    maintenance: "Maintenance",
    housekeeping: "Housekeeping",
    frontDesk: "Front desk",
  },
  autoAssign: true,
  escalation: { enabled: true, minutes: 15, target: "Manager" },
};

const roleSchema = z.enum(STAFF_ROLES);

const teamSchema = z.object({
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: roleSchema,
      lang: langCodeSchema,
      telegram: z.boolean(),
      onShift: z.boolean(),
      lastActive: z.string(),
    }),
  ),
  routing: z.object({
    maintenance: roleSchema,
    housekeeping: roleSchema,
    frontDesk: roleSchema,
  }),
  autoAssign: z.boolean(),
  escalation: z.object({
    enabled: z.boolean(),
    minutes: z.number(),
    target: z.string(),
  }),
});

const store = createStore<TeamState>("roomcall.team", TEAM_SEED, teamSchema);

export const useTeam = () =>
  useSyncExternalStore(store.subscribe, store.get, store.getServer);

export function updateTeam(patch: Partial<TeamState>) {
  store.set({ ...store.get(), ...patch });
}

export function patchMember(id: string, patch: Partial<TeamMember>) {
  updateTeam({
    members: store
      .get()
      .members.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
  });
}
