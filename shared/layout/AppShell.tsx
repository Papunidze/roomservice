import type { CSSProperties, ReactNode } from "react";

import { MobileTabBar } from "./MobileTabBar";
import { Sidebar } from "./Sidebar";

const BLOBS: CSSProperties[] = [
  {
    top: -160,
    left: -120,
    width: 620,
    height: 620,
    background:
      "radial-gradient(circle, rgba(108,60,255,.30), rgba(108,60,255,0) 70%)",
    filter: "blur(60px)",
  },
  {
    top: 180,
    right: -180,
    width: 560,
    height: 560,
    background:
      "radial-gradient(circle, rgba(255,180,90,.22), rgba(255,180,90,0) 70%)",
    filter: "blur(70px)",
  },
  {
    bottom: -220,
    left: "30%",
    width: 680,
    height: 560,
    background:
      "radial-gradient(circle, rgba(90,190,255,.20), rgba(90,190,255,0) 70%)",
    filter: "blur(80px)",
  },
];

interface AppShellProps {
  businessName: string;
  planLabel: string;
  children: ReactNode;
}

export function AppShell({ businessName, planLabel, children }: AppShellProps) {
  return (
    <div className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {BLOBS.map((blob, index) => (
          <div key={index} className="absolute rounded-full" style={blob} />
        ))}
      </div>
      <div className="relative z-1 flex items-stretch">
        <Sidebar businessName={businessName} planLabel={planLabel} />
        <div className="min-w-0 max-w-[1320px] flex-1 px-3.5 pt-3 pb-24 md:px-7 md:pt-5 md:pb-9">
          {children}
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}
