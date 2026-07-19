import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy — Fieldcraft Digital",
  description: "How Fieldcraft Digital collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-[800px]">
          <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-text-tertiary">Last updated: June 2026</p>

          <div className="mt-12 space-y-8 text-text-secondary">
            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                1. Information We Collect
              </h2>
              <p>
                Fieldcraft Digital collects information you provide directly to us, such as your name,
                email address, and message when you use our contact form, subscribe to our newsletter,
                book a call via Calendly, or purchase digital products.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to respond to inquiries, deliver products and services,
                send newsletters and updates, process payments, and improve our offerings.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                3. Data Sharing
              </h2>
              <p>
                We do not sell your personal information. We share data only with trusted service providers
                necessary to operate our business, such as email delivery services, payment processors
                (Gumroad), and scheduling tools (Calendly).
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                4. Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any time by
                contacting us at{" "}
                <a href={`mailto:${links.contact.email}`} className="text-accent underline transition-colors hover:text-accent-hover">
                  {links.contact.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                5. Contact Us
              </h2>
              <p>
                Fieldcraft Digital is based in Bangalore, India. For privacy-related questions, please email{" "}
                <a href={`mailto:${links.contact.email}`} className="text-accent underline transition-colors hover:text-accent-hover">
                  {links.contact.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
