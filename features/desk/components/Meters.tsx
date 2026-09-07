import { cn } from "@/shared/lib/cn";

interface MeterProps {
  label: string;
  value: string;
  percent: number;
  fill: string;
}

function Track({ percent, fill }: { percent: number; fill: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-ink/7">
      <div
        style={{ width: `${percent}%` }}
        className={cn("h-full rounded-full", fill)}
      />
    </div>
  );
}

export function StackedMeter({ label, value, percent, fill }: MeterProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13.5px]">{label}</span>
        <span className="font-mono text-xs text-faint">{value}</span>
      </div>
      <Track percent={percent} fill={fill} />
    </div>
  );
}

export function InlineMeter({ label, value, percent, fill }: MeterProps) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="w-18 text-[13.5px]">{label}</span>
      <div className="flex-1">
        <Track percent={percent} fill={fill} />
      </div>
      <span className="w-8.5 text-right font-mono text-xs text-faint">
        {value}
      </span>
    </div>
  );
}
