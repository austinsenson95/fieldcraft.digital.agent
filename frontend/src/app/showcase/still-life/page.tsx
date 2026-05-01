import type { Metadata } from "next";
import VideoHero from "@/components/showcase/VideoHero";

export const metadata: Metadata = {
  title: "Still Life Showcase — Fieldcraft Digital",
  description: "Elegant ceramics and glassware video hero for artisan brand storytelling.",
};

export default function StillLifeShowcasePage() {
  return (
    <main className="min-h-[100dvh]">
      {/* 
        NOTE: Replace videoSrc with a looping video of ceramics, glassware, or still life.
        Recommended: soft studio lighting, slow dolly movements, warm tones.
        Example sources: Pexels, Coverr, or self-hosted MP4/WebM.
      */}
      <VideoHero
        title="Form & Light"
        subtitle="Still Life"
        ctaText="View the Studio"
        ctaHref="#"
        textTheme="dark"
        accentColor="bg-field-obsidian"
        accentHoverColor="hover:bg-field-deep"
        fallbackClassName="showcase-stilllife-fallback"
      />

      <section className="relative z-10 bg-bg-primary px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-text-tertiary mb-4 font-[family-name:var(--font-geist-mono)]">
            Video Hero — Still Life Theme
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-6 tracking-tight">
            Crafted in silence, lit with intention
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Designed for artisan brands and ceramic studios. The warm parchment palette
            echoes kiln-fired clay and hand-blown glass. Dark text maintains contrast
            against bright, airy backgrounds — ideal for product-forward storytelling.
          </p>
        </div>
      </section>
    </main>
  );
}
