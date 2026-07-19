"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/animations";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import Link from "next/link";

const playbookItems = [
  "The 5 signs you need a custom portal (not another SaaS tool)",
  "The true cost calculator: what manual work is actually costing you per month",
  "The 3-question diagnostic I use in every client call",
  "What's possible in 30 days vs. 60 days vs. 6 months",
  "Real portal examples: before and after workflows",
];

function MinimalHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-6 py-4 md:px-10">
      <Link
        href="/"
        className="flex w-fit items-center gap-2.5 font-[family-name:var(--font-geist-mono)] text-sm tracking-wide text-text-primary"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        Fieldcraft
      </Link>
    </header>
  );
}

export default function PlaybookContent() {
  const [formData, setFormData] = useState({ firstName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // TODO: Replace with ConvertKit/Beehiiv/EmailOctopus form API or webhook.
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ firstName: "", email: "" });
        trackEvent(AnalyticsEvents.playbookDownloadClick);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-28 md:px-10">
      <MinimalHeader />

      <div className="mx-auto max-w-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.entrance }}
        >
          <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.25em] text-accent uppercase">
            Free Resource
          </p>
          <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-text-primary md:text-4xl lg:text-5xl">
            Identify Your #1 Software Bottleneck in 10 Minutes
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            The same diagnostic framework I use in my $5K–20K client engagements — distilled into a free playbook.
          </p>
        </motion.div>

        {/* What's inside */}
        <motion.ul
          className="mt-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE.entrance }}
        >
          {playbookItems.map((item) => (
            <li key={item} className="flex items-start gap-3 leading-[1.8] text-text-primary">
              <svg className="mt-1.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {item}
            </li>
          ))}
        </motion.ul>

        {/* Form */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE.entrance }}
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="rounded-2xl border border-accent/30 bg-bg-secondary/50 p-8 text-center"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE.entrance }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                  Check your inbox!
                </h2>
                <p className="mt-2 text-text-secondary">
                  The Field Brief Playbook is on its way.
                </p>
                <p className="mt-4 text-sm text-text-tertiary">
                  While you wait: Book a free 15-min Field Brief if you want me to personally diagnose your bottleneck.
                </p>
                <Link
                  href="/brief"
                  data-event="book_call_click"
                  className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:bg-accent-hover"
                >
                  Book a Field Brief
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="firstName" className="block text-base text-text-primary">
                  Where should I send your playbook?
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/50 px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
                />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-bg-secondary/50 px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-full bg-accent px-6 py-4 font-[family-name:var(--font-geist-mono)] text-sm font-medium uppercase tracking-wider text-bg-primary transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending..." : "Send Me The Playbook"}
                </button>

                {status === "error" && (
                  <p className="text-center text-sm text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}

                <p className="text-center text-xs text-text-tertiary">
                  No spam. Unsubscribe anytime. Your email funds nothing but great software.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social proof */}
        <motion.blockquote
          className="mt-12 border-l-2 border-accent pl-5 italic text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE.entrance }}
        >
          <span className="text-accent">&ldquo;</span>
          I wrote this playbook because the right diagnosis beats another subscription. It&rsquo;s the exact framework I run before writing a single line of code.
          <span className="text-accent">&rdquo;</span>
          <footer className="mt-2 not-italic text-xs text-text-muted">— Austin Senson, Founder, Fieldcraft Digital</footer>
        </motion.blockquote>
      </div>
    </main>
  );
}
