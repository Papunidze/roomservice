import type { Metadata } from "next";

import { HistoryScreen } from "@/features/desk";

export const metadata: Metadata = {
  title: "History · RoomCall",
};

export default function Page() {
  return <HistoryScreen />;
}
