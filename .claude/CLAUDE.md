# CLAUDE.md — Fieldcraft Digital

## Project State
- **Current phase**: Phase 2 complete — All scroll sections built. Monorepo restructure complete.
- **Last session**: 2026-04-06 — Website review fixes (19 findings, Tiers 1–3 complete)
- **Next priorities**:
  1. Deploy to Vercel and connect fieldcraft.digital domain
  2. Replace SVG OG image with real PNG (1200x630) for proper social card support
  3. Add real Calendly link to CTA button
  4. Phase 3: Interactive personalization demo section
  5. Replace PortalMockup placeholder with real Hamza portal screenshot
- **Blocking issues**:
  - [ ] Austin's headshot needed for About section — add as `frontend/public/images/austin.webp`, update AboutSection.tsx

## Project Structure
This is a monorepo with npm workspaces:
- `frontend/` — Next.js 16 website (primary, all Phase 1–2 work lives here)
- `backend/` — Hono API server (scaffold ready, active from Phase 3)
- `shared/` — Shared TypeScript types, constants, validation
- `docs/` — Living documentation (brand, architecture, plans, decisions)
- `.claude/` — AI operating memory (CLAUDE.md, CONVENTIONS.md, PROMPTS/)

## Key Commands
- `npm run dev:frontend` — Start frontend only (most common)
- `npm run dev` — Start frontend + backend together
- `npm run build` — Production build (shared → frontend)
- `cd frontend && npx vercel` — Deploy frontend to Vercel

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
- Monorepo: npm workspaces (no Turborepo), Hono for backend — 2026-04-05

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
| Footer | ✅ Complete | Expanded — tagline, email, social links, privacy, copyright |
| DeliverablesSection | ✅ Complete | 4-item 2x2 grid, staggered fade-in |
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
- `frontend/src/app/layout.tsx` — Root layout with font variables and metadata
- `frontend/src/app/globals.css` — Tailwind v4 theme (brand colors, fonts), base styles, reduced motion, CTA glow keyframes
- `frontend/src/app/page.tsx` — Home page (all sections assembled in scroll order)
- `frontend/src/components/sections/HeroSection.tsx` — Hero section with Three.js mesh, tagline, scroll indicator
- `frontend/src/components/three/HeroMesh.tsx` — Three.js icosahedron wireframe with mouse parallax
- `frontend/src/components/layout/Navbar.tsx` — Scroll-aware nav with mobile overlay
- `frontend/src/components/layout/Footer.tsx` — Minimal footer (Obsidian bg)
- `frontend/src/components/sections/ProblemSection.tsx` — 3-line problem statement with staggered reveal
- `frontend/src/components/sections/PortalShowcase.tsx` — CSS 3D portal with scroll-linked rotation + label pills
- `frontend/src/components/sections/ProcessSection.tsx` — 3-step process with animated connecting line
- `frontend/src/components/sections/CaseStudySection.tsx` — Case study with PortalMockup, tech tags, metrics
- `frontend/src/components/sections/AboutSection.tsx` — About Austin with avatar placeholder and social links
- `frontend/src/components/sections/CTASection.tsx` — Full-viewport CTA with pulsing button + SVG bg
- `frontend/src/components/interactive/PortalMockup.tsx` — Coded portal UI (sidebar + blueprint generator), reused in sections 3 & 5
- `frontend/src/components/ui/ScrollReveal.tsx` — Reusable scroll-triggered fade/slide wrapper
- `frontend/src/lib/fonts.ts` — Font loading config (Satoshi, DM Sans, Instrument Serif, JetBrains Mono)
- `frontend/src/lib/animations.ts` — Shared animation constants + variants (fadeInUp, scaleIn, staggerContainer)
- `frontend/src/lib/use-reduced-motion.ts` — Reduced motion preference hook
- `frontend/src/lib/use-device-capability.ts` — Device capability detection hook
- `docs/brand/COPY.md` — All website copy in one place
- `docs/architecture/API.md` — API route contracts
- `shared/src/types/api.ts` — Shared request/response types
- `shared/src/constants/brand.ts` — Brand colors, names, URLs
- `backend/src/index.ts` — Hono server entry point
- `frontend/src/components/sections/DeliverablesSection.tsx` — 4-item deliverables grid
- `frontend/public/og/og-default.svg` — OG image placeholder (replace with PNG for production)

## Session: Website Review Fixes — 2026-04-06
### Changes
- Added hero CTA button ("Start a Conversation") + secondary ghost link ("See how it works ↓")
- Updated hero ICP copy: coaches, consultants, and creators who've outgrown their tools
- Fixed Problem section initial opacity (0 → 0.15), added aria-label
- Feature pills in Portal Showcase now show benefit descriptions (hover on desktop, always-visible on mobile)
- Process section: added "4–8 weeks" timeline signal + week tags per step
- Process section: added subdued pricing signal (₹1,50,000 starting price)
- Case Study: added outcome blockquote with gold left border accent
- About: upgraded avatar to gradient circle with ring styling
- Created DeliverablesSection.tsx (4-item 2x2 grid) between CaseStudy and About
- Nav: added scroll-linked active state (mint color + underline indicator)
- Hero scroll indicator: fades out on scroll (>50px) or after 8 seconds
- Standardized all contact email to austin@fieldcraft.digital
- JSON-LD structured data added to layout.tsx
- OG image metadata updated (SVG placeholder — replace with PNG before launch)
- Twitter card type updated to summary_large_image
- Footer expanded: tagline, email, social links, privacy policy, copyright
- CLAUDE.md updated with session summary
