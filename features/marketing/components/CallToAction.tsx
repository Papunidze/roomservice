import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="border-t border-line py-16 md:py-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="rounded-card bg-sage-ink px-7 py-12 text-paper md:px-14 md:py-16">
          <h2 className="max-w-[560px] text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] text-balance md:text-[34px]">
            Put a plate in every room and the language problem goes away.
          </h2>
          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-paper/70">
            Name your property, print the QR plates from the Rooms screen, and
            the desk is live. Nothing for the guest to install.
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            <Link
              href="/sign-up"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-[13.5px] font-medium text-ink"
            >
              Set up your hotel
              <ArrowRight strokeWidth={1.6} className="size-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex min-h-11 items-center rounded-full border border-paper/25 px-5 text-[13.5px] font-medium text-paper/80 transition-colors hover:border-paper/50 hover:text-paper"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
