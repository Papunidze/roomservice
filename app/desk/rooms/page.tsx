import type { Metadata } from "next";

import { RoomsScreen } from "@/features/rooms";

export const metadata: Metadata = {
  title: "Rooms · RoomCall",
};

export default function Page() {
  return <RoomsScreen />;
}
