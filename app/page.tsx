import { LandingNavbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/Hero";
import { FeaturesSection } from "@/components/landing/Features";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import { StatsSection } from "@/components/landing/Stats";
import { FAQSection } from "@/components/landing/FAQ";
import { LandingFooter } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Global aurora background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] orb orb-purple opacity-30" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] orb orb-blue opacity-20" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] orb orb-cyan opacity-10" style={{ animationDelay: "5s" }} />
      </div>

      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <FAQSection />
        <LandingFooter />
      </div>
    </main>
  );
}
