import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell, ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Choose a new password · RoomCall",
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
