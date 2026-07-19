"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { digitalProducts } from "@/lib/products";
import Link from "next/link";

const plans = [
  {
    badge: "Starter",
    name: "Portal Lite",
    price: "$5,000",
    description: "Single-purpose portal. One core workflow automated.",
    features: [
      "AI-powered blueprint generation",
      "Branded dashboard interface",
      "Core workflow automation",
      "Basic payment integration",
      "30-day delivery",
      "30 days post-launch support",
    ],
    highlighted: false,
  },
  {
    badge: "Most Popular",
    name: "Portal Pro",
    price: "$10,000",
    description: "Multi-module command centre. Your business, unified.",
    features: [
      "Everything in Portal Lite",
      "Multi-module architecture",
      "Automated client delivery",
      "Advanced payment & subscription flows",
      "Basic AI assistant integration",
      "45-day delivery",
      "60 days post-launch support",
    ],
    highlighted: true,
  },
  {
    badge: "Scale",
    name: "Portal Enterprise",
    price: "$20,000",
    description: "Full-scale business operating system. Built to grow.",
    features: [
      "Everything in Portal Pro",
      "Custom AI agents & automations",
      "Multi-user role management",
      "Advanced analytics dashboard",
      "Priority support channel",
      "60-day delivery",
      "90 days post-launch support",
    ],
    highlighted: false,
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "Map your bottleneck, workflow, and leverage points.",
  },
  {
    number: "02",
    title: "Architecture",
    description: "Design a unified system around your business model.",
  },
  {
    number: "03",
    title: "Delivery",
    description: "Launch a living portal with support built in.",
  },
];

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  return (
    <motion.div
      className={`relative flex flex-col rounded-2xl p-8 ${
        plan.highlighted
          ? "order-first border border-accent/30 bg-bg-secondary/80 shadow-lg shadow-accent/5 md:order-none"
          : "border border-border-subtle bg-bg-secondary/50"
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
    >
      <span
        className={`mb-4 w-fit rounded-full px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider ${
          plan.highlighted
            ? "bg-accent text-bg-primary"
            : "bg-border-subtle text-text-tertiary"
        }`}
      >
        {plan.badge}
      </span>

      <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-text-primary">
        {plan.name}
      </h3>
      <p className="mt-2 text-sm text-text-tertiary">{plan.description}</p>

      <div className="mt-6">
        <span className="font-[family-name:var(--font-geist-mono)] text-4xl font-semibold text-text-primary">
          {plan.price}
        </span>
        <p className="mt-1 text-xs text-text-muted">one-time</p>
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/brief"
        data-event="book_call_click"
        className={`mt-8 rounded-full px-6 py-3 text-center font-[family-name:var(--font-geist-mono)] text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
          plan.highlighted
            ? "bg-accent text-bg-primary hover:bg-accent-hover"
            : "border border-accent text-accent hover:bg-accent hover:text-bg-primary"
        }`}
      >
        Book a Field Brief
      </Link>
    </motion.div>
  );
}

export default function PricingContent() {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="px-6 pt-32 pb-20 text-center md:px-10 md:pt-40 md:pb-28 lg:px-16">
        <motion.p
          className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.25em] text-accent uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          Investment
        </motion.p>
        <motion.h1
          className="mx-auto max-w-3xl font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-text-primary md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Custom portals for serious operators. Flat fees. No surprises.
        </motion.h1>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {/* Pro card first on mobile */}
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE.entrance }}
          >
            <p className="text-text-tertiary">
              Not sure which tier fits? The Field Brief will give you a clear recommendation.
            </p>
            <Link
              href="/brief"
              data-event="book_call_click"
              className="mt-3 inline-block font-[family-name:var(--font-geist-mono)] text-sm text-accent underline transition-colors hover:text-accent-hover"
            >
              Book a Free Field Brief
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process preview */}
      <section className="bg-bg-secondary px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="os-label mb-4">How It Works</p>
            <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-text-primary md:text-3xl">
              From bottleneck to live portal
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
              >
                <span className="font-[family-name:var(--font-geist-mono)] text-4xl font-light text-text-muted">
                  {step.number}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-text-tertiary">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE.entrance }}
          >
            <Link
              href="/#process"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-sm text-accent transition-colors hover:text-accent-hover"
            >
              See full process
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Digital products teaser */}
      <section className="px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-text-primary">
              Not ready for a custom build? Start with a playbook.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {digitalProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-secondary/50 px-5 py-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
              >
                <div>
                  <h3 className="font-[family-name:var(--font-geist-sans)] text-sm font-semibold text-text-primary">
                    {product.title}
                  </h3>
                  <p className="font-[family-name:var(--font-geist-mono)] text-sm text-accent">
                    ${product.price}
                  </p>
                </div>
                <a
                  href={product.gumroadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="product_purchase_click"
                  data-product={product.id}
                  className="text-xs text-text-tertiary underline transition-colors hover:text-accent"
                >
                  View on Gumroad
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-sm text-accent transition-colors hover:text-accent-hover"
            >
              View all products
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
