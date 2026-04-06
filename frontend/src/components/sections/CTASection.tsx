"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1F15] px-6"
    >
      {/* Subtle background wireframe SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="400,50 750,250 650,550 150,550 50,250"
          stroke="currentColor"
          strokeWidth="1"
          className="text-field-mint"
        />
        <polygon
          points="400,120 650,270 580,490 220,490 150,270"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-field-mint"
        />
        <line x1="400" y1="50" x2="400" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="750" y1="250" x2="650" y2="270" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="650" y1="550" x2="580" y2="490" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="150" y1="550" x2="220" y2="490" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="50" y1="250" x2="150" y2="270" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          className="max-w-3xl font-display text-2xl font-medium text-field-parchment md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.0, ease: EASE.entrance }}
        >
          Ready to build something that&rsquo;s actually yours?
        </motion.h2>

        <motion.p
          className="mt-6 font-body text-base text-field-warm-gray md:text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE.entrance }}
        >
          Every Fieldcraft portal starts with a conversation.
        </motion.p>

        <motion.a
          href="mailto:austin@fieldcraft.digital"
          className="cta-glow mt-10 inline-block w-full rounded-xl bg-field-verdant px-8 py-4 font-display text-lg font-medium text-field-deep transition-all duration-300 hover:scale-[1.02] hover:bg-field-mint sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE.entrance }}
        >
          Start a Conversation
        </motion.a>

        <motion.p
          className="mt-8 font-body text-sm text-field-warm-gray/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE.entrance }}
        >
          Or just say hello &mdash;{" "}
          <a
            href="mailto:austin@fieldcraft.digital"
            className="text-field-soft-teal underline transition-colors hover:text-field-mint"
          >
            austin@fieldcraft.digital
          </a>
        </motion.p>
      </div>
    </section>
  );
}
