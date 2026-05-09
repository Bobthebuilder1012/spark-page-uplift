## iTutor Landing Page Redesign

The current `src/routes/index.tsx` is the blank placeholder, so this build will create the full landing page from scratch — keeping the same section structure visible in your screenshots, but with a fresh, lively look.

### Visual direction

- **Vibe:** Playful & vibrant — soft mint background washes, blob shapes, sticker-style badges, layered cards with friendly tilts, generous rounding (2xl–3xl).
- **Palette:** Brand green stays dominant (`#22c55e`-family in oklch) with a **coral/orange accent** (`oklch(~0.72 0.18 40)`) used sparingly for highlights, secondary CTAs, badge dots, and graphic accents. Deep ink near-black for headings, off-white mint for surfaces, dark forest green for the footer.
- **Typography:** Modern geometric pairing — **Space Grotesk** for headings (tight tracking, big display sizes) + **Inter** for body. Loaded via Google Fonts in `__root.tsx` head links.
- **Motion (rich, framer-motion):**
  - Hero: staggered word-by-word fade/slide-up, floating testimonial + stat cards with gentle Y-axis loop, animated gradient blob behind the photo.
  - Stats bar: count-up numbers when scrolled into view.
  - How It Works: cards fade-up in sequence, dashed connectors draw in.
  - Testimonials: two auto-scrolling marquee rows (opposite directions), pause on hover.
  - Section headings: word-reveal on scroll.
  - Buttons & cards: hover lift + subtle scale, focus rings using accent color.

### Page structure (single route: `src/routes/index.tsx`)

1. **Sticky nav** — Dark pill nav floating over hero. Logo (green V mark + "itutor" wordmark) left; "Sign Up" ghost + "Log In" green-pill right. Mobile sheet menu.
2. **Hero** — Mint background with animated blobs. Left: "Caribbean's No. 1 Tutoring Platform" pill, huge headline "Unlock Your **Academic Potential**" (Potential in green with a hand-drawn underline SVG), subcopy, two CTAs ("Find a Tutor →" green pill, "Become a Tutor" outline pill), 5-avatar stack + 4.9★ rating block. Right: rounded photo of tutor + student, with two floating cards ("Mr. Ramdeen" review card, "150+ Verified iTutors" stat, "94% pass rate" trophy stat) gently animating.
3. **Stats strip** — 4 metrics (1,000+ Active Students · 1,000+ Sessions Delivered · 25+ Subjects · 4.9★) on a white card with soft shadow, count-up on view.
4. **What Real Students & Parents Are Saying** — Heading + "SEA · CSEC · CAPE…" subhead. Two horizontal marquee rows of testimonial cards (avatar, name, quote) scrolling in opposite directions, edge-faded.
5. **How It Works** — Heading "How It **Works**" (Works in green). 4 numbered cards (01–04: Find Your iTutor, Book a Session, Learn & Grow, Ace Your Exams) with pastel icon tiles (lavender, pink, mint, peach), dashed connectors between them on desktop, green check-stat at the bottom of each.
6. **CTA band** — New addition for life: full-width green→accent gradient panel with "Ready to ace your exams?" + dual CTAs.
7. **Footer** — Dark forest-green panel with subtle radial glow. 3 columns (Company / Everything We Offer / FAQ accordion) + Follow Us socials + bottom legal row, exactly matching the screenshot's structure.

### Technical notes

- New files: `src/routes/index.tsx` (replace placeholder) plus small section components under `src/components/landing/` (Nav, Hero, Stats, Testimonials, HowItWorks, CtaBand, Footer) and `src/components/landing/Marquee.tsx`, `CountUp.tsx`.
- Install `framer-motion` via `bun add framer-motion`.
- Update `src/styles.css`: add brand tokens (`--brand-green`, `--brand-green-soft`, `--brand-mint-bg`, `--brand-ink`, `--brand-coral`, `--brand-coral-soft`, gradient + shadow tokens) in oklch; register in `@theme inline`. Add keyframes for `marquee`, `marquee-reverse`, `blob`, `float-y`.
- Add Google Fonts (Space Grotesk + Inter) link tags in `__root.tsx` `head.links`.
- Generate two images via imagegen: a tutor-with-student hero photo (`src/assets/hero-tutor.jpg`) and ~16 small avatar portraits for testimonials (or reuse a few via seeded DiceBear URLs to keep it light — will use generated photo avatars for the visible 5 hero stack + lucide initials for the rest).
- SEO: proper `<title>`, meta description, og tags set in the route's `head()`.
- Fully responsive: mobile-first, hero stacks, marquee remains, How-It-Works becomes vertical with connector line on the side.

### Out of scope

- No auth, booking, or backend wiring — Sign Up / Log In / Find a Tutor buttons are visual only.
- No additional routes (About, Privacy, etc.) — footer links are anchors/placeholders.
