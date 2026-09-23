"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { CheckoutOption } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";
import { Button } from "@/shared/ui";

import {
  ICON_BUTTON,
  MONEY,
  PANEL_CARD,
  TIME,
  toGel,
  toTetri,
} from "./menu-fields";

interface LateCheckoutCardProps {
  standardCheckout: string;
  options: CheckoutOption[];
  onChange: (options: CheckoutOption[]) => void;
}

export function LateCheckoutCard({
  standardCheckout,
  options: lateCheckout,
  onChange,
}: LateCheckoutCardProps) {
  const [newTime, setNewTime] = useState("");
  const setOptions = (options: CheckoutOption[]) =>
    onChange([...options].sort((a, b) => a.time.localeCompare(b.time)));

  const addOption = () => {
    if (!/^\d{2}:\d{2}$/.test(newTime)) return;
    if (lateCheckout.some((option) => option.time === newTime)) return;
    setOptions([...lateCheckout, { time: newTime, surchargeTetri: 0 }]);
    setNewTime("");
  };

  return (
    <>
      <div className="mt-6.5">
        <div className="text-[15px] font-semibold">Late checkout options</div>
        <div className="mt-0.5 text-[12.5px] text-faint">
          Standard checkout is {standardCheckout} (Hotel profile). Each option
          below is offered to guests with its surcharge.
        </div>
      </div>

      <div className={cn(PANEL_CARD, "mt-3.5 overflow-hidden")}>
        {lateCheckout.map((option) => (
          <div
            key={option.time}
            className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-3 sm:px-6"
          >
            <span className="w-20 text-[17px] font-semibold tracking-[-0.02em]">
              {option.time}
            </span>
            <label className="flex items-center gap-1.5 text-[13px] text-muted">
              Surcharge
              <input
                key={option.surchargeTetri}
                aria-label={`Surcharge for ${option.time}`}
                inputMode="decimal"
                defaultValue={toGel(option.surchargeTetri)}
                onBlur={(event) =>
                  setOptions(
                    lateCheckout.map((entry) =>
                      entry.time === option.time
                        ? {
                            ...entry,
                            surchargeTetri: toTetri(event.target.value),
                          }
                        : entry,
                    ),
                  )
                }
                className={MONEY}
              />
              ₾
            </label>
            <span className="text-[12.5px] text-faint">
              {option.surchargeTetri === 0
                ? "Guests see “Free”"
                : `Guests see +${formatGel(option.surchargeTetri)}`}
            </span>
            <span className="flex-1" />
            <button
              type="button"
              aria-label={`Remove ${option.time}`}
              onClick={() =>
                setOptions(
                  lateCheckout.filter((entry) => entry.time !== option.time),
                )
              }
              className={ICON_BUTTON}
            >
              <Trash2 strokeWidth={1.6} className="size-3.5" />
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 sm:px-6">
          <input
            aria-label="New checkout time"
            value={newTime}
            placeholder="15:00"
            onChange={(event) => setNewTime(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addOption();
            }}
            className={TIME}
          />
          <Button variant="ghost" onClick={addOption} className="min-h-9.5">
            <Plus strokeWidth={1.8} className="size-3.5" />
            Add time
          </Button>
          {lateCheckout.length === 0 ? (
            <span className="text-[12.5px] text-faint">
              With no options the “Late checkout” card is hidden from guests.
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}
