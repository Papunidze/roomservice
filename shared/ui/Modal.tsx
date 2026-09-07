"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ModalProps {
  title: string;
  description?: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  title,
  description,
  className,
  onClose,
  children,
}: ModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center px-6 pt-28">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade absolute inset-0 cursor-default bg-ink/30"
      />
      <div
        role="dialog"
        aria-label={title}
        className={cn(
          "animate-rise relative w-110 max-w-full rounded-sheet bg-surface p-6.5",
          className,
        )}
      >
        <div className="text-[19px] font-semibold tracking-[-0.02em]">
          {title}
        </div>
        {description ? (
          <div className="mt-1 text-[13px] text-faint">{description}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
