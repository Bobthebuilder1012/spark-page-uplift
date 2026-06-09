import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Heart, Calendar, Clock, Sparkles, SlidersHorizontal, Users, GraduationCap, BadgeCheck, Flame, X, Check, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  tab: fallback(z.enum(["lessons", "tutors"]), "lessons").default("lessons"),
});

export const Route = createFileRoute("/student/tutors/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Explore — iTutor Student" }] }),
  component: ExplorePage,
});

type Tutor = {
  id: string;
  name: string;
  subjects: string[]; // multiple
  level: string;
  rating: number;
  reviews: number;
  price: number;
  nextSlot: string;
  hue: number;
  verified: boolean;
  topRated?: boolean;
  blurb: string;
};

const TUTORS: Tutor[] = [
  { id: "ramdeen", name: "Mr. Ramdeen", subjects: ["Mathematics", "Physics"], level: "CSEC · CAPE", rating: 4.9, reviews: 128, price: 120, nextSlot: "Today 6:00 PM", hue: 145, verified: true, topRated: true, blurb: "10+ yrs · Calculus, Trig, Mechanics" },
  { id: "singh", name: "Ms. Singh", subjects: ["Physics"], level: "CSEC · CAPE", rating: 4.8, reviews: 94, price: 110, nextSlot: "Tomorrow 4:00 PM", hue: 220, verified: true, blurb: "UWI grad · Waves, Electricity" },
  { id: "joseph", name: "Mr. Joseph", subjects: ["English Lit", "English"], level: "CSEC", rating: 4.95, reviews: 211, price: 100, nextSlot: "Today 8:00 PM", hue: 20, verified: true, topRated: true, blurb: "Essay & poetry coaching" },
  { id: "ali", name: "Ms. Ali", subjects: ["Biology"], level: "CSEC · CAPE", rating: 4.7, reviews: 67, price: 115, nextSlot: "Wed 5:00 PM", hue: 280, verified: false, blurb: "Diagrams, mnemonics, exam tips" },
  { id: "thomas", name: "Mr. Thomas", subjects: ["Chemistry"], level: "CAPE", rating: 4.85, reviews: 142, price: 130, nextSlot: "Tomorrow 7:00 PM", hue: 165, verified: true, blurb: "PhD · Organic & Physical chem" },
  { id: "khan", name: "Ms. Khan", subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", rating: 4.92, reviews: 178, price: 80, nextSlot: "Today 5:30 PM", hue: 35, verified: true, topRated: true, blurb: "5+ yrs SEA prep · all subjects" },
];

type GroupLesson = {
  id: string;
  title: string;
  tutor: string;
  tutorId: string;
  tutorHue: number;
  subject: string;
  level: string;
  day: string;
  time: string;
  monthlyPrice: number;
  seats: { taken: number; total: number };
  rating: number;
  tags: string[];
  color: string;
  emoji: string;
};

const LESSONS: GroupLesson[] = [
  { id: "phys-wed", title: "Physics Power Hour", tutor: "Mr. Ramdeen", tutorId: "ramdeen", tutorHue: 145, subject: "Physics", level: "CSEC", day: "Wednesdays", time: "4:00 – 6:00 PM", monthlyPrice: 200, seats: { taken: 9, total: 12 }, rating: 4.9, tags: ["Group", "4 sessions/mo"], color: "from-sky to-lavender", emoji: "⚛️" },
  { id: "maths-mon", title: "CSEC Maths Mastery", tutor: "Mr. Ramdeen", tutorId: "ramdeen", tutorHue: 145, subject: "Mathematics", level: "CSEC", day: "Mondays", time: "5:00 – 7:00 PM", monthlyPrice: 220, seats: { taken: 10, total: 12 }, rating: 4.95, tags: ["Top rated"], color: "from-brand to-brand-deep", emoji: "📐" },
  { id: "eng-tue", title: "Essay Lab", tutor: "Mr. Joseph", tutorId: "joseph", tutorHue: 20, subject: "English Lit", level: "CSEC", day: "Tuesdays", time: "6:00 – 7:30 PM", monthlyPrice: 160, seats: { taken: 6, total: 10 }, rating: 4.85, tags: ["Includes feedback"], color: "from-coral to-peach", emoji: "📚" },
  { id: "bio-thu", title: "Bio Lab Live", tutor: "Ms. Ali", tutorId: "ali", tutorHue: 280, subject: "Biology", level: "CSEC", day: "Thursdays", time: "4:30 – 6:00 PM", monthlyPrice: 180, seats: { taken: 4, total: 12 }, rating: 4.7, tags: ["New"], color: "from-lavender to-brand-soft", emoji: "🧬" },
  { id: "chem-sat", title: "CAPE Chem Bootcamp", tutor: "Mr. Thomas", tutorId: "thomas", tutorHue: 165, subject: "Chemistry", level: "CAPE", day: "Saturdays", time: "10:00 AM – 12:00 PM", monthlyPrice: 240, seats: { taken: 11, total: 12 }, rating: 4.9, tags: ["PhD"], color: "from-brand-deep to-forest", emoji: "🧪" },
  { id: "sea-fri", title: "SEA Sprint Friday", tutor: "Ms. Khan", tutorId: "khan", tutorHue: 35, subject: "SEA Prep", level: "Primary", day: "Fridays", time: "5:00 – 6:30 PM", monthlyPrice: 140, seats: { taken: 7, total: 12 }, rating: 4.92, tags: ["Top rated"], color: "from-peach to-coral", emoji: "✏️" },
];

const CHIPS = ["All", "Maths", "English", "Physics", "Chemistry", "Biology", "SEA"];

function TutorAvatar({ name, hue, size = 40 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="inline-flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        background: `oklch(0.85 0.1 ${hue})`,
        color: `oklch(0.28 0.07 ${hue})`,
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function TutorGrid({
  tutors,
  saved,
  setSaved,
}: {
  tutors: Tutor[];
  saved: Set<string>;
  setSaved: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = tutors.find((t) => t.id === hoveredId) ?? null;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div className="space-y-3">
        {tutors.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId((id) => (id === t.id ? null : id))}
            className="group rounded-2xl border border-border bg-background p-4 hover:shadow-card hover:border-brand/40 transition-all flex flex-row gap-4 items-start"
          >
            <div className="relative shrink-0">
              <Link to="/student/tutors/$id" params={{ id: t.id }} aria-label={t.name}>
                <TutorAvatar name={t.name} hue={t.hue} size={64} />
              </Link>
              <button
                onClick={() =>
                  setSaved((s) => {
                    const n = new Set(s);
                    n.has(t.id) ? n.delete(t.id) : n.add(t.id);
                    return n;
                  })
                }
                className="absolute -top-1 -right-1 size-7 rounded-full bg-background border border-border grid place-items-center hover:bg-muted"
                aria-label="Save tutor"
              >
                <Heart className={cn("size-3.5", saved.has(t.id) ? "fill-coral text-coral" : "text-muted-foreground")} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/student/tutors/$id"
                    params={{ id: t.id }}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <h3 className="font-semibold text-ink truncate">{t.name}</h3>
                    {t.verified && <BadgeCheck className="size-4 text-brand-deep shrink-0" />}
                  </Link>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {t.subjects.join(" · ")}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold tabular-nums">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      {t.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">{t.reviews} reviews</span>
                    {t.topRated && (
                      <span className="bg-brand-soft text-trust-text text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        Top Rated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{t.blurb}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-deep font-medium mt-2">
                    <Clock className="size-3" /> Next: {t.nextSlot}
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <div>
                    <div className="text-xl font-bold text-ink leading-none">TT${t.price}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">/hr</div>
                  </div>
                  <button className="bg-brand text-white rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-brand-deep transition">
                    Book trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop hover preview panel */}
      <div className="hidden lg:block sticky top-24 self-start">
        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border border-border bg-background p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <TutorAvatar name={hovered.name} hue={hovered.hue} size={80} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="font-bold text-ink truncate">{hovered.name}</div>
                    {hovered.verified && <BadgeCheck className="size-4 text-brand-deep" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{hovered.subjects.join(" · ")}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">TT${hovered.price}/hr</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{hovered.blurb}</p>
              <div className="flex items-center gap-1.5 text-xs text-brand-deep font-medium mt-3">
                <Clock className="size-3.5" /> Next available: {hovered.nextSlot}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/student/tutors/$id"
                  params={{ id: hovered.id }}
                  className="w-full text-center text-sm font-semibold px-3 py-2 rounded-xl border border-brand text-brand-deep hover:bg-brand-soft transition"
                >
                  View full schedule →
                </Link>
                <Link
                  to="/student/tutors/$id"
                  params={{ id: hovered.id }}
                  className="w-full text-center text-sm font-semibold px-3 py-2 rounded-xl border border-border text-ink hover:bg-muted transition"
                >
                  See {hovered.name}'s profile →
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
            >
              Hover a tutor to preview their availability.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



function ExplorePage() {
  const { q, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState(q || "");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [joinLesson, setJoinLesson] = useState<GroupLesson | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  useEffect(() => { setQuery(q || ""); }, [q]);

  const ql = query.trim().toLowerCase();
  const matchSubject = (s: string | string[]) => {
    if (active === "All") return true;
    const arr = Array.isArray(s) ? s : [s];
    return arr.some((x) => x.toLowerCase().includes(active.toLowerCase()) || (active === "SEA" && x === "SEA Prep") || (active === "Maths" && x === "Mathematics"));
  };

  const tutors = TUTORS
    .filter((t) => matchSubject(t.subjects))
    .filter((t) => !ql || t.name.toLowerCase().includes(ql) || t.subjects.join(" ").toLowerCase().includes(ql) || t.blurb.toLowerCase().includes(ql));

  const lessons = LESSONS
    .filter((l) => matchSubject(l.subject))
    .filter((l) => !ql || l.title.toLowerCase().includes(ql) || l.tutor.toLowerCase().includes(ql) || l.subject.toLowerCase().includes(ql) || l.tags.join(" ").toLowerCase().includes(ql));

  const setTab = (next: "lessons" | "tutors") =>
    navigate({ search: (prev: { q: string; tab: "lessons" | "tutors" }) => ({ ...prev, tab: next }) });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Explore</h1>
        <p className="text-sm text-muted-foreground mt-1">Join a recurring group lesson, or book a 1:1 with a tutor.</p>
      </div>

      <div className="inline-flex p-1 rounded-2xl bg-muted">
        <button onClick={() => setTab("lessons")} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition", tab === "lessons" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
          <Users className="size-4" /> Group Lessons
        </button>
        <button onClick={() => setTab("tutors")} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition", tab === "tutors" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
          <GraduationCap className="size-4" /> 1:1 Tutors
        </button>
      </div>

      <div className="rounded-2xl bg-background border border-border p-2 flex items-center gap-2 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "lessons" ? "Search lessons, subjects, tutors…" : "Search tutors by subject or name…"}
            className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
          />
        </div>
        <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-xl">
          <SlidersHorizontal className="size-4" /> Filters
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CHIPS.map((c) => (
          <button key={c} onClick={() => setActive(c)} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border", active === c ? "bg-ink text-white border-ink" : "bg-background text-muted-foreground border-border hover:border-ink/30")}>
            {c}
          </button>
        ))}
      </div>

      {tab === "lessons" ? (
        <>
          <div className="text-sm text-muted-foreground">
            {lessons.length} lesson{lessons.length === 1 ? "" : "s"} {ql && <>matching "<span className="text-ink font-medium">{query}</span>"</>}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((l) => {
              const remaining = l.seats.total - l.seats.taken;
              const lowStock = remaining > 0 && remaining <= 5;
              const full = remaining <= 0;
              const pctFull = Math.round((l.seats.taken / l.seats.total) * 100);
              return (
                <div key={l.id} className="group rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5 flex flex-col">
                  <div className={`relative h-24 bg-gradient-to-br ${l.color} flex items-end p-3`}>
                    <button
                      onClick={() => setSaved((s) => { const n = new Set(s); n.has(l.id) ? n.delete(l.id) : n.add(l.id); return n; })}
                      className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white"
                    >
                      <Heart className={cn("size-4", saved.has(l.id) ? "fill-coral text-coral" : "text-ink")} />
                    </button>
                    <div className="size-12 rounded-2xl bg-white grid place-items-center text-2xl shadow-md">{l.emoji}</div>
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-ink leading-tight">{l.title}</h3>
                        <div className="flex items-center gap-1 text-sm shrink-0">
                          <Star className="size-3.5 fill-coral text-coral" />
                          <span className="font-semibold">{l.rating}</span>
                        </div>
                      </div>
                      <Link to="/student/tutors/$id" params={{ id: l.tutorId }} className="mt-1.5 inline-flex items-center gap-2 group/by hover:text-ink">
                        <TutorAvatar name={l.tutor} hue={l.tutorHue} size={22} />
                        <span className="text-sm text-muted-foreground group-hover/by:text-ink group-hover/by:underline">by {l.tutor}</span>
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">{l.subject} · {l.level}</div>
                    </div>

                    {(lowStock || full) && (
                      <div className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full self-start", full ? "bg-muted text-muted-foreground" : "bg-coral-soft text-coral")}>
                        <Flame className="size-3.5" />
                        {full ? "Lesson full · join waitlist" : `Only ${remaining} spot${remaining === 1 ? "" : "s"} left!`}
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-brand-deep font-medium">
                        <Calendar className="size-3.5" /> {l.day}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" /> {l.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-3.5" /> {l.seats.taken}/{l.seats.total} enrolled
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", lowStock ? "bg-coral" : "bg-brand")} style={{ width: `${pctFull}%` }} />
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-3 mt-auto border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-ink">TT${l.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                      <button
                        disabled={full || joined.has(l.id)}
                        onClick={() => setJoinLesson(l)}
                        className="px-3 py-1.5 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-deep transition disabled:opacity-50"
                      >
                        {joined.has(l.id) ? "Enrolled ✓" : full ? "Waitlist" : "Join lesson"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {tutors.length} tutor{tutors.length === 1 ? "" : "s"} for 1:1 sessions {ql && <>matching "<span className="text-ink font-medium">{query}</span>"</>}
          </div>
          <TutorGrid tutors={tutors} saved={saved} setSaved={setSaved} />

        </>
      )}

      {/* Join lesson confirmation — bottom sheet on mobile, centered modal on desktop */}
      {joinLesson && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setJoinLesson(null)}>
          <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Join recurring lesson</div>
                <div className="font-semibold text-ink text-sm">{joinLesson.title}</div>
              </div>
              <button onClick={() => setJoinLesson(null)} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Hero */}
              <div className={cn("rounded-2xl bg-gradient-to-br p-4 flex items-center gap-3", joinLesson.color)}>
                <div className="size-14 rounded-2xl bg-white grid place-items-center text-3xl shadow-md">{joinLesson.emoji}</div>
                <div className="text-white">
                  <div className="font-bold leading-tight">{joinLesson.title}</div>
                  <div className="text-xs opacity-90">{joinLesson.subject} · {joinLesson.level}</div>
                </div>
              </div>

              {/* Tutor */}
              <Link to="/student/tutors/$id" params={{ id: joinLesson.tutorId }} className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted transition">
                <TutorAvatar name={joinLesson.tutor} hue={joinLesson.tutorHue} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Taught by</div>
                  <div className="font-semibold text-ink text-sm truncate">{joinLesson.tutor}</div>
                </div>
                <span className="text-xs text-brand-deep font-semibold">View →</span>
              </Link>

              {/* Schedule */}
              <div className="rounded-2xl border border-border p-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-ink">
                  <Repeat className="size-4 text-brand-deep" />
                  <span className="font-semibold">Every {joinLesson.day}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" /> {joinLesson.time}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" /> {joinLesson.seats.taken}/{joinLesson.seats.total} students enrolled
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" /> 4 sessions per month · ongoing
                </div>
              </div>

              {/* What's included */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What's included</div>
                <ul className="space-y-1.5 text-sm text-ink">
                  {[
                    "Live group sessions every week",
                    "Recordings for missed classes",
                    "Notes & worksheets after each class",
                    "Group chat with the tutor",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2"><Check className="size-4 text-brand-deep mt-0.5 shrink-0" /><span>{x}</span></li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="rounded-2xl bg-mint p-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Monthly subscription</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Cancel anytime · first class free preview</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-ink">TT${joinLesson.monthlyPrice}</div>
                  <div className="text-[11px] text-muted-foreground">/month</div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">By joining, you'll be charged monthly and agree to rate the lesson at the end of each month.</p>

              <button
                onClick={() => {
                  setJoined((j) => new Set(j).add(joinLesson.id));
                  setJoinLesson(null);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep"
              >
                <Check className="size-4" /> Confirm & enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
