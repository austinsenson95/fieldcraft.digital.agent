# Fieldcraft Digital — Claude Code Build Prompt

> **This file is the primary instruction set for Claude Code. Read this FIRST before any action.**

---

## Project Overview

You are building the website for **Fieldcraft Digital** — a premium, bespoke software studio. The website itself is the proof of concept: if it looks this good, imagine what the builder creates for clients.

**Domain**: fieldcraft.digital
**Stack**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion, GSAP, Three.js (selective), Vercel
**Brand DNA**: See `/docs/brand/BRAND_DNA.md` for complete identity, colors, typography, voice, and design specs.

---

## Project Memory System

This project uses an evolving documentation system. You MUST maintain these files and keep them current after every session.

### Directory Structure

```
fieldcraft-digital/
├── .claude/
│   └── CLAUDE.md              # YOUR operating manual — read this first every session
├── docs/
│   ├── brand/
│   │   └── BRAND_DNA.md       # Complete brand identity (colors, type, voice, visuals)
│   ├── architecture/
│   │   ├── ARCHITECTURE.md    # System architecture decisions and patterns
│   │   ├── STACK.md           # Tech stack details, versions, configs
│   │   └── COMPONENTS.md      # Component inventory with status
│   ├── plan/
│   │   ├── PLAN.md            # Current sprint plan and priorities
│   │   ├── ROADMAP.md         # Long-term feature roadmap
│   │   └── CHANGELOG.md       # Session-by-session log of what was built/changed
│   └── decisions/
│       └── DECISIONS.md       # Architecture Decision Records (ADRs)
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   │   ├── layout/            # Nav, Footer, Section wrappers
│   │   ├── hero/              # Hero section + 3D mesh
│   │   ├── sections/          # Each scroll section
│   │   ├── interactive/       # Personalization demo
│   │   ├── ui/                # Shared UI primitives
│   │   └── three/             # Three.js / R3F components
│   ├── lib/                   # Utilities, hooks, constants
│   ├── styles/                # Global CSS, Tailwind config extensions
│   └── content/               # Copy, metadata, structured content
├── public/
│   ├── fonts/                 # Self-hosted fonts (Satoshi, Instrument Serif)
│   ├── images/                # Optimized images
│   └── models/                # 3D models if needed
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

### CLAUDE.md — The Operating Manual

**This is the most important file in the project.** Create it at `.claude/CLAUDE.md` on first session and update it EVERY session.

It must always contain:

```markdown
# CLAUDE.md — Fieldcraft Digital

## Project State
- **Current phase**: [e.g., "Phase 1 — Scaffold + Hero"]
- **Last session**: [date and summary of what was done]
- **Next priorities**: [ordered list of what to build next]
- **Blocking issues**: [anything that's stuck or needs Austin's input]

## Key Decisions Made
- [Decision]: [Rationale] — [Date]
- (Accumulated across sessions)

## Component Status
| Component | Status | Notes |
|-----------|--------|-------|
| Hero section | ✅ Complete | Mesh + text + scroll trigger |
| Problem section | 🔧 In progress | Text reveal working, timing needs polish |
| Portal showcase | ⬜ Not started | — |
| ... | ... | ... |

## Known Issues
- [Issue description] — [Priority: high/medium/low]

## Style Patterns Established
- [Pattern]: [Where it's used] — [Example]
- (So future sessions stay consistent)

## Austin's Preferences (Observed)
- [Preference noted from conversation]
- (Accumulated across sessions)

## File Map (Key Files)
- `src/components/hero/HeroMesh.tsx` — Three.js wireframe mesh
- `src/lib/animations.ts` — Shared Framer Motion variants
- (Updated as files are created)
```

### Update Protocol

**At the START of every session:**
1. Read `.claude/CLAUDE.md` first
2. Read `docs/plan/PLAN.md` for current priorities
3. Check `docs/plan/CHANGELOG.md` for recent history
4. Confirm understanding of where the project stands before writing any code

**At the END of every session:**
1. Update `.claude/CLAUDE.md` with:
   - What was built/changed this session
   - New decisions made
   - Component status changes
   - Any new issues discovered
   - Updated next priorities
2. Append to `docs/plan/CHANGELOG.md`:
   ```
   ## [Date] — Session [N]
   ### Built
   - [What was created]
   ### Changed
   - [What was modified]
   ### Decisions
   - [Any architecture/design decisions]
   ### Next
   - [What should happen next session]
   ```
3. Update `docs/architecture/COMPONENTS.md` if new components were created
4. Update `docs/decisions/DECISIONS.md` if any non-trivial technical choices were made

**If Austin asks "where are we?"** — read CLAUDE.md and give a concise status report.

---

## Build Phases

### Phase 1 — Scaffold + Hero (First Session)
1. Initialize Next.js 14 project with App Router, TypeScript, Tailwind CSS
2. Configure Tailwind with all brand colors and typography from BRAND_DNA.md
3. Set up font loading via `next/font` (Satoshi from Fontshare, DM Sans from Google, Instrument Serif from Google)
4. Build the hero section:
   - Full viewport dark background (#0F2B1E)
   - "Engineered around you." in Instrument Serif, centered
   - Three.js wireframe mesh (icosahedron) with mouse parallax
   - Scroll indicator at bottom
5. Build the scroll-aware nav bar (transparent → blur on scroll)
6. Set up all doc files (CLAUDE.md, PLAN.md, etc.)
7. Deploy to Vercel, connect fieldcraft.digital domain

### Phase 2 — Scroll Sections
1. Problem section — line-by-line text reveal on scroll
2. What We Build section — portal mockup with floating feature labels
3. How It Works section — 3-step process with animated connecting line
4. About section — photo, bio, social links
5. CTA section — final dark screen with contact options

### Phase 3 — The Personalization Proof
1. Interactive demo section
2. Input field for visitor's business name
3. Dynamic portal mockup that updates with visitor's input
4. Fallback cycling demo for no-input state
5. This is the single most important differentiator — take time to make it exceptional

### Phase 4 — Polish + Performance
1. Lighthouse optimization (target: 90+ mobile)
2. `prefers-reduced-motion` for all animations
3. OG meta tags and social sharing preview
4. Analytics setup (Vercel Analytics)
5. SEO basics (sitemap, robots.txt, structured data)
6. Cross-browser testing

### Phase 5 — Case Study + Content
1. Case study section (post-Hamza delivery)
2. Blog/thought leadership integration (future)
3. CMS setup for dynamic content (Notion API or Sanity)

---

## Technical Specifications

### Tailwind Config Extensions
```typescript
// Add to tailwind.config.ts
colors: {
  field: {
    deep: '#0F2B1E',
    verdant: '#1D9E75',
    mint: '#5DCAA5',
    'soft-teal': '#9FE1CB',
    'deep-teal': '#085041',
    parchment: '#F5F1EB',
    obsidian: '#1A1A18',
    gold: '#C8A96E',
    'warm-gray': '#E8E2D8',
  }
},
fontFamily: {
  display: ['Satoshi', 'sans-serif'],
  body: ['DM Sans', 'sans-serif'],
  accent: ['Instrument Serif', 'serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### Animation Constants
```typescript
// src/lib/animations.ts
export const EASE = {
  entrance: [0.16, 1, 0.3, 1],      // smooth deceleration
  standard: [0.4, 0, 0.2, 1],        // material standard
  dramatic: [0.76, 0, 0.24, 1],      // slow start, fast end
} as const;

export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  cinematic: 2.0,
} as const;

export const STAGGER = {
  tight: 0.08,
  normal: 0.15,
  relaxed: 0.25,
} as const;
```

### Three.js Performance Budget
- Hero mesh: < 5ms per frame
- Total Three.js bundle: < 150KB gzipped
- Lazy load after hero text renders
- Fallback: CSS radial gradient animation on low-end devices
- Detection: check `navigator.hardwareConcurrency` and `deviceMemory` API

### Scroll Architecture
```typescript
// Use Framer Motion's useScroll for section-level tracking
// Use GSAP ScrollTrigger for complex pin/scrub animations
// Never mix both on the same element

// Pattern for scroll-linked sections:
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"]
});
```

### Component Naming Convention
- PascalCase for components: `HeroSection.tsx`, `PortalShowcase.tsx`
- camelCase for utilities: `useScrollProgress.ts`, `formatDate.ts`
- kebab-case for CSS modules (if used): `hero-section.module.css`
- ALL section components receive a `className` prop for composition

### Accessibility Requirements
- All interactive elements focusable and keyboard navigable
- `prefers-reduced-motion`: disable all transforms, opacity-only transitions
- Color contrast: 4.5:1 minimum for body text, 3:1 for large text
- Semantic HTML: sections, headings, landmarks
- Alt text for all images
- Skip-to-content link

---

## What NOT to Do

1. **No template energy** — every section should feel custom-crafted. No generic hero patterns, no cookie-cutter card grids, no stock photo aesthetics.
2. **No animation for animation's sake** — every motion communicates meaning (entry, hierarchy, connection). If removing an animation doesn't hurt comprehension, remove it.
3. **No heavy 3D** — Three.js is for the hero mesh only. Everything else uses CSS transforms and Framer Motion. Performance over spectacle.
4. **No placeholder content left behind** — if a section isn't ready, don't show a "Coming Soon" card. Either build it or hide it.
5. **No purple gradients** — this is the most common AI-generated aesthetic. Fieldcraft is greens, golds, and deep darks.
6. **No Inter, Roboto, or system fonts** — Satoshi + DM Sans + Instrument Serif. No exceptions.
7. **No frameworks within frameworks** — no Chakra UI, no Material UI, no component libraries. Tailwind + custom components only.

---

## Success Criteria

The website is successful when:
1. A first-time visitor spends 60+ seconds scrolling through the full page
2. The personalization demo makes them think "how did it do that?"
3. They reach the CTA and feel like contacting Austin is the obvious next step
4. A developer looking at the source code can see it's hand-crafted, not generated
5. Lighthouse mobile score: 90+ performance, 95+ accessibility
6. Austin feels proud sending this link to anyone

---

*This prompt is version 1.0. Update the version number in CLAUDE.md when making changes.*
