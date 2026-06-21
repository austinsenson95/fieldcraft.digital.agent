"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />
  ),
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden"
    >
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
        {/* Vignette overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, transparent 0%, rgba(15, 43, 30, 0.4) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 md:px-10 lg:px-16">
        <div className="max-w-[720px]">
          {/* Glassmorphism HUD panel */}
          <motion.div
            className="rounded-2xl border border-border-subtle p-8 md:p-10"
            style={{
              background: "rgba(15, 43, 30, 0.45)",
              backdropFilter: "blur(16px) saturate(1.1)",
              WebkitBackdropFilter: "blur(16px) saturate(1.1)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="mb-6 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              BESPOKE SOFTWARE PORTALS
            </motion.p>

            <motion.h1
              className="font-[family-name:var(--font-geist-sans)] text-4xl font-semibold leading-tight tracking-tight text-text-primary md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              Engineered around you.
            </motion.h1>

            <motion.p
              className="mt-6 font-[family-name:var(--font-geist-sans)] text-xl leading-snug text-text-secondary md:text-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.35,
              }}
            >
              No templates. No compromises.
            </motion.p>

            <motion.p
              className="mt-8 max-w-[560px] text-lg leading-normal text-text-tertiary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5,
              }}
            >
              Fieldcraft Digital builds software portals tailored to how your business actually works.
            </motion.p>

            <motion.a
              href="/brief"
              data-event="book_call_click"
              className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm tracking-wider text-bg-primary transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.65,
              }}
            >
              Book a Field Brief
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Cursor hint */}
      <motion.div
        className="pointer-events-none absolute bottom-28 right-6 z-10 hidden flex-col gap-2 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.22em] uppercase text-text-muted">
          <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded border border-border-medium px-1.5 text-text-tertiary">
            drag
          </span>
          warp the field
        </div>
        <div className="flex items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.22em] uppercase text-text-muted">
          <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded border border-border-medium px-1.5 text-text-tertiary">
            click
          </span>
          release energy
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-12 w-px overflow-hidden bg-text-muted/30">
          <motion.div
            className="absolute top-0 left-0 h-3 w-full bg-text-muted"
            animate={{ y: [0, 36, 0], opacity: [1, 0, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
