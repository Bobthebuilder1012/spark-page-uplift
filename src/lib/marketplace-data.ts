// Mock data for the public Classes marketplace (student-facing).
// UI-only — no backend.

export type ClassState =
  | "open"               // public class, can self-join
  | "approval-required"  // student requests, tutor approves
  | "full"               // at capacity, waitlist only
  | "awaiting-approval"  // current viewer has already requested, waiting on tutor
  | "awaiting-consent"   // joined; parent must consent + pay
  | "recurring-1on1";    // 1:1 — student confirms tutor-set terms

export type BillingModel = "per-month" | "per-session" | "prepaid";

export type MarketClass = {
  id: string;
  title: string;
  subject: string;       // Maths / Physics / English / SEA / etc.
  level: string;         // CSEC / CAPE / SEA
  formLevel: string;     // "Form 4–5 (14–16)" — display label with ages
  tutorId: string;
  tutorName: string;
  tutorHue: number;
  tutorRating: number;
  tutorReviews: number;
  emoji: string;
  bannerFrom: string;    // tailwind gradient
  bannerTo: string;
  price: number;                 // current TTD
  originalPrice?: number;        // when discounted
  discountLabel?: string;        // "EARLY-BIRD 20% OFF"
  billing: BillingModel;
  billingDescription: string;    // human-readable terms
  schedule: string;              // "Mondays · 5:00–7:00 PM AST"
  cadence: string;               // "4 sessions per month"
  seatsTaken: number;
  seatsTotal: number;            // for 1:1 this is 1/1 when booked
  includesParentFeedback: boolean;
  approvalRequired: boolean;     // tutor approves requests
  kind: "group" | "recurring-1on1";
  shortBlurb: string;
  longDescription: string;
  whatsIncluded: string[];
  startDate: string;             // "Starts 1 June 2026" or "Ongoing"
};

// Canonical form-level labels with student ages. Reuse everywhere a form level is shown.
export const FORM_LEVELS = {
  primary: "Std 4–5 (9–11)",
  form1: "Form 1 (11–12)",
  form2: "Form 2 (12–13)",
  form3: "Form 3 (13–14)",
  form4: "Form 4 (14–15)",
  form5: "Form 5 (15–16)",
  csec: "Form 4–5 (14–16)",
  lower6: "Lower 6 (16–17)",
  upper6: "Upper 6 (17–18)",
  cape: "Lower & Upper 6 (16–18)",
} as const;

// Scarcity threshold: show "Only X left" when remaining <= 4 and > 0.
export const LOW_STOCK_THRESHOLD = 4;

export const MARKET_CLASSES: MarketClass[] = [
  {
    id: "csec-maths-mastery",
    title: "CSEC Maths Mastery",
    subject: "Mathematics", level: "CSEC",
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorRating: 4.95, tutorReviews: 211,
    emoji: "📐", bannerFrom: "from-brand", bannerTo: "to-brand-deep",
    price: 220, billing: "per-month",
    billingDescription: "TT$220 / month · auto-renews · cancel anytime",
    schedule: "Mondays · 5:00–7:00 PM AST",
    cadence: "4 sessions per month",
    seatsTaken: 10, seatsTotal: 12,
    includesParentFeedback: true,
    approvalRequired: false,
    kind: "group",
    shortBlurb: "Paper 1 & Paper 2 mastery with weekly past-paper drills.",
    longDescription:
      "A focused weekly class taking you from algebra fundamentals through to full Paper 2 mastery. Every session is timed past-paper practice followed by targeted re-teaching of weak topics. Recordings included.",
    whatsIncluded: [
      "Live group sessions every Monday",
      "Recordings posted within 24 hours",
      "Weekly past-paper worksheets + mark schemes",
      "Group chat with the tutor",
      "Monthly parent feedback report",
    ],
    startDate: "Ongoing · join anytime",
  },
  {
    id: "physics-power-hour",
    title: "Physics Power Hour",
    subject: "Physics", level: "CSEC",
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorRating: 4.9, tutorReviews: 128,
    emoji: "⚛️", bannerFrom: "from-sky", bannerTo: "to-lavender",
    price: 160, originalPrice: 200, discountLabel: "EARLY-BIRD 20% OFF",
    billing: "per-month",
    billingDescription: "TT$160 / month for early-bird members (first 8 seats) · normally TT$200",
    schedule: "Wednesdays · 4:00–6:00 PM AST",
    cadence: "4 sessions per month",
    seatsTaken: 5, seatsTotal: 12,
    includesParentFeedback: true,
    approvalRequired: false,
    kind: "group",
    shortBlurb: "High-energy weekly physics with full-class problem solving.",
    longDescription:
      "Two hours of focused physics: mechanics, waves, electricity, and a weekly Paper 1 sprint. Built around the CSEC syllabus with real exam questions every week.",
    whatsIncluded: [
      "Live group sessions every Wednesday",
      "Notes pack + formulae sheets",
      "Recordings for missed sessions",
      "Monthly parent feedback report",
    ],
    startDate: "Ongoing · join anytime",
  },
  {
    id: "essay-lab",
    title: "Essay Lab",
    subject: "English Lit", level: "CSEC",
    tutorId: "joseph", tutorName: "Mr. Joseph", tutorHue: 20, tutorRating: 4.85, tutorReviews: 142,
    emoji: "📚", bannerFrom: "from-coral", bannerTo: "to-peach",
    price: 160, billing: "per-month",
    billingDescription: "TT$160 / month · includes written feedback on every essay",
    schedule: "Tuesdays · 6:00–7:30 PM AST",
    cadence: "4 sessions per month + written feedback",
    seatsTaken: 8, seatsTotal: 10,
    includesParentFeedback: false,
    approvalRequired: true,
    kind: "group",
    shortBlurb: "Build essay technique with personal written feedback every week.",
    longDescription:
      "Small-group writing lab. Each week we write together, then I mark each essay individually with line-by-line feedback. Tutor approval required to keep the group small and focused.",
    whatsIncluded: [
      "Live writing workshops every Tuesday",
      "Personal written feedback on every essay",
      "Curated past-paper question bank",
      "Direct chat access with the tutor",
    ],
    startDate: "New cohort starts 1 June 2026",
  },
  {
    id: "cape-chem-bootcamp",
    title: "CAPE Chem Bootcamp",
    subject: "Chemistry", level: "CAPE",
    tutorId: "thomas", tutorName: "Mr. Thomas", tutorHue: 165, tutorRating: 4.9, tutorReviews: 142,
    emoji: "🧪", bannerFrom: "from-brand-deep", bannerTo: "to-forest",
    price: 240, billing: "per-month",
    billingDescription: "TT$240 / month · auto-renews",
    schedule: "Saturdays · 10:00 AM–12:00 PM AST",
    cadence: "4 sessions per month",
    seatsTaken: 12, seatsTotal: 12,        // FULL
    includesParentFeedback: true,
    approvalRequired: false,
    kind: "group",
    shortBlurb: "PhD-led CAPE Chem bootcamp — organic, inorganic, physical.",
    longDescription:
      "Full CAPE Chemistry syllabus coverage across Unit 1 & 2 with weekly problem sets and a mock exam every month. Recordings included.",
    whatsIncluded: [
      "Live group sessions every Saturday",
      "Monthly mock exam + detailed feedback",
      "Recordings for missed sessions",
      "Monthly parent feedback report",
    ],
    startDate: "Ongoing · waitlist only",
  },
  {
    id: "sea-sprint",
    title: "SEA Sprint Friday",
    subject: "SEA Prep", level: "Primary",
    tutorId: "khan", tutorName: "Ms. Khan", tutorHue: 35, tutorRating: 4.92, tutorReviews: 178,
    emoji: "✏️", bannerFrom: "from-peach", bannerTo: "to-coral",
    price: 140, billing: "per-month",
    billingDescription: "TT$140 / month · cancel anytime",
    schedule: "Fridays · 5:00–6:30 PM AST",
    cadence: "4 sessions per month",
    seatsTaken: 11, seatsTotal: 12,         // near-full (1 left)
    includesParentFeedback: true,
    approvalRequired: false,
    kind: "group",
    shortBlurb: "All-subject SEA prep — Maths, English, Creative Writing.",
    longDescription:
      "A high-energy SEA prep class designed for primary school students sitting the SEA exam. Covers Maths, English Language Arts, and Creative Writing in rotation.",
    whatsIncluded: [
      "Live group sessions every Friday",
      "Weekly worksheets across all subjects",
      "Monthly parent feedback report",
      "WhatsApp group with parents",
    ],
    startDate: "Ongoing · join anytime",
  },
  {
    id: "addmaths-11",
    title: "CSEC Additional Maths · Recurring 1:1",
    subject: "Mathematics", level: "CSEC",
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorRating: 4.95, tutorReviews: 211,
    emoji: "🎯", bannerFrom: "from-brand", bannerTo: "to-brand-deep",
    price: 180, billing: "per-session",
    billingDescription: "TT$180 / session · billed weekly · cancel anytime",
    schedule: "Saturdays · 10:00–11:00 AM AST",
    cadence: "Weekly · 1 hour",
    seatsTaken: 0, seatsTotal: 1,
    includesParentFeedback: true,
    approvalRequired: true,
    kind: "recurring-1on1",
    shortBlurb: "Weekly 1:1 add. maths — built around exam prep.",
    longDescription:
      "A personal weekly slot. We agree the schedule and price up front, then meet every week through to your exam. Tutor approval required to make sure the schedule works on both sides.",
    whatsIncluded: [
      "Private weekly 1:1 session",
      "Custom homework after every session",
      "Direct WhatsApp access with the tutor",
      "Monthly parent feedback report",
    ],
    startDate: "Starts on confirmation",
  },
];

export const SUBJECTS = ["All", "Maths", "Physics", "Chemistry", "English", "Biology", "SEA"] as const;

export function matchSubject(c: MarketClass, active: string) {
  if (active === "All") return true;
  const s = c.subject.toLowerCase();
  const a = active.toLowerCase();
  if (a === "maths") return s.includes("math");
  if (a === "english") return s.includes("english");
  if (a === "sea") return s.includes("sea");
  return s.includes(a);
}

export function classState(c: MarketClass): ClassState {
  if (c.kind === "recurring-1on1") return "recurring-1on1";
  if (c.seatsTaken >= c.seatsTotal) return "full";
  if (c.approvalRequired) return "approval-required";
  return "open";
}
