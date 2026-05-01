"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="border-t border-border-subtle bg-bg-secondary px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[55%_45%] md:gap-16 lg:gap-24">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE.entrance }}
        >
          <p className="mb-8 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase">
            PHILOSOPHY
          </p>
          <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl leading-snug tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Your business runs on systems designed for someone else. Templates. Plugins. Workarounds.
          </h2>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="flex flex-col justify-end"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE.entrance }}
        >
          {/* Abstract geometric illustration */}
          <svg
            className="mb-8 h-auto w-full max-w-[280px]"
            viewBox="0 0 280 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="20" stroke="rgba(245, 241, 235, 0.12)" strokeWidth="1" />
            <circle cx="240" cy="140" r="30" stroke="rgba(29, 158, 117, 0.15)" strokeWidth="1" />
            <line x1="40" y1="40" x2="140" y2="90" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
            <line x1="140" y1="90" x2="240" y2="140" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
            <line x1="140" y1="90" x2="140" y2="180" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="120" y="70" width="40" height="40" stroke="rgba(29, 158, 117, 0.15)" strokeWidth="1" />
            <circle cx="140" cy="90" r="4" fill="rgba(93, 202, 165, 0.25)" />
          </svg>

          <p className="text-xl leading-snug text-text-secondary">
            What if your software actually thought like your business?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
