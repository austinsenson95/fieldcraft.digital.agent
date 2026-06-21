"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/animations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const budgetOptions = [
  "Under GBP 5,000",
  "GBP 5,000 — 10,000",
  "GBP 10,000 — 20,000",
  "GBP 20,000+",
  "Not sure yet",
];

const allocationOptions = [
  "Yes, ready to move",
  "Planning to allocate",
  "Just exploring options",
];

const faqs = [
  {
    question: "Is this a sales call?",
    answer:
      "No. The Field Brief is a diagnostic. I ask questions, map your bottleneck, and give you a clear path forward. If that path involves working together, I'll send you a proposal after the call. No pressure on the call itself.",
  },
  {
    question: "What do I need to prepare?",
    answer:
      "Nothing formal. Just show up with the one workflow, tool, or problem that's been on your mind. The more specific, the better.",
  },
  {
    question: "How much does a custom portal cost?",
    answer:
      "Portal Lite starts at GBP 5,000 for a single-purpose portal. Portal Pro at GBP 10,000 for a multi-module command centre. Portal Enterprise at GBP 20,000 for a full-scale business operating system. All flat fees — no hourly billing surprises.",
  },
  {
    question: "How long does it take?",
    answer:
      "Portal Lite: 30 days. Portal Pro: 45 days. Portal Enterprise: 60 days. I deliver living systems, not static websites.",
  },
  {
    question: "What if I'm not ready to build yet?",
    answer:
      "Grab The Field Brief Playbook (free). It'll help you identify your #1 bottleneck and what's possible within your budget.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      >
        <span className="font-[family-name:var(--font-geist-sans)] text-lg text-text-primary">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 text-accent"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.entrance }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-secondary leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CalendlyWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // TODO: Insert Calendly embed script here.
          // Example:
          // const script = document.createElement("script");
          // script.src = "https://assets.calendly.com/assets/external/widget.js";
          // script.async = true;
          // document.body.appendChild(script);
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div
      ref={ref}
      id="calendly-inline-widget"
      className="min-h-[600px] w-full rounded-2xl border border-border-subtle bg-bg-secondary/50"
    >
      {!loaded ? (
        <div className="flex h-[600px] items-center justify-center text-text-muted">
          <span className="font-[family-name:var(--font-geist-mono)] text-sm">Loading calendar...</span>
        </div>
      ) : (
        <div className="flex h-[600px] items-center justify-center text-text-muted">
          <div className="text-center">
            <p className="font-[family-name:var(--font-geist-mono)] text-sm">Calendly widget placeholder</p>
            <p className="mt-2 text-xs text-text-tertiary">
              Paste Calendly inline embed code in the TODO block inside CalendlyWidget.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BriefContent() {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const [formData, setFormData] = useState({
    bottleneck: "",
    budget: "",
    allocated: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // TODO: Wire this up to your CRM or Airtable/Notion intake form.
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28 lg:px-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="font-[family-name:var(--font-geist-sans)] text-4xl font-semibold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE.entrance }}
          >
            Book Your 15-Minute Field Brief
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE.entrance }}
          >
            Zero pitch. Just clarity on the one bottleneck costing you time, money, or clients every week.
          </motion.p>

          <motion.p
            className="mt-4 font-[family-name:var(--font-geist-mono)] text-sm text-accent"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE.entrance }}
          >
            Join 50+ operators who&apos;ve mapped their next move.
          </motion.p>
        </div>
      </section>

      {/* Video placeholder */}
      <section className="px-6 pb-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-bg-secondary">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                type="button"
                aria-label="Play video"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary"
              >
                <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-sm text-text-secondary">
                Watch: How The Field Brief Works (3 min)
              </p>
            </div>
            {/* TODO: Replace with Vimeo/YouTube iframe embed */}
          </div>
          <p className="mt-4 text-center text-sm italic text-text-muted">
            VSL coming soon. For now, book directly below.
          </p>
        </div>
      </section>

      {/* Qualifying questions */}
      <section className="bg-bg-secondary px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            className="glass-strong rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE.entrance }}
          >
            <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold text-text-primary">
              A few quick questions
            </h2>
            <p className="mt-2 text-text-tertiary">
              This helps us make the most of our 15 minutes together.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <div>
                <label htmlFor="bottleneck" className="block font-[family-name:var(--font-geist-sans)] text-base text-text-primary">
                  What is the #1 manual bottleneck or custom software idea you want to build right now?
                </label>
                <textarea
                  id="bottleneck"
                  required
                  rows={4}
                  value={formData.bottleneck}
                  onChange={(e) => setFormData({ ...formData, bottleneck: e.target.value })}
                  placeholder="e.g., I spend 6 hours every Monday manually onboarding new clients through 4 different tools..."
                  className="mt-3 w-full rounded-xl border border-border-subtle bg-bg-primary/60 px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
                />
              </div>

              <div>
                <span className="block font-[family-name:var(--font-geist-sans)] text-base text-text-primary">
                  What is your rough budget estimate?
                </span>
                <div className="mt-3 space-y-2">
                  {budgetOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle bg-bg-primary/40 px-4 py-3 transition-colors hover:border-accent/30"
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={option}
                        checked={formData.budget === option}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="h-4 w-4 accent-accent"
                      />
                      <span className="text-sm text-text-secondary">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-[family-name:var(--font-geist-sans)] text-base text-text-primary">
                  Do you have budget allocated to solve this problem?
                </span>
                <div className="mt-3 space-y-2">
                  {allocationOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle bg-bg-primary/40 px-4 py-3 transition-colors hover:border-accent/30"
                    >
                      <input
                        type="radio"
                        name="allocated"
                        value={option}
                        checked={formData.allocated === option}
                        onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                        className="h-4 w-4 accent-accent"
                      />
                      <span className="text-sm text-text-secondary">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="w-full rounded-full bg-accent px-8 py-4 font-[family-name:var(--font-geist-mono)] text-sm font-medium uppercase tracking-wider text-bg-primary transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : status === "success" ? "Submitted" : "Submit & Continue to Booking"}
              </button>

              {status === "success" && (
                <p className="text-center text-sm text-accent">
                  Thanks — now pick a time below.
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-400">
                  Something went wrong. Please continue to book below.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Calendly */}
      <section className="px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold text-text-primary">
              Pick Your Time
            </h2>
            <p className="mt-3 text-text-tertiary">
              Available slots this week and next. All times in IST (UTC+5:30).
            </p>
          </div>

          <CalendlyWidget />

          <p className="mt-6 text-center text-sm text-text-tertiary">
            Prefer email? Reach out at{" "}
            <a href="mailto:hello@fieldcraft.digital" className="text-accent underline transition-colors hover:text-accent-hover">
              hello@fieldcraft.digital
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bg-secondary px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-[family-name:var(--font-geist-sans)] text-3xl font-semibold text-text-primary">
            Frequently Asked Questions
          </h2>

          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16 text-center md:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-lg text-text-secondary">
            Not ready to book? Get the free Field Brief Playbook and identify your bottleneck in 10 minutes.
          </p>
          <Link
            href="/playbook"
            className="mt-6 inline-block rounded-full bg-accent px-8 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:bg-accent-hover"
          >
            Get the Free Playbook
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
