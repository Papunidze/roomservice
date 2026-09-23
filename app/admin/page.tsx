import type { Metadata } from "next";

import { AdminScreen } from "@/features/admin";
import { AuthGate } from "@/features/auth";

export const metadata: Metadata = {
  title: "Admin · RoomCall",
};

export default function Page() {
  return (
    <AuthGate>
      <AdminScreen />
    </AuthGate>
  );
}
