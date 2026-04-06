"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function PenLineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/austinsenson",
    icon: LinkedInIcon,
  },
  {
    label: "Writing",
    href: "https://medium.com/@austinsenson",
    icon: PenLineIcon,
  },
  {
    label: "@austinxalchemy",
    href: "https://instagram.com/austinxalchemy",
    icon: InstagramIcon,
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      id="about"
      className="flex min-h-[60vh] items-center justify-center bg-field-deep px-6"
    >
      <motion.div
        className="flex max-w-2xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE.entrance }}
      >
        {/* TODO: Replace with real photo — frontend/public/images/austin.webp */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-field-verdant/20 to-field-deep-teal/40 ring-2 ring-field-mint/20 ring-offset-2 ring-offset-field-deep md:h-32 md:w-32">
          <span className="font-display text-xl text-field-mint md:text-2xl">
            AS
          </span>
        </div>

        <h2 className="font-display text-xl font-medium text-field-parchment md:text-2xl">
          Austin Senson
        </h2>
        <p className="mt-2 font-body text-base text-field-warm-gray">
          Firmware engineer turned software architect.
        </p>
        <p className="mt-2 font-body text-base text-field-warm-gray/80">
          I build systems that think like the businesses they serve. Based in
          Bangalore. Building globally.
        </p>

        {/* Social links */}
        <div className="mt-6 flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-sm text-field-soft-teal transition-colors hover:text-field-mint"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
