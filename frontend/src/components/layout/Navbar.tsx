"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? y / docHeight : 0);
      setScrolled(y > 50);
      if (y > 100) {
        setHidden(y > lastScrollY);
      } else {
        setHidden(false);
      }
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-5 py-3 md:px-8"
        initial={{ y: 0 }}
        animate={{
          y: hidden && !mobileOpen ? "-100%" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: scrolled ? "rgba(15, 43, 30, 0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
          borderBottom: scrolled ? "1px solid rgba(245, 241, 235, 0.08)" : "1px solid transparent",
        }}
      >
        {/* Left: Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-[family-name:var(--font-geist-mono)] text-sm tracking-wide text-text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          Fieldcraft
        </Link>

        {/* Center: Desktop nav links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.15em] uppercase text-text-tertiary transition-colors duration-200 hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA + progress */}
        <div className="hidden items-center gap-5 md:flex">
          {/* Scroll progress bar */}
          <div className="flex items-center gap-2">
            <div className="h-px w-16 overflow-hidden bg-border-subtle">
              <div
                className="h-full bg-mint transition-all duration-100"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-wider text-text-muted">
              {Math.round(scrollProgress * 100).toString().padStart(2, "0")}
            </span>
          </div>
          <Link
            href="/brief"
            data-event="book_call_click"
            className="rounded-full bg-accent px-4 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-bg-primary transition-all duration-200 hover:bg-accent-hover"
          >
            Book a Field Brief
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block h-px w-5 bg-text-primary"
            animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-px w-5 bg-text-primary"
            animate={mobileOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 20 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-px w-5 bg-text-primary"
            animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
            style={{
              background: "rgba(15, 43, 30, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-[family-name:var(--font-geist-sans)] text-3xl text-text-primary"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
            >
              <Link
                href="/brief"
                onClick={() => setMobileOpen(false)}
                data-event="book_call_click"
                className="mt-4 rounded-full bg-accent px-6 py-3 font-[family-name:var(--font-geist-mono)] text-lg text-bg-primary"
              >
                Book a Field Brief
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
