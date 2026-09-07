import type { ReactNode } from "react";
import Link from "next/link";

import { ka } from "@/shared/i18n/ka";
import { Wordmark } from "@/shared/ui/wordmark";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh w-full justify-center p-0 md:p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -left-30 size-155 rounded-full bg-[radial-gradient(circle,rgba(108,60,255,.28),transparent_70%)] blur-[60px]" />
        <div className="absolute -right-45 -bottom-20 size-140 rounded-full bg-[radial-gradient(circle,rgba(90,190,255,.2),transparent_70%)] blur-[70px]" />
      </div>

      <div className="relative z-1 m-auto flex min-h-dvh w-full max-w-120 flex-col justify-center overflow-hidden rounded-none border-white/85 bg-white px-4.5 py-8 shadow-[0_10px_30px_rgb(20_18_31/0.12)] md:min-h-0 md:justify-start md:rounded-card md:border md:px-10">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="link-underline">
            <Wordmark size={30} />
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-[26px] leading-tight font-extrabold tracking-[-0.03em] md:text-3xl">
            {title}
          </h1>
          <p className="mx-auto max-w-[85%] text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="w-full">{children}</div>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            {ka.marketing.footer.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}
