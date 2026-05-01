import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Video Hero Showcases — Fieldcraft Digital",
  description: "Four immersive video hero themes for product showcases and brand story openings.",
};

const showcases = [
  {
    href: "/showcase/nature",
    label: "Nature",
    description: "Forest canopy & ocean waves",
    theme: "Forest greens & deep teal",
    textClass: "text-field-mint",
    borderClass: "border-field-verdant/30",
    hoverBorder: "hover:border-field-verdant",
  },
  {
    href: "/showcase/still-life",
    label: "Still Life",
    description: "Ceramics & glassware",
    theme: "Warm parchment & amber",
    textClass: "text-field-gold",
    borderClass: "border-field-gold/30",
    hoverBorder: "hover:border-field-gold",
  },
  {
    href: "/showcase/materials",
    label: "Materials",
    description: "Leather & fabric textures",
    theme: "Rich umber & brass",
    textClass: "text-field-warm-gray",
    borderClass: "border-field-warm-gray/30",
    hoverBorder: "hover:border-field-warm-gray",
  },
  {
    href: "/showcase/metal-parts",
    label: "Metal Parts",
    description: "Mechanical gears & precision",
    theme: "Steel grey & silver",
    textClass: "text-text-secondary",
    borderClass: "border-border-subtle",
    hoverBorder: "hover:border-border-medium",
  },
];

export default function ShowcaseIndexPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 bg-bg-primary">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-text-tertiary mb-4 font-[family-name:var(--font-geist-mono)]">
            Fieldcraft Digital
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-text-primary tracking-tight mb-6">
            Video Hero Showcases
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
            Four full-screen video hero themes built for immersive brand storytelling.
            Minimalist typography, optimized loading, and theme-harmonized palettes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcases.map((showcase) => (
            <Link
              key={showcase.href}
              href={showcase.href}
              className={`group relative p-8 md:p-10 border ${showcase.borderClass} ${showcase.hoverBorder} bg-bg-secondary/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bg-secondary`}
            >
              <div className="flex items-start justify-between mb-8">
                <span
                  className={`text-xs tracking-[0.15em] uppercase ${showcase.textClass} font-[family-name:var(--font-geist-mono)]`}
                >
                  {showcase.theme}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-text-muted transition-all duration-300 group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M5 15L15 5M15 5H7M15 5V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-2">
                {showcase.label}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {showcase.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-text-muted text-sm">
            Each page supports video + CSS fallback. Drop your own MP4/WebM into{" "}
            <code className="text-text-tertiary font-[family-name:var(--font-geist-mono)] text-xs">
              public/videos/
            </code>{" "}
            and update the{" "}
            <code className="text-text-tertiary font-[family-name:var(--font-geist-mono)] text-xs">
              videoSrc
            </code>{" "}
            prop.
          </p>
        </div>
      </div>
    </main>
  );
}
