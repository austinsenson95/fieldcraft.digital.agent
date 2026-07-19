import linksData from "@/content/links.json";

export interface CheckoutProduct {
  price: number;
  url: string;
}

export type CheckoutProductSlug =
  | "personal-brand-starter-kit"
  | "solo-operator-blueprint"
  | "productized-service-guide"
  | "complete-operator-stack";

export interface Links {
  checkout: Record<CheckoutProductSlug, CheckoutProduct>;
  social: {
    linkedin: string;
    medium: string;
  };
  contact: {
    email: string;
  };
  calendly: {
    url: string;
  };
}

export const links: Links = linksData as Links;

/**
 * The placeholder Calendly URL shipped in links.json. The booking widget is
 * considered "configured" once this value is replaced — either by editing
 * links.json or by setting NEXT_PUBLIC_CALENDLY_URL.
 */
export const CALENDLY_PLACEHOLDER_URL = "https://calendly.com/fieldcraft/field-brief";

/** Calendly booking URL: env var overrides the links.json value. */
export function getCalendlyUrl(): string {
  return process.env.NEXT_PUBLIC_CALENDLY_URL || links.calendly.url;
}

/** True once a real Calendly URL has been configured. */
export function isCalendlyConfigured(): boolean {
  const url = getCalendlyUrl();
  return Boolean(url) && url !== CALENDLY_PLACEHOLDER_URL;
}
