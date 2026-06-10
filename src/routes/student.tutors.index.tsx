import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Star, Heart, Users, GraduationCap, BadgeCheck, TrendingUp, Sparkles, ChevronDown, ChevronLeft, ChevronRight, Play, MessageSquare, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isAuthed } from "@/lib/auth";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  tab: fallback(z.enum(["lessons", "tutors"]), "tutors").default("tutors"),
  page: fallback(z.number(), 1).default(1),
  subject: fallback(z.string(), "").default(""),
  priceMin: fallback(z.number(), 0).default(0),
  priceMax: fallback(z.number(), 200).default(200),
  days: fallback(z.string(), "").default(""),
  times: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/student/tutors/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Find tutors — iTutor" }] }),
  component: ExplorePage,
});

type Tutor = {
  id: string;
  name: string;
  flag: string;
  country: string;
  subjects: string[];
  level: string;
  rating: number;
  reviews: number;
  pricePerLesson: number;
  hue: number;
  verified: boolean;
  superTutor?: boolean;
  professional?: boolean;
  headline: string;
  blurb: string;
  activeStudents: number;
  lessonsTaught: string;
  topPercent?: string;
  recentBookings: number;
};

const BASE_TUTORS: Tutor[] = [
  { id: "ramdeen", name: "Mr. Ramdeen", flag: "🇹🇹", country: "Trinidad", subjects: ["Mathematics", "Physics"], level: "CSEC · CAPE", rating: 4.9, reviews: 128, pricePerLesson: 35, hue: 145, verified: true, superTutor: true, professional: true, headline: "Master CSEC Maths & Physics with 10+ years of exam experience", blurb: "Caribbean-trained tutor who's helped 200+ students earn Grade I in CSEC and CAPE Maths and Physics.", activeStudents: 61, lessonsTaught: "14k+", topPercent: "Top 5%", recentBookings: 21 },
  { id: "singh", name: "Ms. Singh", flag: "🇹🇹", country: "Trinidad", subjects: ["Physics"], level: "CSEC · CAPE", rating: 4.85, reviews: 94, pricePerLesson: 28, hue: 220, verified: true, headline: "UWI Physics graduate — Waves, Mechanics, Electricity made intuitive", blurb: "I make complex Physics concepts intuitive through real-world examples and step-by-step problem solving.", activeStudents: 42, lessonsTaught: "3,120", recentBookings: 12 },
  { id: "joseph", name: "Mr. Joseph", flag: "🇹🇹", country: "Trinidad", subjects: ["English Lit", "English"], level: "CSEC", rating: 4.95, reviews: 211, pricePerLesson: 30, hue: 20, verified: true, superTutor: true, headline: "Caribbean literature & essay coaching — Grade I track record", blurb: "Literature tutor with a love for Caribbean writers. Focused on essay structure, poetry analysis and exam technique.", activeStudents: 88, lessonsTaught: "8,400", topPercent: "Top 10%", recentBookings: 18 },
  { id: "ali", name: "Ms. Ali", flag: "🇹🇹", country: "Trinidad", subjects: ["Biology"], level: "CSEC · CAPE", rating: 4.7, reviews: 67, pricePerLesson: 30, hue: 280, verified: false, headline: "Biology educator — diagrams, mnemonics, and exam strategy", blurb: "I help students remember biology through visuals and stories — not rote learning.", activeStudents: 32, lessonsTaught: "1,800", recentBookings: 6 },
  { id: "thomas", name: "Mr. Thomas", flag: "🇹🇹", country: "Trinidad", subjects: ["Chemistry"], level: "CAPE", rating: 4.9, reviews: 142, pricePerLesson: 32, hue: 165, verified: true, professional: true, headline: "PhD Chemistry tutor — Organic, Inorganic & Physical for CAPE", blurb: "PhD-trained chemist focusing on CAPE preparation. We tackle past papers and build deep conceptual understanding.", activeStudents: 51, lessonsTaught: "5,600", topPercent: "Top 5%", recentBookings: 14 },
  { id: "khan", name: "Ms. Khan", flag: "🇹🇹", country: "Trinidad", subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", rating: 4.92, reviews: 178, pricePerLesson: 22, hue: 35, verified: true, superTutor: true, headline: "SEA Prep specialist — building strong fundamentals", blurb: "Patient SEA preparation tutor with 7 years of experience. Strong fundamentals, gentle pace, real confidence.", activeStudents: 110, lessonsTaught: "9,100", topPercent: "Top 10%", recentBookings: 24 },
  { id: "boyce", name: "Mr. Boyce", flag: "🇧🇧", country: "Barbados", subjects: ["Mathematics", "Additional Mathematics"], level: "CSEC · CAPE", rating: 4.88, reviews: 156, pricePerLesson: 33, hue: 195, verified: true, superTutor: true, headline: "Bridgetown Maths Don — Add Maths and Pure Maths specialist", blurb: "Bajan tutor who specialises in Additional Maths and CAPE Pure Maths. Calm pacing, clean board-work.", activeStudents: 47, lessonsTaught: "6,200", topPercent: "Top 10%", recentBookings: 15 },
  { id: "francis", name: "Ms. Francis", flag: "🇯🇲", country: "Jamaica", subjects: ["English A", "English B"], level: "CSEC", rating: 4.86, reviews: 102, pricePerLesson: 26, hue: 110, verified: true, headline: "Kingston-based English coach — comprehension, summary and Paper 1", blurb: "I focus on building real reading stamina and confident exam technique for CSEC English A and B.", activeStudents: 53, lessonsTaught: "4,300", recentBookings: 11 },
  { id: "samuels", name: "Mr. Samuels", flag: "🇯🇲", country: "Jamaica", subjects: ["Information Technology", "EDPM"], level: "CSEC", rating: 4.78, reviews: 71, pricePerLesson: 24, hue: 250, verified: true, headline: "IT & EDPM tutor — SBA support, school-based assessment specialist", blurb: "I help students plan and complete strong SBAs and prep confidently for IT and EDPM exams.", activeStudents: 36, lessonsTaught: "2,400", recentBookings: 8 },
  { id: "henry", name: "Dr. Henry", flag: "🇬🇾", country: "Guyana", subjects: ["Biology", "Human & Social Biology"], level: "CSEC · CAPE", rating: 4.93, reviews: 189, pricePerLesson: 34, hue: 320, verified: true, superTutor: true, professional: true, headline: "PhD Biology — Genetics, Ecosystems, Anatomy with diagram-first teaching", blurb: "I teach biology through clear visuals, structured note-making and active recall.", activeStudents: 76, lessonsTaught: "11k+", topPercent: "Top 5%", recentBookings: 19 },
  { id: "lopez", name: "Ms. Lopez", flag: "🇹🇹", country: "Trinidad", subjects: ["Spanish"], level: "CSEC · CAPE", rating: 4.82, reviews: 88, pricePerLesson: 25, hue: 50, verified: true, headline: "Spanish — conversation-first, oral exam prep included", blurb: "Conversational practice with a strong focus on the CSEC and CAPE oral and writing components.", activeStudents: 39, lessonsTaught: "2,950", recentBookings: 9 },
  { id: "marshall", name: "Mr. Marshall", flag: "🇹🇹", country: "Trinidad", subjects: ["Principles of Accounts", "Principles of Business"], level: "CSEC", rating: 4.75, reviews: 54, pricePerLesson: 26, hue: 75, verified: true, headline: "POA & POB — ledger work, ratios and case-study writing", blurb: "Clean, structured approach to accounts and business. SBA support included.", activeStudents: 28, lessonsTaught: "1,600", recentBookings: 5 },
  { id: "george", name: "Ms. George", flag: "🇹🇹", country: "Trinidad", subjects: ["Geography"], level: "CSEC · CAPE", rating: 4.89, reviews: 96, pricePerLesson: 27, hue: 130, verified: true, headline: "Geography — fieldwork, map-reading and case-study mastery", blurb: "Caribbean geography focused tutor. We build strong case-study banks and exam writing skills.", activeStudents: 41, lessonsTaught: "3,500", recentBookings: 10 },
  { id: "khan-r", name: "Mr. Khan", flag: "🇹🇹", country: "Trinidad", subjects: ["History", "Caribbean Studies"], level: "CSEC · CAPE", rating: 4.81, reviews: 73, pricePerLesson: 28, hue: 0, verified: true, headline: "History & Caribbean Studies — essays and source analysis", blurb: "Engaging history sessions focused on essay structure and source-based questions.", activeStudents: 33, lessonsTaught: "2,100", recentBookings: 7 },
  { id: "persad", name: "Ms. Persad", flag: "🇹🇹", country: "Trinidad", subjects: ["Pure Mathematics", "Applied Mathematics"], level: "CAPE", rating: 4.94, reviews: 134, pricePerLesson: 36, hue: 240, verified: true, superTutor: true, professional: true, headline: "CAPE Pure & Applied Maths — Unit 1 and 2 specialist", blurb: "I take CAPE Maths students from foundations to fluency with weekly past-paper drills.", activeStudents: 58, lessonsTaught: "7,800", topPercent: "Top 5%", recentBookings: 16 },
  { id: "ramoutar", name: "Mr. Ramoutar", flag: "🇹🇹", country: "Trinidad", subjects: ["Computer Science", "Information Technology"], level: "CAPE", rating: 4.87, reviews: 81, pricePerLesson: 31, hue: 185, verified: true, headline: "CAPE Computer Science — coding, databases, SBA mentoring", blurb: "Software engineer turned tutor — strong on practical coding and clean SBA documentation.", activeStudents: 37, lessonsTaught: "2,650", recentBookings: 8 },
  { id: "carter", name: "Ms. Carter", flag: "🇧🇸", country: "Bahamas", subjects: ["Economics", "Management of Business"], level: "CAPE", rating: 4.79, reviews: 62, pricePerLesson: 29, hue: 90, verified: true, headline: "Economics & MOB — concepts, diagrams and 25-mark essays", blurb: "We focus on exam command words and high-band essay technique.", activeStudents: 24, lessonsTaught: "1,400", recentBookings: 4 },
  { id: "edwards", name: "Mr. Edwards", flag: "🇹🇹", country: "Trinidad", subjects: ["Physics", "Mathematics"], level: "CSEC", rating: 4.84, reviews: 110, pricePerLesson: 27, hue: 30, verified: true, headline: "Physics & Maths bundle — friendly, exam-focused sessions", blurb: "I make Physics and Maths feel solvable through worked examples and steady drills.", activeStudents: 49, lessonsTaught: "3,900", recentBookings: 12 },
  { id: "sookoo", name: "Ms. Sookoo", flag: "🇹🇹", country: "Trinidad", subjects: ["French"], level: "CSEC · CAPE", rating: 4.83, reviews: 47, pricePerLesson: 26, hue: 200, verified: false, headline: "French — oral confidence, grammar drills and exam writing", blurb: "Native-quality French tutoring with friendly oral practice each session.", activeStudents: 19, lessonsTaught: "1,100", recentBookings: 3 },
  { id: "phillips", name: "Mr. Phillips", flag: "🇻🇨", country: "St. Vincent", subjects: ["Mathematics"], level: "SEA · CSEC", rating: 4.7, reviews: 41, pricePerLesson: 20, hue: 60, verified: true, headline: "SEA & lower-secondary Maths — patient foundation building", blurb: "Strong fundamentals first. Calm, encouraging sessions for SEA and Form 1–3 students.", activeStudents: 31, lessonsTaught: "1,700", recentBookings: 7 },
  { id: "abdul", name: "Ms. Abdul", flag: "🇹🇹", country: "Trinidad", subjects: ["Chemistry", "Biology"], level: "CSEC", rating: 4.88, reviews: 79, pricePerLesson: 28, hue: 300, verified: true, headline: "Chem + Bio combo — clear notes, lots of past-paper practice", blurb: "I help science students get organised, with clean summary notes and steady practice.", activeStudents: 42, lessonsTaught: "2,800", recentBookings: 9 },
  { id: "wright", name: "Mr. Wright", flag: "🇯🇲", country: "Jamaica", subjects: ["Sociology", "Caribbean Studies"], level: "CAPE", rating: 4.86, reviews: 58, pricePerLesson: 27, hue: 15, verified: true, headline: "Sociology & Caribbean Studies — essay structure and theory", blurb: "We focus on theory-application essays and structured argument-writing.", activeStudents: 22, lessonsTaught: "1,500", recentBookings: 5 },
  { id: "thompson", name: "Ms. Thompson", flag: "🇹🇹", country: "Trinidad", subjects: ["English Language Arts", "Creative Writing"], level: "SEA", rating: 4.95, reviews: 92, pricePerLesson: 18, hue: 340, verified: true, superTutor: true, headline: "SEA ELA & Creative Writing — confidence-building sessions", blurb: "I help SEA students enjoy writing and feel calm in the exam room.", activeStudents: 64, lessonsTaught: "4,100", topPercent: "Top 10%", recentBookings: 14 },
  { id: "gomes", name: "Mr. Gomes", flag: "🇹🇹", country: "Trinidad", subjects: ["Physics", "Pure Mathematics"], level: "CAPE", rating: 4.83, reviews: 66, pricePerLesson: 30, hue: 260, verified: true, headline: "CAPE Physics + Pure Maths — engineering-style problem solving", blurb: "Engineer-turned-tutor — strong on problem-solving habits and exam pace.", activeStudents: 27, lessonsTaught: "1,950", recentBookings: 6 },
];

const PAGE_SIZE = 12;
const ALL_COUNTRIES = Array.from(new Set(BASE_TUTORS.map((t) => t.country))).sort();
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SUBJECT_GROUPS = {
  SEA: ["Mathematics", "English Language Arts", "Creative Writing", "Science", "Social Studies", "Comprehension", "Grammar", "Spelling"],
  CSEC: ["Mathematics", "Additional Mathematics", "English A", "English B", "English Lit", "English", "Physics", "Chemistry", "Biology", "Integrated Science", "Human & Social Biology", "Information Technology", "EDPM", "Spanish", "French", "Geography", "History", "Principles of Business", "Principles of Accounts", "Office Administration", "Economics", "Social Studies", "Religious Education", "Visual Arts", "Music", "Physical Education", "Agricultural Science", "Food & Nutrition", "Technical Drawing"],
  CAPE: ["Pure Mathematics", "Applied Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Information Technology", "Accounting", "Economics", "Management of Business", "Law", "Sociology", "Caribbean Studies", "Communication Studies", "History", "Geography", "Literatures in English", "Spanish", "French", "Environmental Science", "Agricultural Science", "Digital Media", "Performing Arts", "Visual Arts", "Tourism", "Entrepreneurship"],
} as const;

const TIME_BANDS: { key: string; label: string; group: "morning" | "daytime" | "evening" }[] = [
  { key: "6-9am",  label: "6–9 AM",  group: "morning" },
  { key: "9-12am", label: "9–12 AM", group: "morning" },
  { key: "12-3pm", label: "12–3 PM", group: "daytime" },
  { key: "3-6pm",  label: "3–6 PM",  group: "daytime" },
  { key: "6-9pm",  label: "6–9 PM",  group: "evening" },
  { key: "9-12pm", label: "9–12 PM", group: "evening" },
];

function TutorAvatarSquare({ name, hue, size = 132 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="relative rounded-2xl grid place-items-center font-bold shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.34 }}
    >
      {initials}
      <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-brand ring-2 ring-background" />
    </div>
  );
}

function FilterField({ label, value, hasValue, children }: { label: string; value: string; hasValue?: boolean; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn("w-full text-left rounded-2xl border border-border bg-background px-4 py-2.5 hover:border-ink/40 transition flex items-center justify-between gap-2", hasValue && "border-ink")}>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="text-sm font-semibold text-ink truncate">{value}</div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">{children}</PopoverContent>
    </Popover>
  );
}

function TutorCard({ t, onHover, saved, toggleSave, onBook }: { t: Tutor; onHover: () => void; saved: boolean; toggleSave: () => void; onBook: () => void }) {
  return (
    <div onMouseEnter={onHover} className="rounded-3xl border border-border bg-background p-4 sm:p-5 hover:border-brand/40 hover:shadow-card transition-all">
      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-col items-center gap-3">
          <Link to="/student/tutors/$id" params={{ id: t.id }}>
            <TutorAvatarSquare name={t.name} hue={t.hue} size={96} />
          </Link>
          <button onClick={toggleSave} className="size-9 rounded-full border border-border grid place-items-center hover:bg-muted">
            <Heart className={cn("size-4", saved ? "fill-coral text-coral" : "text-muted-foreground")} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to="/student/tutors/$id" params={{ id: t.id }} className="inline-flex items-center gap-1.5 hover:underline">
                <h3 className="text-lg sm:text-xl font-bold text-ink truncate">{t.name}</h3>
                {t.verified && <BadgeCheck className="size-4 text-brand-deep shrink-0" />}
                <span className="text-base">{t.flag}</span>
              </Link>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {t.rating.toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">({t.reviews} reviews)</span>
                <span className="text-xs sm:text-sm text-muted-foreground">· {t.subjects.join(", ")}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                {t.superTutor && (
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Sparkles className="size-3.5 text-brand-deep" /> Super Tutor
                  </span>
                )}
                {t.professional && (
                  <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-ink">
                    <BadgeCheck className="size-3.5 text-brand-deep" /> Professional
                  </span>
                )}
                <span className="text-muted-foreground">{t.level}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-ink leading-none">${t.pricePerLesson}</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">60-min lesson</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink font-semibold line-clamp-2">✅ {t.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 hidden sm:block">💬 — {t.blurb}</p>

          <div className="mt-3 flex items-center gap-4 sm:gap-5 text-xs">
            <div>
              <div className="font-bold text-ink">{t.activeStudents}</div>
              <div className="text-muted-foreground">Active students</div>
            </div>
            <div>
              <div className="font-bold text-ink inline-flex items-center gap-1.5">
                {t.lessonsTaught}
                {t.topPercent && (<span className="rounded-full bg-trust-bg text-trust-text px-2 py-0.5 text-[10px] font-bold">{t.topPercent}</span>)}
              </div>
              <div className="text-muted-foreground">Lessons taught</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> Booked {t.recentBookings} times recently
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="hidden sm:grid size-10 rounded-xl border border-border place-items-center hover:bg-muted" title="Message">
                <MessageSquare className="size-4" />
              </button>
              <button
                onClick={onBook}
                className="rounded-full bg-brand text-white px-4 sm:px-5 py-2.5 text-sm font-bold hover:bg-brand-deep transition"
              >
                Book trial lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPreviewPanel({ tutor }: { tutor: Tutor | null }) {
  if (!tutor) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Hover a tutor to preview their intro video.
      </div>
    );
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div key={tutor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border" style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${tutor.hue}), oklch(0.65 0.15 ${tutor.hue}))` }}>
          <div className="absolute inset-0 grid place-items-center">
            <button className="size-16 rounded-full bg-brand text-white grid place-items-center shadow-pop hover:scale-105 transition">
              <Play className="size-7 fill-white ml-1" />
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-white font-bold text-lg drop-shadow">{tutor.name}</div>
            <div className="text-white/85 text-xs">{tutor.subjects.join(" · ")}</div>
          </div>
        </div>
        <Link to="/student/tutors/$id/book" params={{ id: tutor.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">View full schedule</Link>
        <Link to="/student/tutors/$id" params={{ id: tutor.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">See {tutor.name.split(" ").pop()}'s profile</Link>
      </motion.div>
    </AnimatePresence>
  );
}

function ExplorePage() {
  const search = Route.useSearch();
  const { q, tab, page, subject, priceMin, priceMax, days, times } = search;
  const navigate = useNavigate();
  const update = (patch: any) => navigate({ to: "/student/tutors", search: { ...search, ...patch } as any });

  const [query, setQuery] = useState(q || "");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(BASE_TUTORS[0].id);

  useEffect(() => { setQuery(q || ""); }, [q]);

  const ql = query.trim().toLowerCase();
  const selectedDays = days ? days.split(",").filter(Boolean) : [];
  const selectedTimes = times ? times.split(",").filter(Boolean) : [];

  const filtered = useMemo(() => {
    const f = BASE_TUTORS.filter((t) => {
      if (ql) {
        const match = t.name.toLowerCase().includes(ql) || t.subjects.join(" ").toLowerCase().includes(ql) || t.headline.toLowerCase().includes(ql);
        if (!match) return false;
      }
      if (subject && !t.subjects.some((s) => s.toLowerCase().includes(subject.toLowerCase()))) return false;
      if (t.pricePerLesson < priceMin || (priceMax < 200 && t.pricePerLesson > priceMax)) return false;
      return true;
    });
    return f;
  }, [ql, subject, priceMin, priceMax]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageTutors = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hoveredTutor = pageTutors.find((t) => t.id === hovered) ?? pageTutors[0] ?? null;

  const onBook = (t: Tutor) => {
    if (!isAuthed()) {
      navigate({ to: "/signup", search: { next: `/student/tutors/${t.id}/book` } as any });
      return;
    }
    navigate({ to: "/student/tutors/$id/book", params: { id: t.id } });
  };

  const subjLabel = subject || "Any subject";
  const priceLabel = priceMin === 0 && priceMax >= 200 ? "$0 – $200+" : `$${priceMin} – $${priceMax}${priceMax >= 200 ? "+" : ""}`;
  const availLabel = selectedDays.length || selectedTimes.length ? `${selectedDays.length || "Any"}d · ${selectedTimes.length || "Any"}t` : "Any time";

  const noResults = filtered.length === 0 && !ql;
  const fallbackTutors = noResults ? BASE_TUTORS.slice(0, PAGE_SIZE) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Find a tutor that helps you grow</h1>
          <p className="text-sm text-muted-foreground mt-1">1:1 lessons with verified Caribbean tutors. Try a trial first.</p>
        </div>
        <div className="text-4xl">📈</div>
      </div>

      <div className="inline-flex p-1 rounded-2xl bg-muted">
        <Link to="/classes" className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition", tab === "lessons" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
          <Users className="size-4" /> Group Lessons
        </Link>
        <button className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition bg-background text-ink shadow-sm")}>
          <GraduationCap className="size-4" /> 1:1 Tutors
        </button>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <FilterField label="I want to learn" value={subjLabel} hasValue={!!subject}>
          <SubjectFilter value={subject} onApply={(s) => update({ subject: s, page: 1 })} />
        </FilterField>

        <FilterField label="Price per lesson" value={priceLabel} hasValue={priceMin > 0 || priceMax < 200}>
          <PriceFilter min={priceMin} max={priceMax} onApply={(lo, hi) => update({ priceMin: lo, priceMax: hi, page: 1 })} />
        </FilterField>

        <FilterField label="Country" value="Any country">
          <div className="text-xs text-muted-foreground mb-2">Tutors are based in:</div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COUNTRIES.map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-muted">{c}</span>
            ))}
          </div>
        </FilterField>

        <FilterField label="I'm available" value={availLabel} hasValue={selectedDays.length > 0 || selectedTimes.length > 0}>
          <AvailabilityFilter
            days={selectedDays}
            times={selectedTimes}
            onApply={(d, t) => update({ days: d.join(","), times: t.join(","), page: 1 })}
          />
        </FilterField>
      </div>

      {/* Active chips */}
      {(subject || selectedDays.length > 0 || selectedTimes.length > 0 || priceMin > 0 || priceMax < 200) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {subject && <Chip onRemove={() => update({ subject: "", page: 1 })}>{subject}</Chip>}
          {(priceMin > 0 || priceMax < 200) && <Chip onRemove={() => update({ priceMin: 0, priceMax: 200, page: 1 })}>{priceLabel}</Chip>}
          {selectedDays.map((d: string) => <Chip key={d} onRemove={() => update({ days: selectedDays.filter((x: string) => x !== d).join(","), page: 1 })}>{d}</Chip>)}
          {selectedTimes.map((t: string) => <Chip key={t} onRemove={() => update({ times: selectedTimes.filter((x: string) => x !== t).join(","), page: 1 })}>{t}</Chip>)}
          <button onClick={() => update({ subject: "", priceMin: 0, priceMax: 200, days: "", times: "", page: 1 })} className="text-xs font-semibold text-brand-deep hover:underline">Clear all</button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => update({ q: query, page: 1 })}
            onKeyDown={(e) => e.key === "Enter" && update({ q: query, page: 1 })}
            placeholder="Search by name or keyword"
            className="pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm outline-none focus:border-brand min-w-[220px]"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {noResults
          ? <>No exact matches — showing tutors that best fit your criteria.</>
          : <>{filtered.length} tutor{filtered.length === 1 ? "" : "s"}{ql && <> matching "<span className="text-ink font-medium">{query}</span>"</>}{filtered.length > PAGE_SIZE && <> · Page {currentPage} of {totalPages}</>}</>}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="space-y-4">
          {(noResults ? fallbackTutors : pageTutors).map((t) => (
            <TutorCard
              key={t.id}
              t={t}
              saved={saved.has(t.id)}
              toggleSave={() => setSaved((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })}
              onHover={() => setHovered(t.id)}
              onBook={() => onBook(t)}
            />
          ))}

          {!noResults && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => update({ page: currentPage - 1 })} disabled={currentPage === 1} className="size-10 rounded-full border border-border grid place-items-center hover:bg-muted disabled:opacity-40">
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => update({ page: p })} className={cn("min-w-10 h-10 px-3 rounded-full text-sm font-bold transition", p === currentPage ? "bg-ink text-white" : "border border-border text-ink hover:bg-muted")}>{p}</button>
              ))}
              <button onClick={() => update({ page: currentPage + 1 })} disabled={currentPage === totalPages} className="size-10 rounded-full border border-border grid place-items-center hover:bg-muted disabled:opacity-40">
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
        <div className="hidden lg:block sticky top-20">
          <VideoPreviewPanel tutor={hoveredTutor} />
        </div>
      </div>
    </div>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-trust-text text-xs font-semibold px-3 py-1">
      {children}
      <button onClick={onRemove} className="hover:text-ink"><X className="size-3" /></button>
    </span>
  );
}

function PriceFilter({ min, max, onApply }: { min: number; max: number; onApply: (lo: number, hi: number) => void }) {
  const [v, setV] = useState<[number, number]>([min, max]);
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-ink">${v[0]} – ${v[1]}{v[1] >= 200 ? "+" : ""}</div>
      <SliderPrimitive.Root
        value={v}
        min={0}
        max={200}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={(n) => setV([n[0], n[1]] as [number, number])}
        className="relative flex items-center w-full h-6 select-none touch-none"
      >
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-muted grow">
          <SliderPrimitive.Range className="absolute h-full bg-ink rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-5 rounded-full bg-background border-2 border-ink shadow focus:outline-none" />
        <SliderPrimitive.Thumb className="block size-5 rounded-full bg-background border-2 border-ink shadow focus:outline-none" />
      </SliderPrimitive.Root>
      <button onClick={() => onApply(v[0], v[1])} className="w-full rounded-full bg-brand text-white py-2 text-sm font-bold hover:bg-brand-deep">Apply</button>
    </div>
  );
}

function SubjectFilter({ value, onApply }: { value: string; onApply: (s: string) => void }) {
  const [level, setLevel] = useState<"SEA" | "CSEC" | "CAPE">("CSEC");
  const [q, setQ] = useState("");
  const list = SUBJECT_GROUPS[level].filter((s) => !q || s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3 w-[300px]">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
        {(["SEA", "CSEC", "CAPE"] as const).map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={cn("py-1.5 rounded-lg text-xs font-bold", level === l ? "bg-background text-ink shadow-sm" : "text-muted-foreground")}>{l}</button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${level}`} className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-brand" />
      </div>
      <div className="max-h-56 overflow-y-auto space-y-0.5">
        <button onClick={() => onApply("")} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted", !value && "bg-brand-soft font-semibold")}>Any subject</button>
        {list.map((s) => (
          <button key={s} onClick={() => onApply(s)} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted", value === s && "bg-brand-soft font-semibold")}>{s}</button>
        ))}
        {list.length === 0 && <div className="text-xs text-muted-foreground px-3 py-4">No matches</div>}
      </div>
    </div>
  );
}

function AvailabilityFilter({ days, times, onApply }: { days: string[]; times: string[]; onApply: (d: string[], t: string[]) => void }) {
  const [d, setD] = useState(days);
  const [t, setT] = useState(times);
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const section = (label: string, group: "morning" | "daytime" | "evening") => (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">{label}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {TIME_BANDS.filter((b) => b.group === group).map((b) => (
          <button key={b.key} onClick={() => toggle(t, b.key, setT)}
            className={cn("px-2 py-2 rounded-lg border text-xs font-semibold", t.includes(b.key) ? "bg-ink text-white border-ink" : "border-border text-ink hover:border-ink/40")}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="text-xs font-bold uppercase tracking-wider text-ink">Times</div>
      {section("Morning", "morning")}
      {section("Daytime", "daytime")}
      {section("Evening and night", "evening")}
      <div className="pt-1">
        <div className="text-xs font-bold uppercase tracking-wider text-ink mb-1.5">Days</div>
        <div className="grid grid-cols-4 gap-1.5">
          {DAY_KEYS.map((day) => (
            <button key={day} onClick={() => toggle(d, day, setD)}
              className={cn("py-2 rounded-lg border text-xs font-semibold", d.includes(day) ? "bg-ink text-white border-ink" : "border-border text-ink hover:border-ink/40")}>
              {day}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => onApply(d, t)} className="w-full rounded-full bg-brand text-white py-2 text-sm font-bold hover:bg-brand-deep">Apply</button>
    </div>
  );
}
