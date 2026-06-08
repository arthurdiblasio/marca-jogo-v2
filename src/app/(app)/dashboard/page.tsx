import { EventScoreboard } from "@/components/football/event-scoreboard";
import { ParticipantList } from "@/components/football/participant-list";
import { SportSection } from "@/components/football/sport-section";
import { SportsRanking } from "@/components/football/sports-ranking";
import { StatStrip } from "@/components/football/stat-strip";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MatchPreview } from "@/components/landing/match-preview";
import { RankingPreview } from "@/components/landing/ranking-preview";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { peladaRanking, peladaStats } from "@/constants/mock-data";

export default function DashboardPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MatchPreview />
      <RankingPreview />
      <CtaSection /></>
  );
}
