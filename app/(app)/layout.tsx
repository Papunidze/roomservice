import { ka } from "@/shared/i18n/ka";
import { AppShell } from "@/shared/layout";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell businessName="ლუნა სალონი" planLabel={ka.plans.business}>
      {children}
    </AppShell>
  );
}
