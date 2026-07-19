"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import SpriteAvatar from "./SpriteAvatar";
import { links } from "@/lib/links";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="about"
      className="bg-bg-secondary px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[40%_60%] md:gap-16 lg:gap-20">
        {/* Sprite Avatar */}
        <motion.div
          className="order-2 md:order-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.7, ease: EASE.entrance }}
        >
          <div className="glass relative aspect-[3/4] overflow-hidden rounded-2xl">
            <SpriteAvatar />
          </div>
        </motion.div>

        {/* Text */}
        <div className="order-1 flex flex-col justify-center md:order-2">
          <motion.p
            className="os-label mb-4"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE.entrance }}
          >
            ABOUT
          </motion.p>
          <motion.h2
            className="font-[family-name:var(--font-geist-sans)] text-2xl tracking-tight text-text-primary md:text-3xl"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE.entrance }}
          >
            Austin Senson
          </motion.h2>
          <motion.p
            className="mt-3 text-xl text-text-secondary"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE.entrance }}
          >
            Firmware engineer turned software architect.
          </motion.p>
          <motion.p
            className="mt-6 max-w-[480px] text-base leading-relaxed text-text-tertiary"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.24, ease: EASE.entrance }}
          >
            I build systems that think like the businesses they serve. Based in Bangalore. Building globally.
          </motion.p>
          <motion.div
            className="mt-6 flex items-center gap-3 text-sm text-text-muted"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.32, ease: EASE.entrance }}
          >
            <a
              href={links.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="os-pill transition-colors duration-200 hover:text-text-secondary hover:border-border-medium"
            >
              LinkedIn
            </a>
            <a
              href={links.social.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="os-pill transition-colors duration-200 hover:text-text-secondary hover:border-border-medium"
            >
              Writing @austinxalchemy
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
