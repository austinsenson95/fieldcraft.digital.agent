"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";
import Image from "next/image";

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: "portal",
      title: "Your Portal",
      description: "A unified command centre for your business — built from your model, not a template.",
      image: "/images/portal.jpg",
      span: "md:col-span-2",
    },
    {
      icon: "blueprint",
      title: "AI Blueprint Generator",
      description: "Map your offer structure, content pillars, and delivery sequence in minutes.",
      image: "/images/blueprint.jpg",
      span: "",
    },
    {
      icon: "dashboard",
      title: "Branded Dashboard",
      description: "A clean, custom interface that feels like your brand — not a SaaS clone.",
      image: "/images/dashboard.jpg",
      span: "",
    },
    {
      icon: "delivery",
      title: "Automated Delivery",
      description: "Drip content, trigger sequences, and manage access without manual work.",
      image: "/images/delivery.jpg",
      span: "",
    },
    {
      icon: "payment",
      title: "Payment Integration",
      description: "Razorpay, Stripe, or your preferred gateway — wired into the experience.",
      image: "/images/payment.jpg",
      span: "",
    },
    {
      icon: "video",
      title: "Video Content Engine",
      description: "Remotion-powered video generation for personalised client content.",
      image: "/images/video.jpg",
      span: "",
    },
  ];

  return (
    <section
      ref={ref}
      id="work"
      className="bg-bg-primary px-6 py-24 md:px-10 md:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="os-label mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          WHAT WE BUILD
        </motion.p>
        <motion.h2
          className="mb-16 font-[family-name:var(--font-geist-sans)] text-2xl tracking-tight text-text-primary md:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
        >
          Software that thinks like your business.
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.icon}
              className={`glass-card group relative overflow-hidden rounded-2xl ${feature.span}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE.entrance }}
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                <h3 className="font-[family-name:var(--font-geist-sans)] text-lg text-text-primary md:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
