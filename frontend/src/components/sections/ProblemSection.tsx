"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

const lines = [
  {
    text: "Your business runs on systems designed for someone else.",
    className:
      "font-display text-xl md:text-3xl lg:text-4xl font-medium text-field-parchment",
  },
  {
    text: "Templates. Plugins. Workarounds.",
    className:
      "font-display text-lg md:text-2xl lg:text-3xl font-normal text-field-mint",
  },
  {
    text: "What if your software actually thought like your business?",
    className:
      "font-accent text-xl md:text-3xl lg:text-4xl italic text-field-parchment",
  },
];

export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      aria-label="Problem statement"
      className="flex min-h-[80vh] items-center justify-center bg-field-deep px-6 md:min-h-screen md:px-8 lg:px-0"
    >
      <div className="flex max-w-[720px] flex-col items-center gap-6 text-center md:gap-8">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            className={line.className}
            initial={{ opacity: 0.15, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.8,
              delay: i * 0.2,
              ease: EASE.entrance,
            }}
          >
            {line.text}
          </motion.p>
        ))}

        {/* Divider line */}
        <motion.div
          className="mt-4 h-px w-[200px] bg-field-mint/30"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : undefined}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: EASE.entrance,
          }}
          style={{ transformOrigin: "center" }}
        />
      </div>
    </section>
  );
}
