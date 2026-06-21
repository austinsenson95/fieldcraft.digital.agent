"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// TODO: Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  gtag("event", name, params);
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Track custom page-view events for key conversion pages
  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/brief") {
      trackEvent("brief_page_view");
    } else if (pathname === "/pricing") {
      trackEvent("pricing_page_view");
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

      {/* Meta Pixel placeholder — TODO: replace PIXEL_ID with your actual Pixel ID */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          // TODO: Insert Meta Pixel base code here. Replace PIXEL_ID before enabling.
          // !function(f,b,e,v,n,t,s)
          // {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          // n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          // ...
          // fbq('init', 'PIXEL_ID');
          // fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}
