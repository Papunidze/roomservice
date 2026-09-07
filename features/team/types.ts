import type { Category, StaffRole } from "@/features/requests";
import type { LangCode } from "@/shared/i18n";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  lang: LangCode;
  telegram: boolean;
  onShift: boolean;
  lastActive: string;
}

export const ROUTING_GROUPS = [
  { key: "maintenance", categories: ["ac", "water", "wifi", "tv"] },
  { key: "housekeeping", categories: ["cleaning", "items"] },
  { key: "frontDesk", categories: ["noise", "service", "checkout", "other"] },
] as const satisfies readonly {
  key: string;
  categories: readonly Category[];
}[];

export type RoutingGroup = (typeof ROUTING_GROUPS)[number]["key"];

export interface TeamState {
  members: TeamMember[];
  routing: Record<RoutingGroup, StaffRole>;
  autoAssign: boolean;
  escalation: {
    enabled: boolean;
    minutes: number;
    target: string;
  };
}
