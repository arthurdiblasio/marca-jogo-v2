import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { MatchPreview } from "@/components/landing/match-preview";
import { RankingPreview } from "@/components/landing/ranking-preview";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection />
      <FeaturesSection />
      <MatchPreview />
      <RankingPreview />
      <CtaSection />
    </main>
  );
}