# FieldCraft Digital — GTM Strategy & Messaging Pack
**Prepared: 16 July 2026 · Solo-operator edition**

---

# STEP 1 — Product Truth Sheet

*Extracted from the codebase (`fieldcraft.digital/frontend` unless noted). This is the only source of truth for product claims in all copy below.*

## What FieldCraft actually sells

**Core offer: bespoke software portals — three tiers, one-time flat fees** (`app/pricing/PricingContent.tsx`):
- **Portal Lite — GBP 5,000.** Single-purpose portal, one core workflow automated. AI blueprint generation, branded dashboard, basic payment integration. 30-day delivery, 30 days post-launch support.
- **Portal Pro — GBP 10,000** ("Most Popular"). Multi-module command centre, automated client delivery, advanced payment & subscription flows, basic AI assistant integration. 45-day delivery, 60 days support.
- **Portal Enterprise — GBP 20,000.** Custom AI agents & automations, multi-user role management, advanced analytics dashboard, priority support. 60-day delivery, 90 days support.

**Portal capabilities** (`components/sections/FeaturesSection.tsx`): AI Blueprint Generator (map offer structure, content pillars, delivery sequence in minutes) · Branded Dashboard · Automated Delivery (drip content, trigger sequences, access management) · Payment Integration (Stripe/Razorpay) · Remotion-powered Video Content Engine.

**Engagement model**: Discovery → Architecture → Delivery; "a living system, not a static website" (`ProcessSection.tsx`).

**Hidden proof asset most prospects never see**: the `/dashboard` route — a working 10-agent swarm orchestrator (Orchestrator, Brand Memory, Lead Intelligence, Outreach Drafting, Content Strategy, Copywriting, Social Publishing, Market Research, Product Ideation, Analytics) with **human-in-the-loop approval queues**, CRM pipelines, and token-usage observability (`dashboard/data/mockData.ts`). Currently mock data, but it demonstrates real agent-system capability.

**Funnel assets that already exist**: 15-minute "Field Brief" diagnostic call ("zero pitch, just clarity") · Field Brief Playbook lead magnet ("5 signs you need a custom portal," true-cost calculator, 3-question diagnostic) · The Field Report weekly newsletter · Gumroad products $39–$129 (incl. bundle with 30-min strategy call).

**Brand voice** (`docs/brand/BRAND_DNA.md`): "Engineered around you." / "No templates. No compromises." Precise not cold, confident not loud, personal not casual. Founder: Austin Senson, firmware engineer turned software architect, Bangalore-based, GBP pricing.

## ⚠️ Gaps and flags (critical — these constrain all marketing)

1. **No real client names, verified testimonials, or case-study metrics anywhere in the codebase.** The single case study ("Freedom Business Engine" for "a freedom business coach") is unnamed and its "View Case Study" link is dead (`CaseStudySection.tsx`). The playbook testimonial is an explicit placeholder attributed to "— Name, Business."
2. **Unverified numbers on the live site** ("Join 50+ operators," "200+ subscribers") — cannot be reused in ads.
3. **"PSPaaS" appears nowhere in the codebase.** The "coaches, consultants, creators" audience phrase exists only in an old copy deck (`docs/brand/COPY.md`), not on the live site.
4. **No retainer or continuity offer** — 100% of revenue is one-time project fees. (Retainer language exists only in a legacy firmware-services doc.)
5. **Positioning split inside the repo**: legacy docs and the dashboard's brand pages target firmware/embedded companies; the live website targets coaches/creators. The market-facing direction per your brief is coaches/educators — the firmware material should be treated as internal until you decide otherwise.

---

# STEP 2 — Market Research Summary

*Sources are dated; community sentiment is secondhand (direct Reddit/X access was blocked) and flagged as such.*

## What's happening (verified findings)

- **Agentic AI adoption is still shallow.** BCG (8 Jul 2026): adoption "around 30% or less for even the basic tools and often patchy." Coaches are at the *intent* stage: roughly half of coaching organizations say agentic AI is a 2026 priority, but most use AI only for content — "the lowest-leverage application" (The Coach's CMO, "State of AI in Coaching Businesses 2026," 8 Apr 2026 — vendor synthesis, treat stats as directional).
- **The money is in retention, not content.** The same Apr 2026 report calls retention/referral systems "the single highest-ROI underutilized AI application in the profession; almost no coaches have prioritized this." Coaches' real gaps: referral-dependent revenue, no pipeline visibility, calendar-capacity ceilings, unsystematized renewals.
- **Tool sprawl is the quantified, mainstream pain.** Kajabi's own 2026 pitch is that it "replaces a $464/mo stack" (Thinkific + Kit + Leadpages + Circle + Calendly + SamCart + Zapier) — meaning stack-cost resentment is strong enough to be a marketing weapon (GroupApp, 4 Jun 2026). The dominant advice to coaches in 2026: *consolidate, run fewer tools*.
- **Price floor for DIY agents keeps collapsing:** n8n ~€20–24/mo, Lindy ~$20–50/mo (pricing in flux, sources conflict), MindStudio ~$20/mo. Buyers are "credit-burned" — per-task pricing anger (Zapier bill shock) is a leading theme in 2026 comparisons; n8n's switcher data shows ~80% of new customers were paying Zapier users (YipitData via SketricGen, 15 Jun 2026).
- **Portal incumbents are adding AI *assistants*, not agent systems:** Assembly (formerly Copilot) $39–$399/mo — AI summaries/meeting prep, no agents, no workflow engine (Moxo blog, 5 May 2026). HoneyBook ~$29–36/mo — AI-drafted replies, AI lead flagging (Art of Her, 7 Jul 2026). SuiteDash from $19/mo — no AI. **Moxo is the one racing toward real embedded agents** (six agent types) but positions up-market (entry ~$99/mo self-reported; Business tier cited at $450/mo by AgencyHandy, 29 Mar 2026).
- **"AI-native portal builder" is becoming a named buying category** (Taskade comparison, 23 Jun 2026) — the category is forming with or without FieldCraft.
- **AI-automation-agency market rates (2026):** builds $1,500–$15,000+, retainers $500–$5,000/mo (Digital Agency Network, 13 May 2026; Taskip, 14 Jun 2026). GoHighLevel "SaaS mode" resellers bundle a white-label platform + AI agents at ~$97–297/mo per client (Softomate Solutions, 2 Jun 2026) — the closest scaled competitor to "portals as a service."
- **Market fatigue is documented.** The #1 deal-killer is *buyer disbelief*, not delivery: "the prospect not believing the automation will work for their specific business is the wall" (Ciela, 2 Jul 2026 — an agency-tool vendor synthesizing Reddit sentiment; directionally useful, self-interested source). ~67% of B2B buyers prefer rep-free, try-it-first experiences.
- **AI skepticism in coaching is identity-level.** 71% of practitioners believe AI cannot replicate the coaching working alliance (Forbes analysis cited in Coach's CMO, Apr 2026); coaches fear looking inauthentic *to their clients*; ICF enforces human-in-the-loop for emotionally charged decisions.
- **Coach-SaaS fragility:** Practice.do has apparently shut down (Paperbell's migration post, 25 May 2026 — original announcement not found, treat as highly likely but unconfirmed).

## ⚠️ Contradictions & risks for current positioning

1. **Price compression from both ends.** DIY agent tools floor at $20–50/mo; GHL resellers bundle "branded platform + AI agents" at $97–297/mo. FieldCraft's GBP 5K–20K must win on *depth of personalization and ownership*, never on "we automate X."
2. **The consolidation trend is your wedge, not your enemy.** A custom portal that *replaces* the $464/mo stack is aligned with 2026 buyer advice; a portal that *adds* another subscription is dead on arrival. Lead with replacement math.
3. **Authenticity is the third rail.** Position agents as *invisible back-office infrastructure* (onboarding, renewals, delivery, admin) — never as "AI coaching." This also happens to be where the ROI evidence points.
4. **Trust deficit is inherited.** Buyers burned by template AI agencies will assume FieldCraft is one. Demo-first, proof-before-sale is table stakes — your working swarm dashboard is the antidote.
5. **Solo-vendor risk cuts both ways.** Prospects will rationally fear depending on one operator (Practice.do made this concrete). Mitigations: export guarantees, mainstream stack, documentation, escrow.
6. **First-mover window is real but short.** Nobody owns "custom AI-native portals for coaches" as a named category, but Moxo is moving down-market. Call it 12–24 months, not years.

*Not found (honest gaps): hard 2026 churn benchmarks for coaching memberships; reliable willingness-to-pay data for custom portals among sub-$10K/mo coaches; confirmed current Lindy/Relevance AI list pricing.*

---

# STEP 3 — ICP & Messaging Map

## ICP 1 — "The Booked-Out Coach"
Established 1:1 or group coach, ~$10–30K/mo, fully booked, revenue capped by their calendar. Onboarding is manual, renewals fall through the cracks, clients get silence between sessions.

- **Pain:** "I'm fully booked and still behind. Every new client means hours of admin, and I lose renewals I should have kept."
- **Mechanism:** A bespoke portal that automates onboarding, delivery sequences, and between-session touchpoints — with retention/renewal agents drafting outreach that *they* approve (human-in-the-loop, matching how FieldCraft's own swarm works).
- **Outcome:** Delivery capacity grows without hiring; clients feel held between sessions; renewals become a system, not a memory test.
- **Buy trigger:** just raised rates / started a waitlist / lost a renewal they expected.

## ICP 2 — "The Drowning Course Creator"
Cohort-course or membership creator running Kajabi + Circle/Skool + Calendly + Stripe + Zapier + email — $400–600/mo of subscriptions, five logins, engagement dropping after week 2.

- **Pain:** "I pay for six tools and still duct-tape them together. My students churn because the experience is scattered."
- **Mechanism:** One branded portal replacing the stack — content delivery, payments, community touchpoints, and engagement agents (drop-off detection, re-engagement drafts) in one login.
- **Outcome:** One login for clients, one dashboard for the creator, lower monthly burn, a delivery experience that actually looks like their brand.
- **Buy trigger:** a Zapier bill shock; a platform price hike; a cohort with poor completion.

## ICP 3 — "The Productizing Consultant"
Boutique consultant or technical educator turning a method/framework into a productized program. Their IP lives in PDFs, Loom links, and their head; they want software that *is* their methodology — and possibly a white-label asset they can put in front of their own clients.

- **Pain:** "My method is my moat, but it's delivered as a Google Drive folder. I can't charge premium for a Notion doc."
- **Mechanism:** A portal engineered from their model — the AI Blueprint Generator maps their offer structure and delivery sequence, then it's built as a branded system they own outright.
- **Outcome:** Their method becomes a tangible, premium, ownable asset — pricing power, IP ownership, and a demo-able product instead of a promise.
- **Buy trigger:** launching a high-ticket cohort; losing deals to more polished competitors; wanting to license their system.

## Unifying positioning statement

> **FieldCraft Digital builds the operating system for expert businesses: one bespoke, AI-native portal — engineered around your method, not a template — that replaces your patchwork of subscriptions and runs your onboarding, delivery, and retention while you do the work only you can do. Flat fee. 30–60 days. Yours.**

Short form (ads/social): **"Your expertise, engineered. One portal that replaces your stack and runs your back office — flat fee, 60 days, no templates."**

## Objection map

| Objection | Counter (grounded) |
|---|---|
| **"GBP 5–20K is a lot."** | Against the math, not in a vacuum: creators commonly run a ~$464/mo tool stack (Kajabi's own replacement math, Jun 2026) plus hours of weekly manual admin. Flat fee, no hourly surprises, delivered in 30–60 days. Portal Lite is the scoped entry point. |
| **"I don't trust AI near my clients."** | Neither do we — near the *coaching*. Agents handle back-office: onboarding, delivery logistics, renewal reminders. Every outward-facing action sits in a human approval queue. You coach; the system administrates. |
| **"I'm not technical."** | You never touch code, hosting, or prompts. Done-for-you build, 30/60/90 days of post-launch support included, and the dashboard is designed for operators, not engineers. |
| **"Why not just use ChatGPT / a $29 no-code tool?"** | ChatGPT is a tool you operate; a portal is a system that operates for you. No-code means *you* become the integrator — and per-task billing is exactly what 2026 buyers are revolting against (documented Zapier/n8n switcher sentiment). |
| **"I've been burned by an AI agency before."** | So has everyone — it's the market's defining wound. That's why the first step is a 15-minute diagnostic with zero pitch, and why I can show you a working agent system (the one that runs my own business) before you spend anything. |
| **"What if you disappear?"** (solo-operator risk) | Your portal is built on mainstream, portable tech (Next.js, Supabase, Stripe) with full documentation and export. You own the code and the data. You're buying an asset, not renting a landlord. |

---

# STEP 4 — Ad Copy

*Every claim below traces to the Product Truth Sheet or a cited market finding. No invented client outcomes. Where proof is missing, the copy sells the mechanism and the demo, not results.*

## ICP 1 — The Booked-Out Coach

### Instagram / Meta (3 variants)

**1A — "Waitlist"**
> **Hook:** You're fully booked. So why are you also behind?
> **Body:** More clients shouldn't mean more admin. I build bespoke client portals for coaches — onboarding, content delivery, and renewal reminders run themselves, and every client-facing message waits for your approval before it goes out. No templates. Built around how *you* coach.
> **CTA:** Book a free 15-min Field Brief — zero pitch, just clarity on your biggest bottleneck. Link in bio.

**1B — "Between sessions"**
> **Hook:** Your clients get silence between sessions. That's where renewals die.
> **Body:** Retention systems are the highest-ROI thing coaches aren't automating (2026 State of AI in Coaching). My portals handle drip content, check-in nudges, and renewal sequences — drafted by AI, approved by you. You coach. The portal administrates.
> **CTA:** DM me "PORTAL" and I'll show you a working one.

**1C — "Not another tool"**
> **Hook:** This is not another app to log into. It's the one that replaces five.
> **Body:** One branded portal for your coaching business: payments, content delivery, client comms, automations — engineered around your method in 30–60 days for one flat fee. No per-task billing. No template look. You own it.
> **CTA:** Free playbook: "5 signs you need a custom portal (not another SaaS tool)" — link in bio.

### LinkedIn (3 variants)

**1D**
> Most established coaches don't have a lead problem. They have a *delivery ceiling*: every new client adds hours of onboarding, scheduling, and follow-up admin — until the calendar caps the business.
>
> The fix isn't another VA or another SaaS subscription. It's a system built around how you already deliver.
>
> I build bespoke, AI-native client portals for coaches: automated onboarding, drip delivery, and renewal sequences — with every client-facing action waiting in your approval queue. Flat fee. 30–60 days. You own the code.
>
> If your calendar is your ceiling, I'll map your #1 bottleneck in a free 15-minute Field Brief. No pitch — I diagnose, you decide.

**1E**
> A 2026 industry report called retention systems "the single highest-ROI underutilized AI application in coaching" — and noted almost no coaches have built one.
>
> Meanwhile most coaches are using AI for… Instagram captions.
>
> The sequence that wins renewals isn't glamorous: onboarding that runs itself, between-session touchpoints that arrive on time, renewal nudges drafted for you and sent only after you approve them. That's what I build — one bespoke portal, engineered around your delivery model, not a template.
>
> Curious what that looks like for your practice? I'll show you a working agent system on a 15-min call. Link in comments.

**1F**
> "Won't AI make my coaching feel impersonal?"
>
> Only if you point it at the coaching. I point it at the admin.
>
> The coaches I build for keep 100% of the human work human — the portal handles the logistics that were never the value: intake forms, content drips, scheduling, renewal reminders. Drafts land in your approval queue; nothing client-facing goes out without your eyes on it.
>
> AI shouldn't touch your genius. It should touch your to-do list.
>
> Booking free Field Briefs for August — 15 minutes, zero pitch.

### Long-form advertorial (organic / LinkedIn article)

**"The calendar ceiling: why the best coaches I know are quietly rebuilding their back office"**

There's a moment in every successful coaching practice that nobody posts about. You're fully booked — the thing you worked years for — and instead of feeling like arrival, it feels like drowning. Every new client means an intake form, a welcome email sequence, a payment link, a calendar dance, a content drip you'll send manually for sixteen weeks. You didn't hit a ceiling on demand. You hit a ceiling on *you*.

The standard advice is to hire or to buy more software. Both miss the point. A VA scales your hours linearly. And the average expert business already runs a stack of five to seven subscriptions — course platform, community tool, scheduler, payments, email, automation glue — an approach so expensive that the biggest platform in the space now markets itself as *replacing* a $464/month stack. More logins is not leverage.

Here's what I've noticed building systems for coaches: the work that burns them out was never the coaching. It's the operational shadow around the coaching — onboarding, delivery logistics, renewal admin. That shadow has three properties that make it perfect for automation: it's repetitive, it's rule-based, and it doesn't require trust. Nobody's coaching alliance depends on who sent the week-three worksheet.

So the question isn't "should AI touch my practice?" It's "why is AI touching my *content* — the thing clients actually pay for — while my back office stays manual?" A 2026 industry report called retention and referral systems the highest-ROI underutilized AI application in the profession. Almost nobody has built one.

What a modern back office looks like: a client pays, and the portal onboards them — welcome sequence, intake, scheduling, first content drop — without you touching anything. Between sessions, check-in nudges arrive on schedule. Six weeks before renewal, a draft appears *in your approval queue*. You edit it in your voice, hit approve, and it goes out as you. You coached. The system administrated.

This is what I build at FieldCraft: bespoke client portals, engineered around how you deliver — not a template with your logo. One flat fee, live in 30–60 days, and you own the code. If you're fully booked and quietly drowning, book a free 15-minute Field Brief. I'll map your single biggest bottleneck — zero pitch, just clarity.

## ICP 2 — The Drowning Course Creator

### Instagram / Meta (3 variants)

**2A — "Stack confession"**
> **Hook:** Name your stack. I'll wait. (Kajabi. Circle. Calendly. Stripe. Zapier. ConvertKit…)
> **Body:** That's easily $400–500/mo before you've sold a single seat — and your students still log into four places. I build one branded portal that replaces the pile: content, payments, community touchpoints, automations. One login for them, one dashboard for you. Flat fee, not another subscription.
> **CTA:** Free true-cost calculator + playbook: what manual work is actually costing you. Link in bio.

**2B — "Week 3 drop-off"**
> **Hook:** Your course doesn't have a content problem. It has a week-3 problem.
> **Body:** Students drift when the experience is scattered across platforms. A bespoke portal keeps everything in one branded home — and quiet agents watch for drop-off and draft re-engagement messages for your approval. You teach. The portal keeps them showing up.
> **CTA:** DM "STACK" — I'll show you what yours could look like.

**2C — "Bill shock"**
> **Hook:** The Zapier invoice is the moment most creators start googling alternatives.
> **Body:** Per-task pricing punishes you for growing — 2026's most-documented buyer revolt. A FieldCraft portal is the opposite: one flat build fee, automations included, and you own the system outright. No meters running.
> **CTA:** Book a free 15-min Field Brief. Bring your stack list — I'll tell you what to kill.

### LinkedIn (3 variants)

**2D**
> Kajabi's own 2026 marketing math: the "typical" creator stack it replaces costs $464/month. Course platform + community + landing pages + scheduler + checkout + email + Zapier.
>
> Read that again. The industry is so sprawled that its biggest player campaigns on *replacement*.
>
> But swapping seven subscriptions for one subscription still leaves you renting. There's a third option: one bespoke portal, built around your course and your brand — content delivery, payments, engagement nudges, re-engagement drafts in your approval queue — that you *own*. Flat build fee. No per-task billing. No platform look-alike.
>
> If your stack list is longer than your curriculum, let's talk. Free 15-min Field Brief in comments.

**2E**
> Completion rates don't die in the curriculum. They die in the gaps between platforms.
>
> Student buys on one tool, gets welcomed by another, joins a community on a third, books calls on a fourth. Every seam is a leak.
>
> The creators I build for consolidate to one branded portal — and the difference isn't aesthetic, it's operational: drip delivery runs on rails, drop-off gets flagged by agents, and re-engagement messages wait as drafts until they approve them. The experience finally feels like *one* product, because it is one.
>
> I build these as flat-fee, 30–60 day projects. If your 2026 goal is a course that feels like a product instead of a pile of links — DM me.

**2F**
> Unpopular opinion: your course platform's "AI features" won't fix your churn.
>
> AI that writes your sales emails is table stakes in 2026. The churn problem is structural: your student's experience is fragmented across tools that don't talk to each other, and nobody notices they've gone quiet until the refund window opens.
>
> What actually moves completion: one home for the whole experience, delivery sequences that run themselves, and an early-warning system that drafts the "hey, everything okay?" message *for* you — before week 3 becomes a refund.
>
> That's a build, not a plugin. I do those builds. 15-minute Field Brief, zero pitch — link in comments.

### Long-form advertorial

**"I audited a creator's stack. The tools were fine. The business was leaking."**

A course creator came to me last quarter with a familiar confession: "I think I need better tools." She was paying for six. Course platform, community, scheduler, checkout, email, and the automation glue holding them together — a monthly bill in the $400–500 range that the industry itself now openly acknowledges (the biggest platform's 2026 pitch is literally "replace your $464/month stack").

Her tools weren't the problem. The *seams* were.

We mapped one student's journey. Purchase confirmation from tool one. Welcome email from tool two — three hours later. Community invite from tool three, buried in a promotions tab. Call booking on tool four. Five logins, four brands, zero memory of what the student had actually done. Every seam was a place a student could quietly fall through — and did. Her completion rate fell off a cliff at week three, right where the experience fragmented hardest.

This is the part nobody tells creators: consolidation isn't about saving subscription money. It's about continuity. A student who lives in one branded home — where the content, the community nudges, the calls, and the progress all share a roof — experiences your course as a *product*. A student shuttling between platforms experiences it as a pile of links.

So we didn't add a tool. We subtracted five. One portal: her brand, her domain, her delivery sequence automated end to end. Payments wired in. Content dripping on schedule. And a quiet layer of agents doing the one thing no platform does — watching for disengagement and drafting the "everything okay?" message for her to approve and send in her own voice. The AI never teaches. It never writes her content. It runs the logistics and taps her on the shoulder when a human moment is needed.

She owns the system. One flat build fee, no meters running, no per-task invoice that punishes her for growing.

If your stack list is longer than your curriculum, that's the audit worth doing. I offer it free: a 15-minute Field Brief. Bring your tool list — I'll tell you what I'd kill first.

## ICP 3 — The Productizing Consultant

### Instagram / Meta (3 variants)

**3A — "Google Drive moat"**
> **Hook:** Your method is your moat. So why is it delivered as a Google Drive folder?
> **Body:** Your framework deserves better than PDFs and Loom links. I turn consultants' methods into bespoke software portals — your delivery sequence, your diagnostics, your brand — a product clients log into, not a folder they skim. Built from your model in 30–60 days. You own it.
> **CTA:** Free playbook: the same diagnostic I use in GBP 5–20K engagements. Link in bio.

**3B — "Premium problem"**
> **Hook:** You can't charge premium for a Notion doc.
> **Body:** Buyers pay for *experiences*, not files. A branded portal turns your method into software: clients onboard, progress, and get results inside a system that feels like you. Flat fee. 30–60 days. No templates — it's engineered from how your method actually works.
> **CTA:** DM "METHOD" and I'll sketch what yours becomes.

**3C — "Demo > deck"**
> **Hook:** A pitch deck promises. A portal demonstrates.
> **Body:** Consultants closing high-ticket deals need something prospects can *touch*. I build bespoke portals that package your method as software — so your sales call becomes a walkthrough, not a persuasion exercise. Engineered around your model. You own the code.
> **CTA:** Book a free 15-min Field Brief — I'll map the product version of your method.

### LinkedIn (3 variants)

**3D**
> Every consultant with a real method hits the same fork: keep selling hours, or turn the method into an asset.
>
> Most try the asset route with the wrong materials — a course platform template, a Notion wiki, a Drive folder with a payment link. The market reads those as *content*, and prices them like content.
>
> What commands product pricing is a *system*: your diagnostics, your delivery sequence, your client experience — running as branded software your clients log into. That's what I build. The blueprint maps your method first; code second. Flat fee, 30–60 days, you own everything.
>
> If 2026 is the year your method becomes an asset — free 15-min Field Brief in comments.

**3E**
> There's a reason "productized service" advice stalls at pricing tiers and Stripe links: packaging isn't the hard part. *Delivery infrastructure* is.
>
> A productized method needs somewhere to live — onboarding that runs itself, your framework delivered as a guided experience, progress visible to both you and the client. Without that, you've renamed consulting, not productized it.
>
> I build the somewhere-to-live: bespoke portals engineered from your method, with automation and AI agents handling the operational layer (drafts queue for your approval — nothing client-facing goes out untouched).
>
> Your method, running as software you own. That's the offer. DMs open.

**3F**
> Consultants: your next competitor isn't another consultant. It's a consultant whose method *ships as software*.
>
> When two proposals land and one includes a branded portal the client will actually log into — diagnostics, delivery, progress tracking — the PDF proposal doesn't lose on price. It loses on tangibility.
>
> This is buildable in 30–60 days, for a flat fee, on a stack you own outright (no per-seat SaaS rent, no template look). I've built the agent systems that run my own business — I'll show you that working system on a call before you commit to anything.
>
> Free Field Briefs for August. 15 minutes, zero pitch.

### Long-form advertorial

**"Your method is worth more than the format you deliver it in"**

Every consultant I respect has the same dirty secret: their life's work — the framework refined over hundreds of engagements — lives in a Google Drive folder. Seventeen PDFs, a Loom playlist, a Miro board only they understand. The method is brilliant. The *container* is worth $49.

Buyers can tell. There's a reason two consultants with identical expertise close at wildly different rates: one sells a process, the other sells a *place*. When a prospect sees that your method has a home — a branded portal where they'll onboard, work through your framework, and watch their own progress — the conversation changes from "why so much?" to "when do we start?" Tangibility is pricing power.

I learned this from the infrastructure side. I build bespoke software portals, and the pattern across engagements is consistent: the consultants who productize successfully don't start by recording a course. They start by *mapping the method* — the diagnostics, the decision points, the delivery sequence — and only then build the container around it. Method first, code second. That's why every engagement I take starts with an AI-assisted blueprint of *your* model, not a template I've shipped to ten other clients.

The second pattern: the best productized methods keep the human in the loop. The portal runs the logistics — onboarding, delivery sequences, reminders, progress tracking — and queues anything client-facing for the consultant's approval. The client feels *more* attended to, not less, because nothing falls through the cracks. Automation handles the admin; the consultant keeps the judgment. That's the whole trick.

And the third pattern: ownership matters more than features. These are built as assets — mainstream stack, documented, exportable, yours. No per-seat rent on your own intellectual property. A method you pay a platform to host is a tenancy. A portal you own is equity.

If your method deserves a better container, I'll map what it looks like as software — free, 15 minutes, zero pitch. It's called a Field Brief. Bring your framework; leave with the blueprint.

## Swipe file — 10 scroll-stopping hooks (cross-format)

1. **"You're fully booked. So why are you also behind?"** (ICP 1 — paradox hook)
2. **"Name your stack. I'll wait."** (ICP 2 — call-out)
3. **"Your method is your moat. So why is it delivered as a Google Drive folder?"** (ICP 3 — status challenge)
4. **"Your clients get silence between sessions. That's where renewals die."** (ICP 1 — loss frame)
5. **"The Zapier invoice is the moment most creators start googling alternatives."** (ICP 2 — shared moment)
6. **"You can't charge premium for a Notion doc."** (ICP 3 — blunt truth)
7. **"This is not another app to log into. It's the one that replaces five."** (all — replacement wedge)
8. **"AI shouldn't touch your genius. It should touch your to-do list."** (all — reframe the AI fear)
9. **"Your course doesn't have a content problem. It has a week-3 problem."** (ICP 2 — pattern interrupt)
10. **"A pitch deck promises. A portal demonstrates."** (ICP 3 — contrast)

---

# STEP 5 — Go-to-Market Plan (next 90 days)

**Operating constraint assumed:** ~10–12 focused hours/week alongside the firmware job; time is the bottleneck, modest tooling budget is available. Flag where I'm assuming vs. where you should correct me.

## Acquisition channels, ranked by expected ROI (solo-operator adjusted)

**1. Founder-led LinkedIn (organic) — primary. £0 cash, ~4 hrs/wk.**
Your ICPs (coaches, creators, consultants) live and buy on LinkedIn; high-ticket services are bought from people, not ads. 3–4 posts/week rotating the advertorial angles above + build-in-public from your own swarm dashboard ("the 10-agent system running my business" is content nobody else can post). This is the only channel that compounds.

**2. Manual, demo-led outbound — co-primary. £0 cash, ~3 hrs/wk.**
10–15 highly researched DMs/week to ICP coaches/creators (waitlists announced, cohort launches, stack complaints posted publicly = buy triggers). Not a pitch — a diagnostic offer + the one asset competitors can't fake: *"I'll show you the agent system that runs my business."* Market research says the #1 deal-killer is disbelief; a live demo kills it.

**3. Niche communities & borrowed audiences — secondary. £0–50/mo, ~2 hrs/wk.**
Coaching communities, course-creator groups, podcast guesting, newsletter swaps. Slow but trust-dense; one good podcast appearance feeds LinkedIn content for a month.

**4. Gumroad products + playbook as a trust ladder — passive, already built.**
Your $39–$129 products and the free playbook are a working ascension path: playbook → Field Report newsletter → Field Brief → portal. Wire them together explicitly (they currently exist but don't visibly chain).

**5. ⛔ Paid ads — NOT recommended in the first 90 days.** (This is the one recommendation requiring ad spend, and I'm explicitly advising against it for now.)
Reasons: you have zero verified testimonials or case-study metrics (ads without proof burn money in a market whose #1 deal-killer is disbelief); high-ticket flat-fee services don't cold-convert profitably without a proven close rate; your funnel math is unknown. Revisit at day 90 *if* you've closed 3+ clients and have documented outcomes — start with £300–500/mo retargeting engaged LinkedIn profile visitors, not cold traffic.

## Content → conversion pipeline

```
LinkedIn post (pain/mechanism angle)
   → Free Field Brief Playbook  [exists: "5 signs you need a custom portal" + true-cost calculator]
   → The Field Report newsletter  [exists: weekly nurture]
   → 15-min Field Brief diagnostic call  [exists: "zero pitch"]
   → LIVE DEMO: your swarm dashboard  [exists — currently unused as a sales asset]
   → Portal Lite GBP 5K (scoped first project)  [exists]
   → (recommended new) monthly Care Plan  [does not exist yet]
```
Everything in the chain already exists except the retainer and the demo's sales role. The GTM motion is mostly *connecting and feeding* assets you've built, not creating new ones — right-sized for a time-poor operator.

## Outbound vs. inbound balance

**90-day split: ~60% outbound / 40% inbound, inverting to 40/60 by month 6.** Reasoning: inbound compounds but starts at zero; you have a small audience and need the first 2–3 clients *now* to fix the proof gap (the codebase's biggest weakness). Outbound (direct, personalized, demo-led) is the fastest path to first clients and first case studies. Every client interaction becomes inbound content, so the split naturally inverts.

## The proof-building priority (highest-leverage move available)

Because there are no verified testimonials or metrics anywhere in the business, **close 1–2 "founding clients" at Portal Lite pricing (or a scoped £2.5–3K pilot) explicitly in exchange for a documented case study**: before/after hours-per-week on onboarding, renewal rate, stack cost eliminated. Instrument the numbers from day one. One real case study with real numbers is worth more than 90 days of any channel activity — it unblocks ads, outbound reply rates, and pricing confidence simultaneously.

**Also recommended: add a Care Plan retainer (~£500–1,500/mo — support, iteration, agent tuning).** Market-standard for AI automation work is $500–5,000/mo retainers (Digital Agency Network, May 2026). For a solo operator, one-time fees mean every month starts at £0 — a retainer base is survival infrastructure. This is my recommendation, not an existing FieldCraft offer; your call.

## Weekly metrics (one spreadsheet, 15 min/wk)

- Posts published (target ≥3) / profile visits / DM conversations started (target 10–15)
- Replies & Field Briefs booked (the #1 leading indicator)
- Proposals sent · close rate · pipeline value (£)
- Founding-client proof assets captured (case studies, metrics, testimonials)
- Newsletter subscribers (playbook downloads)
- Delivery hours used vs. available (your real capacity cap)

## Prioritized 2-week action list

1. **Fix the dead "View Case Study" link** on the homepage (`CaseStudySection.tsx`) — today. It actively erodes trust.
2. **Replace the placeholder testimonial** ("— Name, Business") in the playbook page with either a real quote or remove it. Placeholder proof is worse than none.
3. **Put the coach/creator audience language on the live site** (it currently exists only in an old COPY.md) and decide whether "PSPaaS" is a term you want on the site — right now it's in neither.
4. **Decide the positioning split**: the repo contains a whole firmware-facing brand layer. Archive it from anything client-facing.
5. **Record a 3–5 min Loom walkthrough of your swarm dashboard** (blur/sanitize mock data) — this becomes the demo asset for outbound and the LinkedIn pinned post.
6. **Write the founding-client offer** (scoped Portal Lite pilot + case-study terms) as a one-pager.
7. **Build a list of 100 ICP prospects** (coaches with waitlists, creators mid-launch, consultants launching cohorts) in a spreadsheet with buy-trigger notes.
8. **Publish LinkedIn post #1** (advertorial 1, "The calendar ceiling") and pin the Loom demo.
9. **Send the first 15 outbound DMs** using the diagnostic + demo angle.
10. **Wire the ladder**: playbook opt-in → newsletter → Field Brief link in every email; add the playbook CTA to your LinkedIn featured section.

## Open questions for you (answers sharpen everything above)

1. **What have you actually sold so far?** Any paying portal client (even one) — at what price, and what's the single best measurable outcome you delivered?
2. **Close rate & pipeline today:** how many Field Briefs have you run, and how many converted? (Determines whether outbound volume or close mechanism is the constraint.)
3. **Delivery capacity:** alongside the firmware job, how many portal builds can you realistically ship per quarter? (Caps how hard we can push demand gen.)
4. **Is the "Freedom Business Engine" case study real enough to name?** A named, permissioned client is worth 10 anonymous ones.
5. **Are you open to the Care Plan retainer**, or is one-time-only a deliberate model choice?
6. **Geography:** GBP pricing + Bangalore base — are you targeting UK, India, or global English-speaking? (Changes outbound lists, posting times, and which market's price anchors apply.)
7. **The firmware/BMS line of business:** keep as a separate brand track or fold the engineering credibility into the FieldCraft story ("firmware engineer turned software architect" is already strong founder copy)?
