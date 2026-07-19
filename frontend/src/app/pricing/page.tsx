import type { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing — Fieldcraft Digital",
  description:
    "Flat-fee custom software portals. Portal Lite $5K, Portal Pro $10K, Portal Enterprise $20K. Book a free Field Brief.",
  openGraph: {
    title: "Pricing — Fieldcraft Digital",
    description:
      "Flat-fee custom software portals. Portal Lite $5K, Portal Pro $10K, Portal Enterprise $20K. Book a free Field Brief.",
    url: "https://fieldcraft.digital/pricing",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: ["/og/og-default.svg"],
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
