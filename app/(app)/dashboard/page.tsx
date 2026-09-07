import { DashboardScreen, dashboardPlaceholder } from "@/features/dashboard";
import { ka } from "@/shared/i18n/ka";
import { Topbar } from "@/shared/layout";

export default function DashboardPage() {
  const today = new Date();

  return (
    <>
      <Topbar title={ka.nav.dashboard} date={today} />
      <DashboardScreen data={dashboardPlaceholder} today={today} />
    </>
  );
}
