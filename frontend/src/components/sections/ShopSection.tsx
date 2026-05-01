"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import { digitalProducts } from "@/lib/products";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginGate from "@/components/auth/LoginGate";

function ProductCard({ product, index, isAuthenticated }: { product: typeof digitalProducts[0]; index: number; isAuthenticated: boolean }) {
  const link = (
    <a
      href={product.stripeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-accent px-5 py-2.5 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover"
    >
      Buy Now
    </a>
  );

  return (
    <motion.div
      className="group relative flex flex-col rounded-2xl border border-text-muted/10 bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
    >
      {product.badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg-primary">
          {product.badge}
        </span>
      )}

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {product.category === "template" && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15H3.75M9 18H3.75M9 12h3.75m3 0h3.75M9 15h3.75m3 0h3.75M9 18h3.75m3 0h3.75m-3-6h3.75M9 6h3.75m3 0h3.75" />
          </svg>
        )}
        {product.category === "toolkit" && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M18 9a3 3 0 11-6 0 3 3 0 016 0zM9.75 9a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM3.75 9a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
          </svg>
        )}
        {product.category === "guide" && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        )}
        {product.category === "course" && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        )}
      </div>

      <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-text-primary">
        {product.title}
      </h3>
      <p className="mt-1 font-[family-name:var(--font-geist-sans)] text-sm text-text-tertiary">
        {product.tagline}
      </p>

      <ul className="mt-4 space-y-2">
        {product.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 flex items-center justify-between">
        <span className="font-[family-name:var(--font-geist-mono)] text-2xl font-semibold text-text-primary">
          ${product.price}
        </span>
        <LoginGate isAuthenticated={isAuthenticated}>
          <a
            href={product.stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-5 py-2.5 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover"
          >
            Buy Now
          </a>
        </LoginGate>
      </div>
    </motion.div>
  );
}

export default function ShopSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <section
      ref={ref}
      id="shop"
      className="relative bg-bg-primary px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE.entrance }}
        >
          <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase">
            Digital Products
          </p>
          <h2 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold text-text-primary md:text-4xl">
            Tools that shortcut the journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-tertiary">
            Not courses. Not hype. Just the exact templates, systems, and playbooks I use to run my business.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {digitalProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isAuthenticated={isAuthenticated} />
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE.entrance }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-sm text-accent transition-colors hover:text-accent-hover"
          >
            View all products
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
