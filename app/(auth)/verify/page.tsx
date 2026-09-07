import type { Metadata } from "next";

import { VerifyCodeForm } from "@/features/auth";
import { ka } from "@/shared/i18n/ka";

export const metadata: Metadata = { title: ka.auth.verify.title };

export default async function VerifyPage({
  searchParams,
}: PageProps<"/verify">) {
  const { email } = await searchParams;

  return <VerifyCodeForm email={typeof email === "string" ? email : ""} />;
}
