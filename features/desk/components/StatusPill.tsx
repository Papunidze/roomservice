import type { Status } from "@/features/requests";
import { cn } from "@/shared/lib/cn";

const STYLE: Record<Status, { label: string; className: string }> = {
  new: { label: "Unanswered", className: "bg-urgent/10 font-bold text-urgent" },
  progress: { label: "In progress", className: "bg-sage/12 text-sage-deep" },
  done: { label: "Done", className: "bg-ink/6 text-muted" },
};

export function StatusPill({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const style = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}

export const STATUS_TITLE: Record<Status, string> = {
  new: "Unanswered",
  progress: "In progress",
  done: "Done",
};
