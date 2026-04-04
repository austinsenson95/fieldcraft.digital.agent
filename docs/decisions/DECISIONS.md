# Architecture Decision Records

## ADR-001: Tailwind v4 CSS-based configuration
**Date**: 2026-04-04
**Status**: Accepted
**Context**: Next.js 16 ships with Tailwind v4, which uses CSS `@theme` blocks instead of tailwind.config.ts.
**Decision**: Use Tailwind v4's native CSS-based theme configuration in globals.css.
**Consequence**: All brand tokens defined in `@theme inline` block. No tailwind.config.ts file needed.

## ADR-002: Three.js lazy loading strategy
**Date**: 2026-04-04
**Status**: Accepted
**Context**: Three.js adds significant bundle size. Hero text must render first (FCP).
**Decision**: Lazy-load HeroMesh via `next/dynamic` with SSR disabled. Show CSS gradient placeholder during load.
**Consequence**: Hero text renders immediately, 3D mesh loads in background. Low-end devices get CSS-only fallback via `useDeviceCapability` hook.

## ADR-003: Self-hosted Satoshi font
**Date**: 2026-04-04
**Status**: Accepted
**Context**: Satoshi is available from Fontshare but not Google Fonts. Need consistent loading with other fonts.
**Decision**: Download Satoshi woff2 files and use `next/font/local` for self-hosting.
**Consequence**: Font files in `public/fonts/`. Consistent loading behavior with other `next/font` fonts.

## ADR-004: EdgesGeometry for wireframe mesh
**Date**: 2026-04-04
**Status**: Accepted
**Context**: Standard wireframe rendering shows diagonal edges of triangulated faces, which looks messy.
**Decision**: Use `EdgesGeometry` wrapping `IcosahedronGeometry(2.2, 1)` to get clean edge-only wireframe.
**Consequence**: Cleaner geometric look. Rendered as `lineSegments` instead of mesh wireframe.
