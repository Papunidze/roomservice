"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { fetchMe } from "../api";
import { signIn, useSession } from "../store";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useSession();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    void fetchMe().then((user) => {
      if (!isCurrent) return;
      if (!user) {
        signOutLocally();
        router.replace("/sign-in");
        return;
      }
      signIn(user);
      setIsVerified(true);
    });
    return () => {
      isCurrent = false;
    };
  }, [router]);

  if (!isVerified && !session) return null;
  return children;
}

function signOutLocally() {
  window.localStorage.removeItem("roomcall.session");
}
