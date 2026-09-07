import type { Metadata } from "next";

import { DeskInbox } from "@/features/desk";

export const metadata: Metadata = {
  title: "Inbox · RoomCall",
};

export default async function Page({ searchParams }: PageProps<"/desk">) {
  const { room } = await searchParams;
  return <DeskInbox initialRoom={typeof room === "string" ? room : ""} />;
}
