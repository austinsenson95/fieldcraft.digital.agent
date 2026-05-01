"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  variant?: "fade-up" | "fade-left" | "fade-right" | "scale-in";
  once?: boolean;
  amount?: number;
  className?: string;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const variants = {
  "fade-up": { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  "scale-in": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
};

export default function AnimatedSection({
  children,
  delay = 0,
  duration = 0.7,
  variant = "fade-up",
  once = true,
  amount = 0.15,
  className,
  staggerChildren = false,
  staggerDelay = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const selected = variants[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: selected.hidden,
        visible: {
          ...selected.visible,
          transition: {
            duration,
            delay,
            ease: EASE.entrance,
            staggerChildren: staggerChildren ? staggerDelay : 0,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedChild({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE.entrance },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
