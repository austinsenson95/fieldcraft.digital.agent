"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface LoginGateProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function LoginGate({ children, isAuthenticated }: LoginGateProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        onClick={() => setShowPrompt(true)}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrompt(false)}
          >
            <motion.div
              className="mx-4 w-full max-w-md rounded-2xl border border-text-muted/20 bg-bg-primary p-8 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <h3 className="font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                  Sign in required
                </h3>
                <p className="mt-2 text-text-tertiary">
                  Create a free account to access digital products and get in touch.
                </p>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full rounded-lg bg-accent px-4 py-3 text-center font-medium text-bg-primary transition-all hover:bg-accent-hover"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full rounded-lg border border-text-muted/20 px-4 py-3 text-center font-medium text-text-primary transition-all hover:bg-bg-secondary"
                  >
                    Create Account
                  </Link>
                </div>

                <button
                  onClick={() => setShowPrompt(false)}
                  className="mt-4 text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
