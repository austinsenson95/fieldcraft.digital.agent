import type { Metadata } from "next";
import { satoshi, dmSans, instrumentSerif, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldcraft Digital — Engineered around you.",
  description:
    "Bespoke software portals for personal brands and solo businesses. No templates. No compromises. Just a system that thinks like your business.",
  metadataBase: new URL("https://fieldcraft.digital"),
  openGraph: {
    title: "Fieldcraft Digital — Engineered around you.",
    description:
      "Bespoke software portals for personal brands and solo businesses.",
    url: "https://fieldcraft.digital",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
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
      className={`${satoshi.variable} ${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
