import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Star, Heart, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight,
  Play, Users, Sparkles, TrendingUp, Clock, GraduationCap, MessageSquare, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { cn } from "@/lib/utils";

// ---------- search params ----------
const searchSchema = z.object({
  tab: fallback(z.enum(["tutors", "classes"]), "tutors").default("tutors"),
  q: fallback(z.string(), "").default(""),
  page: fallback(z.number(), 1).default(1),
  subject: fallback(z.string(), "").default(""),
  priceMin: fallback(z.number(), 0).default(0),
  priceMax: fallback(z.number(), 200).default(200),
  days: fallback(z.string(), "").default(""),
  times: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/classes/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Explore tutors & classes — iTutor" }] }),
  component: ExplorePage,
});

// ---------- data ----------
type Tutor = {
  id: string; name: string; flag: string; country: string;
  subjects: string[]; level: string; rating: number; reviews: number;
  pricePerLesson: number; hue: number; verified: boolean;
  superTutor?: boolean; professional?: boolean;
  headline: string; blurb: string;
  activeStudents: number; lessonsTaught: string; topPercent?: string;
  recentBookings: number;
};

const TUTORS: Tutor[] = [
  { id: "ramdeen", name: "Mr. Ramdeen", flag: "🇹🇹", country: "Trinidad", subjects: ["Mathematics", "Physics"], level: "CSEC · CAPE", rating: 4.9, reviews: 128, pricePerLesson: 35, hue: 145, verified: true, superTutor: true, professional: true, headline: "Master CSEC Maths & Physics with 10+ years of exam experience", blurb: "Caribbean-trained tutor who's helped 200+ students earn Grade I.", activeStudents: 61, lessonsTaught: "14k+", topPercent: "Top 5%", recentBookings: 21 },
  { id: "singh", name: "Ms. Singh", flag: "🇹🇹", country: "Trinidad", subjects: ["Physics"], level: "CSEC · CAPE", rating: 4.85, reviews: 94, pricePerLesson: 28, hue: 220, verified: true, headline: "UWI Physics graduate — Waves, Mechanics, Electricity made intuitive", blurb: "Complex Physics made intuitive through real-world examples.", activeStudents: 42, lessonsTaught: "3,120", recentBookings: 12 },
  { id: "joseph", name: "Mr. Joseph", flag: "🇹🇹", country: "Trinidad", subjects: ["English Lit", "English"], level: "CSEC", rating: 4.95, reviews: 211, pricePerLesson: 30, hue: 20, verified: true, superTutor: true, headline: "Caribbean literature & essay coaching — Grade I track record", blurb: "Focus on essay structure, poetry analysis and exam technique.", activeStudents: 88, lessonsTaught: "8,400", topPercent: "Top 10%", recentBookings: 18 },
  { id: "ali", name: "Ms. Ali", flag: "🇹🇹", country: "Trinidad", subjects: ["Biology"], level: "CSEC · CAPE", rating: 4.7, reviews: 67, pricePerLesson: 30, hue: 280, verified: false, headline: "Biology educator — diagrams, mnemonics, and exam strategy", blurb: "Remember biology through visuals and stories.", activeStudents: 32, lessonsTaught: "1,800", recentBookings: 6 },
  { id: "thomas", name: "Mr. Thomas", flag: "🇹🇹", country: "Trinidad", subjects: ["Chemistry"], level: "CAPE", rating: 4.9, reviews: 142, pricePerLesson: 32, hue: 165, verified: true, professional: true, headline: "PhD Chemistry tutor — Organic, Inorganic & Physical for CAPE", blurb: "PhD-trained chemist focusing on CAPE preparation.", activeStudents: 51, lessonsTaught: "5,600", topPercent: "Top 5%", recentBookings: 14 },
  { id: "khan", name: "Ms. Khan", flag: "🇹🇹", country: "Trinidad", subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", rating: 4.92, reviews: 178, pricePerLesson: 22, hue: 35, verified: true, superTutor: true, headline: "SEA Prep specialist — building strong fundamentals", blurb: "Patient SEA preparation tutor with 7 years of experience.", activeStudents: 110, lessonsTaught: "9,100", topPercent: "Top 10%", recentBookings: 24 },
  { id: "boyce", name: "Mr. Boyce", flag: "🇧🇧", country: "Barbados", subjects: ["Mathematics", "Additional Mathematics"], level: "CSEC · CAPE", rating: 4.88, reviews: 156, pricePerLesson: 33, hue: 195, verified: true, superTutor: true, headline: "Bridgetown Maths Don — Add Maths and Pure Maths specialist", blurb: "Bajan tutor for Additional Maths and CAPE Pure Maths.", activeStudents: 47, lessonsTaught: "6,200", topPercent: "Top 10%", recentBookings: 15 },
  { id: "francis", name: "Ms. Francis", flag: "🇯🇲", country: "Jamaica", subjects: ["English A", "English B"], level: "CSEC", rating: 4.86, reviews: 102, pricePerLesson: 26, hue: 110, verified: true, headline: "Kingston English coach — comprehension, summary and Paper 1", blurb: "Build real reading stamina and confident exam technique.", activeStudents: 53, lessonsTaught: "4,300", recentBookings: 11 },
  { id: "henry", name: "Dr. Henry", flag: "🇬🇾", country: "Guyana", subjects: ["Biology", "Human & Social Biology"], level: "CSEC · CAPE", rating: 4.93, reviews: 189, pricePerLesson: 34, hue: 320, verified: true, superTutor: true, professional: true, headline: "PhD Biology — Genetics, Ecosystems, Anatomy", blurb: "Visuals, structured note-making and active recall.", activeStudents: 76, lessonsTaught: "11k+", topPercent: "Top 5%", recentBookings: 19 },
  { id: "lopez", name: "Ms. Lopez", flag: "🇹🇹", country: "Trinidad", subjects: ["Spanish"], level: "CSEC · CAPE", rating: 4.82, reviews: 88, pricePerLesson: 25, hue: 50, verified: true, headline: "Spanish — conversation-first, oral exam prep included", blurb: "Conversational practice with strong focus on oral and writing.", activeStudents: 39, lessonsTaught: "2,950", recentBookings: 9 },
  { id: "persad", name: "Ms. Persad", flag: "🇹🇹", country: "Trinidad", subjects: ["Pure Mathematics", "Applied Mathematics"], level: "CAPE", rating: 4.94, reviews: 134, pricePerLesson: 36, hue: 240, verified: true, superTutor: true, professional: true, headline: "CAPE Pure & Applied Maths — Unit 1 and 2 specialist", blurb: "Foundations to fluency with weekly past-paper drills.", activeStudents: 58, lessonsTaught: "7,800", topPercent: "Top 5%", recentBookings: 16 },
  { id: "thompson", name: "Ms. Thompson", flag: "🇹🇹", country: "Trinidad", subjects: ["English Language Arts", "Creative Writing"], level: "SEA", rating: 4.95, reviews: 92, pricePerLesson: 18, hue: 340, verified: true, superTutor: true, headline: "SEA ELA & Creative Writing — confidence-building sessions", blurb: "Help SEA students enjoy writing and feel calm in the exam room.", activeStudents: 64, lessonsTaught: "4,100", topPercent: "Top 10%", recentBookings: 14 },
];

type ClassRow = {
  id: string; name: string; subject: string; description: string;
  tutorName: string; verified: boolean; rating: number; ratingCount: number;
  priceTTD: number; level: string; schedule: string;
  seatsLeft: number; enrolled: number; recentJoins: number;
  popular?: boolean; hue: number;
};

const CLASSES: ClassRow[] = [
  { id: "c1", name: "CSEC Mathematics — Algebra & Functions", subject: "Mathematics", level: "CSEC", description: "Weekly group class covering algebra and functions with worked past-paper questions.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 24, priceTTD: 350, schedule: "Tue · 4:00 PM (90 min)", seatsLeft: 4, enrolled: 18, recentJoins: 7, popular: true, hue: 145 },
  { id: "c2", name: "English A — Paper 2 Essay Workshop", subject: "English", level: "CSEC", description: "Structured essay-writing focused on Paper 2 — planning, argumentation and revision.", tutorName: "Marcus Hill", verified: true, rating: 4.7, ratingCount: 18, priceTTD: 300, schedule: "Thu · 6:00 PM (75 min)", seatsLeft: 6, enrolled: 14, recentJoins: 4, hue: 20 },
  { id: "c3", name: "CSEC Biology — Cells, Genetics & Systems", subject: "Biology", level: "CSEC", description: "Live lessons through every CSEC Biology unit with diagrams and weekly quizzes.", tutorName: "Dr. Renee Joseph", verified: true, rating: 4.9, ratingCount: 41, priceTTD: 400, schedule: "Wed · 5:00 PM (90 min)", seatsLeft: 2, enrolled: 22, recentJoins: 9, popular: true, hue: 280 },
  { id: "c4", name: "Chemistry Crash Course — Acids, Bases & Salts", subject: "Chemistry", level: "CSEC", description: "Exam-priority topics with live demos and structured practice sets.", tutorName: "Ravi Singh", verified: true, rating: 4.6, ratingCount: 12, priceTTD: 375, schedule: "Sat · 10:00 AM (60 min)", seatsLeft: 9, enrolled: 8, recentJoins: 3, hue: 165 },
  { id: "c5", name: "CSEC Physics — Mechanics Mastery", subject: "Physics", level: "CSEC", description: "Break mechanics into bite-size problems, with weekly check-ins and homework reviews.", tutorName: "Kieran Pierre", verified: true, rating: 4.5, ratingCount: 9, priceTTD: 350, schedule: "Mon · 5:30 PM (75 min)", seatsLeft: 12, enrolled: 6, recentJoins: 2, hue: 220 },
  { id: "c6", name: "Mathematics — Geometry & Trigonometry", subject: "Mathematics", level: "CSEC", description: "Geometry and trig with visual proofs and timed practice.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 33, priceTTD: 350, schedule: "Fri · 4:00 PM (90 min)", seatsLeft: 5, enrolled: 19, recentJoins: 6, hue: 145 },
  { id: "c7", name: "SEA Prep — English Comprehension Bootcamp", subject: "SEA Prep", level: "SEA", description: "Comprehension, vocab and exam writing for SEA students.", tutorName: "Ms. Thompson", verified: true, rating: 4.95, ratingCount: 52, priceTTD: 250, schedule: "Sat · 9:00 AM (60 min)", seatsLeft: 3, enrolled: 21, recentJoins: 11, popular: true, hue: 35 },
  { id: "c8", name: "CAPE Pure Maths — Calculus Sprint", subject: "Mathematics", level: "CAPE", description: "Six-week sprint focused on Unit 1 calculus with past-paper drills.", tutorName: "Ms. Persad", verified: true, rating: 4.92, ratingCount: 28, priceTTD: 500, schedule: "Sun · 5:00 PM (90 min)", seatsLeft: 6, enrolled: 14, recentJoins: 5, hue: 240 },
];

const PAGE_SIZE = 12;
const ALL_SUBJECTS = Array.from(new Set([
  ...TUTORS.flatMap((t) => t.subjects),
  ...CLASSES.map((c) => c.subject),
])).sort();

// Subject groups (for tabbed subject filter)
const SUBJECT_GROUPS = {
  SEA: ["Mathematics", "English Language Arts", "Creative Writing", "Science", "Social Studies"],
  CSEC: ["Mathematics", "Additional Mathematics", "English A", "English B", "English Lit", "Physics", "Chemistry", "Biology", "Information Technology", "Spanish", "French", "Geography", "History", "Principles of Business", "Principles of Accounts", "Economics"],
  CAPE: ["Pure Mathematics", "Applied Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Accounting", "Economics", "Management of Business", "Law", "Sociology", "Caribbean Studies", "Communication Studies", "Literatures in English"],
};

const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// AM/PM time bands per screenshot reference
const TIME_BANDS: { key: string; label: string; group: "morning" | "daytime" | "evening" }[] = [
  { key: "6-9am",   label: "6–9 AM",   group: "morning" },
  { key: "9-12am",  label: "9–12 AM",  group: "morning" },
  { key: "12-3pm",  label: "12–3 PM",  group: "daytime" },
  { key: "3-6pm",   label: "3–6 PM",   group: "daytime" },
  { key: "6-9pm",   label: "6–9 PM",   group: "evening" },
  { key: "9-12pm",  label: "9–12 PM",  group: "evening" },
];

// ---------- shared bits ----------
function Avatar({ name, hue, size = 96, square = true }: { name: string; hue: number; size?: number; square?: boolean }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(/[ —-]/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div
      className={cn("relative grid place-items-center font-bold shrink-0 overflow-hidden", square ? "rounded-2xl" : "rounded-full")}
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.32 }}
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
      <PopoverContent className="w-[340px] p-4" align="start">{children}</PopoverContent>
    </Popover>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-brand-deep text-xs font-semibold px-3 py-1">
      {children}
      <button onClick={onRemove}><X className="size-3" /></button>
    </span>
  );
}

// ---------- tutor card ----------
function TutorCard({ t, saved, toggleSave, onHover, onBook }: { t: Tutor; saved: boolean; toggleSave: () => void; onHover: () => void; onBook: () => void }) {
  return (
    <div onMouseEnter={onHover} className="rounded-3xl border border-border bg-background p-4 sm:p-5 hover:border-brand/40 hover:shadow-card transition-all">
      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-col items-center gap-3">
          <Link to="/student/tutors/$id" params={{ id: t.id }}>
            <Avatar name={t.name} hue={t.hue} size={96} />
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
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> Booked {t.recentBookings} times recently
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="hidden sm:grid size-10 rounded-xl border border-border place-items-center hover:bg-muted"><MessageSquare className="size-4" /></button>
              <button onClick={onBook} className="rounded-full bg-brand text-white px-4 sm:px-5 py-2.5 text-sm font-bold hover:bg-brand-deep">
                Book trial lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- class card ----------
function ClassRowCard({ c, saved, toggleSave, onHover, onEnroll }: { c: ClassRow; saved: boolean; toggleSave: () => void; onHover: () => void; onEnroll: () => void }) {
  return (
    <div onMouseEnter={onHover} className="rounded-3xl border border-border bg-background p-4 sm:p-5 hover:border-brand/40 hover:shadow-card transition-all">
      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-col items-center gap-3">
          <Link to="/classes/$id" params={{ id: c.id }}>
            <Avatar name={c.name} hue={c.hue} size={96} />
          </Link>
          <button onClick={toggleSave} className="size-9 rounded-full border border-border grid place-items-center hover:bg-muted">
            <Heart className={cn("size-4", saved ? "fill-coral text-coral" : "text-muted-foreground")} />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to="/classes/$id" params={{ id: c.id }} className="hover:underline">
                <h3 className="text-lg sm:text-xl font-bold text-ink truncate">{c.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {c.rating.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">({c.ratingCount} ratings)</span>
                <span className="text-xs text-muted-foreground">· {c.subject}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-ink">{c.level}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-muted-foreground">with</span>
                <span className="font-semibold text-ink">{c.tutorName}</span>
                {c.verified && <BadgeCheck className="size-3.5 text-brand-deep" />}
                {c.popular && <span className="inline-flex items-center gap-1 font-semibold text-brand-deep"><Sparkles className="size-3" /> Popular</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-ink leading-none">TT${c.priceTTD}</div>
              <div className="text-[11px] text-muted-foreground mt-1">per month</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="font-bold text-ink inline-flex items-center gap-1.5"><Clock className="size-3.5" /> Live</div>
              <div className="text-muted-foreground">{c.schedule}</div>
            </div>
            <div><div className="font-bold text-ink">{c.enrolled}</div><div className="text-muted-foreground">Enrolled</div></div>
            <div><div className="font-bold text-ink">{c.seatsLeft}</div><div className="text-muted-foreground">Seats left</div></div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> {c.recentJoins} joined this week
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Link to="/classes/$id" params={{ id: c.id }} className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted">Details</Link>
              <button onClick={onEnroll} className="rounded-full bg-brand text-white px-5 py-2.5 text-sm font-bold hover:bg-brand-deep">Enroll</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- subject filter (tabbed CSEC/CAPE/SEA + search) ----------
function SubjectFilter({ value, onApply }: { value: string; onApply: (s: string) => void }) {
  const [level, setLevel] = useState<"SEA" | "CSEC" | "CAPE">("CSEC");
  const [q, setQ] = useState("");
  const list = SUBJECT_GROUPS[level].filter((s) => !q || s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3">
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

// ---------- availability filter (AM/PM bands) ----------
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
      {section("Daytime", "daytime")}
      {section("Evening and night", "evening")}
      {section("Morning", "morning")}
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

function PriceFilter({ min, max, onApply }: { min: number; max: number; onApply: (lo: number, hi: number) => void }) {
  const [v, setV] = useState<[number, number]>([min, max]);
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-ink">${v[0]} – ${v[1]}{v[1] >= 200 ? "+" : ""}</div>
      <SliderPrimitive.Root value={v} min={0} max={200} step={1} minStepsBetweenThumbs={1}
        onValueChange={(n) => setV([n[0], n[1]] as [number, number])}
        className="relative flex items-center w-full h-6 select-none touch-none">
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

// ---------- preview side panels ----------
function TutorPreview({ tutor }: { tutor: Tutor | null }) {
  if (!tutor) return <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Hover a tutor to preview.</div>;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={tutor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border" style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${tutor.hue}), oklch(0.65 0.15 ${tutor.hue}))` }}>
          <div className="absolute inset-0 grid place-items-center">
            <button className="size-16 rounded-full bg-brand text-white grid place-items-center shadow-pop"><Play className="size-7 fill-white ml-1" /></button>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-white font-bold text-lg">{tutor.name}</div>
            <div className="text-white/85 text-xs">{tutor.subjects.join(" · ")}</div>
          </div>
        </div>
        <Link to="/student/tutors/$id" params={{ id: tutor.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">See profile</Link>
      </motion.div>
    </AnimatePresence>
  );
}

function ClassPreview({ c }: { c: ClassRow | null }) {
  if (!c) return <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Hover a class to preview.</div>;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border" style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${c.hue}), oklch(0.65 0.15 ${c.hue}))` }}>
          <div className="absolute inset-0 grid place-items-center">
            <button className="size-16 rounded-full bg-brand text-white grid place-items-center shadow-pop"><Play className="size-7 fill-white ml-1" /></button>
          </div>
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] font-bold text-white"><Users className="size-3" /> Group class</div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-white font-bold text-lg line-clamp-2">{c.name}</div>
            <div className="text-white/85 text-xs">{c.schedule}</div>
          </div>
        </div>
        <Link to="/classes/$id" params={{ id: c.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">View details</Link>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------- page ----------
function ExplorePage() {
  const search = Route.useSearch();
  const { tab, q, page, subject, priceMin, priceMax, days, times } = search;
  const navigate = useNavigate();
  const update = (patch: any) => navigate({ to: "/classes", search: { ...search, ...patch } as any });

  const [query, setQuery] = useState(q || "");
  const [savedT, setSavedT] = useState<Set<string>>(new Set());
  const [savedC, setSavedC] = useState<Set<string>>(new Set());
  const [hoveredT, setHoveredT] = useState<string | null>(TUTORS[0].id);
  const [hoveredC, setHoveredC] = useState<string | null>(CLASSES[0].id);

  useEffect(() => { setQuery(q || ""); }, [q]);

  const ql = query.trim().toLowerCase();
  const selectedDays = days ? days.split(",").filter(Boolean) : [];
  const selectedTimes = times ? times.split(",").filter(Boolean) : [];

  const filteredT = useMemo(() => TUTORS.filter((t) => {
    if (ql && !(t.name.toLowerCase().includes(ql) || t.subjects.join(" ").toLowerCase().includes(ql) || t.headline.toLowerCase().includes(ql))) return false;
    if (subject && !t.subjects.some((s) => s.toLowerCase().includes(subject.toLowerCase()))) return false;
    if (t.pricePerLesson < priceMin || (priceMax < 200 && t.pricePerLesson > priceMax)) return false;
    return true;
  }), [ql, subject, priceMin, priceMax]);

  const filteredC = useMemo(() => CLASSES.filter((c) => {
    if (ql && !(c.name.toLowerCase().includes(ql) || c.tutorName.toLowerCase().includes(ql) || c.description.toLowerCase().includes(ql))) return false;
    if (subject && !c.subject.toLowerCase().includes(subject.toLowerCase())) return false;
    return true;
  }), [ql, subject]);

  const items = tab === "tutors" ? filteredT : filteredC;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hoveredTutor = tab === "tutors" ? (filteredT.find((t) => t.id === hoveredT) ?? filteredT[0] ?? null) : null;
  const hoveredClass = tab === "classes" ? (filteredC.find((c) => c.id === hoveredC) ?? filteredC[0] ?? null) : null;

  const onBookTutor = (t: Tutor) => {
    navigate({ to: "/student/tutors/$id/book", params: { id: t.id } });
  };
  const onEnroll = (c: ClassRow) => {
    navigate({ to: "/classes/$id", params: { id: c.id } });
  };

  const subjLabel = subject || "Any subject";
  const priceLabel = priceMin === 0 && priceMax >= 200 ? "$0 – $200+" : `$${priceMin} – $${priceMax}${priceMax >= 200 ? "+" : ""}`;
  const availLabel = selectedDays.length || selectedTimes.length ? `${selectedDays.length || "Any"}d · ${selectedTimes.length || "Any"}t` : "Any time";

  return (
    <ClassesShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-ink">Explore tutors & classes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              1:1 lessons and live group classes with verified Caribbean tutors.
            </p>
          </div>
          <div className="text-4xl">🎓</div>
        </div>

        {/* Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-muted">
          <button onClick={() => update({ tab: "tutors", page: 1 })}
            className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
              tab === "tutors" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
            <GraduationCap className="size-4" /> 1:1 Tutors
          </button>
          <button onClick={() => update({ tab: "classes", page: 1 })}
            className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
              tab === "classes" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
            <Users className="size-4" /> Group Classes
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <FilterField label="I want to learn" value={subjLabel} hasValue={!!subject}>
            <SubjectFilter value={subject} onApply={(s) => update({ subject: s, page: 1 })} />
          </FilterField>
          {tab === "tutors" && (
            <FilterField label="Price per lesson" value={priceLabel} hasValue={priceMin > 0 || priceMax < 200}>
              <PriceFilter min={priceMin} max={priceMax} onApply={(lo, hi) => update({ priceMin: lo, priceMax: hi, page: 1 })} />
            </FilterField>
          )}
          <FilterField label="I'm available" value={availLabel} hasValue={selectedDays.length > 0 || selectedTimes.length > 0}>
            <AvailabilityFilter days={selectedDays} times={selectedTimes}
              onApply={(d, t) => update({ days: d.join(","), times: t.join(","), page: 1 })} />
          </FilterField>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              onBlur={() => update({ q: query, page: 1 })}
              onKeyDown={(e) => e.key === "Enter" && update({ q: query, page: 1 })}
              placeholder={`Search ${tab}`}
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-border bg-background text-sm outline-none focus:border-brand" />
          </div>
        </div>

        {/* Active chips */}
        {(subject || selectedDays.length > 0 || selectedTimes.length > 0 || priceMin > 0 || priceMax < 200) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Active:</span>
            {subject && <Chip onRemove={() => update({ subject: "", page: 1 })}>{subject}</Chip>}
            {(priceMin > 0 || priceMax < 200) && <Chip onRemove={() => update({ priceMin: 0, priceMax: 200, page: 1 })}>{priceLabel}</Chip>}
            {selectedDays.map((d: string) => <Chip key={d} onRemove={() => update({ days: selectedDays.filter((x: string) => x !== d).join(","), page: 1 })}>{d}</Chip>)}
            {selectedTimes.map((t: string) => <Chip key={t} onRemove={() => update({ times: selectedTimes.filter((x: string) => x !== t).join(","), page: 1 })}>{TIME_BANDS.find((b) => b.key === t)?.label || t}</Chip>)}
            <button onClick={() => update({ subject: "", priceMin: 0, priceMax: 200, days: "", times: "", page: 1 })} className="text-xs font-semibold text-brand-deep hover:underline">Clear all</button>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {items.length} {tab === "tutors" ? "tutor" : "class"}{items.length === 1 ? "" : tab === "tutors" ? "s" : "es"}
          {items.length > PAGE_SIZE && <> · Page {currentPage} of {totalPages}</>}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="space-y-4">
            {tab === "tutors"
              ? pageItems.map((t) => (
                  <TutorCard key={(t as Tutor).id} t={t as Tutor}
                    saved={savedT.has((t as Tutor).id)}
                    toggleSave={() => setSavedT((s) => { const n = new Set(s); n.has((t as Tutor).id) ? n.delete((t as Tutor).id) : n.add((t as Tutor).id); return n; })}
                    onHover={() => setHoveredT((t as Tutor).id)}
                    onBook={() => onBookTutor(t as Tutor)} />
                ))
              : pageItems.map((c) => (
                  <ClassRowCard key={(c as ClassRow).id} c={c as ClassRow}
                    saved={savedC.has((c as ClassRow).id)}
                    toggleSave={() => setSavedC((s) => { const n = new Set(s); n.has((c as ClassRow).id) ? n.delete((c as ClassRow).id) : n.add((c as ClassRow).id); return n; })}
                    onHover={() => setHoveredC((c as ClassRow).id)}
                    onEnroll={() => onEnroll(c as ClassRow)} />
                ))}

            {pageItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
                No {tab} match these filters.
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button onClick={() => update({ page: currentPage - 1 })} disabled={currentPage === 1}
                  className="size-10 rounded-full border border-border grid place-items-center hover:bg-muted disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => update({ page: p })}
                    className={cn("min-w-10 h-10 px-3 rounded-full text-sm font-bold transition",
                      p === currentPage ? "bg-ink text-white" : "border border-border text-ink hover:bg-muted")}>{p}</button>
                ))}
                <button onClick={() => update({ page: currentPage + 1 })} disabled={currentPage === totalPages}
                  className="size-10 rounded-full border border-border grid place-items-center hover:bg-muted disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:block sticky top-24">
            {tab === "tutors" ? <TutorPreview tutor={hoveredTutor} /> : <ClassPreview c={hoveredClass} />}
          </div>
        </div>
      </div>
    </ClassesShell>
  );
}
