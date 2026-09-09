import type { Metadata } from "next";

import { DeskInbox } from "@/features/desk";

export const metadata: Metadata = {
  title: "Inbox · RoomCall",
};

export default async function Page({ searchParams }: PageProps<"/desk">) {
  const { room, open } = await searchParams;
  const openId = typeof open === "string" ? Number.parseInt(open, 10) : NaN;
  return (
    <DeskInbox
      initialRoom={typeof room === "string" ? room : ""}
      initialOpenId={Number.isNaN(openId) ? null : openId}
    />
  );
}
