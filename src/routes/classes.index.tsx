import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Star, Heart, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight,
  Play, Users, Sparkles, TrendingUp, Clock, GraduationCap, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { AvailabilityFilter, hourLabel } from "@/components/filters/AvailabilityFilter";
import { CLASSES_CATALOG, type ClassListing } from "@/lib/classes-catalog";
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

// Group classes pulled from the shared catalog so explore, detail and tutor profiles stay in sync.
type ClassRow = ClassListing;
const CLASSES: ClassRow[] = CLASSES_CATALOG;

const PAGE_SIZE = 12;

// Subject groups (for tabbed subject filter)
const SUBJECT_GROUPS = {
  SEA: ["Mathematics", "English Language Arts", "Creative Writing", "Science", "Social Studies"],
  CSEC: ["Mathematics", "Additional Mathematics", "English A", "English B", "English Lit", "Physics", "Chemistry", "Biology", "Information Technology", "Spanish", "French", "Geography", "History", "Principles of Business", "Principles of Accounts", "Economics"],
  CAPE: ["Pure Mathematics", "Applied Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Accounting", "Economics", "Management of Business", "Law", "Sociology", "Caribbean Studies", "Communication Studies", "Literatures in English"],
};


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
          <p className="mt-3 text-sm text-ink font-semibold line-clamp-2">{t.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 hidden sm:block">{t.blurb}</p>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> Booked {t.recentBookings} times recently
            </div>
            <div className="flex items-center gap-2 ml-auto">
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

// ---------- class card (Coursera-style vertical) ----------
function ClassRowCard({ c, saved, toggleSave, onHover, onEnroll }: { c: ClassRow; saved: boolean; toggleSave: () => void; onHover: () => void; onEnroll: () => void }) {
  const seatsLeft = Math.max(0, c.seatsTotal - c.seatsTaken);
  return (
    <div
      onMouseEnter={onHover}
      className="group flex flex-col rounded-3xl border border-border bg-background overflow-hidden hover:border-brand/50 hover:shadow-card transition-all"
    >
      {/* Branded banner */}
      <Link to="/classes/$id" params={{ id: c.id }} className="block">
        <div
          className="relative h-36 sm:h-40 grid place-items-center text-white overflow-hidden"
          style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${c.hue}), oklch(0.55 0.16 ${c.hue}))` }}
        >
          <span className="absolute right-4 bottom-2 text-[7rem] leading-none opacity-30 select-none font-black">{c.emoji ?? c.subject[0]}</span>
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/25 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold">{c.level}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold">
              <Users className="size-3" /> Group
            </span>
            {c.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink text-white px-2.5 py-0.5 text-[10px] font-bold">
                <Sparkles className="size-3" /> Popular
              </span>
            )}
          </div>
          {c.promoLabel && (
            <span className="absolute bottom-3 left-3 rounded-full bg-coral text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {c.promoLabel}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleSave(); }}
            className="absolute top-3 right-3 size-9 rounded-full bg-background/90 backdrop-blur grid place-items-center hover:bg-background"
          >
            <Heart className={cn("size-4", saved ? "fill-coral text-coral" : "text-ink")} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        <Link to="/student/tutors/$id" params={{ id: c.tutorId }} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-ink transition">
          <span
            className="grid size-6 place-items-center rounded-full text-[9px] font-bold"
            style={{ background: `oklch(0.85 0.1 ${c.tutorHue})`, color: `oklch(0.28 0.07 ${c.tutorHue})` }}
          >
            {c.tutorName.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </span>
          <span className="font-semibold text-ink hover:underline">{c.tutorName}</span>
          {c.tutorVerified && <BadgeCheck className="size-3.5 text-brand-deep" />}
        </Link>

        <Link to="/classes/$id" params={{ id: c.id }}>
          <h3 className="mt-2 text-base sm:text-lg font-bold text-ink leading-snug line-clamp-2 group-hover:text-brand-deep transition">
            {c.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{c.tagline}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-ink">
          <span className="inline-flex items-center gap-1 font-bold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> {c.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">({c.ratingCount})</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{c.subject}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {c.duration}</span>
          <span className="inline-flex items-center gap-1"><Users className="size-3" /> {c.seatsTaken} enrolled</span>
          {seatsLeft > 0 && seatsLeft <= 4 && (
            <span className="font-semibold text-coral">Only {seatsLeft} left</span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-ink">TTD ${c.priceTTD}</span>
              {c.originalPriceTTD && (
                <span className="text-xs text-muted-foreground line-through">${c.originalPriceTTD}</span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground">per month</div>
          </div>
          <button onClick={onEnroll} className="rounded-full bg-brand text-white px-4 py-2 text-sm font-bold hover:bg-brand-deep">
            {seatsLeft === 0 ? "Waitlist" : "Join Class"}
          </button>
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
            <div className="text-white font-bold text-lg line-clamp-2">{c.title}</div>
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
    if (ql && !(c.title.toLowerCase().includes(ql) || c.tutorName.toLowerCase().includes(ql) || c.tagline.toLowerCase().includes(ql))) return false;
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
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Explore tutors & classes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            1:1 lessons and live group classes with verified Caribbean tutors.
          </p>
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
            {selectedTimes.map((t: string) => <Chip key={t} onRemove={() => update({ times: selectedTimes.filter((x: string) => x !== t).join(","), page: 1 })}>{hourLabel(t)}</Chip>)}
            <button onClick={() => update({ subject: "", priceMin: 0, priceMax: 200, days: "", times: "", page: 1 })} className="text-xs font-semibold text-brand-deep hover:underline">Clear all</button>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {items.length} {tab === "tutors" ? "tutor" : "class"}{items.length === 1 ? "" : tab === "tutors" ? "s" : "es"}
          {items.length > PAGE_SIZE && <> · Page {currentPage} of {totalPages}</>}
        </div>

        <div className={cn("grid gap-5 items-start", tab === "tutors" && "lg:grid-cols-[1fr_320px]")}>
          <div className={cn(tab === "tutors" ? "space-y-4" : "grid sm:grid-cols-2 xl:grid-cols-3 gap-5")}>
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
          {tab === "tutors" && (
            <div className="hidden lg:block sticky top-24">
              <TutorPreview tutor={hoveredTutor} />
            </div>
          )}
        </div>
      </div>
    </ClassesShell>
  );
}
