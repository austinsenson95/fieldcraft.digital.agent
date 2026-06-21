"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import Link from "next/link";

export default function PricingTeaser() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section
      ref={ref}
      className="border-t border-border-subtle bg-bg-primary px-6 py-12 text-center md:px-10 lg:px-16"
    >
      <motion.div
        className="mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE.entrance }}
      >
        <p className="text-lg text-text-primary">
          Need something built specifically for your business?
        </p>
        <p className="mt-2 text-text-tertiary">
          Custom portals start at GBP 5,000.{" "}
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-accent transition-colors hover:text-accent-hover"
          >
            See pricing
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
