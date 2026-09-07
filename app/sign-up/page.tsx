import type { Metadata } from "next";

import { AuthShell, SignUpForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Set up your hotel · RoomCall",
};

export default function Page() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  );
}
