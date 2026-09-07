import { CallToAction } from "./CallToAction";
import { DeskFeatures } from "./DeskFeatures";
import { FlowSteps } from "./FlowSteps";
import { Hero } from "./Hero";
import { LanguageWall } from "./LanguageWall";
import { RequestKinds } from "./RequestKinds";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader />
      <main>
        <Hero />
        <FlowSteps />
        <RequestKinds />
        <LanguageWall />
        <DeskFeatures />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  );
}
