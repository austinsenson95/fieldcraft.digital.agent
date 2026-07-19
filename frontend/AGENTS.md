# Fieldcraft Digital Frontend — Agent Notes

## Project Overview

This is the main **Fieldcraft Digital** website built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. It also hosts the merged **Agent Swarm Orchestrator** dashboard at the hidden `/dashboard` route.

The dashboard is not linked anywhere in the website UI; it is only accessible by directly navigating to `/dashboard`.

## Tech Stack

- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with CSS variables
- **UI Library:** Custom components + dashboard-specific shadcn/ui primitives
- **Animation:** Framer Motion + GSAP + Three.js / React Three Fiber
- **Auth:** NextAuth v5 (website) + simple client-side password gate (dashboard)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Tables:** @tanstack/react-table
- **State:** Zustand (dashboard sidebar only)

## Project Structure

```
frontend/
├── next.config.ts
├── package.json
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Geist fonts, AuthProvider)
│   │   ├── globals.css             # Website theme tokens
│   │   ├── page.tsx                # Home page
│   │   ├── products/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── brief/page.tsx
│   │   ├── playbook/page.tsx
│   │   ├── showcase/...            # Showcase pages
│   │   ├── api/                    # API routes (brief, contact, subscribe, nextauth)
│   │   └── dashboard/              # Hidden agent dashboard
│   │       ├── layout.tsx          # Dashboard layout wrapper
│   │       ├── dashboard.css       # Scoped dashboard theme tokens + utilities
│   │       ├── page.tsx            # Swarm Control overview
│   │       ├── approvals/page.tsx
│   │       ├── leads/page.tsx
│   │       ├── content/page.tsx
│   │       ├── products/page.tsx
│   │       ├── chat/page.tsx
│   │       ├── logs/page.tsx
│   │       ├── brand/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── layout/Navbar.tsx       # Website nav — NO dashboard link
│   │   ├── layout/Footer.tsx
│   │   ├── sections/...            # Website sections
│   │   ├── hero/...                # Hero / shader components
│   │   ├── auth/...                # NextAuth provider
│   │   └── ui/...                  # Website UI helpers
│   ├── dashboard/                  # Dashboard-only code
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardTopBar.tsx
│   │   │   └── AuthGate.tsx
│   │   ├── components/ui/          # shadcn primitives (button, input, label, separator, switch)
│   │   ├── api/                    # Mock backend: store.ts (in-memory), seed.ts (deterministic data),
│   │   │                           #   client.ts (swap point for real /api/v1 later), client.test.ts
│   │   ├── lib/utils.ts            # cn() helper
│   │   ├── types/index.ts          # Dashboard TypeScript types
│   │   ├── hooks/                  # useApiData.ts (data fetching), use-mobile.ts
│   │   └── store/useSidebarStore.ts
│   ├── content/
│   │   └── links.json              # ALL external links (Gumroad checkout, social, contact, Calendly)
│   └── lib/...                     # Website libs (fonts, auth, data, animations, links.ts, analytics.ts)
└── public/                         # Static assets
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing home |
| `/products` | Products page |
| `/pricing` | Pricing page |
| `/brief` | Book a Field Brief |
| `/playbook` | Playbook page |
| `/showcase/*` | Showcase pages |
| `/dashboard` | **Hidden** Agent Swarm Orchestrator (password: `fieldcraft`) |
| `/dashboard/approvals` | Approval queue |
| `/dashboard/leads` | Lead generation board |
| `/dashboard/content` | Content calendar |
| `/dashboard/products` | Product ideas |
| `/dashboard/chat` | Agent chat |
| `/dashboard/logs` | Agent logs |
| `/dashboard/brand` | Brand memory |
| `/dashboard/settings` | Settings |

## Build & Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # start production server
npm run typecheck # TypeScript check
npm run lint      # ESLint (must exit 0)
npm test          # Vitest unit tests
npm run test:coverage # Vitest with coverage
```

## Dashboard Authentication

The dashboard uses a simple client-side password gate. The password is `fieldcraft`. After entering, `localStorage.setItem('dashboard_auth', 'true')` persists the session.

## Dashboard Data

The dashboard talks **HTTP to `/api/v1`** (Next.js route handlers in `src/app/api/v1/`), backed by a server-side mock service layer in `src/server/dashboard/`:

- `src/server/dashboard/seed.ts` — deterministic seed data (seeded PRNG, fixed dates; never use `Math.random()`/`new Date()` at module scope).
- `src/server/dashboard/store.ts` — module-level singleton in-memory store, guarded on `globalThis` for dev hot-reload. **Ephemeral on serverless** (per-process memory) until Supabase replaces it.
- `src/server/dashboard/service.ts` — all domain logic (leads, approvals, content, products, chat, logs, brand memory, settings); throws `NotFoundError`/`ValidationError`, mapped to 404/400 by `http.ts`.
- `src/server/dashboard/http.ts` — shared route helpers incl. the **auth seam**: `requireSession()` is a no-op today; implement real session checks there once and every route is protected centrally.
- `src/server/dashboard/schemas.ts` — zod schemas for request bodies (400 on invalid input).
- `src/dashboard/api/client.ts` — the typed async client used by every page; a thin `fetch` transport with zero domain logic. **THE cloud swap point**: base URL comes from `NEXT_PUBLIC_DASHBOARD_API_URL` (default `/api/v1`) — point it at the real cloud API and no page changes are needed.
- Pages consume data via `src/dashboard/hooks/useApiData.ts` (`{data, loading, error, refetch}`) and refetch after mutations. Pages must never import from `src/server/**` — only the client.

## Design Tokens

### Website
- `--color-bg-primary`: #0F2B1E
- `--color-accent`: #1D9E75
- `--color-mint`: #5DCAA5
- `--color-text-primary`: #F5F1EB

### Dashboard (scoped override in `dashboard.css`)
- `--color-bg-primary`: #0f1f17
- `--color-bg-secondary`: #162b1f
- `--color-text-accent`: #2ecc7a
- `--color-border-subtle`: rgba(46, 204, 122, 0.1)

## Notes for Agents

- **External links are centralised** in `src/content/links.json` (checkout, social, contact, calendly). Read them via the typed accessor in `src/lib/links.ts` — never hardcode external URLs in components. The Calendly URL can be overridden with `NEXT_PUBLIC_CALENDLY_URL`.
- **Analytics** live in `src/lib/analytics.ts` (`AnalyticsEvents`, `trackEvent`). GA4 only loads when `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set to a real ID; `trackEvent` no-ops safely otherwise. Conversion clicks use `data-event` / `data-product` attributes delegated in `src/components/analytics/GoogleAnalytics.tsx`.
- The website navbar (`src/components/layout/Navbar.tsx`) intentionally does not link to `/dashboard`.
- Dashboard pages are client components (`"use client"`) and use the merged north_star functionality.
- When adding new dashboard routes, update `DashboardSidebar.tsx` and `DashboardTopBar.tsx`.
- The `@` alias resolves to `./src`.
- Do not remove or expose the `/dashboard` route in the website navigation unless explicitly requested.
