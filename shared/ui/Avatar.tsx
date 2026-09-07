import { cn } from "@/shared/lib/cn";
import { initials } from "@/shared/lib/initials";

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full font-mono text-[9.5px] tracking-wide",
        name
          ? "bg-sage/15 text-sage-deep"
          : "border border-dashed border-line-dashed text-ghost",
        className,
      )}
    >
      {name ? initials(name) : "··"}
    </span>
  );
}
