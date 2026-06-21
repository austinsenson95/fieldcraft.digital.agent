"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "fieldcraft.digital CTA",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send message.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1F15] px-6"
    >
      {/* Subtle background wireframe SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="400,50 750,250 650,550 150,550 50,250"
          stroke="currentColor"
          strokeWidth="1"
          className="text-field-mint"
        />
        <polygon
          points="400,120 650,270 580,490 220,490 150,270"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-field-mint"
        />
        <line x1="400" y1="50" x2="400" y2="120" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="750" y1="250" x2="650" y2="270" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="650" y1="550" x2="580" y2="490" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="150" y1="550" x2="220" y2="490" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
        <line x1="50" y1="250" x2="150" y2="270" stroke="currentColor" strokeWidth="0.5" className="text-field-mint" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        <motion.h2
          className="font-display text-2xl font-medium text-field-parchment md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.0, ease: EASE.entrance }}
        >
          Ready to build something that&rsquo;s actually yours?
        </motion.h2>

        <motion.p
          className="mt-6 font-body text-base text-field-warm-gray md:text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE.entrance }}
        >
          Every Fieldcraft portal starts with a conversation.
        </motion.p>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-10 w-full space-y-4 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE.entrance }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === "sending"}
              className="w-full rounded-lg border border-field-warm-gray/20 bg-field-deep/60 px-4 py-3 font-body text-base text-field-parchment placeholder:text-field-warm-gray/50 outline-none transition-colors focus:border-field-verdant"
            />
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === "sending"}
              className="w-full rounded-lg border border-field-warm-gray/20 bg-field-deep/60 px-4 py-3 font-body text-base text-field-parchment placeholder:text-field-warm-gray/50 outline-none transition-colors focus:border-field-verdant"
            />
          </div>

          <textarea
            name="message"
            placeholder="What are you building? What's the biggest thing holding you back?"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            disabled={status === "sending"}
            className="w-full rounded-lg border border-field-warm-gray/20 bg-field-deep/60 px-4 py-3 font-body text-base text-field-parchment placeholder:text-field-warm-gray/50 outline-none transition-colors focus:border-field-verdant resize-none"
          />

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="cta-glow w-full sm:w-auto rounded-xl bg-field-verdant px-8 py-4 font-display text-lg font-medium text-field-deep transition-all duration-300 hover:scale-[1.02] hover:bg-field-mint disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending..."
                : status === "success"
                  ? "Message sent"
                  : "Start a Conversation"}
            </button>

            {/* Direct email link */}
            <a
              href="mailto:austin@fieldcraft.digital?subject=Project%20Inquiry"
              className="text-field-soft-teal underline transition-colors hover:text-field-mint font-body text-sm"
            >
              Or email me directly
            </a>
          </div>

          {status === "success" && (
            <motion.p
              className="text-center font-body text-sm text-field-mint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Thanks for reaching out &mdash; I&rsquo;ll get back to you within 24 hours.
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              className="text-center font-body text-sm text-red-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errorMsg}
            </motion.p>
          )}
        </motion.form>

        <motion.p
          className="mt-8 font-body text-sm text-field-warm-gray/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE.entrance }}
        >
          Messages forwarded to{" "}
          <span className="text-field-soft-teal">austinsenson95@gmail.com</span>
        </motion.p>
      </div>
    </section>
  );
}
