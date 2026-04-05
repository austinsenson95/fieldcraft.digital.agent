# CLAUDE.md — Fieldcraft Digital

## Project State
- **Current phase**: Phase 2 complete — All scroll sections built
- **Last session**: 2026-04-04 — Built all 6 scroll sections (Problem, Portal Showcase, Process, Case Study, About, CTA) + Footer
- **Next priorities**:
  1. Deploy to Vercel and connect fieldcraft.digital domain
  2. Phase 3: Interactive personalization demo section
  3. Replace PortalMockup placeholder with real Hamza portal screenshot
  4. Add real Calendly link to CTA button
  5. Add Austin's photo to About section
- **Blocking issues**: None

## Key Decisions Made
- Tailwind v4 (CSS-based `@theme` config, not tailwind.config.ts) — shipped with Next.js 16 — 2026-04-04
- Satoshi font self-hosted from Fontshare (woff2), DM Sans + Instrument Serif from Google via next/font — 2026-04-04
- Three.js hero mesh lazy-loaded with `next/dynamic`, CSS gradient fallback for low-end devices — 2026-04-04
- IcosahedronGeometry (detail level 1) rendered as EdgesGeometry for wireframe look — 2026-04-04
- Inline SVG icons for social links (lucide-react dropped brand icons) — 2026-04-04
- Portal Showcase uses CSS 3D transforms + `useScroll`/`useTransform` for scroll-linked rotation — 2026-04-04
- Process section uses vertical connecting line with `scaleY` scroll animation — 2026-04-04
- CTA background uses static SVG wireframe (not Three.js) for performance — 2026-04-04
- PortalMockup is a reusable component used in both Portal Showcase and Case Study sections — 2026-04-04

## Component Status
| Component | Status | Notes |
|-----------|--------|-------|
| Hero section | ✅ Complete | Three.js mesh + text + scroll indicator |
| Navbar | ✅ Complete | Transparent → blur on scroll, mobile hamburger overlay |
| Problem section | ✅ Complete | 3-line staggered fade-in, divider animation |
| What We Build section | ✅ Complete | CSS 3D portal, scroll-linked rotation, floating labels, portal interior reveal |
| PortalMockup | ✅ Complete | Reusable coded portal UI (sidebar + blueprint generator) |
| How It Works section | ✅ Complete | Vertical connecting line with scaleY scroll animation, 3 steps |
| Case Study section | ✅ Complete | PortalMockup + tech tags + metric cards |
| About section | ✅ Complete | Avatar placeholder, bio, social links (inline SVGs) |
| CTA section | ✅ Complete | Full-viewport, glow-pulse button, SVG wireframe bg |
| Footer | ✅ Complete | Minimal, Obsidian bg, wordmark + copyright |
| Personalization demo | ⬜ Not started | Phase 3 |
| ScrollReveal | ✅ Complete | Reusable inView wrapper with direction/delay props |

## Known Issues
- None yet

## Style Patterns Established
- **Dark-first**: bg-field-deep (#0F2B1E) as primary background
- **Color tokens**: All brand colors as `field-*` Tailwind classes (e.g., `text-field-mint`, `bg-field-verdant`)
- **Font classes**: `font-display` (Satoshi), `font-body` (DM Sans), `font-accent` (Instrument Serif), `font-mono` (JetBrains Mono)
- **Animation pattern**: Framer Motion `motion.*` components with constants from `@/lib/animations`
- **Three.js pattern**: Lazy-loaded via `next/dynamic` with SSR disabled, CSS fallback for low-end
- **Reduced motion**: CSS `prefers-reduced-motion` in globals.css + `useReducedMotion` hook for JS animations

## Austin's Preferences (Observed)
- (To be accumulated across sessions)

## File Map (Key Files)
- `src/app/layout.tsx` — Root layout with font variables and metadata
- `src/app/globals.css` — Tailwind v4 theme (brand colors, fonts), base styles, reduced motion, CTA glow keyframes
- `src/app/page.tsx` — Home page (all sections assembled in scroll order)
- `src/components/hero/HeroSection.tsx` — Hero section with Three.js mesh, tagline, scroll indicator
- `src/components/three/HeroMesh.tsx` — Three.js icosahedron wireframe with mouse parallax
- `src/components/layout/Navbar.tsx` — Scroll-aware nav with mobile overlay
- `src/components/layout/Footer.tsx` — Minimal footer (Obsidian bg)
- `src/components/sections/ProblemSection.tsx` — 3-line problem statement with staggered reveal
- `src/components/sections/PortalShowcase.tsx` — CSS 3D portal with scroll-linked rotation + label pills
- `src/components/sections/ProcessSection.tsx` — 3-step process with animated connecting line
- `src/components/sections/CaseStudySection.tsx` — Case study with PortalMockup, tech tags, metrics
- `src/components/sections/AboutSection.tsx` — About Austin with avatar placeholder and social links
- `src/components/sections/CTASection.tsx` — Full-viewport CTA with pulsing button + SVG bg
- `src/components/interactive/PortalMockup.tsx` — Coded portal UI (sidebar + blueprint generator), reused in sections 3 & 5
- `src/components/ui/ScrollReveal.tsx` — Reusable scroll-triggered fade/slide wrapper
- `src/lib/fonts.ts` — Font loading config (Satoshi, DM Sans, Instrument Serif, JetBrains Mono)
- `src/lib/animations.ts` — Shared animation constants + variants (fadeInUp, scaleIn, staggerContainer)
- `src/lib/use-reduced-motion.ts` — Reduced motion preference hook
- `src/lib/use-device-capability.ts` — Device capability detection hook
