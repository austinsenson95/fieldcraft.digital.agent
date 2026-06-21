import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import ShopSection from "@/components/sections/ShopSection";
import AboutSection from "@/components/sections/AboutSection";
import CTAFooter from "@/components/sections/CTAFooter";
import NewsletterSection from "@/components/sections/NewsletterSection";
import PricingTeaser from "@/components/sections/PricingTeaser";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <FeaturesSection />
      <ProcessSection />
      <CaseStudySection />
      <NewsletterSection />
      <ShopSection />
      <PricingTeaser />
      <AboutSection />
      <CTAFooter />
      <Footer />
    </main>
  );
}
