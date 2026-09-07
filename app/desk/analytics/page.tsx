import type { Metadata } from "next";

import { AnalyticsScreen } from "@/features/desk";

export const metadata: Metadata = {
  title: "Analytics · RoomCall",
};

export default function Page() {
  return <AnalyticsScreen />;
}
