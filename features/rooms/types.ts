import type { LangCode } from "@/shared/i18n";

export interface GuestSession {
  lang: LangCode;
  since: string;
  nights: string;
}

export interface Room {
  no: string;
  floor: number;
  printed: boolean;
  session: GuestSession | null;
  lastActivity: string;
}
