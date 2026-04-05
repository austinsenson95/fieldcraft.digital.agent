# Code Conventions — Fieldcraft Digital

## Naming
- Components: PascalCase (`HeroSection.tsx`)
- Hooks: camelCase with `use` prefix (`useScrollProgress.ts`)
- Utils/lib: camelCase (`animations.ts`)
- Types: PascalCase for interfaces/types, camelCase for files
- CSS classes: Tailwind utilities first, custom classes in kebab-case
- API routes: kebab-case (`/api/contact-form`)
- Env vars: SCREAMING_SNAKE_CASE (`CLAUDE_API_KEY`)

## Components
- One component per file (exception: tightly coupled sub-components)
- Default export for page-level components
- Named exports for shared/reusable components
- Props interface defined above the component, named `{Component}Props`

## Imports Order
1. React / Next.js
2. Third-party libraries
3. @fieldcraft/shared
4. @/ internal imports (components, hooks, lib)
5. Relative imports
6. Type imports last

## Animation
- Framer Motion for enter/exit and scroll-linked animations
- GSAP ScrollTrigger only for pin/scrub (complex scroll sequences)
- CSS @keyframes for continuous loops (glow, pulse, float)
- Never mix Framer Motion and GSAP on the same element
- All animations wrapped in prefers-reduced-motion check

## Git
- Commit messages: `type: description` (feat, fix, refactor, docs, style, chore)
- One logical change per commit
- Never commit .env.local or node_modules

## Workspace Layout
- All frontend work: `frontend/src/`
- All backend work: `backend/src/`
- Shared types/constants: `shared/src/`
- All copy editing: `docs/brand/COPY.md`
- Dev server: `npm run dev:frontend` (frontend only) or `npm run dev` (all)
