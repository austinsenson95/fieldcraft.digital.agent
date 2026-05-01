import type { Metadata } from "next";
import VideoHero from "@/components/showcase/VideoHero";

export const metadata: Metadata = {
  title: "Nature Showcase — Fieldcraft Digital",
  description: "Immersive forest and ocean video hero for nature-inspired brand storytelling.",
};

export default function NatureShowcasePage() {
  return (
    <main className="min-h-[100dvh]">
      <VideoHero
        videoSrc="/videos/nature.mp4"
        title="Wilderness Unveiled"
        subtitle="Nature"
        ctaText="Explore the Collection"
        ctaHref="#"
        textTheme="light"
        accentColor="bg-field-verdant"
        accentHoverColor="hover:bg-field-mint"
        fallbackClassName="showcase-nature-fallback"
      />

      {/* Brief context section below fold */}
      <section className="relative z-10 bg-bg-primary px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-text-tertiary mb-4 font-[family-name:var(--font-geist-mono)]">
            Video Hero — Nature Theme
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-6 tracking-tight">
            Where light filters through ancient canopy
          </h2>
          <p className="text-text-secondary leading-relaxed">
            This showcase demonstrates a full-screen looping video background paired with
            minimalist typography. The verdant accent harmonizes with forest tones, while
            the dark gradient overlay ensures text legibility across varying light conditions.
          </p>
        </div>
      </section>
    </main>
  );
}
