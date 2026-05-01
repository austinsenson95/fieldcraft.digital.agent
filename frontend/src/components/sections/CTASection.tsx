"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Failed to send message.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-field-warm-gray/20 bg-field-deep/60 px-5 py-3.5 font-body text-base text-field-parchment placeholder:text-field-warm-gray/50 outline-none transition-all duration-200 focus:border-field-verdant focus:ring-1 focus:ring-field-verdant/30";

  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1F15] px-6 py-24"
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
      </svg>

      <div className="relative z-10 w-full max-w-xl">
        {/* Headline */}
        <motion.h2
          className="text-center font-display text-2xl font-medium text-field-parchment md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.0, ease: EASE.entrance }}
        >
          Ready to build something that&rsquo;s actually yours?
        </motion.h2>

        <motion.p
          className="mt-6 text-center font-body text-base text-field-warm-gray md:text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE.entrance }}
        >
          Every Fieldcraft portal starts with a conversation.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE.entrance }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === "sending"}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === "sending"}
              className={inputClass}
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
            className={`${inputClass} resize-none`}
          />

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="cta-glow w-full rounded-xl bg-field-verdant px-8 py-4 font-display text-lg font-medium text-field-deep transition-all duration-300 hover:scale-[1.02] hover:bg-field-mint disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "sending"
                ? "Sending..."
                : status === "success"
                  ? "Message sent"
                  : "Start a Conversation"}
            </button>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <motion.p
              className="text-center font-body text-sm text-field-mint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Thanks for reaching out — I&rsquo;ll get back to you within 24
              hours.
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

        {/* Fallback email link */}
        <motion.p
          className="mt-8 text-center font-body text-sm text-field-warm-gray/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE.entrance }}
        >
          Or just say hello —{" "}
          <a
            href="mailto:austin@fieldcraft.digital"
            className="text-field-soft-teal underline transition-colors hover:text-field-mint"
          >
            austin@fieldcraft.digital
          </a>
        </motion.p>
      </div>
    </section>
  );
}
