"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

const techTags = ["Next.js", "Claude API", "Razorpay", "Remotion", "Supabase"];

export default function CaseStudySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-bg-primary px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[60%_40%] md:gap-16 lg:gap-20">
          {/* Image */}
          <motion.div
            className="overflow-hidden rounded-lg border border-border-subtle"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE.entrance }}
          >
            <div className="group relative aspect-[16/10] overflow-hidden bg-bg-tertiary">
              {/* Portal mockup visual */}
              <div className="absolute inset-0 flex">
                {/* Sidebar */}
                <div className="hidden w-40 shrink-0 border-r border-border-subtle bg-bg-secondary p-4 sm:block">
                  <div className="mb-4 h-2 w-16 rounded bg-border-subtle" />
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-accent-muted" />
                    <div className="h-2 w-3/4 rounded bg-border-subtle" />
                    <div className="h-2 w-3/4 rounded bg-border-subtle" />
                    <div className="h-2 w-3/4 rounded bg-border-subtle" />
                  </div>
                </div>
                {/* Main */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="mb-4 h-3 w-40 rounded bg-text-primary/10" />
                  <div className="mb-4 rounded-lg border border-border-subtle bg-bg-secondary p-3">
                    <div className="mb-2 h-2 w-32 rounded bg-text-muted" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded bg-text-muted/50" />
                      <div className="h-2 w-5/6 rounded bg-text-muted/50" />
                      <div className="h-2 w-4/6 rounded bg-text-muted/50" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-accent-muted bg-accent-glow p-3">
                    <div className="mb-1 h-2.5 w-36 rounded bg-accent/30" />
                    <div className="mb-3 h-2 w-48 rounded bg-text-muted" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <div className="h-2 w-3/4 rounded bg-text-muted/60" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <div className="h-2 w-2/3 rounded bg-text-muted/60" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <div className="h-2 w-4/5 rounded bg-text-muted/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hover scale */}
              <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="flex flex-col justify-center">
            <motion.p
              className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE.entrance }}
            >
              RECENT WORK
            </motion.p>
            <motion.h3
              className="font-[family-name:var(--font-geist-sans)] text-2xl tracking-tight text-text-primary md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE.entrance }}
            >
              Freedom Business Engine
            </motion.h3>
            <motion.p
              className="mt-4 text-base leading-relaxed text-text-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE.entrance }}
            >
              A personalised portal for a freedom business coach — AI-powered blueprint generation, branded content delivery, and integrated payments.
            </motion.p>

            {/* Tech stack tags */}
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE.entrance }}
            >
              {techTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-accent-muted px-3 py-1 font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-accent"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.a
              href="#"
              className="mt-6 inline-block text-sm text-accent transition-colors hover:underline"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE.entrance }}
            >
              View Case Study →
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
