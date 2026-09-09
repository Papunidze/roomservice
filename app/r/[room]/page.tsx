import type { Metadata } from "next";

import { GuestApp } from "@/features/guest";

export const metadata: Metadata = {
  title: "RoomCall",
};

export default async function Page({ searchParams }: PageProps<"/r/[room]">) {
  const { t } = await searchParams;
  return <GuestApp token={typeof t === "string" ? t : ""} />;
}
