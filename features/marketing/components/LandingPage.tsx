import type { CSSProperties } from "react";

import { Faq } from "./Faq";
import { FeatureCards } from "./FeatureCards";
import { FinalCta } from "./FinalCta";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Industries } from "./Industries";
import { LandingHeader } from "./LandingHeader";
import { PainPoints } from "./PainPoints";
import { Pricing } from "./Pricing";
import { Proof } from "./Proof";
import { SiteFooter } from "./SiteFooter";

const BLOBS: CSSProperties[] = [
  {
    top: -180,
    left: -140,
    width: 680,
    height: 680,
    background:
      "radial-gradient(circle, rgba(108,60,255,.32), rgba(108,60,255,0) 70%)",
    filter: "blur(60px)",
  },
  {
    top: 60,
    right: -200,
    width: 620,
    height: 620,
    background:
      "radial-gradient(circle, rgba(255,180,90,.24), rgba(255,180,90,0) 70%)",
    filter: "blur(70px)",
  },
  {
    top: 1400,
    left: -160,
    width: 700,
    height: 700,
    background:
      "radial-gradient(circle, rgba(90,190,255,.22), rgba(90,190,255,0) 70%)",
    filter: "blur(80px)",
  },
  {
    bottom: 200,
    right: -140,
    width: 640,
    height: 640,
    background:
      "radial-gradient(circle, rgba(108,60,255,.26), rgba(108,60,255,0) 70%)",
    filter: "blur(70px)",
  },
];

export function LandingPage() {
  return (
    <div className="relative bg-[linear-gradient(180deg,#F1EDFF_0%,#F8F6FF_30%,#FFFFFF_60%,#F6F3FF_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {BLOBS.map((blob, index) => (
          <div key={index} className="absolute rounded-full" style={blob} />
        ))}
      </div>

      <LandingHeader />
      <div className="relative z-1 pt-16 md:pt-18">
        <div className="mx-auto max-w-310 px-4 md:px-10">
          <Hero />
          <PainPoints />
          <HowItWorks />
          <FeatureCards />
          <Industries />
          <Proof />
          <Pricing />
          <Faq />
          <section className="py-11 md:py-18">
            <FinalCta />
            <SiteFooter />
          </section>
        </div>
      </div>
    </div>
  );
}
