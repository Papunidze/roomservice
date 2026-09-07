import type { Metadata } from "next";

import { SettingsScreen } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings · RoomCall",
};

export default function Page() {
  return <SettingsScreen />;
}
