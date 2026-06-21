"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import Image from "next/image";

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
            className="glass overflow-hidden rounded-2xl"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE.entrance }}
          >
            <div className="group relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/casestudy.jpg"
                alt="Freedom Business Engine portal"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="flex flex-col justify-center">
            <motion.p
              className="os-label mb-4"
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
                <span key={tag} className="os-pill">
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
