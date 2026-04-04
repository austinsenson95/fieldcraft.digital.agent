# Fieldcraft Digital — Brand DNA & Website Blueprint

## 1. Brand Foundation

### Brand Name
**Fieldcraft Digital**

### Domain
`fieldcraft.digital`

### Tagline
Primary: *Engineered around you.*
Secondary: *Precision-built digital systems.*

### One-Line Positioning
Fieldcraft Digital builds bespoke software portals for personal brands and solo businesses — engineered around your unique model, not a template.

### What We Actually Sell
Personalised Software Portals as a Service (PSPaaS). Each portal is a living operating system for a client's business — AI-powered blueprint generators, automated delivery, branded dashboards, payment integration, and video content. No two portals are alike because no two businesses are alike.

---

## 2. Brand DNA

### Internal Mythology (Not Client-Facing)
"Field" — the sovereign field of influence, the morphic field, the electromagnetic field (firmware roots), the field of consciousness.
"Craft" — deliberate mastery through skill, not automation.
"Digital" — grounds the brand commercially.

To clients: "Expert digital craftsmanship."
To Austin: "Shaping the field through craft."

### Core Identity Tension
The engineer who sees invisible structures. Not just building software — perceiving the underlying pattern of someone's business and crystallizing it into a living system. Alchemical thinking applied to code, but expressed as engineering precision.

### Brand Archetype
**The Master Craftsman** — not the wizard, not the disruptor, not the guru. The person who builds things at a level you didn't know was possible, and does it quietly.

### Brand Principles

1. **Bespoke over scalable** — Every portal is built from scratch around one client. We don't reskin templates.
2. **System over feature** — We deliver integrated operating systems, not feature checklists.
3. **Clarity over complexity** — The best software feels simple. Complexity lives in the architecture, not the interface.
4. **Depth over breadth** — We go deep with fewer clients rather than shallow with many.
5. **Craft over speed** — We don't rush. Every pixel, every interaction, every data flow is intentional.

---

## 3. Visual Identity

### Color Palette

#### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Deep Field | `#0F2B1E` | Primary dark / backgrounds / hero sections |
| Verdant | `#1D9E75` | Primary accent / CTAs / active states |
| Mint | `#5DCAA5` | Secondary accent / hover states / highlights |
| Parchment | `#F5F1EB` | Light backgrounds / cards / surfaces |
| Obsidian | `#1A1A18` | Text / deep black / contrast |

#### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Accent Gold | `#C8A96E` | Premium touches / subtle highlights / CTAs on dark |
| Warm Gray | `#E8E2D8` | Borders / dividers / muted surfaces |
| Soft Teal | `#9FE1CB` | Data viz / progress indicators / light accents |
| Deep Teal | `#085041` | Text on light teal backgrounds |

#### Color Philosophy
- **Dark-first design** — the site lives primarily in Deep Field (#0F2B1E) and Obsidian (#1A1A18). This creates cinema. Light sections are the exception, not the rule.
- **Green = life** — the teal/green range signals organic growth, living systems, vitality. It's not generic "tech blue."
- **Gold = hidden alchemy** — used sparingly. A gold accent on a CTA. A gold line separating sections. Clients read "premium." Austin knows it's aurum.
- **No gradients in branding** — flat, confident color blocks. Gradients only appear as ambient atmospheric effects on the website (see Section 5).

### Typography

#### Font Pairing
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display/Headlines | **Satoshi** or **General Sans** | 500-700 | Hero text, section headings, large callouts |
| Body | **DM Sans** or **Plus Jakarta Sans** | 400-500 | Paragraphs, descriptions, UI text |
| Accent/Tagline | **Instrument Serif** or **Cormorant** | 400 | Tagline only, single words, pull quotes |
| Code/Technical | **JetBrains Mono** or **Fira Code** | 400 | Code snippets, technical specs, portal demo UI |

#### Typography Rules
- Headlines: -0.5px letter-spacing, sentence case, never ALL CAPS
- Body: 16-18px, line-height 1.6-1.7
- Maximum 2 fonts visible on any single viewport
- Serif accent used ONLY for the tagline and 1-2 pull quotes across the entire site
- Numbers always in tabular (monospace) figures

### Logo

#### Wordmark (Primary)
"Fieldcraft" in Satoshi 500 + "Digital" in Satoshi 400 (lighter weight). The weight contrast separates the two words without a space or divider.

#### Monogram (Secondary)
A stylized "F" in Instrument Serif set inside a rounded square with Deep Field background and Mint fill. Below the F, a thin horizontal line and "DIGITAL" in 7px tracked uppercase.

#### Logo Usage Rules
- Minimum clear space: 1x the height of the "F" on all sides
- On dark backgrounds: Mint wordmark
- On light backgrounds: Obsidian wordmark
- Never place the logo on busy backgrounds or photographs
- The monogram is used for favicons, social avatars, and app icons only

---

## 4. Brand Voice

### Voice Attributes

| Attribute | What It Means | Example |
|-----------|---------------|---------|
| **Precise, not cold** | Every word earns its place. No filler, no jargon. | "Your portal includes a Claude-powered blueprint generator" not "Leveraging cutting-edge AI technology to deliver next-gen solutions" |
| **Confident, not loud** | The work speaks. No superlatives. | "We build one system per client" not "We're revolutionizing the future of personalized software" |
| **Personal, not casual** | First-person warmth. Human. Direct. | "I'll build this around how you actually work" not "Our team delivers customized workflow optimization" |
| **Deep, not esoteric** | Suggest depth without explaining the philosophy. | "Every system starts with understanding the pattern underneath your business" not "Using Hermetic principles of correspondence..." |

### Writing Rules
1. Never use: disrupt, revolutionary, game-changing, leverage, synergy, unlock, empower, holistic (in client copy), paradigm, scalable (as a feature), cutting-edge
2. Never use: affordable, cheap, budget, discount — this is premium positioning
3. Prefer active voice and concrete nouns
4. One idea per sentence. Short paragraphs. Generous whitespace.
5. Client-facing copy never exceeds 8th grade reading level (Hemingway standard)
6. Numbers and specifics over adjectives: "3 months of architecture" beats "extensive planning phase"

### Tone by Context
- **Website hero**: Cinematic. Sparse. Let the visuals breathe.
- **Service descriptions**: Clear, specific, benefit-first.
- **Case studies**: Story-driven, show the transformation.
- **Email/DMs**: Warm, direct, slightly conversational.
- **Social media**: Sharper, more personality, still precise.
- **Technical documentation**: Dense, accurate, no filler.

---

## 5. Website Architecture & Design

### Design Philosophy
The Fieldcraft Digital website is not a brochure — it's a **proof of concept**. Every interaction, animation, and design decision should make the visitor think: "If he built *this* for himself, imagine what he'd build for *me*."

The site should feel like **Apple's product pages meet a living software demo** — cinematic scroll reveals, 3D elements, and a section where the visitor experiences personalization firsthand.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + custom CSS variables |
| Animation | Framer Motion + GSAP (scroll-triggered) |
| 3D Elements | Three.js / React Three Fiber (selective, not gimmicky) |
| Video/Motion | Remotion (for portal demo videos) |
| Hosting | Vercel |
| Domain | fieldcraft.digital |
| Analytics | Vercel Analytics or Plausible |
| CMS (future) | Notion API or Sanity (for case studies) |

### Page Structure

#### Page 1: Home (Single-Page, Scroll-Driven)

**Section 1 — Hero (100vh)**
- Full dark screen (#0F2B1E)
- Large display text: "Engineered around you." in Instrument Serif, centered
- Subtle ambient particle field or geometric mesh in the background (low opacity, responding to mouse movement) — this is the "field" visual metaphor
- No navigation visible initially — it appears on scroll
- Small down-arrow or "scroll" indicator at bottom
- Micro-interaction: the text subtly shifts parallax on mouse move (1-2px only, not distracting)

**Section 2 — The Problem (scroll reveal)**
- Dark background continues
- Text appears line-by-line on scroll:
  - "Your business runs on systems designed for someone else."
  - "Templates. Plugins. Workarounds."
  - "What if your software actually thought like your business?"
- Each line fades in with a slight upward motion (Framer Motion stagger)
- After the last line, a horizontal divider animates across, transitioning to...

**Section 3 — What We Build (scroll-triggered showcase)**
- Background shifts to slightly lighter dark (#162B24)
- A 3D portal mockup rotates slowly in the center — this is a stylized representation of a client portal
- Around it, floating labels animate in: "AI Blueprint Generator" / "Branded Dashboard" / "Automated Delivery" / "Payment Integration" / "Video Content Engine"
- As user scrolls further, the 3D portal "opens" and shows an actual portal interface screenshot/demo
- This section should feel like a product reveal — Apple keynote energy

**Section 4 — The Personalization Proof (interactive)**
- "Don't take our word for it. Experience it."
- An interactive mini-demo:
  - Visitor types their business name (or it auto-detects from referrer/IP and pre-fills a suggestion)
  - The portal mockup on screen dynamically updates: their name appears in the portal header, brand colors shift, the blueprint section populates with relevant industry prompts
  - This is the "site knows I'm here" moment — even a simple version of this is *extremely* powerful as a sales tool
- Fallback for no input: show a cycling demo of 3 different portal configurations (coaching, SaaS, creator)

**Section 5 — How It Works (3-step process)**
- Clean section, slightly lighter background or Parchment (#F5F1EB) for contrast
- Three steps, each with a custom icon/illustration:
  1. **Discovery** — "We map the invisible structure of your business"
  2. **Architecture** — "Your portal is engineered from your model, not a template"
  3. **Delivery** — "A living system, not a static website"
- Each step reveals on scroll with a connecting line that draws between them

**Section 6 — Case Study / Proof (when available)**
- For now: a "Coming Soon" version showing the Hamza portal concept
- Dark background with a large screenshot, key metrics, and a short testimonial
- Later: full case study with before/after, metrics, video walkthrough

**Section 7 — About / The Builder**
- Small section. Austin's photo (professional, not casual), 3 lines max:
  - "Austin Senson. Firmware engineer turned software architect."
  - "I build systems that think like the businesses they serve."
  - "Based in Bangalore. Building globally."
- Links to LinkedIn, Medium, Instagram (@austinxalchemy)
- No mention of mystical/esoteric frameworks — the depth is *felt* in the craft, not stated in the bio

**Section 8 — CTA / Contact**
- Full dark screen again, bookending the hero
- Large text: "Ready to build something that's actually yours?"
- Single CTA button in Verdant (#1D9E75): "Start a Conversation"
- Links to: Calendly booking / WhatsApp / email (austin@fieldcraft.digital)
- Below: "Or just say hello — hello@fieldcraft.digital"

**Navigation (appears on scroll)**
- Fixed top bar, transparent → slight blur background on scroll
- Left: Fieldcraft monogram
- Right: "Work" / "Process" / "About" / "Contact" (scroll-to sections)
- Mobile: hamburger with full-screen overlay menu

---

## 6. Animation & Interaction Spec

### Principles
1. **Motion serves meaning** — every animation communicates something (entry, hierarchy, connection, state change). No animation exists purely for decoration.
2. **Apple-tier timing** — ease curves: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `cubic-bezier(0.4, 0, 0.2, 1)` for standard transitions. Never linear. Never bouncy.
3. **Scroll is the primary input** — 80% of animations are scroll-triggered. The site unfolds like a story.
4. **Mouse awareness, not mouse dependency** — cursor-reactive elements add atmosphere but the site works perfectly without them (mobile, accessibility).

### Specific Animations

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Hero text | Fade in + slight scale (1.02 → 1.0) | Page load | 1.2s |
| Background mesh | Slow float + mouse parallax | Continuous | Infinite (60fps) |
| Problem text lines | Staggered fade-up, 0.15s delay between | Scroll into view | 0.6s each |
| Portal 3D model | Slow Y-axis rotation | Continuous | 20s loop |
| Portal "open" | Scale + perspective shift | Scroll progress (0.3-0.7) | Tied to scroll |
| Feature labels | Fade in from edges toward portal | Scroll into view | 0.4s stagger |
| Process steps | Draw connecting line + fade step | Scroll into view | 0.8s each |
| CTA button | Subtle glow pulse on Verdant | Continuous | 3s loop |
| Nav bar | Opacity 0 → 1 + backdrop blur | Scroll > 100vh | 0.3s |
| Section transitions | Smooth color crossfade on background | Scroll between sections | Tied to scroll |

### 3D Elements (Three.js / React Three Fiber)

**Hero Background — "The Field"**
- A geometric wireframe mesh (icosahedron or custom topology) floating in the center of the hero
- Low-poly, thin strokes in Mint (#5DCAA5) at 15-20% opacity
- Subtle vertex displacement animation (noise-based, organic movement)
- Responds to mouse position: mesh tilts 2-3 degrees toward cursor
- On mobile: auto-animates a slow drift pattern instead of mouse tracking
- Performance budget: < 5ms per frame, lazy-loaded, fallback to CSS gradient on low-end devices

**Portal Mockup (Section 3)**
- A flat panel (like a floating monitor/tablet) showing a portal UI screenshot as a texture
- Gentle Y-axis rotation (0.5 rpm)
- On scroll, rotates to face the viewer and scales up
- The panel has a subtle edge glow in Verdant
- Can be implemented as a CSS 3D transform if Three.js is too heavy for this section

### Performance Requirements
- Lighthouse score: 90+ on mobile
- First Contentful Paint: < 1.5s
- 3D elements lazy-loaded after hero text renders
- All images in WebP/AVIF with responsive srcsets
- Animations respect `prefers-reduced-motion`

---

## 7. Responsive Design

### Breakpoints
| Device | Width | Adaptations |
|--------|-------|-------------|
| Desktop | 1280px+ | Full experience, 3D, mouse interactions |
| Laptop | 1024-1279px | Slightly reduced hero text size, same layout |
| Tablet | 768-1023px | Single column, 3D replaced with static + CSS transforms |
| Mobile | < 768px | Stacked layout, simplified animations, touch-optimized |

### Mobile-Specific
- Hero text: 2-3 lines max, tighter leading
- 3D mesh → CSS animated gradient or static SVG pattern
- Portal mockup → static screenshot with swipe carousel
- Interactive demo → simplified version with pre-filled examples
- Touch targets: minimum 44x44px
- Bottom CTA bar fixed on mobile (WhatsApp / Book a Call)

---

## 8. Content Strategy

### Website Copy — Key Messages

**Hero**: "Engineered around you."

**Subhead**: "Bespoke software portals for personal brands and solo businesses. No templates. No compromises. Just a system that thinks like your business."

**Problem Frame**: "Your business runs on systems designed for someone else. Templates. Plugins. Workarounds. You deserve software that was built from your model — not bent to fit one."

**Solution Frame**: "Fieldcraft Digital builds one-of-a-kind software portals. Each one starts with your business DNA — your audience, your products, your workflow — and becomes a living operating system you own."

**Process**:
1. Discovery — "We map the invisible structure of your business. Not just what you sell, but how your audience thinks, what your delivery looks like, and where the leverage points are."
2. Architecture — "Your portal is engineered from your model. AI-powered blueprint generation, branded dashboards, automated delivery, payment integration — all built as one unified system."
3. Delivery — "You receive a living system, not a static website. Ongoing support, updates, and the ability to evolve as your business grows."

**CTA**: "Ready to build something that's actually yours?"

---

## 9. Future Brand Extensions

### Email
- Primary: austin@fieldcraft.digital
- General: hello@fieldcraft.digital
- Setup via Google Workspace or Zoho Mail (MX records on Hostinger DNS)

### Social Presence
- LinkedIn: Austin Senson — "Founder, Fieldcraft Digital"
- Instagram: @austinxalchemy (personal brand) → links to fieldcraft.digital
- Medium: @austinsenson95 (thought leadership)
- Twitter/X: @fieldcraft_digital (if available)

### Collateral (Phase 2)
- Business card: Deep Field background, Mint monogram, Gold accent line
- Proposal template: matching brand system (docx or PDF)
- Invoice template: clean, branded, professional
- Pitch deck: Dark slides, same typography system

### Brand Evolution Path
- **Now**: Single-page portfolio site for Fieldcraft Digital
- **After Hamza delivery**: Add case study section with real screenshots and metrics
- **After 3 clients**: Add a "Work" page with 3 case studies
- **After 5 clients**: Consider sub-brand or product name for the portal platform itself

---

## 10. Claude Code Build Prompt

When ready to build, provide Claude Code with:

1. This entire document as context
2. The brand board visual (from this conversation)
3. Reference links: Apple product pages, Linear.app, Stripe.com
4. Specific instruction: "Build the Fieldcraft Digital website as a Next.js 14 App Router project with Tailwind CSS, Framer Motion, and optionally Three.js for the hero mesh. Deploy to Vercel. Follow every spec in the Brand DNA document."

### Key Technical Decisions for Claude Code
- Use `next/font` for font loading (Satoshi via Fontshare, DM Sans via Google Fonts)
- Tailwind config extends with all custom colors from Section 3
- Framer Motion `useScroll` + `useTransform` for scroll-linked animations
- GSAP ScrollTrigger as fallback for complex scroll sequences
- Three.js only for the hero mesh — everything else uses CSS transforms
- `prefers-reduced-motion` media query wraps all animation code
- Vercel deployment with custom domain fieldcraft.digital

---

*This document is the single source of truth for the Fieldcraft Digital brand. Every design decision, piece of copy, and technical choice should trace back to this blueprint.*

*Last updated: April 4, 2026*
*Version: 1.0*
