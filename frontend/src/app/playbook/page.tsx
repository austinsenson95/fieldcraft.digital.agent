import type { Metadata } from "next";
import PlaybookContent from "./PlaybookContent";

export const metadata: Metadata = {
  title: "Free Field Brief Playbook — Fieldcraft Digital",
  description:
    "Identify your #1 software bottleneck in 10 minutes with the same diagnostic I use in $5K–20K engagements.",
  openGraph: {
    title: "Free Field Brief Playbook — Fieldcraft Digital",
    description:
      "Identify your #1 software bottleneck in 10 minutes with the same diagnostic I use in $5K–20K engagements.",
    url: "https://fieldcraft.digital/playbook",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: ["/og/og-default.svg"],
  },
};

export default function PlaybookPage() {
  return <PlaybookContent />;
}
