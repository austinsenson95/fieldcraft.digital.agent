"use client";

import { useEffect, useRef, useState } from "react";
import { getCalendlyUrl, isCalendlyConfigured } from "@/lib/links";

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Calendly inline embed, lazy-loaded: the widget script is only injected once
 * the widget scrolls into view. The URL comes from links.json and can be
 * overridden with NEXT_PUBLIC_CALENDLY_URL. While the URL is still the
 * placeholder, a subtle note is shown instead of a broken embed.
 */
export default function CalendlyWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const url = getCalendlyUrl();
  const configured = isCalendlyConfigured();

  useEffect(() => {
    if (!inView || !configured) return;
    if (document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [inView, configured]);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div
      ref={ref}
      data-event="book_call_click"
      className="relative min-h-[630px] w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary/50"
    >
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "630px" }}
      />
      {!configured && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-[family-name:var(--font-geist-mono)] text-sm text-text-muted">
            Booking calendar activates once the Calendly URL is configured.
          </p>
          <p className="text-xs text-text-tertiary">
            Set NEXT_PUBLIC_CALENDLY_URL or update calendly.url in src/content/links.json.
          </p>
        </div>
      )}
    </div>
  );
}
