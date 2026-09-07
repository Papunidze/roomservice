import type { Metadata } from "next";

import { GuestApp } from "@/features/guest";
import { HOTEL } from "@/features/requests";

export const metadata: Metadata = {
  title: `${HOTEL.name} · RoomCall`,
};

export default async function Page({ params }: PageProps<"/r/[room]">) {
  const { room } = await params;
  return <GuestApp room={room} />;
}
