import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

import type { UnreadSummary } from "../types";

export function UnreadMessagesCard({
  total,
  instagram,
  whatsapp,
}: UnreadSummary) {
  return (
    <Card variant="ink" className="px-6 py-5.5">
      <div className="text-[13.5px] text-white/70">
        {ka.dashboard.unread.title}
      </div>
      <div className="mt-2.5 flex flex-wrap items-baseline gap-3">
        <div className="text-[clamp(32px,3.4vw,48px)] leading-none font-extrabold tracking-[-0.035em]">
          {total}
        </div>
        <div className="text-[12.5px] text-white/70">
          Instagram {instagram} · WhatsApp {whatsapp}
        </div>
      </div>
      <Button size="block" className="mt-4.5 hover:bg-primary-light">
        {ka.dashboard.unread.action}
      </Button>
    </Card>
  );
}
