import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth";
import { ka } from "@/shared/i18n/ka";

export const metadata: Metadata = { title: ka.auth.forgot.title };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
