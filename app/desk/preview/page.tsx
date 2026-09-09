import type { Metadata } from "next";

import { GuestPreviewScreen } from "@/features/guest";

export const metadata: Metadata = {
  title: "Guest preview · RoomCall",
};

export default function Page() {
  return <GuestPreviewScreen />;
}
