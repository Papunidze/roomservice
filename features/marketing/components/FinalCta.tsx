import Link from "next/link";

import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";

export function FinalCta() {
  return (
    <div className="mb-11 flex flex-wrap items-center justify-between gap-6.5 rounded-[30px] bg-linear-140 from-primary-glow to-[#4b25c4] px-6.5 py-7.5 shadow-[0_30px_62px_rgb(108_60_255/0.34)] md:px-12 md:py-11">
      <div className="min-w-0 max-w-155">
        <div className="text-[28px] leading-tight font-extrabold tracking-[-0.035em] text-white md:text-[38px]">
          {ka.marketing.finalCta.title}
        </div>
        <div className="mt-3 text-[15.5px] leading-relaxed text-white/84">
          {ka.marketing.finalCta.text}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Button
          asChild
          className="h-13 bg-white px-7.5 text-[15px] text-[#4b25c4] shadow-[0_14px_30px_rgb(20_18_31/0.2)] hover:bg-white/90"
        >
          <Link href="/register">{ka.marketing.finalCta.primary}</Link>
        </Button>
        <Button
          variant="outline"
          className="h-13 rounded-full border-white/45 bg-transparent px-7.5 text-[15px] text-white hover:border-white hover:bg-white/10 hover:text-white"
        >
          {ka.marketing.finalCta.secondary}
        </Button>
      </div>
    </div>
  );
}
