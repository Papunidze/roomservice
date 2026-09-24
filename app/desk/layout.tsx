import { AuthGate } from "@/features/auth";
import { DeskBoot, DeskHeader } from "@/features/desk";
import { Overlays } from "@/shared/ui";

export default function DeskLayout({ children }: LayoutProps<"/desk">) {
  return (
    <AuthGate>
      <DeskBoot>
        <div className="min-h-dvh bg-canvas md:h-dvh md:min-h-[640px] md:p-7.5">
          <div className="relative mx-auto flex min-h-dvh w-360 max-w-full flex-col overflow-hidden bg-panel md:h-full md:min-h-0 md:rounded-card md:border md:border-line">
            <DeskHeader />
            {children}
            <Overlays />
          </div>
        </div>
      </DeskBoot>
    </AuthGate>
  );
}
