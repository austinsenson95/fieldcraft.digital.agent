import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Fieldcraft Digital — Bespoke Business Operating Systems",
  description:
    "One bespoke, AI-native portal that replaces your patchwork of tools and runs onboarding, delivery, and client admin — engineered around how your business actually works. For coaches, consultants, and creators. Flat fees from $5,000.",
  keywords: ["business operating system", "client portal", "bespoke software", "AI client portal", "workflow automation", "coaching software", "course creator tools", "Austin Senson"],
  authors: [{ name: "Austin Senson" }],
  metadataBase: new URL("https://fieldcraft.digital"),
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Fieldcraft Digital — Bespoke Business Operating Systems",
    description:
      "One bespoke, AI-native portal that replaces your patchwork of tools and runs onboarding, delivery, and client admin — for coaches, consultants, and creators. Flat fees from $5,000.",
    url: "https://fieldcraft.digital",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Fieldcraft Digital — Bespoke Business Operating Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fieldcraft Digital — Bespoke Business Operating Systems",
    description:
      "One bespoke, AI-native portal that replaces your patchwork of tools and runs onboarding, delivery, and client admin — for coaches, consultants, and creators.",
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
