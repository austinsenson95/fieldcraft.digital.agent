/**
 * Lightweight GA4 event helpers. Safe to call anywhere: `trackEvent` no-ops
 * on the server and simply buffers into `window.dataLayer` when gtag.js has
 * not been loaded (e.g. no measurement ID configured).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Canonical analytics event names used across the site. */
export const AnalyticsEvents = {
  briefPageView: "brief_page_view",
  pricingPageView: "pricing_page_view",
  playbookDownloadClick: "playbook_download_click",
  bookCallClick: "book_call_click",
  productPurchaseClick: "product_purchase_click",
  newsletterSignup: "newsletter_signup",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsParams = Record<string, string | number | boolean>;

export function trackEvent(name: AnalyticsEventName | string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", name, params ?? {}]);
}
