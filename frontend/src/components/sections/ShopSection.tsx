"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import { digitalProducts } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

const productImages: Record<string, string> = {
  "personal-brand-starter": "/images/product-brand.jpg",
  "solo-operator-blueprint": "/images/product-operator.jpg",
  "productized-service-guide": "/images/product-guide.jpg",
};

function ProductCard({ product, index }: { product: typeof digitalProducts[0]; index: number }) {
  const image = productImages[product.id] || "/images/product-guide.jpg";

  return (
    <motion.div
      className="glass-card group relative flex flex-col overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE.entrance }}
    >
      {/* Product Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/30 to-transparent" />
        {product.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-bg-primary">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
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
          <a
            href={product.gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            data-event="product_purchase_click"
            data-product={product.id}
            className="rounded-full bg-accent px-5 py-2.5 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:scale-[1.02] hover:bg-accent-hover"
          >
            Buy Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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
          <p className="os-label mb-4">Digital Products</p>
          <h2 className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold text-text-primary md:text-4xl">
            Tools that shortcut the journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-tertiary">
            Not courses. Not hype. Just the exact templates, systems, and playbooks I use to run my business.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {digitalProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
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
