import Navbar from "@/components/layout/Navbar";
import { digitalProducts } from "@/lib/products";
import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";
import Link from "next/link";

function ProductCard({ product, index }: { product: typeof digitalProducts[0]; index: number }) {
  return (
    <motion.div
      className="group relative flex flex-col rounded-2xl border border-text-muted/10 bg-bg-secondary p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
    >
      {product.badge && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg-primary">
          {product.badge}
        </span>
      )}

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {product.category === "template" && (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15H3.75M9 18H3.75M9 12h3.75m3 0h3.75M9 15h3.75m3 0h3.75M9 18h3.75m3 0h3.75m-3-6h3.75M9 6h3.75m3 0h3.75" />
          </svg>
        )}
        {product.category === "toolkit" && (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M18 9a3 3 0 11-6 0 3 3 0 016 0zM9.75 9a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM3.75 9a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
          </svg>
        )}
        {product.category === "guide" && (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        )}
      </div>

      <h2 className="font-[family-name:var(--font-geist-sans)] text-xl font-semibold text-text-primary">
        {product.title}
      </h2>
      <p className="mt-2 font-[family-name:var(--font-geist-sans)] text-sm text-text-tertiary">
        {product.description}
      </p>

      <ul className="mt-6 space-y-3">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8 flex items-center justify-between">
        <span className="font-[family-name:var(--font-geist-mono)] text-3xl font-semibold text-text-primary">
          ${product.price}
        </span>
        <a
          href={product.stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-6 py-3 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover"
        >
          Buy Now
        </a>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />

      <section className="px-6 pt-32 pb-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.entrance }}
          >
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-sm text-text-muted transition-colors hover:text-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
              </svg>
              Back to home
            </Link>

            <h1 className="mt-8 font-[family-name:var(--font-geist-sans)] text-4xl font-semibold text-text-primary md:text-5xl">
              Digital Products
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-tertiary">
              No courses. No hype. Just the exact templates, systems, and playbooks I use to run my business.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {digitalProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            className="mt-20 rounded-2xl border border-text-muted/10 bg-bg-secondary p-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="font-[family-name:var(--font-geist-sans)] text-lg text-text-secondary">
              Want something custom?{" "}
              <Link href="/#contact" className="text-accent underline transition-colors hover:text-accent-hover">
                Let&apos;s talk
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
