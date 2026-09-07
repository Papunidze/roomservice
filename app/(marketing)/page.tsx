import type { Metadata } from "next";

import { LandingPage } from "@/features/marketing";
import { ka } from "@/shared/i18n/ka";

export const metadata: Metadata = {
  title: ka.marketing.hero.title,
  description: ka.marketing.hero.lead,
};

export default function Page() {
  return <LandingPage />;
}
