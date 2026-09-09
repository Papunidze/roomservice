import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthGate } from "@/features/auth";
import { PlatesPrint } from "@/features/rooms";

export const metadata: Metadata = {
  title: "QR plates · RoomCall",
};

export default function Page() {
  return (
    <AuthGate>
      <Suspense>
        <PlatesPrint />
      </Suspense>
    </AuthGate>
  );
}
