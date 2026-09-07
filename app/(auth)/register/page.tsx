import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth";
import { ka } from "@/shared/i18n/ka";

export const metadata: Metadata = { title: ka.auth.register.title };

export default function RegisterPage() {
  return <RegisterForm />;
}
