"use client";

import { motion } from "framer-motion";

export default function SpriteAvatar() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-mint/40"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Character container */}
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Glow effect behind */}
          <defs>
            <radialGradient id="avatarGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#5DCAA5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#5DCAA5" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hoodGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D4A38" />
              <stop offset="100%" stopColor="#0F2B1E" />
            </linearGradient>
            <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5F1EB" />
              <stop offset="100%" stopColor="#E8E2D8" />
            </linearGradient>
          </defs>

          {/* Glow circle */}
          <circle cx="100" cy="110" r="90" fill="url(#avatarGlow)" />

          {/* Hood / Hair back */}
          <path
            d="M40 110 C40 60 65 30 100 30 C135 30 160 60 160 110 L160 150 L40 150 Z"
            fill="url(#hoodGrad)"
            stroke="#1D9E75"
            strokeWidth="2"
          />

          {/* Face */}
          <ellipse cx="100" cy="115" rx="45" ry="50" fill="url(#faceGrad)" />

          {/* Hood front framing */}
          <path
            d="M55 110 C55 65 75 40 100 40 C125 40 145 65 145 110"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Ears */}
          <ellipse cx="55" cy="115" rx="8" ry="12" fill="#E8E2D8" />
          <ellipse cx="145" cy="115" rx="8" ry="12" fill="#E8E2D8" />

          {/* Eyes container */}
          <g>
            {/* Left eye */}
            <ellipse cx="82" cy="108" rx="14" ry="16" fill="#0F2B1E" />
            <motion.ellipse
              cx="85"
              cy="104"
              rx="5"
              ry="6"
              fill="#5DCAA5"
              animate={{ cx: [85, 87, 85, 83, 85] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="88"
              cy="100"
              rx="2"
              ry="2.5"
              fill="#F5F1EB"
              animate={{ cx: [88, 90, 88, 86, 88] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Right eye */}
            <ellipse cx="118" cy="108" rx="14" ry="16" fill="#0F2B1E" />
            <motion.ellipse
              cx="121"
              cy="104"
              rx="5"
              ry="6"
              fill="#5DCAA5"
              animate={{ cx: [121, 123, 121, 119, 121] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.ellipse
              cx="124"
              cy="100"
              rx="2"
              ry="2.5"
              fill="#F5F1EB"
              animate={{ cx: [124, 126, 124, 122, 124] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
          </g>

          {/* Blinking eyelids */}
          <motion.rect
            x="65"
            y="85"
            width="70"
            height="46"
            rx="23"
            fill="#0F2B1E"
            animate={{ height: [0, 46, 0, 0, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3.7, times: [0, 0.5, 1, 1, 1] }}
            style={{ transformOrigin: "center" }}
          />

          {/* Nose */}
          <path
            d="M100 118 L96 128 L104 128 Z"
            fill="#D4C4B0"
            opacity="0.6"
          />

          {/* Mouth */}
          <motion.path
            d="M90 138 Q100 142 110 138"
            stroke="#1D4A38"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            animate={{ d: ["M90 138 Q100 142 110 138", "M90 138 Q100 145 110 138", "M90 138 Q100 142 110 138"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hair tuft */}
          <motion.path
            d="M95 32 Q100 15 105 32"
            stroke="#1D9E75"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ d: ["M95 32 Q100 15 105 32", "M95 32 Q100 12 105 32", "M95 32 Q100 15 105 32"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Body / Shoulders */}
          <path
            d="M50 165 Q100 150 150 165 L150 200 Q100 210 50 200 Z"
            fill="#143326"
            stroke="#1D9E75"
            strokeWidth="1.5"
          />

          {/* Shirt detail */}
          <path
            d="M95 165 L100 200 L105 165"
            stroke="#1D9E75"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          {/* Code brackets on shirt */}
          <text
            x="100"
            y="188"
            textAnchor="middle"
            fill="#5DCAA5"
            fontFamily="monospace"
            fontSize="10"
            opacity="0.6"
          >
            {"</>"}
          </text>
        </svg>
      </motion.div>

      {/* Bottom shadow */}
      <motion.div
        className="absolute bottom-4 h-2 w-20 rounded-full bg-mint/10 blur-sm"
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
