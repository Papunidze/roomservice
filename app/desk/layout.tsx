import { AuthGate } from "@/features/auth";
import { DeskHeader } from "@/features/desk";
import { Overlays } from "@/shared/ui";

export default function DeskLayout({ children }: LayoutProps<"/desk">) {
  return (
    <AuthGate>
      <div className="scrollbar-slim min-h-dvh overflow-x-auto bg-canvas p-7.5">
        <div className="relative mx-auto w-360 max-w-full overflow-hidden rounded-card border border-line bg-panel">
          <DeskHeader />
          {children}
          <Overlays />
        </div>
      </div>
    </AuthGate>
  );
}
