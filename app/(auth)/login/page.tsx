import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import { ka } from "@/shared/i18n/ka";

export const metadata: Metadata = { title: ka.auth.login.title };

export default function LoginPage() {
  return <LoginForm />;
}
