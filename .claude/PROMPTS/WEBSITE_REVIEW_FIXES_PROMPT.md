# Website Review Fixes — Priority Execution Prompt

> **Read CLAUDE.md first. This prompt addresses 19 findings from a UX/conversion review. Execute in priority order. Commit after each priority tier is complete.**

---

## Context

The website was reviewed for conversion, messaging, UX, and technical quality. The aesthetic and animation direction is strong — no visual redesign needed. The work is in the **conversion layer**: giving visitors a clear action, enough trust signals, and enough information to say yes.

**Rule: Do NOT change the existing visual identity, color palette, animation style, or typography system. All fixes work WITHIN the established design language.**

---

## 🔴 TIER 1 — Critical Fixes (Do These First)

These are conversion killers. Fix all four before moving to Tier 2.

### Fix 1: Add CTA Button to Hero Section

**File**: `frontend/src/components/sections/HeroSection.tsx`

The hero currently has no clickable action. Add a primary CTA button below the subheadline.

```
Layout (top to bottom, centered):
1. "Engineered around you." (existing headline — no change)
2. "Bespoke software portals for coaches, consultants, and creators who've outgrown their tools." (updated subhead — see Fix 4 for copy change)
3. [CTA Button] "Start a Conversation" 
4. [Scroll indicator] (existing — keep but lower z-index)
```

**Button spec:**
- Text: "Start a Conversation"
- Style: `bg-field-verdant hover:bg-field-mint text-field-deep font-display font-medium text-base md:text-lg px-8 py-4 rounded-xl transition-all duration-300`
- Hover: scale to 1.02, box-shadow increases
- Animation: fade-in + translate-y (20px → 0), 0.8s delay after subheadline appears, entrance easing
- Link: scrolls to the contact section (`#contact`) for now — will become an intake form link later
- `prefers-reduced-motion`: appears immediately, no transform
- Add `mt-8 md:mt-10` spacing between subheadline and button

**Also add a secondary ghost link** below the button:
- Text: "See how it works ↓"
- Style: `text-field-soft-teal/60 hover:text-field-soft-teal text-sm font-body mt-4 transition-colors cursor-pointer`
- onClick: smooth scroll to the portal showcase section (`#work`)

### Fix 2: Fix Hero Subheadline Typo

**File**: `frontend/src/components/sections/HeroSection.tsx` (or `docs/brand/COPY.md` if copy is centralized)

Find: `businesses.No templates`
Replace with: `businesses. No templates`

There's a missing space after the period. On a site positioning itself as precision-built, this is a credibility hit visible on first impression. Also take this opportunity to proofread ALL visible copy across every section for similar spacing or punctuation issues.

### Fix 3: Fix Scroll-Only Content Visibility in Problem Section

**File**: `frontend/src/components/sections/ProblemSection.tsx`

Currently the three text lines start completely invisible (same color as background) and only reveal on scroll. This means:
- Direct-link visitors see a blank screen
- Screen readers get no content
- OG previews and screenshots show nothing
- Refreshing mid-scroll shows blank

**Fix approach:**
- Set initial text opacity to 0.15 (not 0) — dimly visible, enough to signal content exists
- The scroll animation still transitions from 0.15 → 1.0 opacity (with the translate-y motion)
- This preserves the reveal effect while ensuring the section is never truly blank
- For `prefers-reduced-motion`: show text at full opacity immediately

```typescript
// Example Framer Motion variant change
const textVariants = {
  hidden: { opacity: 0.15, y: 30 },  // was opacity: 0
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};
```

Also ensure the section has proper `aria-label` and the text is in the DOM (not conditionally rendered based on scroll).

### Fix 4: Update ICP Specificity in Hero Copy

**File**: Hero section component + `docs/brand/COPY.md`

**Current subheadline:**
"Bespoke software portals for personal brands and solo businesses. No templates. No compromises."

**New subheadline:**
"Bespoke software portals for coaches, consultants, and creators who've outgrown their tools."

This is more specific, names the three target archetypes, and replaces the generic "no templates" line (which is repeated elsewhere on the page) with a pain-point hook ("outgrown their tools") that resonates with the exact buyer who needs Fieldcraft.

Update `docs/brand/COPY.md` to match.

### Commit after Tier 1:
```bash
git add -A && git commit -m "fix: critical conversion fixes — hero CTA, typo, visibility, ICP copy"
```

---

## 🟡 TIER 2 — High-Impact Improvements

These significantly improve trust and conversion. Do all five.

### Fix 5: Add Feature Explanations to Portal Showcase

**File**: `frontend/src/components/sections/PortalShowcase.tsx`

The floating feature labels ("AI Blueprint Generator", "Branded Dashboard", etc.) currently have no explanation. A visitor doesn't know what "Blueprint Generator" means for their business.

**Add a brief benefit line to each feature pill.** Change from simple pills to mini-cards:

```
Feature: "AI Blueprint Generator"
Benefit: "Your audience answers a few questions. They get a custom roadmap — branded to you."

Feature: "Branded Dashboard"  
Benefit: "Your clients log in to a space that looks and feels like your brand, not a generic tool."

Feature: "Automated Delivery"
Benefit: "Content, resources, and assets delivered on schedule without manual work."

Feature: "Payment Integration"
Benefit: "Razorpay-powered billing built into the portal. No third-party checkout pages."

Feature: "Video Content Engine"
Benefit: "Personalised video content generated and delivered at scale."
```

**Implementation:**
- Desktop: on hover over a feature pill, show a tooltip or expand the pill to reveal the benefit line
- Mobile: show pills as cards with the benefit line always visible (no hover on touch)
- Benefit text: `font-body text-xs text-field-warm-gray/70 mt-1`
- Keep the animation tight — a 0.2s max-height or opacity transition on hover

### Fix 6: Add Timeline Signal to Process Section

**File**: `frontend/src/components/sections/ProcessSection.tsx`

Below the section headline "Three steps. Zero templates.", add a timeline signal:

**Add**: "Typical projects run 4–8 weeks from kickoff to launch."
- Style: `font-body text-base text-field-deep-teal/70 mt-2`
- Placement: directly below the headline, before the three step cards

Also add duration hints to each step:
```
Step 1 — Discovery: add "Week 1–2" as a small tag
Step 2 — Architecture: add "Week 2–5" as a small tag  
Step 3 — Delivery: add "Week 5–8" as a small tag
```
- Tag style: `font-mono text-xs text-field-verdant/60` placed above each step number

### Fix 7: Add Social Proof / Testimonial Placeholder

**File**: `frontend/src/components/sections/CaseStudySection.tsx`

Add a testimonial block below the case study screenshot. For now, use a placeholder structure that Austin can fill in after Hamza's project delivers:

**If a real quote is available** (ask Austin), use it:
```
"[Quote from Hamza about working with Austin]"
— Hamza C, Freedom Business Coach
```

**If no quote yet**, add an outcome statement instead of a fake testimonial:
```
"Built from scratch in 6 weeks. One portal. Zero templates. Every feature engineered around one coach's exact business model."
```

**Styling:**
- Blockquote style: `font-accent italic text-xl md:text-2xl text-field-parchment leading-relaxed`
- Attribution: `font-body text-sm text-field-warm-gray mt-4`
- Add a subtle left border: `border-l-2 border-field-gold pl-6`
- The gold border is one of the few places the accent gold appears — it signals premium

### Fix 8: Replace Initials Avatar with Photo Placeholder

**File**: `frontend/src/components/sections/AboutSection.tsx`

The "AS" initials circle should become a real photo as soon as Austin provides one. For now, improve the placeholder:

**Option A (if Austin provides a photo):**
- Accept an image at `frontend/public/images/austin.webp`
- Use `next/image` with `width={128} height={128}` and `className="rounded-full object-cover"`
- Add a subtle border: `ring-2 ring-field-mint/20 ring-offset-2 ring-offset-field-deep`

**Option B (better placeholder until photo exists):**
- Instead of just "AS", make the placeholder a stylized gradient circle:
  - `bg-gradient-to-br from-field-verdant/20 to-field-deep-teal/40`
  - With "AS" text inside: `font-display text-2xl text-field-mint`
- Add a comment in the code: `{/* TODO: Replace with real photo — frontend/public/images/austin.webp */}`

**Also add this line to CLAUDE.md under "Blocking Issues":**
```
- [ ] Austin's headshot needed for About section (high priority for trust)
```

### Fix 9: Add Pricing Signal

This is sensitive — we don't want to scare people off or anchor too low. Add a soft pricing signal in the process section OR as a standalone line before the CTA.

**Recommended placement**: After the three process steps, before the case study section. Add a small centered text block:

```
"Fieldcraft portals are a premium, one-time investment — not a monthly subscription. Projects typically start at ₹1,50,000."
```

- Style: `font-body text-sm text-field-warm-gray/50 text-center mt-16`
- Keep it subdued — this is a qualifier, not a sales pitch
- The number helps qualified leads self-select IN and unqualified leads self-select OUT (both are good)

**Note to Austin**: Adjust the ₹1,50,000 figure to whatever your actual starting price is. This number should feel like "not cheap, but not unreachable." If you're not ready to commit to a number, use this instead:
```
"Fieldcraft portals are a premium, one-time investment. Every project is scoped to your business."
```

### Commit after Tier 2:
```bash
git add -A && git commit -m "feat: high-impact conversion improvements — features, timeline, social proof, pricing"
```

---

## 🟢 TIER 3 — Technical & UX Polish

These improve professionalism and SEO. Do all seven.

### Fix 10: Add OG Image for Social Sharing

**Create file**: `frontend/public/og/og-default.png` (1200x630px)

Generate a simple branded OG card:
- Background: Deep Field (#0F2B1E)
- Center: Fieldcraft Digital wordmark in Parchment (#F5F1EB)
- Below wordmark: "Engineered around you." in Instrument Serif, Mint (#5DCAA5)
- Subtle wireframe mesh pattern at 5% opacity in background (use a static SVG export)

**Create this as an SVG first, then export/convert to PNG.** You can generate this programmatically:

```typescript
// Create a simple script or React component that renders to a canvas/SVG
// Save as frontend/public/og/og-default.png at 1200x630
```

**Update metadata** in `frontend/src/app/layout.tsx`:
```typescript
openGraph: {
  images: [{ url: '/og/og-default.png', width: 1200, height: 630 }],
},
twitter: {
  card: 'summary_large_image',  // Changed from 'summary'
  images: ['/og/og-default.png'],
},
```

### Fix 11: Add Nav Active State

**File**: `frontend/src/components/layout/Navbar.tsx`

Add scroll-linked active state highlighting to nav links:
- Track which section is currently in view (use Intersection Observer or `useScroll`)
- The active nav link gets: `text-field-mint` (instead of default `text-field-parchment/60`)
- Add a small underline indicator: `after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-field-mint after:scale-x-100` with transition
- Non-active links: `after:scale-x-0`

### Fix 12: Improve Scroll Indicator Persistence

**File**: `frontend/src/components/sections/HeroSection.tsx`

The scroll indicator disappears too quickly. Change behavior:
- Keep visible for at least 8 seconds after page load (currently disappears faster)
- Fade out when user starts scrolling (use scroll position > 50px as trigger)
- Use a slower fade: `transition-opacity duration-1000` instead of abrupt disappearance

### Fix 13: Fix Contact Email Consistency

**Files**: CTASection.tsx, Footer.tsx, and anywhere email appears

Standardize on ONE primary email: `austin@fieldcraft.digital`

- CTA button: links to `austin@fieldcraft.digital` (or intake form when built)
- "Just say hello" text: also links to `austin@fieldcraft.digital`
- Footer: display `austin@fieldcraft.digital`
- Remove `hello@fieldcraft.digital` references unless both inboxes are actually set up and monitored

Update `docs/brand/COPY.md` to reflect the canonical email.

### Fix 14: Add Structured Data (JSON-LD)

**File**: `frontend/src/app/layout.tsx` (or create `frontend/src/lib/structuredData.ts`)

Add JSON-LD schema markup in the `<head>`:

```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Fieldcraft Digital",
  "url": "https://fieldcraft.digital",
  "description": "Bespoke software portals for coaches, consultants, and creators",
  "founder": {
    "@type": "Person",
    "name": "Austin Senson",
    "jobTitle": "Software Architect",
    "url": "https://linkedin.com/in/austinsenson"
  },
  "areaServed": "Worldwide",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressCountry": "IN"
  },
  "serviceType": ["Custom Software Development", "Web Application Development", "AI-Powered Business Portals"],
  "priceRange": "$$$$"
};
```

Inject as: `<script type="application/ld+json">{JSON.stringify(structuredData)}</script>`

### Fix 15: Expand Footer

**File**: `frontend/src/components/layout/Footer.tsx`

Current footer is nearly empty. Expand to:

```
Left column:
  - Fieldcraft Digital wordmark (small)
  - "Engineered around you." tagline in text-xs
  - austin@fieldcraft.digital (linked)

Right column:
  - Social links: LinkedIn · Medium · Instagram (inline, text-xs)
  - "Privacy Policy" link (placeholder href for now)
  - © 2026 Fieldcraft Digital
```

- Layout: `flex justify-between items-start` on desktop, `flex-col gap-6` on mobile
- Keep it minimal — no large footer. Total height: ~120px
- Background stays Obsidian (#1A1A18)
- All text: `text-field-warm-gray/40 hover:text-field-warm-gray/70 transition-colors text-xs`

### Fix 16: Add "What You Get" Summary Before CTA

**File**: Create `frontend/src/components/sections/DeliverablesSection.tsx`

Add a brief deliverables summary between the Case Study section and the About section. This gives prospects a final clarity check before the CTA.

**Layout:**
- Background: continues Deep Field (#0F2B1E)
- Centered text: "What your portal includes" — `font-body text-xs tracking-[0.2em] uppercase text-field-mint/60`
- Below: 4 deliverable items in a 2x2 grid (desktop) or vertical stack (mobile)

```
1. "Branded client portal" — "A dashboard your clients log into — your colors, your logo, your experience."
2. "AI blueprint engine" — "Automated, personalised strategy documents generated for each client."
3. "Integrated payments" — "Razorpay billing built in. No redirects, no friction."
4. "Content delivery system" — "Resources, videos, and assets delivered on your schedule."
```

**Card style:**
- `bg-field-deep/30 border border-field-mint/10 rounded-xl p-6`
- Title: `font-display text-base font-medium text-field-parchment mb-2`
- Description: `font-body text-sm text-field-warm-gray leading-relaxed`
- Animation: staggered fade-in on scroll, 0.12s apart

**Wire into page.tsx** between CaseStudySection and AboutSection.

### Commit after Tier 3:
```bash
git add -A && git commit -m "polish: OG image, nav active state, structured data, footer, deliverables section"
```

---

## 💡 TIER 4 — Strategic Improvements (If Time Allows)

These are high-value but can wait for a future session.

### Fix 17: Replace mailto with Intake Form

**Create**: `frontend/src/components/interactive/ContactForm.tsx`

Replace the mailto CTA with a simple embedded form:

**Fields:**
1. Name (text input, required)
2. Email (email input, required)
3. "Tell me about your business" (textarea, required, placeholder: "What do you sell, who do you serve, and what tools are you currently using?")
4. Submit button: "Send Message"

**Backend**: POST to `/api/contact` → sends email to austin@fieldcraft.digital via Resend API

**Styling**: Match the dark theme — dark inputs with subtle borders, Verdant submit button, inline validation.

**Fallback**: If form submission fails, show "You can also email directly: austin@fieldcraft.digital"

This removes mailto friction (especially on mobile where mail app dialogs are unreliable) and lets Austin qualify leads before a call.

### Fix 18: Add Second Case Study / Concept Build

When time allows, create a second portfolio entry — a "concept build" showing a portal designed for a different archetype (e.g., a course creator or consultant). This signals range beyond a single client.

### Fix 19: Add Waitlist / Early Access Framing

If Austin isn't ready for open client intake, consider reframing the CTA:
- "I take on 2 clients per quarter. Reserve your spot."
- This creates scarcity and positions the service as exclusive (which matches premium pricing)

---

## Post-Fix Verification Checklist

After all tiers are complete:

- [ ] Hero: CTA button visible without scrolling, links to #contact
- [ ] Hero: "See how it works ↓" scrolls to portal showcase
- [ ] Hero: subheadline has correct spacing and updated copy
- [ ] Problem section: text dimly visible (0.15 opacity) before scroll
- [ ] Problem section: `prefers-reduced-motion` shows full opacity
- [ ] Portal showcase: feature pills show benefit on hover (desktop) / always visible (mobile)
- [ ] Process: timeline signal visible ("4–8 weeks")
- [ ] Process: week tags on each step
- [ ] Case study: testimonial/outcome block visible
- [ ] About: photo placeholder improved (gradient circle or real photo)
- [ ] CTA: pricing signal visible somewhere on page
- [ ] Deliverables: 4-item grid visible between case study and about
- [ ] Nav: active state highlights current section on scroll
- [ ] Footer: expanded with tagline, email, social links
- [ ] OG image: share link on Twitter/LinkedIn shows branded preview
- [ ] Twitter card: `summary_large_image` type
- [ ] JSON-LD: structured data in page source
- [ ] All emails: consistent `austin@fieldcraft.digital`
- [ ] Mobile: all fixes render correctly at 375px
- [ ] Lighthouse: still 90+ performance
- [ ] CLAUDE.md updated
- [ ] CHANGELOG.md updated
- [ ] COMPONENTS.md updated with new DeliverablesSection

---

## CLAUDE.md Session Update Template

After completing fixes, append this to CLAUDE.md:

```markdown
## Session: Website Review Fixes
### Changes
- Added hero CTA button + secondary scroll link
- Fixed hero typo (missing space)
- Updated ICP copy to target coaches/consultants/creators
- Fixed problem section visibility (0.15 base opacity)
- Added feature benefit tooltips to portal showcase
- Added timeline signals to process section
- Added testimonial/outcome block to case study
- Improved about avatar placeholder
- Added pricing signal
- Added deliverables section (4-item grid)
- Added OG image and fixed twitter card type
- Added nav active state
- Fixed scroll indicator persistence
- Standardized contact email
- Added JSON-LD structured data
- Expanded footer
### New Components
- DeliverablesSection.tsx
- (ContactForm.tsx if Tier 4 completed)
### Updated Copy
- docs/brand/COPY.md updated with all changes
```

---

*Execute tiers 1-3 in one session. Tier 4 is optional. The goal: every fix makes the visitor more likely to click "Start a Conversation."*
