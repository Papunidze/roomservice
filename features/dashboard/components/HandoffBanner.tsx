import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";

import type { HandoffSummary } from "../types";

export function HandoffBanner({ count, reasons }: HandoffSummary) {
  return (
    <div className="mb-4.5 flex items-center gap-3.5 rounded-panel border border-white/80 bg-warning-bg/60 px-4.5 py-3.5 backdrop-blur-[14px]">
      <span className="size-2.25 shrink-0 animate-pulse rounded-full bg-warning" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-warning-ink-strong">
          {count} {ka.dashboard.handoff.title}
        </div>
        <div className="mt-0.5 text-[12.5px] text-warning-ink">
          {ka.dashboard.handoff.reasonsLabel}: {reasons.join(", ")}
        </div>
      </div>
      <Button variant="ink" size="pill">
        {ka.dashboard.handoff.action}
      </Button>
    </div>
  );
}
