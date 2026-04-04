# Changelog

## 2026-04-04 — Session 1

### Built
- Initialized Next.js 16 project with TypeScript, Tailwind CSS v4, App Router
- Installed Framer Motion, GSAP, Three.js (@react-three/fiber + drei)
- Configured Tailwind v4 theme with all brand colors (`field-*` tokens) and font families
- Set up font loading: Satoshi (self-hosted woff2), DM Sans, Instrument Serif, JetBrains Mono via next/font
- Created hero section with:
  - Full viewport dark background (#0F2B1E)
  - "Engineered around you." in Instrument Serif with fade-in + scale animation
  - Three.js icosahedron wireframe mesh with mouse parallax
  - CSS gradient fallback for low-end devices
  - Scroll indicator at bottom
- Created scroll-aware navbar:
  - Transparent → blur on scroll (appears after hero)
  - Fieldcraft Digital wordmark
  - Desktop nav links (Work, Process, About, Contact)
  - Mobile hamburger with full-screen overlay
- Created utility hooks: useReducedMotion, useDeviceCapability
- Created shared animation constants (EASE, DURATION, STAGGER, motion variants)
- Set up full project directory structure per build prompt
- Created all documentation files

### Decisions
- Used Tailwind v4 CSS-based config (`@theme inline`) instead of tailwind.config.ts (Next.js 16 default)
- EdgesGeometry on IcosahedronGeometry for clean wireframe look
- Lazy-load Three.js via next/dynamic to keep FCP fast

### Next
- Deploy to Vercel
- Begin Phase 2 scroll sections (Problem → What We Build → How It Works → About → CTA)
