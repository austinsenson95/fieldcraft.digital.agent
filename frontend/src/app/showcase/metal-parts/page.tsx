import type { Metadata } from "next";
import VideoHero from "@/components/showcase/VideoHero";

export const metadata: Metadata = {
  title: "Metal Parts Showcase — Fieldcraft Digital",
  description: "Precision mechanical gears video hero for industrial engineering storytelling.",
};

export default function MetalPartsShowcasePage() {
  return (
    <main className="min-h-[100dvh]">
      {/* 
        NOTE: Replace videoSrc with a looping video of mechanical gears, CNC machining, or metalwork.
        Recommended: macro shots of interlocking gears, oil-slick surfaces, controlled lighting.
        Example sources: Pexels, Coverr, or self-hosted MP4/WebM.
      */}
      <VideoHero
        title="Precision in Motion"
        subtitle="Metal Parts"
        ctaText="Engineer Your Vision"
        ctaHref="#"
        textTheme="light"
        accentColor="bg-field-warm-gray"
        accentHoverColor="hover:bg-field-parchment"
        fallbackClassName="showcase-metal-fallback"
      />

      <section className="relative z-10 bg-bg-primary px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-text-tertiary mb-4 font-[family-name:var(--font-geist-mono)]">
            Video Hero — Metal Parts Theme
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-6 tracking-tight">
            Where engineering meets artistry
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Created for precision engineering, aerospace, and advanced manufacturing brands.
            The dark steel palette with silver sheen animation evokes CNC-milled surfaces
            and titanium alloys. High-contrast light text ensures readability against deep
            industrial backgrounds.
          </p>
        </div>
      </section>
    </main>
  );
}
