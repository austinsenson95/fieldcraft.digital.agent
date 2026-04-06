"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Discovery",
    week: "Week 1–2",
    description:
      "We map the invisible structure of your business. Not just what you sell — but how your audience thinks, what your delivery looks like, and where the leverage points are.",
  },
  {
    number: "02",
    title: "Architecture",
    week: "Week 2–5",
    description:
      "Your portal is engineered from your model. AI-powered blueprint generation, branded dashboards, automated delivery, payment integration — all built as one unified system.",
  },
  {
    number: "03",
    title: "Delivery",
    week: "Week 5–8",
    description:
      "You receive a living system, not a static website. Ongoing support, iteration, and the ability to evolve as your business grows.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-field-parchment px-6 py-20 md:py-32"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section header */}
        <motion.p
          className="mb-4 font-body text-xs uppercase tracking-[0.2em] text-field-verdant"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="mb-3 font-display text-3xl font-medium text-field-obsidian md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Three steps. Zero templates.
        </motion.h2>
        <motion.p
          className="mb-16 font-body text-base text-field-deep-teal/70 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE.entrance }}
        >
          Typical projects run 4–8 weeks from kickoff to launch.
        </motion.p>

        {/* Steps with connecting line */}
        <div className="relative pl-8 md:pl-12">
          {/* Animated vertical line */}
          <div
            ref={lineRef}
            className="absolute top-0 left-0 h-full w-px md:left-2"
          >
            <div className="h-full w-full bg-field-verdant/10" />
            <motion.div
              className="absolute top-0 left-0 h-full w-full origin-top bg-field-verdant/30"
              style={{ scaleY: lineScaleY }}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Pricing signal */}
        <motion.p
          className="mt-16 text-center font-body text-sm text-field-warm-gray/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          Fieldcraft portals are a premium, one-time investment — not a monthly
          subscription. Projects typically start at ₹1,50,000.
        </motion.p>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: EASE.entrance,
      }}
    >
      {/* Dot on the line */}
      <div className="absolute -left-8 top-1 h-2 w-2 rounded-full bg-field-verdant md:-left-[42px]" />

      <div className="font-mono text-xs text-field-verdant/60">{step.week}</div>
      <div className="mt-1 font-mono text-sm text-field-verdant">
        {step.number}
      </div>
      <h3 className="mt-1 font-display text-xl font-medium text-field-obsidian">
        {step.title}
      </h3>
      <p className="mt-3 max-w-lg font-body text-base leading-relaxed text-field-deep-teal">
        {step.description}
      </p>
    </motion.div>
  );
}
