import HeroSection from "@/components/sections/HeroSection";
import Navbar from "@/components/layout/Navbar";
import ProblemSection from "@/components/sections/ProblemSection";
import PortalShowcase from "@/components/sections/PortalShowcase";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import DeliverablesSection from "@/components/sections/DeliverablesSection";
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
      <DeliverablesSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </main>
  );
}
