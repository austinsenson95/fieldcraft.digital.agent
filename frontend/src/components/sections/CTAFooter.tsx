"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/animations";
import Link from "next/link";

export default function CTAFooter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("hello@fieldcraft.digital");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-bg-primary px-6 pt-32 pb-24 text-center md:px-10 md:pt-40 md:pb-32 lg:px-16"
    >
      <div className="mx-auto max-w-[720px]">
        <motion.div
          className="glass rounded-2xl p-10 md:p-14"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE.entrance }}
        >
          <h2 className="font-[family-name:var(--font-geist-sans)] text-3xl tracking-tight text-text-primary md:text-4xl">
            Ready to build something that&rsquo;s actually yours?
          </h2>

          <p className="mt-6 text-lg text-text-secondary">
            Every Fieldcraft portal starts with a 15-minute Field Brief — zero pitch, just clarity on your biggest bottleneck.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/brief"
              data-event="book_call_click"
              className="rounded-full bg-accent px-8 py-4 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover"
            >
              Book Your Free Field Brief
            </Link>

            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE.entrance }}
            >
              <a
                href="mailto:hello@fieldcraft.digital"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopy();
                }}
                className="font-[family-name:var(--font-geist-mono)] text-sm text-text-tertiary transition-colors hover:text-text-secondary"
              >
                Or email hello@fieldcraft.digital
              </a>

              <AnimatePresence>
                {copied && (
                  <motion.span
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-text-muted"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    Copied to clipboard
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.p
            className="mt-10 text-sm text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE.entrance }}
          >
            Prefer to book directly?{" "}
            <Link
              href="/brief"
              data-event="book_call_click"
              className="text-accent underline transition-colors hover:text-accent-hover"
            >
              Book a 15-Min Field Brief
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
