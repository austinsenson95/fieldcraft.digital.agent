"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

export default function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // TODO: Replace with actual ConvertKit/Beehiiv embed or endpoint
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        trackEvent(AnalyticsEvents.newsletterSignup);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={ref}
      id="newsletter"
      className="bg-[#1a3a2a] px-6 py-16 text-center md:px-10 md:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-[500px]">
        <motion.p
          className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.25em] text-accent uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          The Field Report
        </motion.p>

        <motion.h2
          className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-text-primary md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Bespoke software insights for operators who refuse to use templates.
        </motion.h2>

        <motion.p
          className="mt-3 text-base text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE.entrance }}
        >
          One email a week. No fluff.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE.entrance }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === "submitting" || status === "success"}
            className="flex-1 rounded-full border border-accent bg-[#0f281e] px-5 py-3 font-[family-name:var(--font-geist-mono)] text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent-hover"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="rounded-full bg-accent px-6 py-3 font-[family-name:var(--font-geist-mono)] text-sm font-medium uppercase tracking-wider text-bg-primary transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Subscribing..." : status === "success" ? "Subscribed" : "Subscribe"}
          </button>
        </motion.form>

        {status === "success" && (
          <motion.p
            className="mt-4 text-sm text-accent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            You&apos;re in. Check your inbox soon.
          </motion.p>
        )}

        {status === "error" && (
          <motion.p
            className="mt-4 text-sm text-red-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Something went wrong. Please try again.
          </motion.p>
        )}

        <motion.p
          className="mt-4 text-xs text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE.entrance }}
        >
          Join 200+ operators. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  );
}
