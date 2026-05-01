import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldcraft Digital — Bespoke Software Portals",
  description:
    "Engineered around you. No templates. No compromises. Bespoke software portals for personal brands and solo businesses.",
  keywords: ["bespoke software", "personal brand", "solo business", "software portal", "Austin Senson"],
  authors: [{ name: "Austin Senson" }],
  metadataBase: new URL("https://fieldcraft.digital"),
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Fieldcraft Digital — Bespoke Software Portals",
    description: "Engineered around you. No templates. No compromises.",
    url: "https://fieldcraft.digital",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieldcraft Digital",
    description: "Engineered around you.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-text-primary">{children}</body>
    </html>
  );
}
