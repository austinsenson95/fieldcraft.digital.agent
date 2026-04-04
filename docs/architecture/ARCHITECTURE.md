# Architecture

## Overview
Single-page scroll-driven website built with Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, and selective Three.js.

## Key Patterns

### Rendering
- Static generation (SSG) for the home page
- Three.js components lazy-loaded with `next/dynamic` (SSR disabled)
- CSS gradient fallback for low-end devices

### Styling
- Tailwind v4 with CSS-based `@theme` configuration (not tailwind.config.ts)
- All brand tokens defined in `src/app/globals.css`
- No component libraries — custom components only

### Animation
- Framer Motion for component-level animations and scroll tracking (`useScroll`, `useTransform`)
- GSAP ScrollTrigger reserved for complex pin/scrub animations
- Never mix Framer Motion and GSAP on the same element
- All animations respect `prefers-reduced-motion`

### Fonts
- Self-hosted Satoshi (woff2) via `next/font/local`
- Google fonts (DM Sans, Instrument Serif, JetBrains Mono) via `next/font/google`
- CSS variables set on `<html>`, consumed by Tailwind theme

### Performance Budget
- Lighthouse mobile: 90+ target
- Hero mesh: < 5ms per frame
- Three.js bundle: < 150KB gzipped (lazy-loaded)
- FCP: < 1.5s
