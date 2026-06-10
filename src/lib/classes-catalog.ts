// Shared catalog of group classes — consumed by explore, class detail, and tutor profile.

export type ClassBadge = {
  key: "popular" | "new" | "almost-full" | "early-bird" | "promo";
  label: string;
  tone: "ink" | "coral" | "brand" | "sky";
};

export type ClassListing = {
  id: string;
  title: string;
  subject: string;
  level: string;            // CSEC · CAPE · SEA · etc.
  tagline: string;
  description: string;
  whatYouLearn: string[];
  whatsIncluded: string[];
  tutorId: string;
  tutorName: string;
  tutorHue: number;
  tutorVerified: boolean;
  rating: number;
  ratingCount: number;
  priceTTD: number;
  originalPriceTTD?: number;
  promoLabel?: string;      // tutor-set promo (e.g. "EARLY-BIRD 17% OFF")
  schedule: string;
  duration: string;
  cadence: string;
  seatsTotal: number;
  seatsTaken: number;
  recentJoins: number;
  hue: number;
  emoji?: string;
  nextBilling: string;
  startsLabel: string;
  // New metadata (drives badges + access flow)
  createdAt: string;        // ISO date — used for "New cohort" badge
  requestToJoin?: boolean;  // tutor toggle — student joins by request, not direct enrol
};

// Auto badge rules:
// - popular        rating >= 4.7 AND ratingCount >= 20 AND seatsTaken >= 15
// - almost-full    seatsLeft <= 4 AND seatsLeft > 0
// - new            createdAt within last 45 days
// - early-bird     originalPriceTTD set AND priceTTD < originalPriceTTD
// - promo          tutor-set promoLabel
export function getClassBadges(c: ClassListing): ClassBadge[] {
  const out: ClassBadge[] = [];
  const seatsLeft = c.seatsTotal - c.seatsTaken;
  const ageDays = (Date.now() - new Date(c.createdAt).getTime()) / 86_400_000;

  if (c.rating >= 4.7 && c.ratingCount >= 20 && c.seatsTaken >= 15) {
    out.push({ key: "popular", label: "Popular", tone: "ink" });
  }
  if (seatsLeft > 0 && seatsLeft <= 4) {
    out.push({ key: "almost-full", label: `Only ${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`, tone: "coral" });
  }
  if (ageDays <= 45) {
    out.push({ key: "new", label: "New cohort", tone: "sky" });
  }
  if (c.originalPriceTTD && c.priceTTD < c.originalPriceTTD) {
    out.push({ key: "early-bird", label: c.promoLabel ?? "Early-bird", tone: "brand" });
  } else if (c.promoLabel) {
    out.push({ key: "promo", label: c.promoLabel, tone: "brand" });
  }
  return out;
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const CLASSES_CATALOG: ClassListing[] = [
  {
    id: "c1",
    title: "CSEC Mathematics — Algebra & Functions",
    subject: "Mathematics", level: "CSEC",
    tagline: "Live weekly group class covering algebra and functions with worked past-paper questions.",
    description:
      "A focused weekly group class taking you through the algebra & functions strand of the CSEC Mathematics syllabus. Every session pairs concept teaching with timed past-paper practice, and you keep access to the recordings, notes and class stream between lessons.",
    whatYouLearn: [
      "Linear, quadratic and rational functions",
      "Indices, surds and logarithms",
      "Inequalities and absolute value",
      "Sequences, series and pattern recognition",
      "Paper 2 long-question structure and timing",
    ],
    whatsIncluded: [
      "Live 90-minute weekly session",
      "All recordings and notes for the month",
      "Weekly past-paper worksheet + mark scheme",
      "Class stream with announcements, assignments and Q&A",
      "Monthly progress check-in",
    ],
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorVerified: true,
    rating: 4.8, ratingCount: 24, priceTTD: 350,
    originalPriceTTD: 420, promoLabel: "EARLY-BIRD 17% OFF",
    schedule: "Tuesdays · 4:00–5:30 PM AST",
    duration: "90 min", cadence: "Weekly",
    seatsTotal: 22, seatsTaken: 18, recentJoins: 7,
    hue: 145, emoji: "∑",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(120),
  },
  {
    id: "c2",
    title: "English A — Paper 2 Essay Workshop",
    subject: "English", level: "CSEC",
    tagline: "Structured essay-writing focused on Paper 2 — planning, argumentation and revision.",
    description:
      "A small-group writing workshop. Each week we plan, write and revise one essay together, with line-by-line written feedback on your draft. Designed to build real exam stamina without burning students out.",
    whatYouLearn: [
      "Argument planning and thesis construction",
      "Evidence integration and PEEL paragraphs",
      "Sentence variety and academic register",
      "Editing under exam timing",
    ],
    whatsIncluded: [
      "Live 75-minute weekly workshop",
      "Personal written feedback on every essay",
      "Curated Paper 2 question bank",
      "Direct class chat with the tutor",
    ],
    tutorId: "joseph", tutorName: "Mr. Joseph", tutorHue: 20, tutorVerified: true,
    rating: 4.7, ratingCount: 18, priceTTD: 300,
    schedule: "Thursdays · 6:00–7:15 PM AST",
    duration: "75 min", cadence: "Weekly",
    seatsTotal: 20, seatsTaken: 14, recentJoins: 4,
    hue: 20, emoji: "✎",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(60),
    requestToJoin: true,
  },
  {
    id: "c3",
    title: "CSEC Biology — Cells, Genetics & Systems",
    subject: "Biology", level: "CSEC",
    tagline: "Live lessons through every CSEC Biology unit with diagrams and weekly quizzes.",
    description:
      "Comprehensive coverage of the CSEC Biology syllabus, taught through diagrams, mnemonics and active recall. Includes weekly quizzes and a monthly mock paper.",
    whatYouLearn: [
      "Cell biology and biological molecules",
      "Genetics and variation",
      "Human body systems",
      "Ecosystems and the impact of humans",
      "SBA technique and lab write-ups",
    ],
    whatsIncluded: [
      "Live 90-minute weekly lesson",
      "Recordings and diagram packs",
      "Weekly quiz with auto-feedback",
      "Monthly mock paper",
    ],
    tutorId: "ali", tutorName: "Ms. Ali", tutorHue: 280, tutorVerified: true,
    rating: 4.9, ratingCount: 41, priceTTD: 400,
    schedule: "Wednesdays · 5:00–6:30 PM AST",
    duration: "90 min", cadence: "Weekly",
    seatsTotal: 24, seatsTaken: 22, recentJoins: 9,
    hue: 280, emoji: "B",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(220),
  },
  {
    id: "c4",
    title: "Chemistry Crash Course — Acids, Bases & Salts",
    subject: "Chemistry", level: "CSEC",
    tagline: "Exam-priority topics with live demos and structured practice sets.",
    description:
      "A six-week crash course focused on the highest-yield CSEC Chemistry topics. Live demonstrations, structured practice, and a final mock paper.",
    whatYouLearn: [
      "Acid–base reactions and pH",
      "Salt preparation methods",
      "Titration technique and calculations",
      "Qualitative analysis flow",
    ],
    whatsIncluded: [
      "Six 60-minute live sessions",
      "Demo recordings and notes",
      "Practice problem sets with worked solutions",
      "Final mock paper with marking",
    ],
    tutorId: "thomas", tutorName: "Mr. Thomas", tutorHue: 165, tutorVerified: true,
    rating: 4.6, ratingCount: 12, priceTTD: 375,
    schedule: "Saturdays · 10:00–11:00 AM AST",
    duration: "60 min", cadence: "Weekly · 6 weeks",
    seatsTotal: 20, seatsTaken: 8, recentJoins: 3,
    hue: 165, emoji: "⚗",
    nextBilling: "—",
    startsLabel: "Next cohort: 1 Sept 2026",
    createdAt: daysAgo(20),
  },
  {
    id: "c5",
    title: "CSEC Physics — Mechanics Mastery",
    subject: "Physics", level: "CSEC",
    tagline: "Break mechanics into bite-size problems, with weekly check-ins and homework reviews.",
    description:
      "Mechanics taught from first principles, with weekly problem-solving sessions and graded homework reviews. Built to demystify forces, motion and energy.",
    whatYouLearn: [
      "Kinematics and equations of motion",
      "Forces, friction and Newton's laws",
      "Energy, work and power",
      "Momentum and collisions",
    ],
    whatsIncluded: [
      "Live 75-minute weekly lesson",
      "Weekly graded homework set",
      "Recordings + formula sheets",
      "Monthly check-in with parents",
    ],
    tutorId: "singh", tutorName: "Ms. Singh", tutorHue: 220, tutorVerified: true,
    rating: 4.5, ratingCount: 9, priceTTD: 350,
    schedule: "Mondays · 5:30–6:45 PM AST",
    duration: "75 min", cadence: "Weekly",
    seatsTotal: 18, seatsTaken: 6, recentJoins: 2,
    hue: 220, emoji: "⚛",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(90),
  },
  {
    id: "c6",
    title: "Mathematics — Geometry & Trigonometry",
    subject: "Mathematics", level: "CSEC",
    tagline: "Geometry and trig with visual proofs and timed practice.",
    description:
      "A geometry-and-trig deep dive with visual proofs and timed practice. Great as a complement to the Algebra & Functions class.",
    whatYouLearn: [
      "Circle theorems and angle properties",
      "Vectors and transformations",
      "Trigonometric ratios and identities",
      "Bearings and applications",
    ],
    whatsIncluded: [
      "Live 90-minute weekly lesson",
      "Visual proof walkthroughs",
      "Timed mini-paper every two weeks",
      "Class stream Q&A",
    ],
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorVerified: true,
    rating: 4.8, ratingCount: 33, priceTTD: 350,
    schedule: "Fridays · 4:00–5:30 PM AST",
    duration: "90 min", cadence: "Weekly",
    seatsTotal: 22, seatsTaken: 19, recentJoins: 6,
    hue: 145, emoji: "△",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(150),
  },
  {
    id: "c7",
    title: "SEA Prep — English Comprehension Bootcamp",
    subject: "SEA Prep", level: "SEA",
    tagline: "Comprehension, vocab and exam writing for SEA students.",
    description:
      "A focused Saturday bootcamp helping SEA students build reading stamina, vocabulary and confident exam writing.",
    whatYouLearn: [
      "Comprehension strategies for SEA passages",
      "Vocabulary in context",
      "Writing the SEA composition",
      "Time management in the exam",
    ],
    whatsIncluded: [
      "Live 60-minute weekly bootcamp",
      "Worksheets for parents to use at home",
      "Monthly parent feedback report",
      "Recordings of every session",
    ],
    tutorId: "khan", tutorName: "Ms. Khan", tutorHue: 35, tutorVerified: true,
    rating: 4.95, ratingCount: 52, priceTTD: 250,
    originalPriceTTD: 300, promoLabel: "FAMILY SPECIAL",
    schedule: "Saturdays · 9:00–10:00 AM AST",
    duration: "60 min", cadence: "Weekly",
    seatsTotal: 24, seatsTaken: 21, recentJoins: 11,
    hue: 35, emoji: "★",
    nextBilling: "Aug 1, 2026",
    startsLabel: "Ongoing — join anytime",
    createdAt: daysAgo(300),
  },
  {
    id: "c8",
    title: "CAPE Pure Maths — Calculus Sprint",
    subject: "Mathematics", level: "CAPE",
    tagline: "Six-week sprint focused on Unit 1 calculus with past-paper drills.",
    description:
      "An intensive six-week sprint through Unit 1 calculus: limits, differentiation, integration and application. Weekly past-paper drills built in.",
    whatYouLearn: [
      "Limits and continuity",
      "Differentiation techniques and applications",
      "Definite and indefinite integration",
      "Modelling rates of change",
    ],
    whatsIncluded: [
      "Six 90-minute live sessions",
      "Recordings + full worked-solution pack",
      "Weekly past-paper drill",
      "Final mock with feedback",
    ],
    tutorId: "ramdeen", tutorName: "Mr. Ramdeen", tutorHue: 145, tutorVerified: true,
    rating: 4.92, ratingCount: 28, priceTTD: 500,
    schedule: "Sundays · 5:00–6:30 PM AST",
    duration: "90 min", cadence: "Weekly · 6 weeks",
    seatsTotal: 16, seatsTaken: 14, recentJoins: 5,
    hue: 145, emoji: "∫",
    nextBilling: "—",
    startsLabel: "Next cohort: 1 Sept 2026",
    createdAt: daysAgo(35),
    requestToJoin: true,
  },
];

export function getClassById(id: string): ClassListing | undefined {
  return CLASSES_CATALOG.find((c) => c.id === id);
}

export function getClassesByTutorId(tutorId: string, excludeId?: string): ClassListing[] {
  return CLASSES_CATALOG.filter((c) => c.tutorId === tutorId && c.id !== excludeId);
}
