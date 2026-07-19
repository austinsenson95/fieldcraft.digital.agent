"use client";

import { motion } from "framer-motion";

/**
 * Founder brand mark: a minimal terminal treatment with an "AS" monogram and
 * a blinking cursor. Fully deterministic — no randomness, so it is safe for
 * SSR hydration.
 */
export default function SpriteAvatar() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0F2B1E]">
      {/* Circuit-trace detail */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="avatarGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#1D9E75" strokeWidth="0.5" strokeOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="300" height="400" fill="url(#avatarGrid)" />
        <g stroke="#1D9E75" strokeOpacity="0.35" strokeWidth="1">
          <polyline points="0,64 52,64 76,88 128,88" />
          <circle cx="128" cy="88" r="2.5" fill="#1D9E75" stroke="none" />
          <polyline points="300,320 236,320 212,296 160,296" />
          <circle cx="160" cy="296" r="2.5" fill="#1D9E75" stroke="none" />
          <polyline points="0,352 36,352 60,376 300,376" strokeOpacity="0.2" />
          <polyline points="300,32 262,32 238,56 96,56" strokeOpacity="0.2" />
        </g>
      </svg>

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #5DCAA5 0px, #5DCAA5 1px, transparent 1px, transparent 4px)",
        }}
        aria-hidden="true"
      />

      {/* Terminal panel */}
      <div className="relative w-[70%] max-w-[240px] rounded-xl border border-[#1D9E75]/30 bg-[#0a1f15]/90 p-5 shadow-lg shadow-black/30">
        {/* Window controls */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#1D9E75]/40" />
          <span className="h-2 w-2 rounded-full bg-[#1D9E75]/60" />
          <span className="h-2 w-2 rounded-full bg-[#5DCAA5]" />
        </div>

        <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-wide text-[#5DCAA5]/50">
          austin@fieldcraft:~$ whoami
        </p>

        <div className="mt-2 flex items-end">
          <span className="font-[family-name:var(--font-geist-mono)] text-5xl font-semibold leading-none tracking-tight text-[#5DCAA5]">
            AS
          </span>
          <motion.span
            className="mb-0.5 ml-1.5 h-8 w-4 bg-[#5DCAA5]"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
            aria-hidden="true"
          />
        </div>

        <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-wide text-[#5DCAA5]/40">
          firmware → software architect
        </p>
      </div>
    </div>
  );
}
