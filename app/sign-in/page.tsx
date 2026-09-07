import type { Metadata } from "next";

import { AuthShell, SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in · RoomCall",
};

export default function Page() {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  );
}
