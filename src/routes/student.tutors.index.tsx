import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Heart, Calendar, Clock, Sparkles, SlidersHorizontal, Users, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  tab: fallback(z.enum(["lessons", "tutors"]), "lessons").default("lessons"),
});

export const Route = createFileRoute("/student/tutors/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: "Explore — iTutor Student" }],
  }),
  component: ExplorePage,
});

const TUTORS = [
  { id: "ramdeen", name: "Mr. Ramdeen", subject: "Mathematics", level: "CSEC · CAPE", rating: 4.9, reviews: 128, price: 120, nextSlot: "Today 6:00 PM", tags: ["Top rated", "10+ years"], color: "from-brand to-brand-deep" },
  { id: "singh", name: "Ms. Singh", subject: "Physics", level: "CSEC · CAPE", rating: 4.8, reviews: 94, price: 110, nextSlot: "Tomorrow 4:00 PM", tags: ["UWI grad"], color: "from-sky to-lavender" },
  { id: "joseph", name: "Mr. Joseph", subject: "English Lit", level: "CSEC", rating: 4.95, reviews: 211, price: 100, nextSlot: "Today 8:00 PM", tags: ["Top rated"], color: "from-coral to-peach" },
  { id: "ali", name: "Ms. Ali", subject: "Biology", level: "CSEC · CAPE", rating: 4.7, reviews: 67, price: 115, nextSlot: "Wed 5:00 PM", tags: ["New"], color: "from-lavender to-brand-soft" },
  { id: "thomas", name: "Mr. Thomas", subject: "Chemistry", level: "CAPE", rating: 4.85, reviews: 142, price: 130, nextSlot: "Tomorrow 7:00 PM", tags: ["PhD"], color: "from-brand-deep to-forest" },
  { id: "khan", name: "Ms. Khan", subject: "SEA Prep", level: "Primary", rating: 4.92, reviews: 178, price: 80, nextSlot: "Today 5:30 PM", tags: ["Top rated", "5+ years"], color: "from-peach to-coral" },
];

type GroupLesson = {
  id: string;
  title: string;
  tutor: string;
  tutorId: string;
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
  { id: "phys-wed", title: "Physics Power Hour", tutor: "Mr. Ramdeen", tutorId: "ramdeen", subject: "Physics", level: "CSEC", day: "Wednesdays", time: "4:00 – 6:00 PM", monthlyPrice: 200, seats: { taken: 8, total: 12 }, rating: 4.9, tags: ["Group", "4 sessions/mo"], color: "from-sky to-lavender", emoji: "⚛️" },
  { id: "maths-mon", title: "CSEC Maths Mastery", tutor: "Mr. Ramdeen", tutorId: "ramdeen", subject: "Mathematics", level: "CSEC", day: "Mondays", time: "5:00 – 7:00 PM", monthlyPrice: 220, seats: { taken: 10, total: 12 }, rating: 4.95, tags: ["Top rated", "Almost full"], color: "from-brand to-brand-deep", emoji: "📐" },
  { id: "eng-tue", title: "Essay Lab", tutor: "Mr. Joseph", tutorId: "joseph", subject: "English Lit", level: "CSEC", day: "Tuesdays", time: "6:00 – 7:30 PM", monthlyPrice: 160, seats: { taken: 6, total: 10 }, rating: 4.85, tags: ["Group", "Includes feedback"], color: "from-coral to-peach", emoji: "📚" },
  { id: "bio-thu", title: "Bio Lab Live", tutor: "Ms. Ali", tutorId: "ali", subject: "Biology", level: "CSEC", day: "Thursdays", time: "4:30 – 6:00 PM", monthlyPrice: 180, seats: { taken: 4, total: 12 }, rating: 4.7, tags: ["New"], color: "from-lavender to-brand-soft", emoji: "🧬" },
  { id: "chem-sat", title: "CAPE Chem Bootcamp", tutor: "Mr. Thomas", tutorId: "thomas", subject: "Chemistry", level: "CAPE", day: "Saturdays", time: "10:00 AM – 12:00 PM", monthlyPrice: 240, seats: { taken: 11, total: 12 }, rating: 4.9, tags: ["PhD", "Almost full"], color: "from-brand-deep to-forest", emoji: "🧪" },
  { id: "sea-fri", title: "SEA Sprint Friday", tutor: "Ms. Khan", tutorId: "khan", subject: "SEA Prep", level: "Primary", day: "Fridays", time: "5:00 – 6:30 PM", monthlyPrice: 140, seats: { taken: 7, total: 12 }, rating: 4.92, tags: ["Top rated"], color: "from-peach to-coral", emoji: "✏️" },
];

const CHIPS = ["All", "Maths", "English", "Physics", "Chemistry", "Biology", "SEA"];

function ExplorePage() {
  const { q, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState(q || "");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => { setQuery(q || ""); }, [q]);

  const ql = query.trim().toLowerCase();
  const matchSubject = (s: string) =>
    active === "All" ||
    s.toLowerCase().includes(active.toLowerCase()) ||
    (active === "SEA" && s === "SEA Prep");

  const tutors = TUTORS
    .filter((t) => matchSubject(t.subject))
    .filter((t) => !ql || t.name.toLowerCase().includes(ql) || t.subject.toLowerCase().includes(ql) || t.tags.join(" ").toLowerCase().includes(ql));

  const lessons = LESSONS
    .filter((l) => matchSubject(l.subject))
    .filter((l) => !ql || l.title.toLowerCase().includes(ql) || l.tutor.toLowerCase().includes(ql) || l.subject.toLowerCase().includes(ql) || l.tags.join(" ").toLowerCase().includes(ql));

  const setTab = (next: "lessons" | "tutors") =>
    navigate({ search: (prev: { q: string; tab: "lessons" | "tutors" }) => ({ ...prev, tab: next }) });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Explore</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Join a recurring group lesson, or book a 1:1 with a tutor.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-muted">
        <button
          onClick={() => setTab("lessons")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
            tab === "lessons" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink"
          )}
        >
          <Users className="size-4" /> Group Lessons
        </button>
        <button
          onClick={() => setTab("tutors")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
            tab === "tutors" ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink"
          )}
        >
          <GraduationCap className="size-4" /> 1:1 Tutors
        </button>
      </div>

      {/* Search bar */}
      <div className="rounded-2xl bg-background border border-border p-2 flex items-center gap-2 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "lessons" ? "Search lessons, subjects, tutors…" : "Search tutors by subject or name…"}
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
        </div>
        <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-xl">
          <SlidersHorizontal className="size-4" /> Filters
        </button>
      </div>

      {/* Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border",
              active === c
                ? "bg-ink text-white border-ink"
                : "bg-background text-muted-foreground border-border hover:border-ink/30"
            )}
          >
            {c}
          </button>
        ))}
        <div className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-coral-soft text-coral whitespace-nowrap">
          <Sparkles className="size-3.5" /> {tab === "lessons" ? "Enrolling now" : "Available this week"}
        </div>
      </div>

      {tab === "lessons" ? (
        <>
          <div className="text-sm text-muted-foreground">
            {lessons.length} lesson{lessons.length === 1 ? "" : "s"} {ql && <>matching "<span className="text-ink font-medium">{query}</span>"</>}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((l) => {
              const pctFull = Math.round((l.seats.taken / l.seats.total) * 100);
              const almostFull = l.seats.total - l.seats.taken <= 2;
              return (
                <div key={l.id} className="group rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5 flex flex-col">
                  <div className={`relative h-28 bg-gradient-to-br ${l.color} flex items-end p-4`}>
                    <button
                      onClick={() => setSaved((s) => { const n = new Set(s); n.has(l.id) ? n.delete(l.id) : n.add(l.id); return n; })}
                      className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white"
                    >
                      <Heart className={cn("size-4", saved.has(l.id) ? "fill-coral text-coral" : "text-ink")} />
                    </button>
                    <div className="size-14 rounded-2xl bg-white grid place-items-center text-2xl shadow-md">
                      {l.emoji}
                    </div>
                    {almostFull && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-coral uppercase tracking-wider">Almost full</span>
                    )}
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
                      <Link to="/student/tutors/$id" params={{ id: l.tutorId }} className="text-sm text-muted-foreground hover:text-ink hover:underline">
                        with {l.tutor}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">{l.subject} · {l.level}</div>
                    </div>

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
                        <div className={cn("h-full rounded-full", almostFull ? "bg-coral" : "bg-brand")} style={{ width: `${pctFull}%` }} />
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-3 mt-auto border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-ink">TT${l.monthlyPrice}</span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-deep transition">
                        Join lesson
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutors.map((t) => (
              <Link
                key={t.id}
                to="/student/tutors/$id"
                params={{ id: t.id }}
                className="group rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5"
              >
                <div className={`relative h-32 bg-gradient-to-br ${t.color} flex items-end p-4`}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSaved((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; });
                    }}
                    className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white"
                  >
                    <Heart className={cn("size-4", saved.has(t.id) ? "fill-coral text-coral" : "text-ink")} />
                  </button>
                  <div className="size-16 rounded-2xl bg-white grid place-items-center text-xl font-bold text-forest shadow-md">
                    {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  {t.tags.includes("Top rated") && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-forest uppercase tracking-wider">★ Top rated</span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-ink">{t.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-coral text-coral" />
                        <span className="font-semibold">{t.rating}</span>
                        <span className="text-muted-foreground text-xs">({t.reviews})</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{t.subject} · {t.level}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-deep font-medium">
                    <Clock className="size-3.5" /> Next 1:1: {t.nextSlot}
                  </div>
                  <div className="flex items-end justify-between pt-2 border-t border-border">
                    <div>
                      <span className="text-lg font-bold text-ink">TT${t.price}</span>
                      <span className="text-xs text-muted-foreground">/hr</span>
                    </div>
                    <span className="text-xs font-semibold text-brand-deep group-hover:underline">Request 1:1 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
