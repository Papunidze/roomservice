import { cn } from "@/shared/lib/cn";

interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export function Switch({ checked, label, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-5.5 w-9.5 shrink-0 cursor-pointer rounded-full transition-colors",
        checked ? "bg-sage" : "bg-ink/15",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4.5 rounded-full bg-surface transition-[left] duration-200",
          checked ? "left-4.5" : "left-0.5",
        )}
      />
    </button>
  );
}
