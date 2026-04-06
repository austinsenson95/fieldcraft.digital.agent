"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE } from "@/lib/animations";

const NAV_LINKS = [
  { label: "Work", href: "#work", sectionId: "work" },
  { label: "Process", href: "#process", sectionId: "process" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.sectionId);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: DURATION.fast, ease: EASE.standard }}
        style={{
          pointerEvents: scrolled ? "auto" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          backgroundColor: scrolled
            ? "rgba(15, 43, 30, 0.85)"
            : "transparent",
        }}
      >
        {/* Logo / Wordmark */}
        <a href="#" className="flex items-baseline gap-0.5">
          <span className="font-display text-lg font-medium text-field-mint">
            Fieldcraft
          </span>
          <span className="font-display text-lg font-normal text-field-mint/60">
            Digital
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative font-body text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-field-mint"
                    : "text-field-parchment/60 hover:text-field-parchment"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full bg-field-mint transition-transform duration-200 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block h-px w-6 bg-field-parchment"
            animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: DURATION.fast }}
          />
          <motion.span
            className="block h-px w-6 bg-field-parchment"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: DURATION.fast }}
          />
          <motion.span
            className="block h-px w-6 bg-field-parchment"
            animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: DURATION.fast }}
          />
        </button>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-field-deep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-display text-3xl transition-colors ${
                  activeSection === link.sectionId
                    ? "text-field-mint"
                    : "text-field-parchment"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: DURATION.normal,
                  ease: EASE.entrance,
                  delay: i * 0.08,
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
