"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import PortalMockup from "@/components/interactive/PortalMockup";

const featureLabels = [
  {
    label: "AI Blueprint Generator",
    benefit:
      "Your audience answers a few questions. They get a custom roadmap — branded to you.",
  },
  {
    label: "Branded Dashboard",
    benefit:
      "Your clients log in to a space that looks and feels like your brand, not a generic tool.",
  },
  {
    label: "Automated Delivery",
    benefit: "Content, resources, and assets delivered on schedule without manual work.",
  },
  {
    label: "Payment Integration",
    benefit: "Razorpay-powered billing built into the portal. No third-party checkout pages.",
  },
  {
    label: "Video Content Engine",
    benefit: "Personalised video content generated and delivered at scale.",
  },
];

function FeaturePill({
  label,
  benefit,
  delay,
  visible,
}: {
  label: string;
  benefit: string;
  delay: number;
  visible: boolean;
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: EASE.entrance }}
    >
      {/* Pill — always visible on mobile as a card, hover-expandable on desktop */}
      <div className="rounded-xl border border-field-mint/20 bg-field-deep/80 px-4 py-2 transition-all duration-200 sm:rounded-full md:hover:rounded-xl md:hover:border-field-mint/30 md:hover:bg-field-deep/90">
        <span className="block font-body text-xs text-field-soft-teal sm:text-sm">{label}</span>
        {/* Benefit — always visible on mobile, revealed on hover on desktop */}
        <p className="mt-1 font-body text-xs text-field-warm-gray/70 md:hidden md:group-hover:block">
          {benefit}
        </p>
        <p className="mt-1 hidden max-h-0 overflow-hidden font-body text-xs text-field-warm-gray/70 transition-all duration-200 md:block md:max-h-0 md:opacity-0 md:group-hover:max-h-12 md:group-hover:opacity-100">
          {benefit}
        </p>
      </div>
    </motion.div>
  );
}

export default function PortalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const labelsInView = useInView(labelsRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Portal 3D rotation — starts tilted, straightens as user scrolls in
  const rotateY = useTransform(scrollYProgress, [0.1, 0.4], [-8, 0]);
  const rotateX = useTransform(scrollYProgress, [0.1, 0.4], [3, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.85, 1]);

  // Portal interior reveal — crossfade from exterior to mockup
  const exteriorOpacity = useTransform(scrollYProgress, [0.4, 0.55], [1, 0]);
  const interiorOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const interiorScale = useTransform(scrollYProgress, [0.45, 0.6], [0.95, 1]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative min-h-[200vh] bg-[#162B24] px-4 py-32 md:px-8"
      style={{ perspective: "1200px" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Section heading */}
        <div className="sticky top-[20vh] mb-16">
          <motion.p
            className="mb-4 text-center font-body text-xs uppercase tracking-[0.2em] text-field-mint/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE.entrance }}
          >
            What we build
          </motion.p>
          <motion.h2
            className="mb-16 text-center font-display text-2xl font-medium text-field-parchment md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
          >
            Software that thinks like your business.
          </motion.h2>

          {/* 3D Portal container */}
          <motion.div
            className="relative mx-auto aspect-[16/10] w-full max-w-3xl"
            style={{
              rotateY,
              rotateX,
              scale,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Exterior — dark panel */}
            <motion.div
              className="absolute inset-0 rounded-xl border border-field-mint/20 bg-field-obsidian"
              style={{
                opacity: exteriorOpacity,
                boxShadow: "0 0 80px rgba(29, 158, 117, 0.08)",
              }}
            >
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 font-display text-lg font-medium text-field-mint/40 md:text-xl">
                    Your Portal
                  </div>
                  <div className="font-body text-sm text-field-warm-gray/30">
                    Built from your business model
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interior — actual portal mockup */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-xl border border-field-mint/20"
              style={{
                opacity: interiorOpacity,
                scale: interiorScale,
                boxShadow: "0 0 80px rgba(29, 158, 117, 0.08)",
              }}
            >
              <PortalMockup />
            </motion.div>
          </motion.div>

          {/* Feature pills — cards on mobile, hover-expandable on desktop */}
          <div
            ref={labelsRef}
            className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 md:gap-3"
          >
            {featureLabels.map((feature, i) => (
              <FeaturePill
                key={feature.label}
                label={feature.label}
                benefit={feature.benefit}
                delay={i * 0.1}
                visible={labelsInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
