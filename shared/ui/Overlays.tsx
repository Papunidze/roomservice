"use client";

import { Check } from "lucide-react";

import { Button } from "./Button";
import { dismissConfirm, usePendingConfirm } from "./confirm";
import { Modal } from "./Modal";
import { useToastMessage } from "./toast";

export function Overlays() {
  const toast = useToastMessage();
  const confirm = usePendingConfirm();

  return (
    <>
      {toast ? (
        <div
          role="status"
          className="animate-rise absolute bottom-6.5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink py-3 pr-4.5 pl-3.5 text-[13px] whitespace-nowrap text-paper"
        >
          <Check strokeWidth={2} className="size-[15px] text-sage" />
          <span>{toast}</span>
        </div>
      ) : null}

      {confirm ? (
        <Modal title={confirm.title} onClose={dismissConfirm} className="w-110">
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            {confirm.body}
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={dismissConfirm}>
              Cancel
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                dismissConfirm();
                confirm.onConfirm();
              }}
            >
              {confirm.confirmLabel}
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
