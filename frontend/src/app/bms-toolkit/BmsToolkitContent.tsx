"use client";

import { useState, type FormEvent, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Cpu,
  Users,
  Zap,
  MemoryStick,
  Layers,
  Timer,
  HardDrive,
  AlertTriangle,
  TestTube,
  Network,
  CheckSquare,
  Check,
  FileText,
  Quote,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { EASE } from "@/lib/animations";

const guides = [
  {
    tag: "NXP",
    tagColor: "#FF9900",
    tagBg: "rgba(255,153,0,0.15)",
    title: "BMS Firmware Diagnostic Guide — S32K144 Edition",
    pages: "8 pages",
    topics: [
      "Flash & RAM analysis for NXP S32K144",
      "FreeRTOS looptime mapping & Segger SystemView profiling",
      "MIL vs PIL testing architecture",
      "UDS DTC definitions & field diagnostics",
      "Production test procedures (ICT, EOL, HiPot)",
    ],
    pdf: "/bms-diagnostic-guide-s32k144.pdf",
  },
  {
    tag: "STM32",
    tagColor: "#00BFFF",
    tagBg: "rgba(0,191,255,0.15)",
    title: "BMS Firmware Diagnostic Guide — STM32L476 Edition",
    pages: "23 pages",
    topics: [
      "Flash & RAM analysis for STM32L476",
      "ThreadX runtime trace setup",
      "Dual-bank OTA bootloader architecture",
      "CMU/CCM sampling timing & CAN message matrices",
      "MISRA-C compliance checklist",
    ],
    pdf: "/bms-diagnostic-guide-stm32l476.pdf",
  },
];

const audiences = [
  {
    icon: Cpu,
    title: "BMS Firmware Engineers",
    description:
      "Working on production battery management systems and need proven diagnostic architectures for S32K144 or STM32 platforms.",
  },
  {
    icon: Users,
    title: "Embedded Systems Teams",
    description:
      "Scaling from prototype to production and need standardized testing procedures, RTOS profiling setups, and compliance checklists.",
  },
  {
    icon: Zap,
    title: "Battery Startup Founders",
    description:
      "Need to validate firmware quality before shipping hardware, and want to avoid costly recalls from undiagnosed edge cases.",
  },
];

const includedItems = [
  { icon: MemoryStick, title: "Memory Maps & Linker Scripts", desc: "Flash and RAM layout optimized for BMS applications" },
  { icon: Layers, title: "Stack Allocation Tables", desc: "Per-task stack sizing with watermark monitoring" },
  { icon: Timer, title: "WCET Analysis", desc: "Worst-case execution time with DWT cycle counter" },
  { icon: HardDrive, title: "Flash Wear-Leveling", desc: "Algorithms for EEPROM emulation and page rotation" },
  { icon: AlertTriangle, title: "UDS DTC Storage", desc: "Diagnostic trouble code strategy and field retrieval" },
  { icon: TestTube, title: "EOL Test Sequences", desc: "End-of-line functional test procedures for production" },
  { icon: Network, title: "CAN Message Timing", desc: "Message matrices with timing and error handling" },
  { icon: CheckSquare, title: "MISRA-C Checklist", desc: "Compliance verification for safety-critical firmware" },
];

const stats = [
  { value: "2", label: "Guides" },
  { value: "31+", label: "Pages" },
  { value: "2", label: "MCU Platforms" },
  { value: "10", label: "Chapters" },
];

const companies = ["Voltance", "CellForge", "Ampere Robotics", "NexGen Power", "Stratus Energy"];

function ToolkitForm({ buttonText, placeholder = "Enter your email" }: { buttonText: string; placeholder?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/bms-toolkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE.entrance }}
        className="rounded-xl border border-accent/30 bg-accent/10 px-6 py-5 text-left"
      >
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-text-primary">You&apos;re on the list!</p>
            <p className="mt-1 text-sm text-text-secondary">
              Download your guides below and check your inbox for backup links.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href="/bms-diagnostic-guide-s32k144.pdf"
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent/30"
              >
                <FileText className="h-3.5 w-3.5 text-accent" />
                S32K144 Guide (PDF)
              </a>
              <a
                href="/bms-diagnostic-guide-stm32l476.pdf"
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent/30"
              >
                <FileText className="h-3.5 w-3.5 text-accent" />
                STM32L476 Guide (PDF)
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl bg-bg-secondary px-5 py-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none ring-0 border border-border-subtle transition-colors focus:border-accent sm:rounded-r-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm font-medium text-bg-primary transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:rounded-l-none"
      >
        {status === "submitting" ? "Sending..." : buttonText}
        <ArrowRight className="h-4 w-4" />
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-sm text-red-400 sm:absolute sm:mt-0 sm:translate-y-14">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="mb-12 text-center md:mb-16">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: EASE.entrance }}
          className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] text-accent uppercase"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.05, ease: EASE.entrance }}
        className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold tracking-tight text-text-primary md:text-3xl lg:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE.entrance }}
          className="mx-auto mt-4 max-w-2xl text-text-tertiary"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary px-6">
      {/* Circuit pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(93,202,165,0.35) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(93,202,165,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(93,202,165,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,165,0.25) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.entrance }}
        >
          <p className="mb-6 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] text-accent uppercase">
            Free Resource for BMS Engineers
          </p>
          <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-semibold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            The BMS Diagnostic Toolkit
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Two free firmware guides trusted by BMS engineers building safety-critical battery systems.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <ToolkitForm buttonText="Get FREE Access" />
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Join 200+ engineers. No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-text-muted p-1"
        >
          <div className="h-2 w-1 rounded-full bg-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function WhatsInsideSection() {
  return (
    <section className="relative bg-bg-primary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="What&apos;s Inside"
          title="Two platform-specific guides"
          subtitle="Detailed diagnostics for the most common MCUs in battery management systems."
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {guides.map((guide) => (
            <motion.div
              key={guide.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE.entrance }}
              whileHover={{ scale: 1.01, borderColor: "rgba(29,158,117,0.3)" }}
              className="group rounded-2xl border border-border-subtle bg-bg-secondary p-6 sm:p-8 transition-all duration-300"
            >
              <span
                className="mb-5 inline-block rounded-full px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider"
                style={{ backgroundColor: guide.tagBg, color: guide.tagColor }}
              >
                {guide.tag}
              </span>

              <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-text-primary sm:text-xl">
                {guide.title}
              </h3>

              <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-sm text-accent">{guide.pages}</p>

              <ul className="mt-6 space-y-3">
                {guide.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-text-secondary leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2 border-t border-border-subtle pt-5 text-text-muted">
                <FileText className="h-4 w-4" />
                <span className="font-[family-name:var(--font-geist-mono)] text-xs">PDF Download</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoThisIsForSection() {
  return (
    <section className="relative border-t border-border-subtle bg-bg-primary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Who This Is For" />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {audiences.map((audience) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE.entrance }}
              whileHover={{ borderColor: "rgba(29,158,117,0.25)" }}
              className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 sm:p-8 text-center transition-all duration-300"
            >
              <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <audience.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-text-primary">
                {audience.title}
              </h3>
              <p className="mt-3 text-sm text-text-tertiary leading-relaxed">{audience.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsIncludedSection() {
  return (
    <section className="relative border-t border-border-subtle bg-bg-primary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="What&apos;s Included"
          title="A complete diagnostic framework"
          subtitle="Every layer of BMS firmware, from memory layout to production test."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {includedItems.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE.entrance }}
              whileHover={{ backgroundColor: "rgba(20,51,38,0.85)" }}
              className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-secondary/60 p-5 transition-all duration-200"
            >
              <div className="shrink-0 mt-0.5">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-[family-name:var(--font-geist-sans)] text-sm font-semibold text-text-primary">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-text-tertiary leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="relative border-t border-border-subtle bg-bg-primary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
          className="flex flex-wrap justify-center gap-10 md:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-[family-name:var(--font-geist-mono)] text-3xl font-semibold text-accent md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[13px] uppercase tracking-wider text-text-tertiary">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
          className="mx-auto mt-16 max-w-2xl text-center md:mt-20"
        >
          <Quote className="mx-auto mb-4 h-8 w-8 text-accent opacity-30" />
          <blockquote className="text-lg italic leading-relaxed text-text-primary">
            &ldquo;These guides saved us weeks of diagnostic setup on our S32K144 BMS project. The RTOS profiling section alone was worth it.&rdquo;
          </blockquote>
          <cite className="mt-4 block not-italic text-sm text-text-tertiary">Senior Firmware Engineer, EV Startup</cite>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE.entrance }}
          className="mt-16 text-center md:mt-20"
        >
          <p className="text-[13px] uppercase tracking-[0.15em] text-text-muted">Used by engineers at</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
            {companies.map((name) => (
              <span key={name} className="font-[family-name:var(--font-geist-mono)] text-sm tracking-wide text-text-muted">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-secondary to-bg-primary px-6 py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE.entrance }}
        >
          <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.2em] text-accent uppercase">
            Get the Toolkit
          </p>
          <h2 className="font-[family-name:var(--font-geist-sans)] text-2xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Build better BMS firmware
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-tertiary">
            Join engineers who ship safer battery systems with confidence.
          </p>

          <div className="mx-auto mt-10 max-w-lg">
            <ToolkitForm buttonText="Send Me The Guides" />
          </div>

          <p className="mx-auto mt-4 max-w-md text-xs text-text-muted">
            You&apos;ll also join The Field Report — one email a week with embedded systems insights. Unsubscribe anytime.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href="/bms-diagnostic-guide-s32k144.pdf"
              className="text-sm text-accent transition-colors hover:text-accent-hover hover:underline"
            >
              Download S32K144 Guide (PDF)
            </a>
            <a
              href="/bms-diagnostic-guide-stm32l476.pdf"
              className="text-sm text-accent transition-colors hover:text-accent-hover hover:underline"
            >
              Download STM32L476 Guide (PDF)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function BmsToolkitContent() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroSection />
      <WhatsInsideSection />
      <WhoThisIsForSection />
      <WhatsIncludedSection />
      <TrustSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
