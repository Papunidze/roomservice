import type { Settings } from "@/features/requests";

export const PANEL_CARD = "rounded-tile border border-line bg-surface";

export interface SettingsPanelProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}

interface PanelHeadingProps {
  title: string;
  subtitle: string;
}

export function PanelHeading({ title, subtitle }: PanelHeadingProps) {
  return (
    <div>
      <div className="text-[19px] font-semibold tracking-[-0.02em]">
        {title}
      </div>
      <div className="mt-1 text-[13px] text-faint">{subtitle}</div>
    </div>
  );
}
