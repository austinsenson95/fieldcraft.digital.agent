"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We map the invisible structure of your business. Not just what you sell — but how your audience thinks, what your delivery looks like, and where the leverage points are.",
  },
  {
    number: "02",
    title: "Architecture",
    description:
      "Your portal is engineered from your model. AI-powered blueprint generation, branded dashboards, automated delivery, payment integration — all built as one unified system.",
  },
  {
    number: "03",
    title: "Delivery",
    description:
      "You receive a living system, not a static website. Ongoing support, iteration, and the ability to evolve as your business grows.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-bg-secondary px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          className="os-label mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          HOW IT WORKS
        </motion.p>
        <motion.h2
          className="mb-16 font-[family-name:var(--font-geist-sans)] text-2xl tracking-tight text-text-primary md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Three steps. Zero templates.
        </motion.h2>

        {/* Timeline container */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute top-0 left-4 h-full w-px md:left-1/2">
            <div className="h-full w-full bg-border-subtle" />
            <motion.div
              className="absolute top-0 left-0 h-full w-full origin-top bg-border-medium"
              style={{ scaleY: lineScaleY }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
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
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-start gap-8 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: EASE.entrance,
      }}
    >
      {/* Content */}
      <div
        className={`flex-1 pl-12 md:pl-0 md:px-16 ${
          isLeft ? "md:text-right" : "md:text-left"
        }`}
      >
        <div
          className={`glass-card rounded-xl p-6 md:p-8 ${
            isLeft ? "md:ml-auto" : "md:mr-auto"
          }`}
          style={{ maxWidth: "420px" }}
        >
          <div
            className={`font-[family-name:var(--font-geist-mono)] text-4xl font-light text-text-muted md:text-5xl ${
              isLeft ? "md:text-right" : "md:text-left"
            }`}
          >
            {step.number}
          </div>
          <h3 className="mt-4 font-[family-name:var(--font-geist-sans)] text-xl text-text-primary md:text-2xl">
            {step.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connector dot */}
      <div className="absolute top-2 left-4 flex -translate-x-1/2 items-center justify-center md:left-1/2">
        <div className="h-2 w-2 rounded-full border-2 border-accent bg-bg-tertiary" />
      </div>

      {/* Spacer for the other side */}
      <div className="hidden flex-1 md:block" />
    </motion.div>
  );
}
