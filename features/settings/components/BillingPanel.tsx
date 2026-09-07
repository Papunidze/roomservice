"use client";

import { useRooms } from "@/features/rooms";
import { cn } from "@/shared/lib/cn";
import { formatGel } from "@/shared/lib/money";
import { Button, showToast } from "@/shared/ui";

import { PANEL_CARD, PanelHeading } from "./PanelHeading";

const PER_ROOM_TETRI = 600;

const BANK = [
  { label: "Beneficiary", value: "RoomCall LLC" },
  { label: "Bank", value: "TBC Bank" },
  { label: "IBAN", value: "GE29TB7194536080100002" },
  { label: "Reference", value: "Invoice number" },
];

const GRID = "grid grid-cols-[130px_1fr_120px_110px_130px] items-center gap-3";

function statusClass(status: string) {
  if (status === "Paid") return "bg-sage/10 text-sage-deep";
  if (status === "Trial") return "bg-sand/50 text-sand-ink";
  return "bg-ink/6 text-muted";
}

export function BillingPanel() {
  const rooms = useRooms();
  const monthly = rooms.length * PER_ROOM_TETRI;

  const invoices = [
    {
      no: "RC-2026-0009",
      period: "Sep 2026 · trial",
      amount: formatGel(0),
      status: "Trial",
    },
    {
      no: "RC-2026-0008",
      period: "Aug 12 – Sep 11 · pending",
      amount: formatGel(monthly),
      status: "Due 11 Oct",
    },
    {
      no: "RC-2026-0007",
      period: `Setup · ${rooms.length} QR plates`,
      amount: formatGel(rooms.length * 200),
      status: "Paid",
    },
  ];

  return (
    <div className="animate-rise max-w-215">
      <PanelHeading
        title="Billing"
        subtitle="Priced per room, billed monthly in GEL."
      />

      <div className="mt-5.5 grid grid-cols-[1.3fr_1fr] gap-3.5">
        <div className="rounded-card bg-ink px-6.5 py-6 text-paper">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] tracking-[0.14em] text-paper/50">
              CURRENT PLAN
            </span>
            <span className="ml-auto rounded-full bg-sand/22 px-2.5 py-1 text-xs font-medium text-sand">
              Trial ends in 34 days
            </span>
          </div>
          <div className="mt-3.5 text-[28px] font-semibold tracking-[-0.03em]">
            Boutique
          </div>
          <div className="mt-1 text-[13.5px] text-paper/65">
            {rooms.length} rooms · unlimited staff · all languages
          </div>
          <div className="mt-5.5 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-[-0.03em]">
              {formatGel(monthly)}
            </span>
            <span className="text-[13px] text-paper/65">
              / month · {formatGel(PER_ROOM_TETRI)} per room
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-paper/15 pt-4 text-[12.5px] text-paper/65">
            <span>Next invoice · 11 Oct 2026</span>
            <button
              type="button"
              onClick={() =>
                showToast(
                  "Plans: Boutique 6 ₾/room · Resort 5 ₾/room from 100 rooms",
                )
              }
              className="min-h-8.5 cursor-pointer rounded-full border border-paper/30 px-3.5 text-[12.5px] text-paper"
            >
              Change plan
            </button>
          </div>
        </div>

        <div className={cn(PANEL_CARD, "rounded-card px-6 py-5.5")}>
          <div className="text-[15px] font-semibold">Payment method</div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Bank transfer. Include the invoice number as the reference.
          </div>
          <div className="mt-2 flex flex-col">
            {BANK.map((row) => (
              <div
                key={row.label}
                className="flex min-h-10 items-baseline justify-between gap-3 border-t border-line-soft pt-2.5"
              >
                <span className="text-[12.5px] text-faint">{row.label}</span>
                <span className="text-right font-mono text-[12.5px]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(PANEL_CARD, "mt-3.5 overflow-hidden")}>
        <div
          className={cn(
            GRID,
            "border-b border-line-soft px-5.5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
          )}
        >
          <span>Invoice</span>
          <span>Period</span>
          <span>Amount</span>
          <span>Status</span>
          <span />
        </div>
        {invoices.map((invoice) => (
          <div
            key={invoice.no}
            className={cn(
              GRID,
              "min-h-14 border-b border-line-soft px-5.5 last:border-b-0",
            )}
          >
            <span className="font-mono text-[12.5px]">{invoice.no}</span>
            <span className="text-[13.5px]">{invoice.period}</span>
            <span className="text-[13.5px] font-medium">{invoice.amount}</span>
            <span
              className={cn(
                "inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                statusClass(invoice.status),
              )}
            >
              {invoice.status}
            </span>
            <Button
              variant="ghost"
              className="min-h-8 justify-self-end px-3 text-xs"
              onClick={() => showToast(`Downloading ${invoice.no}.pdf`)}
            >
              Download PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
