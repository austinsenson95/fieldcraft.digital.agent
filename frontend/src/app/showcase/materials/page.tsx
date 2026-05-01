import type { Metadata } from "next";
import VideoHero from "@/components/showcase/VideoHero";

export const metadata: Metadata = {
  title: "Materials Showcase — Fieldcraft Digital",
  description: "Tactile leather and fabric texture video hero for luxury material storytelling.",
};

export default function MaterialsShowcasePage() {
  return (
    <main className="min-h-[100dvh]">
      {/* 
        NOTE: Replace videoSrc with a looping video of leather, fabric, or textile textures.
        Recommended: macro close-ups, slow pan across grain, warm natural lighting.
        Example sources: Pexels, Coverr, or self-hosted MP4/WebM.
      */}
      <VideoHero
        title="Touch of Tradition"
        subtitle="Materials"
        ctaText="Feel the Difference"
        ctaHref="#"
        textTheme="light"
        accentColor="bg-field-gold"
        accentHoverColor="hover:brightness-110"
        fallbackClassName="showcase-materials-fallback"
      />

      <section className="relative z-10 bg-bg-primary px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-text-tertiary mb-4 font-[family-name:var(--font-geist-mono)]">
            Video Hero — Materials Theme
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-6 tracking-tight">
            Every fiber tells a story
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Built for heritage leather goods, bespoke tailoring, and tactile luxury brands.
            The deep umber and gold accent palette draws from full-grain leather and aged
            brass hardware. Light text floats above shadow-rich textures.
          </p>
        </div>
      </section>
    </main>
  );
}
