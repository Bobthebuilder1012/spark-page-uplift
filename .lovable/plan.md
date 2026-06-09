# iTutor Marketplace — Preply-style Rebuild

Adapt all four Preply flows to iTutor's existing dark theme (`#0A0A0A` bg, `#111111` surface, `#1F1F1F` border, white text) with brand green `#32CC6F` replacing Preply's pink. Keep existing routing, shells, and data shape — only swap UI.

## 1. Tutor listing — `src/routes/student.tutors.index.tsx`

Replace the current grid with Preply-style horizontal cards + filter bar.

- **Top filter row** (4 dropdown-style fields): "I want to learn" (subject), "Price per lesson" (range), "Country of birth", "I'm available" (day/time chips)
- **Secondary chip row**: Specialties, Also speaks, Native speaker, Tutor categories, Sort by, Search by name
- **Horizontal tutor card**: square avatar left, name + verified + flag, "Speaks …", Super Tutor / Professional badges, headline, blurb (2 lines), "Active students" + "Lessons taught (Top 5%)" stats, price top-right, "Book trial lesson" CTA, message + heart icons, "Very popular. Booked X times recently"
- **Right sticky video preview panel** (desktop only): hovered tutor's intro video placeholder + "View full schedule" / "See profile" buttons

## 2. Tutor profile — `src/routes/student.tutors.$id.tsx`

- Hero: video intro placeholder (16:9, play button) + name + "Subject tutor · From Country 🇮🇳"
- Headline paragraph (subjects/exam boards)
- **Highlights pills**: ✨ "Tutor's highlights" with pastel pills (Patient / Structured / Goal-Focused)
- **More about me**: blurb with "read more"; "I teach: X" + "I speak: …" rows with icons
- **Lesson rating tiles**: 4 cards (Reassurance / Clarity / Progress / Preparation) with score + icon; "Based on N anonymous student reviews"
- **What my students say**: big "4.9 ⭐" + "Based on N reviews" + 2-column review list with avatar, name, date, stars, text, "Show more"
- **Sticky booking card** (right):
  - Price + "50-min lesson"
  - Rating block + lessons count
  - Big "Book trial lesson" CTA (brand green)
  - Message / favorite / share icon row
  - "Not a match? You still have 2 free tutor trials" trust box (brand-soft bg)
  - "Very popular — 13 bookings in last 2 days" footer

## 3. Booking flow

**Modal — `src/components/booking/BookTrialModal.tsx`** (opened from Book trial buttons)
- Header: tutor avatar + "Book a trial lesson / To discuss your level and learning plan"
- 25 mins / 50 mins toggle
- Week navigator (← Jun 8–14, 2026 →) with 7 day pills, current day highlighted in brand
- Morning / Afternoon / Evening sections with time-slot pill buttons
- "Very popular — Booked 21 times recently" footer
- Continue CTA (disabled until slot picked) → navigates to checkout

**Checkout page — `src/routes/checkout.$tutorId.tsx`**
- Brand-tinted hero band: "Speak {Subject} for your career in 1–3 months"
- Left column: "Your tutor" card (name, rating, students/lessons/years stats, "Perfect for business topics" highlight); "Trial lesson details" card (date block + time + "Cancel or reschedule for free…"); "Checkout info" card (25/50 toggle, lesson + processing fee + total, "Have a promo code?", "Free tutor replacement" footer)
- Right column: "Choose how to pay" (Card / Apple Pay / Google Pay tiles), card form (number/MM-YY/CVC, save card checkbox), "Book lesson and pay · $X" CTA, policy text
- Below right: "{Tutor} is a great choice" review carousel card

## 4. Onboarding wizard — `src/routes/onboarding.tsx`

3-step wizard with progress + Continue:
1. **Subject** — chips of subjects
2. **Budget** — "What's your budget?" dual-handle range slider with histogram visual, Min/Max inputs
3. **Loading** — full-bleed brand-green panel: iTutor logo + "Finding tutors who will inspire you." then auto-redirect to `/student/tutors` after ~1.5s

## 5. Shared components (new)

- `src/components/marketplace/TutorListCard.tsx` — horizontal card
- `src/components/marketplace/FilterBar.tsx` — filter dropdowns + chip row
- `src/components/marketplace/VideoPreviewPanel.tsx` — sticky right panel
- `src/components/marketplace/RatingTile.tsx` — lesson-rating score tile
- `src/components/marketplace/ReviewItem.tsx` — single review row
- `src/components/booking/BookTrialModal.tsx` — slot picker modal
- `src/components/booking/PaymentMethodTile.tsx` — Card/Apple/Google tile
- `src/components/onboarding/BudgetSlider.tsx` — dual-handle slider with histogram

## Technical notes

- All placeholder data hardcoded in route files — no Supabase calls.
- Reuse `TutorAvatar` (oklch hue), `StarRating`, `TrustBox`.
- Modal uses existing shadcn `Dialog`; week navigator state local to modal.
- Onboarding redirect via `useNavigate` + `setTimeout`.
- Add `/checkout/$tutorId` and `/onboarding` to routes; rest are edits.
- framer-motion only for: modal open, star pulse, loading screen fade — keep light.
- All Preply pink → `#32CC6F`; all white bg → `#0A0A0A`; preserve existing dark theme tokens.

## Out of scope

- No real payment integration (UI only).
- No real video player (poster + play icon overlay).
- No availability backend — slot data is static per tutor.