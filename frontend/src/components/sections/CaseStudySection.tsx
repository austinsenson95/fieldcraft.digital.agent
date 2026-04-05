"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import PortalMockup from "@/components/interactive/PortalMockup";

const techTags = ["Next.js", "Claude API", "Razorpay", "Remotion", "Supabase"];

const metrics = [
  { value: "Custom portal", label: "Built from scratch" },
  { value: "AI blueprints", label: "Personalised to client\u2019s audience" },
  { value: "Full system", label: "Payments, content, delivery" },
];

export default function CaseStudySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-field-deep px-4 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        {/* Section label + title */}
        <motion.p
          className="mb-4 text-center font-body text-xs uppercase tracking-[0.2em] text-field-mint/60"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          Recent work
        </motion.p>
        <motion.h2
          className="mb-4 text-center font-display text-3xl font-medium text-field-parchment md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Freedom Business Engine
        </motion.h2>
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center font-body text-base text-field-warm-gray md:mb-16 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE.entrance }}
        >
          A personalised portal for a freedom business coach &mdash; AI-powered
          blueprint generation, branded content delivery, and integrated
          payments.
        </motion.p>

        {/* Portal screenshot / mockup */}
        <motion.div
          className="mx-auto mb-8 max-w-4xl overflow-hidden rounded-xl border border-field-mint/10"
          style={{ boxShadow: "0 0 60px rgba(29, 158, 117, 0.06)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.entrance }}
        >
          <div className="aspect-[16/10]">
            <PortalMockup />
          </div>
        </motion.div>

        {/* Tech tags */}
        <div className="mb-12 flex flex-wrap justify-center gap-2 md:mb-16">
          {techTags.map((tag, i) => (
            <motion.span
              key={tag}
              className="rounded-full border border-field-mint/20 px-3 py-1 font-mono text-xs text-field-soft-teal"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : undefined}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.1,
                ease: EASE.entrance,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.value}
              className="rounded-xl border border-field-mint/10 bg-field-deep/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.6,
                delay: 0.7 + i * 0.15,
                ease: EASE.entrance,
              }}
            >
              <div className="font-display text-lg font-medium text-field-mint md:text-xl">
                {metric.value}
              </div>
              <div className="mt-1 font-body text-sm text-field-warm-gray">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
