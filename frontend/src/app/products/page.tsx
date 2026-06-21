import type { Metadata } from "next";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  title: "Digital Products — Fieldcraft Digital",
  description:
    "Templates, systems, and playbooks I use to run Fieldcraft Digital solo. From $39.",
  openGraph: {
    title: "Digital Products — Fieldcraft Digital",
    description:
      "Templates, systems, and playbooks I use to run Fieldcraft Digital solo. From $39.",
    url: "https://fieldcraft.digital/products",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: ["/og/og-default.svg"],
  },
};

export default function ProductsPage() {
  return <ProductsContent />;
}
