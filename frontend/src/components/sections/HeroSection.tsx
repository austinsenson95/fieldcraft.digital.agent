"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/animations";

const HeroMesh = dynamic(() => import("@/components/three/HeroMesh"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(93, 202, 165, 0.06) 0%, transparent 70%)",
      }}
    />
  ),
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrollIndicatorVisible(window.scrollY < 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Also hide after 8 seconds if user hasn't scrolled
    const timer = setTimeout(() => setScrollIndicatorVisible(false), 8000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-field-deep"
    >
      {/* Three.js mesh background */}
      <HeroMesh />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          className="font-accent text-5xl leading-tight tracking-tight text-field-parchment md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: DURATION.slow,
            ease: EASE.entrance,
            delay: 0.2,
          }}
        >
          Engineered around you.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl font-body text-base leading-relaxed text-field-soft-teal/70 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.normal,
            ease: EASE.entrance,
            delay: 0.8,
          }}
        >
          Bespoke software portals for coaches, consultants, and creators
          who&apos;ve outgrown their tools.
        </motion.p>

        {/* Primary CTA button */}
        <motion.a
          href="#contact"
          className="mt-8 inline-block rounded-xl bg-field-verdant px-8 py-4 font-display text-base font-medium text-field-deep transition-all duration-300 hover:scale-[1.02] hover:bg-field-mint hover:shadow-[0_0_24px_rgba(93,202,165,0.3)] md:mt-10 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.normal,
            ease: EASE.entrance,
            delay: 1.4,
          }}
        >
          Start a Conversation
        </motion.a>

        {/* Secondary ghost link */}
        <motion.button
          onClick={() => scrollToSection("work")}
          className="mt-4 cursor-pointer font-body text-sm text-field-soft-teal/60 transition-colors hover:text-field-soft-teal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DURATION.normal,
            ease: EASE.entrance,
            delay: 1.6,
          }}
        >
          See how it works ↓
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
        transition={{ delay: scrollIndicatorVisible ? 1.8 : 0, duration: 1 }}
      >
        <span className="font-body text-xs uppercase tracking-widest text-field-mint/40">
          Scroll
        </span>
        <motion.div
          className="h-8 w-px bg-field-mint/30"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
