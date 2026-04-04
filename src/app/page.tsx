import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/layout/Navbar";
import ProblemSection from "@/components/sections/ProblemSection";
import PortalShowcase from "@/components/sections/PortalShowcase";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <PortalShowcase />
      <ProcessSection />
      <CaseStudySection />
      <AboutSection />
      <CTASection />
      <Footer />
    </main>
  );
}
