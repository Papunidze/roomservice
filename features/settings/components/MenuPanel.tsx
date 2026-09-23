"use client";

import type { Settings } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { NumberField } from "@/shared/ui";

import { DishesCard } from "./DishesCard";
import { LateCheckoutCard } from "./LateCheckoutCard";
import { TIME } from "./menu-fields";
import {
  PANEL_CARD,
  PanelHeading,
  type SettingsPanelProps,
} from "./PanelHeading";

export function MenuPanel({ settings, onChange }: SettingsPanelProps) {
  const { service } = settings;
  const setService = (patch: Partial<Settings["service"]>) =>
    onChange({ service: { ...service, ...patch } });

  return (
    <div className="animate-rise max-w-215">
      <PanelHeading
        title="Room service & late checkout"
        subtitle="What guests can order and when. Names are translated into each enabled guest language after you save."
      />

      <div className={cn(PANEL_CARD, "mt-5.5 p-5 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="min-w-48 flex-1">
            <div className="text-[15px] font-semibold">Kitchen hours</div>
            <div className="mt-0.5 text-[12.5px] text-faint">
              Shown on the guest’s home screen and the menu.
            </div>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-muted">
            <span className="sr-only">Opens</span>
            <input
              value={service.open}
              onChange={(event) => setService({ open: event.target.value })}
              className={TIME}
            />
            –<span className="sr-only">Closes</span>
            <input
              value={service.close}
              onChange={(event) => setService({ close: event.target.value })}
              className={TIME}
            />
          </label>
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Delivery about
            <NumberField
              label="Delivery minutes"
              value={service.deliveryMinutes}
              max={240}
              onChange={(deliveryMinutes) => setService({ deliveryMinutes })}
            />
            min
          </label>
        </div>
      </div>

      <DishesCard
        dishes={service.dishes}
        onChange={(dishes) => setService({ dishes })}
      />

      <LateCheckoutCard
        standardCheckout={settings.hotel.checkout}
        options={settings.lateCheckout}
        onChange={(lateCheckout) => onChange({ lateCheckout })}
      />
    </div>
  );
}
