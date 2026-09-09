import { z } from "zod";

import { langCodeSchema, STAFF_ROLES } from "@/features/requests";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  noContent,
  unwrap,
} from "@/shared/lib/api";

import type { TeamConfig, TeamMember } from "./types";

const roleSchema = z.enum(STAFF_ROLES);

const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
  lang: langCodeSchema,
  telegram: z.boolean(),
  onShift: z.boolean(),
  lastActive: z.string().nullable(),
  hasPassword: z.boolean(),
});

const configSchema = z.object({
  routing: z.object({
    maintenance: roleSchema,
    housekeeping: roleSchema,
    frontDesk: roleSchema,
  }),
  autoAssign: z.boolean(),
  escalation: z.object({
    enabled: z.boolean(),
    minutes: z.number(),
    target: roleSchema,
  }),
});

const teamSchema = z.object({
  team: configSchema.extend({ members: z.array(memberSchema) }),
});
const oneMember = z.object({ member: memberSchema });
const oneConfig = z.object({ config: configSchema });

export const fetchTeam = () =>
  apiGet("/api/team", teamSchema).then((r) => unwrap(r).team);

export const patchTeamConfig = (patch: Partial<TeamConfig>) =>
  apiPatch("/api/team", patch, oneConfig);

export const inviteMemberApi = (input: {
  name: string;
  email: string;
  role: TeamMember["role"];
}) => apiPost("/api/team/members", input, oneMember);

export const patchMemberApi = (
  id: string,
  patch: Partial<
    Pick<TeamMember, "name" | "role" | "lang" | "telegram" | "onShift">
  >,
) => apiPatch(`/api/team/members/${id}`, patch, oneMember);

export const removeMemberApi = (id: string) =>
  apiDelete(`/api/team/members/${id}`);

export const resetMemberPasswordApi = (id: string) =>
  apiPost(`/api/team/members/${id}/reset-password`, {}, noContent);
