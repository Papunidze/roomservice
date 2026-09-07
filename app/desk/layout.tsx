import { DeskHeader } from "@/features/desk";

export default function DeskLayout({ children }: LayoutProps<"/desk">) {
  return (
    <div className="scrollbar-slim min-h-dvh overflow-x-auto bg-canvas p-7.5">
      <div className="mx-auto w-360 max-w-full overflow-hidden rounded-card border border-line bg-panel">
        <DeskHeader />
        {children}
      </div>
    </div>
  );
}
