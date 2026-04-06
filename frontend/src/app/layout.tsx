import type { Metadata } from "next";
import { satoshi, dmSans, instrumentSerif, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldcraft Digital — Engineered around you.",
  description:
    "Bespoke software portals for coaches, consultants, and creators who've outgrown their tools.",
  metadataBase: new URL("https://fieldcraft.digital"),
  openGraph: {
    title: "Fieldcraft Digital — Engineered around you.",
    description:
      "Bespoke software portals for coaches, consultants, and creators who've outgrown their tools.",
    url: "https://fieldcraft.digital",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieldcraft Digital — Engineered around you.",
    description:
      "Bespoke software portals for coaches, consultants, and creators who've outgrown their tools.",
    images: ["/og/og-default.svg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Fieldcraft Digital",
  url: "https://fieldcraft.digital",
  description:
    "Bespoke software portals for coaches, consultants, and creators",
  founder: {
    "@type": "Person",
    name: "Austin Senson",
    jobTitle: "Software Architect",
    url: "https://linkedin.com/in/austinsenson",
  },
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressCountry: "IN",
  },
  serviceType: [
    "Custom Software Development",
    "Web Application Development",
    "AI-Powered Business Portals",
  ],
  priceRange: "$$$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
