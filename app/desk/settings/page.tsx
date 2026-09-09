import type { Metadata } from "next";

import { isSection, SettingsScreen } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings · RoomCall",
};

export default async function Page({
  searchParams,
}: PageProps<"/desk/settings">) {
  const { section } = await searchParams;
  return (
    <SettingsScreen initialSection={isSection(section) ? section : undefined} />
  );
}
