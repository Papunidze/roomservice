import { ArrowRight } from "lucide-react";

import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

const ACTIONS = [
  ka.dashboard.quickActions.addBooking,
  ka.dashboard.quickActions.editService,
  ka.dashboard.quickActions.editSite,
  ka.dashboard.quickActions.connectWhatsapp,
];

export function QuickActions() {
  return (
    <Card className="px-6 py-5.5">
      <div className="mb-3.5 text-base font-bold">
        {ka.dashboard.quickActions.title}
      </div>
      <div className="flex flex-col gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action}
            variant="soft"
            size="block"
            className="group h-auto justify-between rounded-[16px] px-4 py-3.25 text-left font-semibold text-wrap"
          >
            <span>{action}</span>
            <ArrowRight className="size-3.5 text-ghost group-hover:text-accent-foreground" />
          </Button>
        ))}
      </div>
    </Card>
  );
}
