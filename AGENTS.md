<!-- From: /Users/austinsenson/Work/03-Web-Apps/fieldcraft.digital/AGENTS.md -->
# AGENTS.md — Fieldcraft Digital

> This file is intended for AI coding agents. It assumes zero prior knowledge of the project.

---

## Project Overview

**Fieldcraft Digital** is the public website and operating system for a bespoke software portal studio. The site is a single-page, scroll-driven marketing experience built with Next.js 16, Tailwind CSS v4, Framer Motion, GSAP, and selective Three.js. It also includes an auth-gated digital products shop, a contact form, and video hero showcase pages.

The project is structured as an **npm workspace monorepo** with three packages:

- `frontend` — Next.js 16 website (primary deliverable)
- `backend` — Hono API server (scaffolded, only the health check route is active)
- `shared` — TypeScript types, constants, and Zod schemas shared across both

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5.9 |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | ^12.38 |
| Scroll Animation | GSAP | ^3.14 |
| 3D | Three.js + @react-three/fiber + drei | ^0.183 / ^9.5 / ^10.7 |
| Backend Framework | Hono | ^4.0 |
| Backend Runtime | Node.js (via `@hono/node-server`) | — |
| Database | PostgreSQL (via Prisma) | 7.8 |
| Auth | Next-Auth v5 (beta) + Prisma Adapter | ^5.0.0-beta.31 |
| Email | Resend | ^6.12 |
| Payments | Stripe JS (client-side only) | ^9.4 |
| Hosting | Vercel | — |
| Package Manager | npm workspaces | — |
| Node | v22+ | — |

### Important Implementation Notes

- **Prisma client is currently a mock.** `frontend/src/lib/prisma.ts` exports a mock implementation so the app can build without a live database. The real Prisma schema exists at `frontend/prisma/schema.prisma`, but registration and login do not yet persist to or read from a real database.
- **Middleware is permissive.** `frontend/src/middleware.ts` matches `/products/:path*` and `/api/contact` but currently returns `NextResponse.next()` for all requests. Auth gating is implemented at the component level via `LoginGate`.
- **Backend routes are mostly planned.** Only `GET /health` is active. `POST /contact` and `POST /personalize` are commented out and the route files do not exist.
- **Zod versions differ.** Frontend uses `zod@^4.4.1`; backend and shared use `zod@^3.22.0`.

---

## Monorepo Structure

```
fieldcraft.digital/
├── frontend/           # Next.js 16 website
│   ├── src/app/        # App Router pages + API routes
│   ├── src/components/ # React components
│   ├── src/lib/        # Utilities, hooks, animation configs
│   ├── prisma/         # Prisma schema
│   └── public/         # Static assets (videos, images, favicons, fonts)
├── backend/            # Hono API server
│   └── src/index.ts    # Server entry point (health check + CORS)
├── shared/             # Shared TypeScript package
│   └── src/            # Types (api.ts, content.ts) + brand constants (brand.ts)
├── docs/               # Living documentation
│   ├── architecture/   # API.md, ARCHITECTURE.md, COMPONENTS.md, STACK.md
│   ├── brand/          # BRAND_DNA.md, COPY.md
│   ├── decisions/      # DECISIONS.md (ADRs)
│   └── plan/           # PLAN.md, ROADMAP.md, CHANGELOG.md
├── scripts/            # Dev helpers (dev.sh)
├── .claude/            # Agent prompts and conventions
├── docker-compose.yml  # Local PostgreSQL
└── vercel.json         # Vercel deployment config
```

---

## Build and Development Commands

All commands run from the repo root unless noted.

```bash
# Start frontend only (most common during development)
npm run dev:frontend

# Start both frontend and backend concurrently
npm run dev

# Production build (shared → frontend)
npm run build

# Lint frontend and backend
npm run lint

# Clean build artifacts and node_modules
npm run clean
```

### Frontend-specific commands (run from `frontend/`)

```bash
npm run dev              # Next.js dev server (port 3000)
npm run build            # next build
npm run start            # next start
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run db:generate      # prisma generate
npm run db:migrate       # prisma migrate dev
npm run db:studio        # prisma studio
npm run db:push          # prisma db push
```

### Backend-specific commands (run from `backend/`)

```bash
npm run dev              # tsx watch src/index.ts (port 3001)
npm run build            # tsc
npm run start            # node dist/index.js
```

### Shared-specific commands (run from `shared/`)

```bash
npm run build            # tsc --noEmit
npm run typecheck        # tsc --noEmit
```

---

## Code Organization

### Frontend (`frontend/src/`)

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages, layouts, and API route handlers |
| `app/api/` | API routes: `/api/contact`, `/api/register`, `/api/auth/[...nextauth]` |
| `app/login/` | Custom sign-in page |
| `app/register/` | Custom registration page |
| `app/products/` | Digital products listing page |
| `app/showcase/` | Video hero showcase theme pages |
| `components/auth/` | AuthProvider, LoginGate |
| `components/hero/` | HeroSection, ShaderBackground, GenerativeField |
| `components/interactive/` | PortalMockup (reusable coded portal UI) |
| `components/layout/` | Navbar, Footer |
| `components/sections/` | Page sections: Philosophy, Features, Process, CaseStudy, Shop, About, CTA |
| `components/showcase/` | VideoHero component used by showcase theme pages |
| `components/three/` | HeroMesh (Three.js wireframe icosahedron) |
| `components/ui/` | ScrollReveal, AnimatedSection |
| `lib/` | animations.ts, auth.ts, data.ts, fonts.ts, prisma.ts, products.ts, shaders.ts, hooks |
| `types/next-auth.d.ts` | Next-Auth session/user type extensions |

### Backend (`backend/src/`)

| File | Purpose |
|------|---------|
| `index.ts` | Hono app setup, CORS, health check (`GET /health`) |

Planned routes (commented out):

- `POST /contact` — Contact form handling
- `POST /personalize` — Personalization demo

### Shared (`shared/src/`)

| File | Purpose |
|------|---------|
| `types/api.ts` | ContactRequest, ContactResponse, PersonalizeRequest, PersonalizeResponse, PortalConfig |
| `types/content.ts` | CaseStudy, ProcessStep, SocialLink |
| `constants/brand.ts` | BRAND object (name, domain, emails, socials) and COLORS |
| `index.ts` | Re-exports all shared exports |

---

## Code Style and Conventions

The project follows the conventions documented in `.claude/CONVENTIONS.md`.

### Naming

- **Components**: PascalCase (`HeroSection.tsx`)
- **Hooks**: camelCase with `use` prefix (`useReducedMotion.ts`)
- **Utils/lib**: camelCase (`animations.ts`)
- **Types**: PascalCase for interfaces/types, camelCase for files
- **CSS classes**: Tailwind utilities first; custom classes in kebab-case
- **API routes**: kebab-case (`/api/contact-form`)
- **Env vars**: SCREAMING_SNAKE_CASE (`RESEND_API_KEY`)

### Components

- One component per file (exception: tightly coupled sub-components)
- Default export for page-level components
- Named exports for shared/reusable components
- Props interface defined above the component, named `{Component}Props`

### Import Order

1. React / Next.js
2. Third-party libraries
3. `@fieldcraft/shared`
4. `@/` internal imports (components, hooks, lib)
5. Relative imports
6. Type imports last

### Git

- Commit messages: `type: description` (feat, fix, refactor, docs, style, chore)
- One logical change per commit
- Never commit `.env.local` or `node_modules`

---

## Database and ORM

- **Database**: PostgreSQL
- **ORM**: Prisma 7.8 with `@prisma/client`
- **Schema location**: `frontend/prisma/schema.prisma`
- **Models**: User, Account, Session, VerificationToken (standard Next-Auth + custom password field)
- **Local database**: Start with `docker compose up -d` (PostgreSQL 16 on port 5432)
- **Connection**: `DATABASE_URL` in `.env.local`

The Prisma schema is defined, but the runtime client at `frontend/src/lib/prisma.ts` is currently a mock for build compatibility. To use a real database:

1. Set `DATABASE_URL` in `.env.local`
2. Replace `frontend/src/lib/prisma.ts` with the standard Prisma singleton:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Authentication and Authorization

- **Library**: Next-Auth v5 (beta) with PrismaAdapter
- **Provider**: CredentialsProvider only (email + password)
- **Session strategy**: JWT
- **Password hashing**: bcryptjs with 12 rounds
- **Custom pages**: `/login` and `/register`
- **Middleware**: `frontend/src/middleware.ts` is currently permissive and does not enforce authentication
- **Component-level gating**: `LoginGate` wraps gated actions (e.g., "Buy Now" in `ShopSection`). Unauthenticated users see an auth prompt modal; authenticated users see the real action.
- **Auto-login after registration**: The register API creates the user; the client then calls `signIn("credentials")` and redirects.

### Protected Resources

- `/products` is matched by middleware but not enforced
- `/api/contact` is matched by middleware but not enforced
- Shop CTAs use `LoginGate` for the actual auth check

---

## API Routes

### Frontend (Next.js `/api`)

| Route | Method | Auth Required | Description |
|-------|--------|---------------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | No | Next-Auth handler |
| `/api/contact` | POST | No (middleware matched but permissive) | Sends contact email via Resend; rate-limited (5/hr); has honeypot |
| `/api/register` | POST | No | Creates user with bcrypt password (uses mock Prisma client) |

### Backend (Hono)

| Route | Method | Description |
|-------|--------|-------------|
| `/health` | GET | Health check returning `{ status, uptime }` |

---

## Animation and Performance Guidelines

### Animation Stack Rules

- **Framer Motion**: For component enter/exit animations and scroll-linked effects (`useScroll`, `useTransform`, `whileInView`)
- **GSAP ScrollTrigger**: Reserved exclusively for complex pin/scrub sequences
- **CSS @keyframes**: For continuous loops (glow, pulse, float)
- **Never mix Framer Motion and GSAP on the same element**

### Performance Budget

- Lighthouse mobile: 90+ target
- Three.js bundle: < 150KB gzipped (lazy-loaded)
- FCP: < 1.5s

### Three.js Pattern

- Lazy-load via `next/dynamic` with `ssr: false`
- Use `useDeviceCapability` hook to detect low-end devices (≤2 cores or ≤2GB RAM) and skip 3D
- CSS gradient fallback for low-end devices

### Reduced Motion

- CSS `prefers-reduced-motion` in `globals.css` zeroes out all transitions and animations
- `useReducedMotion` hook (via `useSyncExternalStore`) for JS-level checks
- Framer Motion's built-in `useReducedMotion` is also used in showcase components
- Video components respect reduced motion by pausing and not autoplaying

---

## Testing Strategy

**There is currently no test framework installed and no test suite.** If you add tests, the recommended stack for this project would be:

- **Unit tests**: Vitest or Jest
- **Component tests**: React Testing Library
- **E2E tests**: Playwright

Place tests adjacent to the files they test or in a `__tests__` directory.

---

## Deployment

### Frontend (Vercel)

- Configured in `vercel.json` at repo root
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `frontend/.next`
- Framework: `nextjs`

### Backend

- The backend is **not currently deployed**. It runs locally on port 3001 during development.

### Database

- Local: `docker compose up -d` spins up PostgreSQL 16 on port 5432
- Production: Requires a hosted PostgreSQL instance and `DATABASE_URL` env var

---

## Security Considerations

- **Environment variables**: Never commit `.env.local`. Use `.env.example` as a template.
- **Auth secrets**: `NEXTAUTH_SECRET` must be set in production.
- **Contact form**: Implements in-memory IP rate limiting (5 requests per IP per hour), a honeypot field (`company`), and Zod input validation.
- **Passwords**: Hashed with bcryptjs (12 rounds). Never store or log plain text.
- **CORS**: Backend CORS origin is configurable via `CORS_ORIGIN` env var.
- **Prisma queries**: Use parameterized queries via Prisma client; do not concatenate raw SQL.
- **Stripe links**: Digital product checkout links are external Stripe URLs (currently placeholder/test links).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Note that the checked-in `.env.example` files are incomplete: they do not list `DATABASE_URL`, `NEXTAUTH_URL`, or `NEXTAUTH_SECRET`, all of which are required once the real Prisma client is wired up.

```bash
# App
NEXT_PUBLIC_SITE_URL=https://fieldcraft.digital
NEXT_PUBLIC_SITE_NAME="Fieldcraft Digital"

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fieldcraft"

# Next-Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=              # Generate with: openssl rand -base64 32

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=hello@fieldcraft.digital
EMAIL_TO=austin@fieldcraft.digital

# AI (Phase 3 — personalization demo)
ANTHROPIC_API_KEY=

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=

# Backend
BACKEND_PORT=3001
CORS_ORIGIN=http://localhost:3000
```

Frontend-specific env vars used by `api/contact`:

```bash
RESEND_API_KEY=
CONTACT_EMAIL_TO=hello@fieldcraft.digital
CONTACT_EMAIL_FROM=noreply@fieldcraft.digital
```

---

## Brand and Design Tokens

All design tokens live in `frontend/src/app/globals.css` inside the `@theme inline` block.

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | #0F2B1E | Primary dark background |
| `bg-secondary` | #143326 | Secondary background |
| `text-primary` | #F5F1EB | Primary text (warm parchment) |
| `text-secondary` | rgba(245,241,235,0.70) | Secondary text |
| `accent` | #1D9E75 | Primary accent / CTAs |
| `accent-hover` | #5DCAA5 | Hover state |

### Legacy Brand Colors

Also available as Tailwind classes: `field-deep`, `field-verdant`, `field-mint`, `field-soft-teal`, `field-deep-teal`, `field-parchment`, `field-obsidian`, `field-gold`, `field-warm-gray`.

### Typography

- **Display / Body**: Geist Sans (via `geist` package)
- **Mono**: Geist Mono (via `geist` package)
- Font variables are set on `<html>` and consumed by Tailwind theme.

---

## Key Patterns and Decisions

1. **Tailwind v4 CSS-based config**: All tokens are defined in `globals.css` via `@theme inline`. There is no `tailwind.config.ts`.
2. **Three.js lazy loading**: Hero shader is loaded with `next/dynamic` and `ssr: false`. Low-end devices get CSS gradient fallbacks.
3. **Video heroes**: The main hero and showcase pages use `<video>` backgrounds with IntersectionObserver and Page Visibility API to pause off-screen/hidden videos for performance.
4. **Monorepo boundary**: `shared/` contains only pure TypeScript (no React, no Node-specific APIs). Both frontend and backend import from `@fieldcraft/shared`.
5. **Prisma in frontend**: Because Next.js API routes run on the server, Prisma lives in the frontend package. The backend does not currently use Prisma.
6. **No component UI library**: All UI is custom-built. Inline SVGs are used for icons.
7. **Static content**: Products and case studies are hardcoded in `frontend/src/lib/products.ts` and `frontend/src/lib/data.ts`, not fetched from a CMS.

---

## Getting Started (Quickstart)

```bash
# 1. Install dependencies
npm install

# 2. Start local PostgreSQL
docker compose up -d

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local — at minimum set DATABASE_URL and NEXTAUTH_SECRET

# 4. Generate Prisma client and push schema
npm run db:generate -w frontend
npm run db:push -w frontend

# 5. Wire up the real Prisma client
# Replace frontend/src/lib/prisma.ts with a real PrismaClient singleton

# 6. Start development
npm run dev:frontend
```

The frontend will be available at `http://localhost:3000`. The backend (if started with `npm run dev`) runs at `http://localhost:3001`.
