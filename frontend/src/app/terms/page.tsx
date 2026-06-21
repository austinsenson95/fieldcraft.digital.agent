import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Fieldcraft Digital",
  description: "Terms and conditions for using Fieldcraft Digital services and products.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-[800px]">
          <h1 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-text-tertiary">Last updated: June 2026</p>

          <div className="mt-12 space-y-8 text-text-secondary">
            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                1. Overview
              </h2>
              <p>
                These Terms of Service govern your use of Fieldcraft Digital&apos;s website, custom software
                development services, and digital products. By using our services, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                2. Services
              </h2>
              <p>
                Fieldcraft Digital provides bespoke software portal development and digital products. All
                custom project terms, including scope, timeline, and deliverables, are confirmed in writing
                before work begins.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                3. Payments & Refunds
              </h2>
              <p>
                Custom software projects are invoiced according to the agreed proposal. Digital products are
                sold through Gumroad and are subject to Gumroad&apos;s payment and refund policies. We offer a
                30-day guarantee on digital products.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                4. Intellectual Property
              </h2>
              <p>
                Upon full payment, custom software deliverables are transferred to the client. Pre-existing
                tools, frameworks, and templates remain the property of Fieldcraft Digital.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                5. Limitation of Liability
              </h2>
              <p>
                Fieldcraft Digital is not liable for indirect, incidental, or consequential damages arising
                from the use of our services or products.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
                6. Contact
              </h2>
              <p>
                For questions about these terms, please contact{" "}
                <a href="mailto:hello@fieldcraft.digital" className="text-accent underline transition-colors hover:text-accent-hover">
                  hello@fieldcraft.digital
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
