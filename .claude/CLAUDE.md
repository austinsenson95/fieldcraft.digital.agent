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
| Problem section | ⬜ Not started | — |
| What We Build section | ⬜ Not started | — |
| Personalization demo | ⬜ Not started | — |
| How It Works section | ⬜ Not started | — |
| About section | ⬜ Not started | — |
| CTA section | ⬜ Not started | — |

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
- `src/app/globals.css` — Tailwind v4 theme (brand colors, fonts), base styles, reduced motion
- `src/app/page.tsx` — Home page (single-page scroll)
- `src/components/hero/HeroSection.tsx` — Hero section with Three.js mesh, tagline, scroll indicator
- `src/components/three/HeroMesh.tsx` — Three.js icosahedron wireframe with mouse parallax
- `src/components/layout/Navbar.tsx` — Scroll-aware nav with mobile overlay
- `src/lib/fonts.ts` — Font loading config (Satoshi, DM Sans, Instrument Serif, JetBrains Mono)
- `src/lib/animations.ts` — Shared animation constants (EASE, DURATION, STAGGER, variants)
- `src/lib/use-reduced-motion.ts` — Reduced motion preference hook
- `src/lib/use-device-capability.ts` — Device capability detection hook
