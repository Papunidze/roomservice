import { ka } from "@/shared/i18n/ka";
import { cn } from "@/shared/lib/cn";

interface WordmarkProps {
  size?: number;
  className?: string;
}

export function Wordmark({ size = 26, className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline leading-none font-bold tracking-[-0.045em] whitespace-nowrap",
        className,
      )}
      style={{ fontSize: size }}
    >
      {ka.brand}
      <span
        aria-hidden
        className="self-end bg-primary"
        style={{
          width: size * 0.11,
          height: size * 0.11,
          borderRadius: size * 0.028,
          marginLeft: size * 0.06,
          marginBottom: size * 0.03,
        }}
      />
    </span>
  );
}

interface WordmarkMarkProps {
  size?: number;
  className?: string;
  dotClassName?: string;
}

export function WordmarkMark({
  size = 32,
  className,
  dotClassName,
}: WordmarkMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("block", className)}
    >
      <rect x="6" y="12" width="52" height="11" rx="5.5" fill="currentColor" />
      <rect
        x="26.5"
        y="12"
        width="11"
        height="40"
        rx="5.5"
        fill="currentColor"
      />
      <rect
        x="46"
        y="41"
        width="11"
        height="11"
        rx="3"
        className={cn("fill-primary", dotClassName)}
      />
    </svg>
  );
}
