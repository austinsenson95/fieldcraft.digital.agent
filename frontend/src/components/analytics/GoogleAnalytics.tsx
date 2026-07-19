"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/** True only when a real measurement ID has been configured. */
const isGA4Configured = Boolean(
  GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.startsWith("G-XXX")
);

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Track custom page-view events for key conversion pages
  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/brief") {
      trackEvent(AnalyticsEvents.briefPageView);
    } else if (pathname === "/pricing") {
      trackEvent(AnalyticsEvents.pricingPageView);
    }
  }, [pathname]);

  // Track clicks on data-event elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-event]");
      if (!target) return;

      const eventName = target.dataset.event;
      if (!eventName) return;

      const params: Record<string, string | number | boolean> = {};
      if (target.dataset.product) {
        params.product = target.dataset.product;
      }

      trackEvent(eventName, params);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // No measurement ID configured (or still the placeholder): do not inject
  // the gtag scripts. The listeners above stay active and no-op safely into
  // window.dataLayer.
  if (!isGA4Configured) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
