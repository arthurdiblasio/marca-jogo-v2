import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { StatsPreview } from "@/components/landing/stats-preview";

export default function PublicPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <StatsPreview />
    </>
  );
}