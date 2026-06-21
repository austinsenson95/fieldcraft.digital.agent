"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/animations";

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
    <>
      <section
        ref={ref}
        id="contact"
        className="bg-bg-primary px-6 pt-32 pb-24 text-center md:px-10 md:pt-40 md:pb-32 lg:px-16"
      >
        <div className="mx-auto max-w-[640px]">
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
              Every Fieldcraft portal starts with a conversation.
            </p>

            <motion.div
              className="relative mt-10 inline-block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE.entrance }}
            >
              <a
                href="mailto:hello@fieldcraft.digital"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopy();
                }}
                className="font-[family-name:var(--font-geist-mono)] text-xl text-accent transition-colors hover:text-accent-hover"
              >
                hello@fieldcraft.digital
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

            <motion.p
              className="mt-10 text-sm text-text-tertiary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE.entrance }}
            >
              Or just say hello
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="border-t border-border-subtle bg-bg-primary px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs text-text-muted">
            &copy; 2026 Fieldcraft Digital
          </span>

          {/* Tiny geometric mark */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-text-muted"
          >
            <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="1" />
            <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1" />
          </svg>

          <span className="font-[family-name:var(--font-geist-mono)] text-xs text-text-muted">
            Hand-coded in Bangalore
          </span>
        </div>
      </footer>
    </>
  );
}
