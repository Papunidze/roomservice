import type { Metadata } from "next";

import { AuthShell, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset password · RoomCall",
};

export default function Page() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
