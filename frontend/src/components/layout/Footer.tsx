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
  { label: "LinkedIn", href: "https://linkedin.com/in/austinsenson", icon: LinkedInIcon },
  { label: "Medium", href: "https://medium.com/@austinsenson95", icon: PenLineIcon },
  { label: "Instagram", href: "https://instagram.com/austinxalchemy", icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="bg-field-obsidian px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        {/* Left column */}
        <div className="flex flex-col gap-1">
          <span className="font-display text-sm text-field-warm-gray/50">
            Fieldcraft Digital
          </span>
          <span className="font-body text-xs text-field-warm-gray/30">
            Engineered around you.
          </span>
          <a
            href="mailto:austin@fieldcraft.digital"
            className="font-body text-xs text-field-warm-gray/40 transition-colors hover:text-field-warm-gray/70"
          >
            austin@fieldcraft.digital
          </a>
        </div>

        {/* Right column */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-body text-xs text-field-warm-gray/40 transition-colors hover:text-field-warm-gray/70"
              >
                <link.icon className="h-3 w-3" />
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="font-body text-xs text-field-warm-gray/30 transition-colors hover:text-field-warm-gray/60"
            >
              Privacy Policy
            </a>
            <span className="font-body text-xs text-field-warm-gray/30">
              &copy; 2026 Fieldcraft Digital
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
