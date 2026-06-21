import type { Metadata } from "next";
import BriefContent from "./BriefContent";

export const metadata: Metadata = {
  title: "Book a Field Brief — Fieldcraft Digital",
  description:
    "15 minutes. Zero pitch. Just clarity on your biggest software bottleneck. Book your free diagnostic call.",
  openGraph: {
    title: "Book a Field Brief — Fieldcraft Digital",
    description:
      "15 minutes. Zero pitch. Just clarity on your biggest software bottleneck. Book your free diagnostic call.",
    url: "https://fieldcraft.digital/brief",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: ["/og/og-default.svg"],
  },
};

export default function BriefPage() {
  return <BriefContent />;
}
