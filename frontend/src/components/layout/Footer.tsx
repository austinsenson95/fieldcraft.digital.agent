"use client";

import Link from "next/link";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book a Brief", href: "/brief" },
];

const RESOURCE_LINKS = [
  { label: "The Field Report", href: "/#newsletter" },
  { label: "The Field Brief Playbook", href: "/playbook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/austin-senson-19014018b/", external: true },
  { label: "Writing @austinxalchemy", href: "https://medium.com/@austinsenson95", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-[#0a1f15] px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
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
            <p className="max-w-[200px] text-sm text-text-tertiary">
              Bespoke software portals for operators who refuse templates.
            </p>
          </div>

          {/* Column 2 — Navigate */}
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.15em] text-text-muted uppercase">
              Navigate
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-tertiary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.15em] text-text-muted uppercase">
              Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-text-tertiary transition-colors duration-200 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Connect */}
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.15em] text-text-muted uppercase">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@fieldcraft.digital"
                  className="text-sm text-text-tertiary transition-colors duration-200 hover:text-text-primary"
                >
                  hello@fieldcraft.digital
                </a>
              </li>
              <li className="text-sm text-text-tertiary">
                Based in Bangalore. Building globally.
              </li>
              <li className="pt-2 text-xs text-text-muted">
                Hand-coded with precision.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs text-text-muted">
            &copy; 2026 Fieldcraft Digital. All rights reserved.
          </span>

          <div className="flex items-center gap-4 font-[family-name:var(--font-geist-mono)] text-xs text-text-muted">
            <Link href="/privacy" className="transition-colors hover:text-text-primary">
              Privacy Policy
            </Link>
            <span className="text-text-muted/30">|</span>
            <Link href="/terms" className="transition-colors hover:text-text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
