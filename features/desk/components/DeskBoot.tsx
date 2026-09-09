"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useSession } from "@/features/auth";
import { useOptionalSettings } from "@/features/requests";
import { useOptionalTeam } from "@/features/team";

export function DeskBoot({ children }: { children: ReactNode }) {
  const settings = useOptionalSettings();
  const team = useOptionalTeam();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isStaffOffInbox =
    session !== null && session.role !== "Manager" && pathname !== "/desk";

  useEffect(() => {
    if (isStaffOffInbox) router.replace("/desk");
  }, [isStaffOffInbox, router]);

  if (!settings || !team || isStaffOffInbox) return null;
  return children;
}
