import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import AboutSection from "@/components/sections/AboutSection";
import CTAFooter from "@/components/sections/CTAFooter";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <FeaturesSection />
      <ProcessSection />
      <CaseStudySection />
      <AboutSection />
      <CTAFooter />
    </main>
  );
}
