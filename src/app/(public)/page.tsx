import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MatchPreview } from "@/components/landing/match-preview";
import { RankingPreview } from "@/components/landing/ranking-preview";
import { getSession } from "@/shared/auth/auth-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session =
    await getSession();

  if (session) {
    redirect("/dashboard");
  }

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