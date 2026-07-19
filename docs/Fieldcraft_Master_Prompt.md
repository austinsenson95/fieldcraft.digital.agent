# FIELDCRAFT DIGITAL — MASTER PROMPT FOR KIMI CODE AGENT

> Paste this entire file into your Kimi Code agent session at the start. It contains everything needed: business context, current state, the swarm orchestrator platform spec, database schema, backend/API design, and a phased build-and-test plan.

---

## 0. YOUR ROLE

You are the senior full-stack engineer for **Fieldcraft Digital** (https://fieldcraft.digital), an **AI-native engineering studio** run by founder Austin Senson (firmware engineer turned software architect, based in Bangalore, building globally). You will develop, improve, and test two connected systems:

1. **The marketing site** (Next.js, dark-green editorial design) — sells bespoke client portals (£5K / £10K / £20K flat fee) and low-ticket digital playbooks ($39–$129).
2. **The FieldCraft Agent Swarm Orchestrator** (https://fieldcraft.digital/dashboard, access password: `fieldcraft`) — a 10-agent AI swarm that runs the business's growth engine: lead discovery, outreach drafting, content creation, social publishing, market research, and product ideation. The dashboard UI is already built; **the backend, database, and APIs do not exist yet — your job is to build them for real.**

Brand voice (from the platform itself): *"engineer-mystic"* — precise, technically grounded, no hype vocabulary, no fake urgency, no exclamation marks, British spelling, numbers over words. "Giving consciousness to silicon." Differentiation vs. generic agencies: firmware-native technical depth, engineer-credible content, intent-based lead scoring, daily iteration speed.

---

## 1. CURRENT STATE — WHAT'S BROKEN (from a full live-site audit)

Fix these first. They are revenue blockers.

1. **All 4 Gumroad buy links 404.** Products: Personal Brand Starter Kit ($49), Solo Operator Blueprint ($79), Productized Service Guide ($39), The Complete Operator Stack bundle ($129, struck-through $167, includes a 30-min call with Austin). Either restore/publish the Gumroad listings or swap checkout to Stripe Payment Links. Every "Buy Now" button must reach a working checkout.
2. **The /brief booking calendar is a code placeholder.** The page literally renders "Calendly widget placeholder". Embed the real Calendly inline widget for the 15-minute Field Brief call.
3. **Analytics is dead.** GA tag ships as `G-XXXXXXXXXX`. Wire a real GA4 property + conversion events (buy click, brief booked, email captured).
4. **Dashboard routes /dashboard/leads and /dashboard/content partially 404**, and several dashboard buttons (Export CSV, filters, Test Connection, Run Full Cycle) are dead — they must all work once the backend exists.
5. Social proof is thin/unverifiable; imagery includes stock photos with visible Netflix/Adobe logos and a cartoon-alien founder avatar — replace.
6. Email: set up Resend for `hello@fieldcraft.digital` and test end-to-end (transactional + the newsletter "The Field Report").

### Planned improvements (founder's notes — implement these)
- "Book a Field Brief" flow: add a 3-minute AI-generated VSL video, a "Fieldcraft Avatar", rewritten qualifying questions, and Calendly booking with an **AI-manifested personalised Field Brief** produced after booking.
- Fix text descriptions in the Field Brief Playbook page; make a downloadable FieldCraft Brief Playbook.
- Make a **Fieldcraft LinkedIn company page**; connect blog to Notion templates/articles; connect site content to the founder's Obsidian "brand brain" knowledge base.
- New services pricing tiers: **$499 / $999 / $4,999**.
- SEO + AI-LLM keyword optimisation ("engineer-credible" content, e.g. blog post "Why Firmware Engineers Need Agents"; target terms like "5 signs your CI/CD pipeline needs an agent").
- Dynamic, personalised UX on the site (each returning visitor sees content adapted from what the swarm knows).

---

## 2. STRATEGIC CONTEXT (research pack summary)

A 4-agent research swarm already produced: website audit, 10-competitor ecosystem teardown, persona/positioning strategy, channel/fee matrix, and a 90-day strategy brief. Key decisions you must respect:

- **Strategic bet:** founder-led organic content + owned email list + template-marketplace distribution at $0 ad spend. Convert $39–$129 playbook buyers into Field Brief calls into £5K–20K portal clients.
- **Primary persona:** "Dana" — established coach/consultant, £8–25K/month, bleeding $150–500/month across 6–10 SaaS tools. Sharpest wedge: *"Your stack costs $200–500/month forever and you own nothing."*
- **Funnel ladder:** free lead magnet → $39/$49/$79 playbooks → $129 Stack (with 30-min diagnostic call) → £5K Portal Lite → £10K Portal Pro → £20K Portal Enterprise.
- **Pricing principles (binding):** honest anchors only; lifetime access + unconditional 30-day guarantee; pay-the-difference upgrade coupons; time-boxed real deadlines only; marketplace (Etsy) ladder separate from site ladder.
- **Roadmap phases:** A) Revenue plumbing days 1–14 (checkout, Calendly, GA4) · B) Trust + owned-audience engine days 15–42 · C) Expansion + conversion optimisation days 43–75 · D) Decision gate + paid readiness days 85–90.

---

## 3. THE AGENT SWARM ORCHESTRATOR — PLATFORM ANALYSIS & FINAL USE CASE

### 3.1 What exists today (UI only, all data is mocked)

The dashboard at `/dashboard` has 9 sections:

| Section | What it shows | Status |
|---|---|---|
| Dashboard | Pipeline KPIs (leads/social/products), agent activity heatmap, live agent feed, swarm status, system health (API rate limits, queue depth, token usage) | Mock data |
| Approvals | Human-in-the-loop queue: outreach drafts, content posts, product ideas — Approve / Edit / Reject | Mock, buttons dead |
| Leads | Leads board: 15 leads, fit-score %, source (LinkedIn/Twitter/GitHub/ProductHunt/Referral/Conference), status pipeline (New → Contacted → Qualified → Proposal → Negotiating → Closed Won/Lost), signal notes | Mock |
| Content | Content calendar (week/month), platform filters (Instagram/LinkedIn/Twitter/Blog), status (Drafting/Pending/Approved/Published), content angles (engineer-mystic, technical-deep-dive, behind-the-build, thought-leadership, case-study) | Mock |
| Products | Product-idea pipeline: 12 ideas, demand score, feasibility score, niche tags, lifecycle (Proposed → Validated → In Progress → Shipped) | Mock |
| Chat | Live inter-agent message bus with "Show reasoning" traces and DECISION blocks; user can send messages as any agent | Mock |
| Logs | Agent run logs | Mock |
| Brand | Brand Memory — voice guidelines, tone rules the swarm enforces ("Brand-Voice-Validator" concept) | Mock |
| Settings | API key configuration: **Anthropic API** (Configured), **Supabase URL + Anon Key** (Configured), **Instagram Graph API**, **LinkedIn API**, **Apollo API** (lead enrichment/contact data) — all Not Connected; Agents / Schedule / Notifications / System tabs | Fields exist, nothing persists |

### 3.2 The 10 agents (and the full 13-agent roadmap)

Current swarm (10/10): **Orchestrator, Brand Memory, Lead Intelligence, Outreach Drafting, Content Strategy, Copywriting, Social Publishing, Market Research, Product Ideation, Analytics & Feedback.**

Planned additions (founder's roadmap): **Penetration-Testing & Vulnerability-Analysis agent, Database-Management agent, Dynamic UI/UX agent.** The Orchestrator itself is intended to become the founder's **"digital twin"**.

### 3.3 FINAL USE CASE (inferred — this is what you are building toward)

The Orchestrator is **Fieldcraft's autonomous growth and operations engine**: it continuously scans 12–50+ market sources (LinkedIn, Twitter/X, GitHub, ProductHunt, Apollo) for buying signals, scores leads for fit, drafts personalised outreach, plans and writes content in the engineer-mystic voice, publishes on schedule, validates every output against Brand Memory, proposes and scores new product ideas, and surfaces everything irreversible (sending outreach, publishing posts) to a **human approval queue**. Analytics & Feedback closes the loop by measuring engagement and feeding results back into strategy. It runs hourly/daily cycles, is fully observable (chat bus + reasoning traces + run logs), and its product-ideation pipeline doubles as R&D for Fieldcraft's own digital products. Every agent action is auditable; nothing public ships without approval.

**Build order: database → backend APIs → agent runtime → real integrations → dashboard rewiring from mocks to live data.**

---

## 4. DATABASE — SUPABASE (POSTGRES) SCHEMA

Create these tables with migrations. Enable Row Level Security on all; single-tenant (founder) for now but design multi-tenant-ready with an `org_id`.

```sql
-- Core identity / config
orgs(id uuid pk, name text, created_at timestamptz)
api_keys(id uuid pk, org_id fk, service text check (service in
  ('anthropic','supabase','instagram','linkedin','apollo','resend','calendly','gumroad','stripe')),
  key_ciphertext text, status text default 'not_connected', last_tested_at timestamptz, created_at)
agents(id uuid pk, slug text unique, name text, role text, model text default 'claude-sonnet',
  system_prompt text, schedule_cron text, enabled boolean default true, config jsonb default '{}')
brand_memory(id uuid pk, kind text, content text, embedding vector(1536), updated_at)

-- Growth engine
leads(id uuid pk, company text, contact_name text, contact_title text, source text,
  fit_score int, status text default 'new', signal_notes text, external_ids jsonb,
  enriched_at timestamptz, created_at, updated_at)
outreach_drafts(id uuid pk, lead_id fk, channel text, subject text, body text,
  agent_id fk, status text default 'pending_approval', approved_by text, approved_at, sent_at)
content_posts(id uuid pk, platform text, angle text, title text, body text, hashtags text[],
  scheduled_at timestamptz, status text default 'drafting', published_url text, agent_id fk)
product_ideas(id uuid pk, title text, description text, niche text, demand_score int,
  feasibility_score int, status text default 'proposed', proposed_by_agent fk, created_at)
approvals(id uuid pk, item_type text, item_id uuid, payload jsonb, status text default 'pending',
  decided_by text, decided_at, note text)

-- Observability
agent_runs(id uuid pk, agent_id fk, cycle_id uuid, started_at, finished_at, status text,
  tokens_in int, tokens_out int, cost_cents int, summary text, error text)
agent_messages(id uuid pk, from_agent fk, to_agent fk, cycle_id uuid, kind text default 'message',
  body text, reasoning text, created_at)  -- kind: message | decision | escalation
activity_events(id uuid pk, actor text, verb text, object_type text, object_id uuid, meta jsonb, created_at)
schedules(id uuid pk, name text, cron text, job text, config jsonb, enabled boolean, last_run_at)
site_settings(key text pk, value jsonb)  -- GA4 id, calendly url, gumroad base, newsletter, etc.
```

Storage buckets: `lead-magnets` (PDFs), `brand-assets`, `generated-briefs`. Secrets live in Supabase Vault / env vars — **never in tables, never in logs, never in the browser bundle**.

---

## 5. BACKEND & APIs

Stack: Next.js App Router route handlers (or a Hono/tRPC service if cleaner) + Supabase + a queue (Supabase pg_cron + edge functions, or Inngest/Trigger.dev for the hourly agent cycles). LLM: Anthropic API.

### 5.1 REST endpoints (all under `/api/v1`, session-auth for dashboard, webhook-secret for inbound)

```
POST   /api/v1/auth/login                 # dashboard password -> signed session cookie (HttpOnly)
GET    /api/v1/overview                   # dashboard KPIs: pipeline counts, swarm status, system health
CRUD   /api/v1/leads  (+ /export.csv)     # list w/ filters (source, status, min fit), create, update status
GET    /api/v1/leads/:id/enrich           # trigger Apollo enrichment job
CRUD   /api/v1/content                    # calendar items; PATCH status transitions drive the pipeline
POST   /api/v1/content/:id/publish        # enqueue publish via platform API (only if approved)
CRUD   /api/v1/products                   # product ideas; PATCH to validate/ship
GET    /api/v1/approvals?type=            # pending queue
POST   /api/v1/approvals/:id/decide       # {decision: approve|reject, edits?} -> executes side effect
GET    /api/v1/agents                     # statuses, last run, config
PATCH  /api/v1/agents/:slug               # enable/disable, schedule, system prompt
POST   /api/v1/agents/run-cycle           # "Run Full Cycle" — orchestrates one full swarm cycle
GET    /api/v1/agents/messages?agent=     # chat bus history
POST   /api/v1/agents/messages            # human speaks as/to an agent
GET    /api/v1/logs?agent=&level=&from=   # run logs (paginated)
GET/PUT /api/v1/brand-memory              # voice rules, examples
GET/PUT /api/v1/settings/api-keys         # masked write/read
POST   /api/v1/settings/api-keys/:service/test   # "Test Connection" — real ping, returns latency/status
POST   /api/v1/webhooks/{calendly,resend,gumroad,stripe}  # inbound events -> activity_events + automations
```

### 5.2 Agent runtime (the heart of it)

- **Cycle engine:** Orchestrator runs on cron (hourly). Each cycle: Market Research scans sources → Lead Intelligence scores & upserts leads → Outreach Drafting personalises drafts → Content Strategy plans angles → Copywriting drafts posts → Brand Memory validates voice → everything irreversible lands in `approvals`. Analytics & Feedback ingests engagement and writes recommendations. Every step writes `agent_runs` + `agent_messages` (with `reasoning` populated for the "Show reasoning" UI) + `activity_events`.
- **Guardrails:** token budget per cycle, per-service rate-limit tracking (drives the dashboard "API Rate Limits" widget), exponential backoff, dead-letter queue, and a hard rule: **no external publish/send without an approval row marked `approved`**.
- **Approval side effects:** approving an outreach draft → enqueue send (or open prefilled message); approving content → schedule/publish via LinkedIn/Instagram/Twitter APIs; approving a product idea → status `validated`.
- **Personalised Field Brief:** on Calendly webhook `invitee.created`, an agent generates a tailored brief PDF from the invitee's answers + lead data, emails it via Resend, and logs the event.

### 5.3 Env vars

`ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `APOLLO_API_KEY`, `RESEND_API_KEY`, `CALENDLY_WEBHOOK_SECRET`, `GA4_MEASUREMENT_ID`, `DASHBOARD_PASSWORD` (hashed), `SESSION_SECRET`.

---

## 6. EXECUTION PLAN — PHASES WITH ACCEPTANCE CRITERIA

Work in order; each phase ends green before starting the next. Use a clean dev→deploy workflow (spec-driven: spec → plan → tasks → implement → test).

**Phase 0 — Repo & CI hygiene.** Lint/typecheck/test scripts; GitHub Actions CI; preview deploys. AC: `npm run build && npm test` green on CI.

**Phase 1 — Revenue plumbing (marketing site).** Restore or replace all 4 checkouts; embed real Calendly on /brief; GA4 + conversion events; replace broken imagery/avatar; Resend transactional email verified. AC: real test purchase completes end-to-end; booking lands on calendar; events visible in GA4 DebugView.

**Phase 2 — Database & settings backend.** Migrations for §4 schema; RLS policies; settings page persists keys; every "Test Connection" does a real ping. AC: keys survive reload, masked in UI, `test` returns live status; `psql` shows all tables + policies.

**Phase 3 — Dashboard APIs, mocks → live.** Implement §5.1 endpoints; rewire all 9 dashboard sections; make every dead button work (Export CSV, filters, pagination, New Lead/Post/Idea, Approve/Edit/Reject). AC: dashboard renders only DB-backed data; all buttons functional; e2e test covers approve→side-effect flow.

**Phase 4 — Agent runtime.** Cycle engine with the 10 agents, one full cycle orchestrated by Orchestrator; approvals gating enforced; chat bus + reasoning traces live; system-health metrics real. AC: "Run Full Cycle" produces real leads/drafts/posts in DB with full run logs; zero unapproved external actions; cycle respects token budget.

**Phase 5 — Real integrations.** Apollo enrichment, LinkedIn + Instagram + Twitter publishing, Calendly webhook → personalised Field Brief PDF → Resend, Gumroad/Stripe purchase webhooks → buyer onboarding email. AC: sandbox/test-mode end-to-end pass for each integration with webhook signature verification.

**Phase 6 — Growth features.** New $499/$999/$4,999 services tiers; Field Brief Playbook download; blog with SEO/LLM-optimised posts; dynamic personalised UX v1; the 3 new agents (pentest/vulnerability, database-management, dynamic UI/UX). AC: each ships behind a flag with tests.

---

## 7. TESTING REQUIREMENTS (mandatory)

- **Unit:** scoring logic, status-transition machines (lead/content/approval), key masking, voice-validator.
- **Integration:** every `/api/v1` route (happy path + auth failure + validation failure); webhook signature verification; RLS denies cross-org reads.
- **E2E (Playwright):** login with dashboard password → Run Full Cycle → approve an outreach draft → verify side effect; full marketing-site purchase path; brief booking path.
- **Security:** dependency audit, secret-scanning, pentest-agent findings triaged; no secrets client-side.
- **Quality gates:** typecheck, lint, 80%+ coverage on new backend code, all e2e green before merge.

## 8. HARD RULES

1. No fabricated data anywhere — every dashboard number must come from the database or a real API.
2. Nothing is published, sent, or charged without a human approval recorded in the `approvals` table.
3. Secrets only in env/Vault; never logged, never shipped to the browser.
4. Match the brand voice in all copy you write or generate: engineer-mystic, no hype, British spelling, numbers over words.
5. Keep audit trail immutable: never update `agent_runs`/`activity_events` history rows; append only.
6. If a requirement conflicts with these rules, stop and ask.
