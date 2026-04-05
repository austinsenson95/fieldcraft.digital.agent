# API Routes — Fieldcraft Digital

## Frontend API Routes (Next.js /api)

### POST /api/contact
- Purpose: Handle contact form submissions
- Body: `{ name, email, message }`
- Response: `{ success: boolean, message: string }`
- Side effects: Sends email notification to austin@fieldcraft.digital

### POST /api/personalize (Phase 3)
- Purpose: Generate personalized portal preview data
- Body: `{ businessName, industry?, colorPreference? }`
- Response: `{ portalConfig: { name, colors, prompts, layout } }`
- Side effects: None (stateless)

## Backend API Routes (Hono — Phase 3+)

### GET /health
- Purpose: Health check
- Response: `{ status: "ok", uptime }`

### POST /analytics/event (Phase 4)
- Purpose: Track custom analytics events
- Body: `{ event, properties, timestamp }`
- Auth: API key

## Shared Types
All request/response types live in `shared/src/types/api.ts` and are imported by
both `@fieldcraft/frontend` and `@fieldcraft/backend`.
