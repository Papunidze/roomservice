import type { LangCode } from "@/shared/i18n";

export interface Session {
  id: string;
  name: string;
  email: string;
  hotel: string;
  role: string;
  lang: LangCode;
  isOwner: boolean;
  twoFactorEnabled: boolean;
}
