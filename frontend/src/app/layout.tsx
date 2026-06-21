import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Fieldcraft Digital — Bespoke Software Portals",
  description:
    "No templates. No compromises. Custom software portals engineered around how your business actually works. Starts at GBP 5,000.",
  keywords: ["bespoke software", "personal brand", "solo business", "software portal", "Austin Senson"],
  authors: [{ name: "Austin Senson" }],
  metadataBase: new URL("https://fieldcraft.digital"),
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Fieldcraft Digital — Bespoke Software Portals",
    description:
      "No templates. No compromises. Custom software portals engineered around how your business actually works. Starts at GBP 5,000.",
    url: "https://fieldcraft.digital",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Fieldcraft Digital — Bespoke Software Portals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieldcraft Digital — Bespoke Software Portals",
    description:
      "No templates. No compromises. Custom software portals engineered around how your business actually works.",
    images: ["/og/og-default.svg"],
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
      <body className="bg-bg-primary text-text-primary">
        <AuthProvider>
          {children}
          <GoogleAnalytics />
        </AuthProvider>
      </body>
    </html>
  );
}
