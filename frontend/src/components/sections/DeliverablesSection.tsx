"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";

const deliverables = [
  {
    title: "Branded client portal",
    description:
      "A dashboard your clients log into — your colors, your logo, your experience.",
  },
  {
    title: "AI blueprint engine",
    description:
      "Automated, personalised strategy documents generated for each client.",
  },
  {
    title: "Integrated payments",
    description: "Razorpay billing built in. No redirects, no friction.",
  },
  {
    title: "Content delivery system",
    description:
      "Resources, videos, and assets delivered on your schedule.",
  },
];

export default function DeliverablesSection() {
  return (
    <section className="bg-field-deep px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.p
          className="mb-10 text-center font-body text-xs uppercase tracking-[0.2em] text-field-mint/60"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          What your portal includes
        </motion.p>

        <div className="grid gap-4 sm:grid-cols-2">
          {deliverables.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-xl border border-field-mint/10 bg-field-deep/30 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: EASE.entrance,
              }}
            >
              <h3 className="mb-2 font-display text-base font-medium text-field-parchment">
                {item.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-field-warm-gray">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
