import type { StaffRole } from "@/features/requests";
import type { LangCode } from "@/shared/i18n";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  lang: LangCode;
  onShift: boolean;
  onShiftSince: string | null;
  lastActive: string | null;
  hasPassword: boolean;
}

export interface TeamConfig {
  autoAssign: boolean;
  offShiftHours: number;
  escalation: {
    enabled: boolean;
    minutes: number;
    target: StaffRole;
  };
}

export interface TeamState extends TeamConfig {
  members: TeamMember[];
}
