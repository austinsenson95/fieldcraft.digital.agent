# FIELCRAFT.DIGITAL — COMPREHENSIVE WEBSITE OVERHAUL PROMPT
## Copy-paste this entire document into Kimi Code (or any AI coding agent)

---

## CONTEXT & IDENTITY

You are editing the website **fieldcraft.digital** — a bespoke software portal agency run by Austin Senson, a firmware engineer turned software architect based in Bangalore, building globally.

**Brand Palette:**
- Background: Dark forest green (#0f281e / #142d1f range)
- Primary accent: Emerald green / Mint green (#34d399 range)
- Text: White (#ffffff) and muted green-gray (#9ca3af range)
- Font: Monospace-style headings, clean sans-serif body
- Aesthetic: Dark, premium, minimal, tech-forward with the signature interactive "warp the field" particle effect on the hero

**Current Tech Stack (do NOT change):** React/Vite/Next.js (as currently built), keep the existing interactive particle field effect, preserve all existing animations and scroll behaviors.

**Business Model:**
- High-ticket: Custom software portals (Portal Lite GBP 5K, Portal Pro GBP 10K, Portal Enterprise GBP 20K)
- Low-ticket: Digital products ($49, $79, $39) sold via Gumroad
- Lead magnet: "The Field Brief Playbook" (free PDF)
- CTA: "Book a 15-Min Field Brief" (Calendly)

---

## PART A: CRITICAL FIXES (Do These First)

### A1. Fix All Payment Links
**Priority: CRITICAL**

All "Buy Now" buttons across the site currently link to Stripe test placeholder URLs. Replace ALL three product purchase links with Gumroad product links.

| Product | Current Broken Link | New Action |
|---------|-------------------|------------|
| Personal Brand Starter Kit ($49) | `https://buy.stripe.com/test_placeholder_1` | Link to `https://fieldcraftdigital.gumroad.com/l/personal-brand-starter-kit` |
| Solo Operator Blueprint ($79) | `https://buy.stripe.com/test_placeholder_2` | Link to `https://fieldcraftdigital.gumroad.com/l/solo-operator-blueprint` |
| Productized Service Guide ($39) | `https://buy.stripe.com/test_placeholder_3` | Link to `https://fieldcraftdigital.gumroad.com/l/productized-service-guide` |

**Open Gumroad links in a new tab** (`target="_blank" rel="noopener noreferrer"`).

### A2. Fix All "Start a Conversation" CTAs
**Priority: CRITICAL**

Every "Start a Conversation" CTA on the site currently either links nowhere or links to a dead anchor. Replace ALL instances to point to the new `/brief` page (see Part C1 below).

Instances to fix:
1. Hero section primary CTA button
2. Homepage "Ready to build something that's actually yours?" CTA
3. Nav bar "Start a Conversation" button (top right)
4. Products page "Want something custom? Let's talk" CTA

All should navigate to `/brief`.

### A3. Fix the Contact Section
**Priority: CRITICAL**

In the homepage contact/CTA section (above the footer), the current text says:
> "Or just say hello"

Replace this with:
> "Prefer to book directly? [Book a 15-Min Field Brief](/brief)"

Make "Book a 15-Min Field Brief" a styled link in the mint green accent color (`#34d399`), underline on hover.

Keep the `hello@fieldcraft.digital` email link as-is.

---

## PART B: EXISTING PAGE MODIFICATIONS

### B1. HOMEPAGE (/) — Additions

#### B1a. Add Newsletter Signup Banner
Insert a new section between the "How It Works" section and the "Digital Products" section.

**Design:** Full-width banner, slightly lighter dark green background (`#1a3a2a`), centered content.
**Copy:**
- Headline: "THE FIELD REPORT" (monospace uppercase, mint green, tracking wide)
- Subheadline: "Bespoke software insights for operators who refuse to use templates. One email a week. No fluff." (white, 16px, max-width 500px centered)
- Input field: Email placeholder "your@email.com" — dark background (#0f281e), 1px border (#34d399), white text, monospace
- Button: "Subscribe" — mint green background (#34d399), dark text (#0f281e), rounded-full, uppercase monospace
- Small text below: "Join 200+ operators. Unsubscribe anytime." (muted gray, 12px)

**Functionality:** Use an embedded ConvertKit or Beehiiv signup form. For now, create the UI and use a form that POSTs to a placeholder endpoint (`/api/subscribe`). Document where to insert the actual form embed code.

#### B1b. Enhance the Contact/CTA Section
The current final CTA section says:
> "Ready to build something that's actually yours? Every Fieldcraft portal starts with a conversation."

Change to:
> "Ready to build something that's actually yours? Every Fieldcraft portal starts with a 15-minute Field Brief — zero pitch, just clarity on your biggest bottleneck."

Replace the email-only layout with a **dual-option layout**:
- **Left side (primary):** Large mint green button "Book Your Free Field Brief" → links to `/brief`
- **Right side (secondary):** "Or email hello@fieldcraft.digital" with the mailto link

#### B1c. Add High-Ticket Pricing Teaser
Insert a small section between the "Digital Products" cards and the About section.

**Design:** Narrow banner, centered, dark background with subtle 1px top border in muted green.
**Copy:**
> "Need something built specifically for your business?"
> "Custom portals start at GBP 5,000. See pricing."
> "See pricing" links to `/pricing`

Style: "Need something built specifically for your business?" in white, 18px. "Custom portals start at GBP 5,000" in muted gray. "See pricing" as a mint green link with arrow (→).

### B2. PRODUCTS PAGE (/products) — Additions

#### B2a. Add Gumroad Trust Badges
Below the product description on each card, add small text:
> "Delivered instantly via Gumroad. 30-day guarantee."

Style: 12px, muted gray, italic.

#### B2b. Add "Bundle & Save" Card
Add a fourth card below the three product cards (or as a highlighted row spanning all three columns).

**Design:** Full-width card, slightly different background with a subtle mint green border glow.
**Copy:**
- Title: "The Complete Operator Stack"
- Description: "All three playbooks. One price. The exact systems I use to run Fieldcraft Digital solo."
- Features list:
  - Personal Brand Starter Kit
  - Solo Operator Blueprint
  - Productized Service Guide
  - Bonus: 30-min strategy call with Austin
- Price: "$129" (strikethrough "$167" next to it)
- CTA: "Get the Stack" → links to `https://fieldcraftdigital.gumroad.com/l/complete-operator-stack`

#### B2c. Add High-Ticket Upsell Section
Below the digital products grid, add a new full-width section:

**Design:** Darker background (#0a1f15), generous padding (80px vertical).
**Copy:**
- Small label: "BESPOKE SERVICES" (mint green, uppercase, monospace, tracking wide)
- Headline: "These templates run my business. But sometimes you need something built *just* for you." (white, large, the "just" in italic)
- Sub-bullets:
  - "Custom client portals built around your workflow"
  - "AI-powered blueprint generation before a single line of code"
  - "Delivery in 30-60 days, not 6 months"
  - "Starts at GBP 5,000 — one flat fee, no surprises"
- CTA: "Book a Field Brief" → links to `/brief` (mint green filled button)
- Below CTA: "Not sure yet? Grab the free Field Brief Playbook." where "Field Brief Playbook" links to `/playbook`

### B3. FOOTER (All Pages)

**Current footer:** Just "© 2026 Fieldcraft Digital" and "Hand-coded in Bangalore"

**Replace with a proper 4-column footer:**

**Column 1 — Brand:**
- "Fieldcraft" logo text (monospace, mint green dot)
- "Bespoke software portals for operators who refuse templates." (muted gray, 14px, max-width 200px)

**Column 2 — Navigate:**
- Work (`/work`)
- Process (`/process`)
- Products (`/products`)
- Pricing (`/pricing`)
- Book a Brief (`/brief`)

**Column 3 — Resources:**
- The Field Report (newsletter — anchor to homepage signup section)
- The Field Brief Playbook (`/playbook`)
- LinkedIn (`https://www.linkedin.com/in/austin-senson-19014018b/`)
- Writing @austinxalchemy (`https://medium.com/@austinsenson95`)

**Column 4 — Connect:**
- hello@fieldcraft.digital (mailto)
- Based in Bangalore. Building globally.
- Small: "Hand-coded with precision."

**Bottom bar:**
- Left: © 2026 Fieldcraft Digital. All rights reserved.
- Right: Privacy Policy (`/privacy`) | Terms (`/terms`)

Style: Background slightly darker than page (#0a1f15), top border 1px solid rgba(52, 211, 153, 0.1), padding 60px 40px, all links in muted gray (#9ca3af) turning white on hover.

---

## PART C: NEW PAGES TO CREATE

### C1. /brief — "Book a Field Brief" Landing Page

This is the PRIMARY conversion page for high-ticket services. Make it clean, focused, and high-converting.

**Hero Section:**
- Headline: "Book Your 15-Minute Field Brief" (large, white, bold)
- Subheadline: "Zero pitch. Just clarity on the one bottleneck costing you time, money, or clients every week." (muted gray, 18px)
- Trust line: "Join 50+ operators who've mapped their next move." (small, mint green)

**Video Section (Below hero):**
- Placeholder for a VSL (Video Sales Letter) — 16:9 aspect ratio container with dark background
- Show a play button overlay with text: "Watch: How The Field Brief Works (3 min)"
- Below the video container, add text: "VSL coming soon. For now, book directly below." (small, muted gray, italic)
- The video container should be styled to accept an embedded Vimeo/YouTube iframe later

**The 3 Qualifying Questions (Below video):**
Style these as an elegant form card on a slightly elevated dark background.

- **Question 1:** "What is the #1 manual bottleneck or custom software idea you want to build right now?"
  - Textarea, 4 rows, placeholder: "e.g., I spend 6 hours every Monday manually onboarding new clients through 4 different tools..."
  
- **Question 2:** "What is your rough budget estimate?"
  - Radio buttons or styled select dropdown:
    - Under GBP 5,000
    - GBP 5,000 — 10,000
    - GBP 10,000 — 20,000
    - GBP 20,000+
    - Not sure yet
    
- **Question 3:** "Do you have budget allocated to solve this problem?"
  - Radio buttons:
    - Yes, ready to move
    - Planning to allocate
    - Just exploring options

**Calendly Embed Section:**
- Headline: "Pick Your Time" (white)
- Subtext: "Available slots this week and next. All times in IST (UTC+5:30)." (muted gray)
- Embed a responsive Calendly inline widget container (use a placeholder div with ID `calendly-inline-widget` and document where to paste the Calendly embed code)
- Below: "Prefer email? Reach out at hello@fieldcraft.digital" (small link)

**FAQ Section:**
- H3: "Frequently Asked Questions" (white, centered)
- Accordion-style FAQ items:
  - "Is this a sales call?" → "No. The Field Brief is a diagnostic. I ask questions, map your bottleneck, and give you a clear path forward. If that path involves working together, I'll send you a proposal after the call. No pressure on the call itself."
  - "What do I need to prepare?" → "Nothing formal. Just show up with the one workflow, tool, or problem that's been on your mind. The more specific, the better."
  - "How much does a custom portal cost?" → "Portal Lite starts at GBP 5,000 for a single-purpose portal. Portal Pro at GBP 10,000 for a multi-module command centre. Portal Enterprise at GBP 20,000 for a full-scale business operating system. All flat fees — no hourly billing surprises."
  - "How long does it take?" → "Portal Lite: 30 days. Portal Pro: 45 days. Portal Enterprise: 60 days. I deliver living systems, not static websites."
  - "What if I'm not ready to build yet?" → "Grab The Field Brief Playbook (free). It'll help you identify your #1 bottleneck and what's possible within your budget."

**CTA Banner (Bottom):**
- "Not ready to book? Get the free Field Brief Playbook and identify your bottleneck in 10 minutes."
- Button: "Get the Free Playbook" → links to `/playbook`

### C2. /pricing — Pricing Page

**Hero:**
- Headline: "Investment" (monospace uppercase, mint green)
- Subheadline: "Custom portals for serious operators. Flat fees. No surprises." (white, 24px)

**3 Pricing Cards (side by side on desktop, stacked on mobile):**

**Card 1 — Portal Lite:**
- Badge: "STARTER" (small, muted gray, uppercase)
- Name: "Portal Lite" (white, 24px, bold)
- Price: "GBP 5,000" (large, white, with "one-time" in small muted gray below)
- Description: "Single-purpose portal. One core workflow automated." (muted gray)
- Feature list (each with green checkmark):
  - AI-powered blueprint generation
  - Branded dashboard interface
  - Core workflow automation
  - Basic payment integration
  - 30-day delivery
  - 30 days post-launch support
- CTA: "Book a Field Brief" → `/brief` (outline button, mint green border)

**Card 2 — Portal Pro (HIGHLIGHTED):**
- Badge: "MOST POPULAR" (mint green background, dark text, small pill)
- Name: "Portal Pro" (white, 24px, bold)
- Price: "GBP 10,000" (large, white, "one-time" below)
- Description: "Multi-module command centre. Your business, unified." (muted gray)
- Feature list:
  - Everything in Portal Lite
  - Multi-module architecture
  - Automated client delivery
  - Advanced payment & subscription flows
  - Basic AI assistant integration
  - 45-day delivery
  - 60 days post-launch support
- CTA: "Book a Field Brief" → `/brief` (filled button, mint green background, dark text — make this the prominent CTA)
- **Visual treatment:** Slightly elevated, mint green border glow (1px solid rgba(52, 211, 153, 0.3)), subtle shadow

**Card 3 — Portal Enterprise:**
- Badge: "SCALE" (small, muted gray, uppercase)
- Name: "Portal Enterprise" (white, 24px, bold)
- Price: "GBP 20,000" (large, white, "one-time" below)
- Description: "Full-scale business operating system. Built to grow." (muted gray)
- Feature list:
  - Everything in Portal Pro
  - Custom AI agents & automations
  - Multi-user role management
  - Advanced analytics dashboard
  - Priority support channel
  - 60-day delivery
  - 90 days post-launch support
- CTA: "Book a Field Brief" → `/brief` (outline button)

**Below the cards:**
- Centered text: "Not sure which tier fits? The Field Brief will give you a clear recommendation." (muted gray)
- Centered link: "Book a Free Field Brief" (mint green, underlined)

**Process Preview Section:**
- Reuse the "3 Steps" visual from the homepage but condensed
- Step 01: Discovery → Step 02: Architecture → Step 03: Delivery
- Each with one-line description
- CTA: "See full process" → `/process`

**Digital Products Teaser (Bottom):**
- "Not ready for a custom build? Start with a playbook." (white)
- 3 mini product cards (horizontal row, smaller than products page)
- Each shows name, price, and "View on Gumroad" link
- Links to `/products`

### C3. /playbook — Lead Magnet Landing Page

This is a dedicated landing page for "The Field Brief Playbook" free PDF download.

**Layout:** Single-column, centered, max-width 600px. No nav distractions (keep the Fieldcraft logo linking home, but hide the full nav or make it minimal).

**Hero:**
- Small label: "FREE RESOURCE" (mint green, uppercase, monospace)
- Headline: "Identify Your #1 Software Bottleneck in 10 Minutes" (large, white, bold)
- Subheadline: "The same diagnostic framework I use in my GBP 5K–20K client engagements — distilled into a free playbook." (muted gray, 18px)

**What's Inside (Bulleted list):**
- "The 5 signs you need a custom portal (not another SaaS tool)"
- "The true cost calculator: what manual work is actually costing you per month"
- "The 3-question diagnostic I use in every client call"
- "What's possible in 30 days vs. 60 days vs. 6 months"
- "Real portal examples: before and after workflows"

Style: Each bullet has a small mint green checkmark icon, text in white, generous line-height (1.8).

**Email Capture Form:**
- Label: "Where should I send your playbook?" (white, 16px)
- Input: First name (placeholder: "First name")
- Input: Email (placeholder: "your@email.com")
- Button: "Send Me The Playbook" (mint green filled, dark text, rounded-full, full-width)
- Below button: "No spam. Unsubscribe anytime. Your email funds nothing but great software." (12px, muted gray)

**Functionality:** The form should POST to a placeholder endpoint. Document clearly where to insert ConvertKit/Beehiiv/EmailOctopus form embed code. On "submit," show a success state:
- Checkmark animation (mint green)
- "Check your inbox! The Field Brief Playbook is on its way."
- "While you wait: Book a free 15-min Field Brief if you want me to personally diagnose your bottleneck."
- Secondary CTA: "Book a Field Brief" → `/brief`

**Social Proof (Below form):**
- Small testimonial placeholder: "This playbook helped me realize I was spending 12 hours a week on manual client onboarding. Austin built me a portal that cut it to 20 minutes." — Name, Business
- Style: Italic, muted gray, with quotation marks in mint green

### C4. /privacy & /terms — Legal Pages

Create minimal but complete legal pages. Use a standard privacy policy and terms of service template adapted for:
- Fieldcraft Digital
- Contact: hello@fieldcraft.digital
- Based in Bangalore, India
- Services: Custom software development and digital products
- Data collection: Email (newsletter), contact form data, Calendly booking data
- Payment processing: Gumroad for digital products, direct invoicing for services

Style: Same dark green background, white text, max-width 800px centered, clean typography. Simple and functional.

---

## PART D: NAVIGATION UPDATES

### D1. Add Pricing to Nav
Add "Pricing" (`/pricing`) to the main navigation between "Products" and "About".

### D2. Nav CTA
Change the top-right nav CTA from "Start a Conversation" to "Book a Field Brief". Keep it styled as the mint green pill button. Link to `/brief`.

### D3. Mobile Nav
Ensure all new pages (`/brief`, `/pricing`, `/playbook`, `/privacy`, `/terms`) appear in the mobile hamburger menu.

---

## PART E: SEO & METADATA

Update `<title>` and `<meta name="description">` for every page:

| Page | Title | Meta Description |
|------|-------|-----------------|
| Homepage | Fieldcraft Digital — Bespoke Software Portals | No templates. No compromises. Custom software portals engineered around how your business actually works. Starts at GBP 5,000. |
| /products | Digital Products — Fieldcraft Digital | Templates, systems, and playbooks I use to run Fieldcraft Digital solo. From $39. |
| /pricing | Pricing — Fieldcraft Digital | Flat-fee custom software portals. Portal Lite GBP 5K, Portal Pro GBP 10K, Portal Enterprise GBP 20K. Book a free Field Brief. |
| /brief | Book a Field Brief — Fieldcraft Digital | 15 minutes. Zero pitch. Just clarity on your biggest software bottleneck. Book your free diagnostic call. |
| /playbook | Free Field Brief Playbook — Fieldcraft Digital | Identify your #1 software bottleneck in 10 minutes with the same diagnostic I use in GBP 5K–20K engagements. |
| /privacy | Privacy Policy — Fieldcraft Digital | How Fieldcraft Digital collects, uses, and protects your data. |
| /terms | Terms of Service — Fieldcraft Digital | Terms and conditions for using Fieldcraft Digital services and products. |

Add Open Graph tags for all pages with appropriate images (use the existing hero visual or a mint green branded OG image).

---

## PART F: ANALYTICS & TRACKING

### F1. Add Google Analytics 4
Insert the GA4 script in the `<head>` of every page. Use a placeholder `G-XXXXXXXXXX` and document where to insert the real Measurement ID.

### F2. Add Conversion Events
Track these events:
- `brief_page_view` — when `/brief` is loaded
- `playbook_download_click` — when the playbook form is submitted
- `book_call_click` — when Calendly "Book" is clicked
- `product_purchase_click` — when any Gumroad "Buy Now" is clicked (tag each product separately)
- `pricing_page_view` — when `/pricing` is loaded

### F3. Add Meta Pixel (Optional)
Placeholder for Meta Pixel code (Facebook/Instagram ads). Document where to insert the Pixel ID.

---

## PART G: RESPONSIVE REQUIREMENTS

- All new pages must be fully responsive (mobile, tablet, desktop)
- Pricing cards stack vertically on mobile (Pro card first/most prominent on mobile)
- `/brief` page: Calendly widget should be 100% width on mobile
- `/playbook` page: form inputs should be full-width on mobile
- Footer: 4 columns → 2 columns on tablet → 1 column stacked on mobile
- Nav: hamburger menu on mobile with all links including new pages

---

## PART H: PERFORMANCE & ACCESSIBILITY

- All images must have descriptive `alt` text
- Buttons must have clear focus states (mint green outline)
- Color contrast ratios must meet WCAG AA (white on dark green passes, verify mint green on dark green)
- Page load targets: < 2s for all new pages
- Lazy load the Calendly embed (only load when section scrolls into view)

---

# IMPLEMENTATION ORDER

1. **Phase 1 (Critical):** A1, A2, A3 — Fix all broken links and CTAs
2. **Phase 2 (Pages):** C1 (/brief), C2 (/pricing), C3 (/playbook) — Build new conversion pages
3. **Phase 3 (Enhancements):** B1, B2, B3 — Add newsletter, bundle card, footer, pricing teasers
4. **Phase 4 (Polish):** D, E, F, C4 — Nav updates, SEO, analytics, legal pages
5. **Phase 5 (Test):** G, H — Responsive testing, accessibility audit

---

# NOTES FOR DEVELOPER

- Preserve the existing interactive particle/warp field effect on the homepage hero at ALL costs
- Keep all existing scroll animations, section transitions, and hover effects
- The dark forest green aesthetic with mint green accents is sacred — do not introduce new colors
- All new code should match the existing codebase patterns (React components, CSS modules, etc.)
- Use existing component patterns where possible (Button, Card, Section, etc.)
- Document all placeholder values clearly with `TODO:` comments
