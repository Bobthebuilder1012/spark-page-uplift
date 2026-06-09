import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Heart, Clock, Users, GraduationCap, BadgeCheck, TrendingUp, Sparkles, ChevronDown, Play, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { BookTrialModal } from "@/components/booking/BookTrialModal";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  tab: fallback(z.enum(["lessons", "tutors"]), "tutors").default("tutors"),
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
  speaks: { lang: string; level: string }[];
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

const TUTORS: Tutor[] = [
  { id: "ramdeen", name: "Mr. Ramdeen", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }, { lang: "Hindi", level: "B1" }], subjects: ["Mathematics", "Physics"], level: "CSEC · CAPE", rating: 4.9, reviews: 128, pricePerLesson: 35, hue: 145, verified: true, superTutor: true, professional: true, headline: "Master CSEC Maths & Physics with 10+ years of exam experience", blurb: "Hello! I'm Ramdeen, a Caribbean-trained tutor who's helped 200+ students earn Grade I in CSEC and CAPE Maths and Physics. Lessons are structured, patient and focused on real understanding.", activeStudents: 61, lessonsTaught: "14k+", topPercent: "Top 5%", recentBookings: 21 },
  { id: "singh", name: "Ms. Singh", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }], subjects: ["Physics"], level: "CSEC · CAPE", rating: 4.85, reviews: 94, pricePerLesson: 28, hue: 220, verified: true, headline: "UWI Physics graduate — Waves, Mechanics, Electricity made intuitive", blurb: "I make complex Physics concepts intuitive through real-world examples and step-by-step problem solving.", activeStudents: 42, lessonsTaught: "3,120", recentBookings: 12 },
  { id: "joseph", name: "Mr. Joseph", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }], subjects: ["English Lit", "English"], level: "CSEC", rating: 4.95, reviews: 211, pricePerLesson: 30, hue: 20, verified: true, superTutor: true, headline: "Caribbean literature & essay coaching — Grade I track record", blurb: "Literature tutor with a love for Caribbean writers. Focused on essay structure, poetry analysis and exam technique.", activeStudents: 88, lessonsTaught: "8,400", topPercent: "Top 10%", recentBookings: 18 },
  { id: "ali", name: "Ms. Ali", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }], subjects: ["Biology"], level: "CSEC · CAPE", rating: 4.7, reviews: 67, pricePerLesson: 30, hue: 280, verified: false, headline: "Biology educator — diagrams, mnemonics, and exam strategy", blurb: "I help students remember biology through visuals and stories — not rote learning.", activeStudents: 32, lessonsTaught: "1,800", recentBookings: 6 },
  { id: "thomas", name: "Mr. Thomas", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }, { lang: "French", level: "B2" }], subjects: ["Chemistry"], level: "CAPE", rating: 4.9, reviews: 142, pricePerLesson: 32, hue: 165, verified: true, professional: true, headline: "PhD Chemistry tutor — Organic, Inorganic & Physical for CAPE", blurb: "PhD-trained chemist focusing on CAPE preparation. We tackle past papers and build deep conceptual understanding.", activeStudents: 51, lessonsTaught: "5,600", topPercent: "Top 5%", recentBookings: 14 },
  { id: "khan", name: "Ms. Khan", flag: "🇹🇹", country: "Trinidad", speaks: [{ lang: "English", level: "Native" }], subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", rating: 4.92, reviews: 178, pricePerLesson: 22, hue: 35, verified: true, superTutor: true, headline: "SEA Prep specialist — building strong fundamentals", blurb: "Patient SEA preparation tutor with 7 years of experience. Strong fundamentals, gentle pace, real confidence.", activeStudents: 110, lessonsTaught: "9,100", topPercent: "Top 10%", recentBookings: 24 },
];

const SUBJECTS = ["All subjects", "Mathematics", "English", "Physics", "Chemistry", "Biology", "SEA Prep"];

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

function FilterField({ label, value, hasValue }: { label: string; value: string; hasValue?: boolean }) {
  return (
    <button className={cn("text-left rounded-2xl border border-border bg-background px-4 py-2.5 hover:border-ink/40 transition flex items-center justify-between gap-2", hasValue && "border-ink")}>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-ink truncate">{value}</div>
      </div>
      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
    </button>
  );
}

function ChipFilter({ label, count }: { label: string; count?: number }) {
  return (
    <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink hover:border-ink/40 transition inline-flex items-center gap-2">
      {label}
      {count !== undefined && (
        <span className="size-5 rounded-full bg-ink text-white text-[11px] font-bold grid place-items-center">{count}</span>
      )}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </button>
  );
}

function TutorCard({ t, onBook, onHover, saved, toggleSave }: { t: Tutor; onBook: () => void; onHover: () => void; saved: boolean; toggleSave: () => void }) {
  return (
    <div
      onMouseEnter={onHover}
      className="rounded-3xl border border-border bg-background p-5 hover:border-brand/40 hover:shadow-card transition-all"
    >
      <div className="flex gap-5">
        <div className="flex flex-col items-center gap-3">
          <Link to="/student/tutors/$id" params={{ id: t.id }}>
            <TutorAvatarSquare name={t.name} hue={t.hue} />
          </Link>
          <button onClick={toggleSave} className="size-10 rounded-full border border-border grid place-items-center hover:bg-muted">
            <Heart className={cn("size-4", saved ? "fill-coral text-coral" : "text-muted-foreground")} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to="/student/tutors/$id" params={{ id: t.id }} className="inline-flex items-center gap-1.5 hover:underline">
                <h3 className="text-xl font-bold text-ink truncate">{t.name}</h3>
                {t.verified && <BadgeCheck className="size-4 text-brand-deep shrink-0" />}
                <span className="text-base">{t.flag}</span>
              </Link>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="size-3.5" />
                  Speaks <span className="text-ink font-semibold">{t.speaks[0].lang}</span>
                  {t.speaks.length > 1 && <span>, {t.speaks[1].lang} ({t.speaks[1].level}) +{t.speaks.length - 1}</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                {t.superTutor && (
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Sparkles className="size-3.5 text-brand-deep" /> Super Tutor
                  </span>
                )}
                {t.professional && (
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <BadgeCheck className="size-3.5 text-brand-deep" /> Professional
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-ink leading-none">${t.pricePerLesson}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.subjects.includes("Mathematics") || t.subjects.includes("Physics") || true ? "50-min lesson" : ""}</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink font-semibold">✅ {t.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">💬 — {t.blurb}</p>

          <div className="mt-3 flex items-center gap-5 text-xs">
            <div>
              <div className="font-bold text-ink">{t.activeStudents}</div>
              <div className="text-muted-foreground">Active students</div>
            </div>
            <div>
              <div className="font-bold text-ink inline-flex items-center gap-1.5">
                {t.lessonsTaught}
                {t.topPercent && (
                  <span className="rounded-full bg-trust-bg text-trust-text px-2 py-0.5 text-[10px] font-bold">{t.topPercent}</span>
                )}
              </div>
              <div className="text-muted-foreground">Lessons taught</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> Very popular. Booked {t.recentBookings} times recently
            </div>
            <div className="flex items-center gap-2">
              <button className="size-10 rounded-xl border border-border grid place-items-center hover:bg-muted" title="Message">
                <MessageSquare className="size-4" />
              </button>
              <button
                onClick={onBook}
                className="rounded-full bg-brand text-white px-5 py-2.5 text-sm font-bold hover:bg-brand-deep transition"
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
      <motion.div
        key={tutor.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-3"
      >
        <div
          className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border"
          style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${tutor.hue}), oklch(0.65 0.15 ${tutor.hue}))` }}
        >
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
        <Link to="/student/tutors/$id" params={{ id: tutor.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">
          View full schedule
        </Link>
        <Link to="/student/tutors/$id" params={{ id: tutor.id }} className="block w-full text-center rounded-full border border-border bg-background py-3 text-sm font-semibold text-ink hover:bg-muted">
          See {tutor.name.split(" ").pop()}'s profile
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

function ExplorePage() {
  const { q, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [subject, setSubject] = useState("All subjects");
  const [query, setQuery] = useState(q || "");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(TUTORS[0].id);
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);

  useEffect(() => { setQuery(q || ""); }, [q]);

  const ql = query.trim().toLowerCase();
  const tutors = TUTORS.filter((t) => {
    const subjOk = subject === "All subjects" || t.subjects.some((s) => s.toLowerCase().includes(subject.toLowerCase()));
    const qOk = !ql || t.name.toLowerCase().includes(ql) || t.subjects.join(" ").toLowerCase().includes(ql) || t.headline.toLowerCase().includes(ql);
    return subjOk && qOk;
  });

  const hoveredTutor = tutors.find((t) => t.id === hovered) ?? tutors[0] ?? null;

  const setTab = (next: "lessons" | "tutors") =>
    navigate({ search: (prev: any) => ({ ...prev, tab: next }) });

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
        <button onClick={() => setTab("lessons")} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition", tab === "lessons" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
          <Users className="size-4" /> Group Lessons
        </button>
        <button onClick={() => setTab("tutors")} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition", tab === "tutors" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
          <GraduationCap className="size-4" /> 1:1 Tutors
        </button>
      </div>

      {/* Primary filter row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <FilterField label="I want to learn" value={subject === "All subjects" ? "Any subject" : subject} hasValue={subject !== "All subjects"} />
        <FilterField label="Price per lesson" value="$5 – $40+" />
        <FilterField label="Country of birth" value="Any country" />
        <FilterField label="I'm available" value="Any time" />
      </div>

      {/* Secondary chips + search */}
      <div className="flex flex-wrap items-center gap-2">
        <ChipFilter label="Specialties" count={1} />
        <ChipFilter label="Also speaks" />
        <ChipFilter label="Native speaker" />
        <ChipFilter label="Tutor categories" />
        <div className="flex-1 min-w-[200px]" />
        <ChipFilter label="Sort: Our top picks" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or keyword"
            className="pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm outline-none focus:border-brand min-w-[220px]"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {tutors.length} tutor{tutors.length === 1 ? "" : "s"} {ql && <>matching "<span className="text-ink font-medium">{query}</span>"</>}
      </div>

      {/* Grid: cards left, sticky video right */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="space-y-4">
          {tutors.map((t) => (
            <TutorCard
              key={t.id}
              t={t}
              saved={saved.has(t.id)}
              toggleSave={() => setSaved((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })}
              onHover={() => setHovered(t.id)}
              onBook={() => setBookingTutor(t)}
            />
          ))}
          {tutors.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No tutors match these filters.
            </div>
          )}
        </div>
        <div className="hidden lg:block sticky top-20">
          <VideoPreviewPanel tutor={hoveredTutor} />
        </div>
      </div>

      {bookingTutor && (
        <BookTrialModal
          open
          onClose={() => setBookingTutor(null)}
          tutorId={bookingTutor.id}
          tutorName={bookingTutor.name}
          tutorHue={bookingTutor.hue}
        />
      )}
    </div>
  );
}
