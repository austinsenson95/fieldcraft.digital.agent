"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";



function PortalIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="6" width="32" height="28" rx="2" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1.5" />
      <line x1="4" y1="14" x2="36" y2="14" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="12" y1="22" x2="28" y2="22" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="12" y1="26" x2="22" y2="26" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <circle cx="8" cy="10" r="1.5" fill="rgba(93, 202, 165, 0.25)" />
    </svg>
  );
}

function BlueprintIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="20" cy="20" r="6" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="20" y1="6" x2="20" y2="14" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="6" y1="20" x2="14" y2="20" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="26" y1="20" x2="34" y2="20" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="14" height="14" rx="1" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1" />
      <rect x="22" y="4" width="14" height="14" rx="1" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <rect x="4" y="22" width="32" height="14" rx="1" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <line x1="10" y1="28" x2="30" y2="28" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M8 20L16 12L24 20L32 12" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="28" x2="28" y2="28" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="32" cy="28" r="3" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="10" width="32" height="20" rx="3" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1.5" />
      <line x1="4" y1="18" x2="36" y2="18" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
      <circle cx="28" cy="24" r="2" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="8" width="26" height="20" rx="2" stroke="rgba(29, 158, 117, 0.25)" strokeWidth="1.5" />
      <polygon points="16,16 16,24 22,20" fill="rgba(245, 241, 235, 0.08)" />
      <line x1="34" y1="14" x2="34" y2="26" stroke="rgba(245, 241, 235, 0.08)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="34" cy="12" r="1.5" fill="rgba(93, 202, 165, 0.25)" />
      <circle cx="34" cy="28" r="1.5" fill="rgba(93, 202, 165, 0.25)" />
    </svg>
  );
}

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="work"
      className="bg-bg-primary px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          WHAT WE BUILD
        </motion.p>
        <motion.h2
          className="mb-16 font-[family-name:var(--font-geist-sans)] text-2xl tracking-tight text-text-primary md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Software that thinks like your business.
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {/* Hero card */}
          <motion.div
            className="col-span-1 rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium md:col-span-2 md:p-10"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE.entrance }}
          >
            <PortalIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-xl text-text-primary md:text-2xl">
              Your Portal
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              A unified command centre for your business — built from your model, not a template.
            </p>
            {/* Mini preview visual */}
            <div className="mt-8 overflow-hidden rounded-lg border border-border-subtle p-4">
              <div className="flex gap-3">
                <div className="h-20 w-24 rounded border border-border-subtle bg-bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-3/4 rounded bg-border-subtle" />
                  <div className="h-2 w-1/2 rounded bg-border-subtle" />
                  <div className="h-2 w-2/3 rounded bg-border-subtle" />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-16 flex-1 rounded border border-border-subtle bg-bg-secondary" />
                <div className="h-16 flex-1 rounded border border-border-subtle bg-bg-secondary" />
              </div>
            </div>
          </motion.div>

          {/* AI Blueprint Generator */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
          >
            <BlueprintIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
              AI Blueprint Generator
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Map your offer structure, content pillars, and delivery sequence in minutes.
            </p>
          </motion.div>

          {/* Branded Dashboard */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE.entrance }}
          >
            <DashboardIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
              Branded Dashboard
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              A clean, custom interface that feels like your brand — not a SaaS clone.
            </p>
          </motion.div>

          {/* Automated Delivery */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE.entrance }}
          >
            <DeliveryIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
              Automated Delivery
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Drip content, trigger sequences, and manage access without manual work.
            </p>
          </motion.div>

          {/* Payment Integration */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE.entrance }}
          >
            <PaymentIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
              Payment Integration
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Razorpay, Stripe, or your preferred gateway — wired into the experience.
            </p>
          </motion.div>

          {/* Video Content Engine */}
          <motion.div
            className="rounded-xl border border-border-subtle bg-bg-tertiary p-8 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE.entrance }}
          >
            <VideoIcon />
            <h3 className="mt-6 font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
              Video Content Engine
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Remotion-powered video generation for personalised client content.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
