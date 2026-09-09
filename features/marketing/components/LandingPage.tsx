import { CallToAction } from "./CallToAction";
import { Faq } from "./Faq";
import { FlowSteps } from "./FlowSteps";
import { Hero } from "./Hero";
import { HeroPreview } from "./HeroPreview";
import { LanguagesCard } from "./LanguagesCard";
import { Pricing } from "./Pricing";
import { MobileBar } from "./MobileBar";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { Stats } from "./Stats";
import { TeamCard } from "./TeamCard";

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-6 pb-28 md:px-8 md:pb-20">
        <main>
          <Hero />
          <HeroPreview />
          <Stats />
          <FlowSteps />
          <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
            <LanguagesCard />
            <TeamCard />
          </div>
          <Pricing />
          <Faq />
          <CallToAction />
        </main>
        <SiteFooter />
      </div>
      <MobileBar />
    </div>
  );
}
