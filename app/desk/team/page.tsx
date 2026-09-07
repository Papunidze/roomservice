import type { Metadata } from "next";

import { TeamScreen } from "@/features/team";

export const metadata: Metadata = {
  title: "Team · RoomCall",
};

export default function Page() {
  return <TeamScreen />;
}
