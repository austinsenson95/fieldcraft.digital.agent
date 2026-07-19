import { describe, expect, it } from "vitest";
import linksData from "@/content/links.json";
import { CALENDLY_PLACEHOLDER_URL, getCalendlyUrl, isCalendlyConfigured, links } from "./links";

const EXPECTED_SLUGS = [
  "personal-brand-starter-kit",
  "solo-operator-blueprint",
  "productized-service-guide",
  "complete-operator-stack",
] as const;

describe("links.json", () => {
  it("contains exactly the 4 checkout products", () => {
    expect(Object.keys(linksData.checkout).sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it("has unique product ids", () => {
    const ids = Object.keys(linksData.checkout);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses https for every URL", () => {
    const urls = [
      ...Object.values(linksData.checkout).map((p) => p.url),
      linksData.social.linkedin,
      linksData.social.medium,
      linksData.calendly.url,
    ];
    for (const url of urls) {
      expect(url.startsWith("https://")).toBe(true);
    }
  });

  it("includes the product slug in every checkout URL", () => {
    for (const [slug, product] of Object.entries(linksData.checkout)) {
      expect(product.url).toContain(slug);
    }
  });

  it("carries the replacement reminder comment", () => {
    expect(linksData._comment).toBe("Replace these placeholder URLs with live links before launch.");
  });
});

describe("links accessor", () => {
  it("returns the same checkout values as the JSON", () => {
    expect(links.checkout).toEqual(linksData.checkout);
  });

  it("returns the same social, contact, and calendly values as the JSON", () => {
    expect(links.social).toEqual(linksData.social);
    expect(links.contact).toEqual(linksData.contact);
    expect(links.calendly).toEqual(linksData.calendly);
  });

  it("exposes typed entries for every expected slug", () => {
    for (const slug of EXPECTED_SLUGS) {
      expect(links.checkout[slug].url).toBe(
        linksData.checkout[slug as keyof typeof linksData.checkout].url
      );
      expect(typeof links.checkout[slug].price).toBe("number");
    }
  });
});

describe("calendly helpers", () => {
  it("falls back to the links.json URL when the env var is unset", () => {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    expect(getCalendlyUrl()).toBe(linksData.calendly.url);
  });

  it("prefers NEXT_PUBLIC_CALENDLY_URL when set", () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/example/live";
    expect(getCalendlyUrl()).toBe("https://calendly.com/example/live");
    expect(isCalendlyConfigured()).toBe(true);
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
  });

  it("treats the placeholder URL as unconfigured", () => {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    expect(getCalendlyUrl()).toBe(CALENDLY_PLACEHOLDER_URL);
    expect(isCalendlyConfigured()).toBe(false);
  });
});
