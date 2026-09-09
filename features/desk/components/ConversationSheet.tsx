"use client";

import type { ComponentProps } from "react";

import { ConversationPanel } from "./ConversationPanel";

type ConversationSheetProps = ComponentProps<typeof ConversationPanel> & {
  onClose: () => void;
};

export function ConversationSheet({
  onClose,
  ...panel
}: ConversationSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close conversation"
        onClick={onClose}
        className="animate-fade absolute inset-0 cursor-default bg-ink/30"
      />
      <div className="animate-rise relative flex h-full w-[880px] max-w-full flex-col border-l border-line bg-surface">
        <ConversationPanel {...panel} onClose={onClose} />
      </div>
    </div>
  );
}
