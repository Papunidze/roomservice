import type { Metadata } from "next";

import { DeskInbox } from "@/features/desk";

export const metadata: Metadata = {
  title: "Inbox · RoomCall",
};

export default function Page() {
  return <DeskInbox />;
}
