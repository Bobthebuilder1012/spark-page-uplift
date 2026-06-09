import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  Heart,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassesShell } from "@/components/classes/ClassesShell";

const ACCENTS: Record<string, string> = {
  Mathematics: "145",
  English: "20",
  Biology: "280",
  Chemistry: "165",
  Physics: "220",
  "SEA Prep": "35",
};

type ClassRow = {
  id: string;
  name: string;
  subject: string;
  description: string;
  tutorName: string;
  verified: boolean;
  rating: number;
  ratingCount: number;
  priceTTD: number;
  level: string;
  schedule: string;
  seatsLeft: number;
  enrolled: number;
  recentJoins: number;
  popular?: boolean;
};

const CLASSES: ClassRow[] = [
  { id: "c1", name: "CSEC Mathematics — Algebra & Functions", subject: "Mathematics", level: "CSEC", description: "Weekly group class covering algebra and functions with worked past-paper questions and quick assessments.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 24, priceTTD: 350, schedule: "Tue · 4:00 PM (90 min)", seatsLeft: 4, enrolled: 18, recentJoins: 7, popular: true },
  { id: "c2", name: "English A — Paper 2 Essay Workshop", subject: "English", level: "CSEC", description: "Structured essay-writing focused on Paper 2 — planning, argumentation and revision feedback.", tutorName: "Marcus Hill", verified: true, rating: 4.7, ratingCount: 18, priceTTD: 300, schedule: "Thu · 6:00 PM (75 min)", seatsLeft: 6, enrolled: 14, recentJoins: 4 },
  { id: "c3", name: "CSEC Biology — Cells, Genetics & Systems", subject: "Biology", level: "CSEC", description: "Live group lessons walking through every CSEC Biology unit with diagrams, mnemonics and weekly quizzes.", tutorName: "Dr. Renee Joseph", verified: true, rating: 4.9, ratingCount: 41, priceTTD: 400, schedule: "Wed · 5:00 PM (90 min)", seatsLeft: 2, enrolled: 22, recentJoins: 9, popular: true },
  { id: "c4", name: "Chemistry Crash Course — Acids, Bases & Salts", subject: "Chemistry", level: "CSEC", description: "Focused programme covering exam-priority topics with live demos and structured practice sets.", tutorName: "Ravi Singh", verified: true, rating: 4.6, ratingCount: 12, priceTTD: 375, schedule: "Sat · 10:00 AM (60 min)", seatsLeft: 9, enrolled: 8, recentJoins: 3 },
  { id: "c5", name: "CSEC Physics — Mechanics Mastery", subject: "Physics", level: "CSEC", description: "Group classes that break mechanics into bite-size problems, with weekly check-ins and homework reviews.", tutorName: "Kieran Pierre", verified: true, rating: 4.5, ratingCount: 9, priceTTD: 350, schedule: "Mon · 5:30 PM (75 min)", seatsLeft: 12, enrolled: 6, recentJoins: 2 },
  { id: "c6", name: "Mathematics — Geometry & Trigonometry", subject: "Mathematics", level: "CSEC", description: "Step-by-step group sessions for geometry and trigonometry with visual proofs and timed practice.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 33, priceTTD: 350, schedule: "Fri · 4:00 PM (90 min)", seatsLeft: 5, enrolled: 19, recentJoins: 6 },
  { id: "c7", name: "SEA Prep — English Comprehension Bootcamp", subject: "SEA Prep", level: "SEA", description: "Confidence-building weekly group sessions for SEA students — comprehension, vocab and exam writing.", tutorName: "Ms. Thompson", verified: true, rating: 4.95, ratingCount: 52, priceTTD: 250, schedule: "Sat · 9:00 AM (60 min)", seatsLeft: 3, enrolled: 21, recentJoins: 11, popular: true },
  { id: "c8", name: "CAPE Pure Maths — Calculus Sprint", subject: "Mathematics", level: "CAPE", description: "Six-week sprint focused on Unit 1 calculus with weekly past-paper drills and worked solutions.", tutorName: "Ms. Persad", verified: true, rating: 4.92, ratingCount: 28, priceTTD: 500, schedule: "Sun · 5:00 PM (90 min)", seatsLeft: 6, enrolled: 14, recentJoins: 5 },
];

const PAGE_SIZE = 12;
const SUBJECT_OPTIONS = ["All subjects", "Mathematics", "English", "Biology", "Chemistry", "Physics", "SEA Prep"];

function ClassAvatar({ name, hue, size = 132 }: { name: string; hue: number; size?: number }) {
  const initials = name.split(/[ —-]/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div
      className="relative rounded-2xl grid place-items-center font-bold shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `oklch(0.32 0.12 ${hue})`,
        color: `oklch(0.92 0.05 ${hue})`,
        fontSize: size * 0.28,
      }}
    >
      <span className="opacity-90">{initials}</span>
      <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-[#32CC6F] ring-2 ring-[#111111]" />
    </div>
  );
}

function FilterField({ label, value }: { label: string; value: string }) {
  return (
    <button className="text-left rounded-2xl border border-[#1F1F1F] bg-[#111111] px-4 py-2.5 hover:border-white/30 transition flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-[#A0A0A0]">{label}</div>
        <div className="text-sm font-semibold text-white truncate">{value}</div>
      </div>
      <ChevronDown className="size-4 text-[#A0A0A0] shrink-0" />
    </button>
  );
}

function ClassRowCard({
  c,
  hue,
  saved,
  toggleSave,
  onHover,
}: {
  c: ClassRow;
  hue: number;
  saved: boolean;
  toggleSave: () => void;
  onHover: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      className="rounded-3xl border border-[#1F1F1F] bg-[#111111] p-5 hover:border-[#32CC6F]/40 transition-all"
    >
      <div className="flex gap-5">
        <div className="flex flex-col items-center gap-3">
          <Link to="/classes/$id" params={{ id: c.id }}>
            <ClassAvatar name={c.name} hue={hue} />
          </Link>
          <button
            onClick={toggleSave}
            className="size-10 rounded-full border border-[#1F1F1F] grid place-items-center hover:bg-white/5"
          >
            <Heart className={`size-4 ${saved ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-[#A0A0A0]"}`} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to="/classes/$id" params={{ id: c.id }} className="hover:underline">
                <h3 className="text-xl font-bold text-white truncate">{c.name}</h3>
              </Link>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-white">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {c.rating.toFixed(2)}
                </span>
                <span className="text-sm text-[#A0A0A0]">({c.ratingCount} ratings)</span>
                <span className="text-sm text-[#A0A0A0]">· {c.subject}</span>
                <span className="rounded-full bg-[#1F1F1F] px-2 py-0.5 text-[11px] font-medium text-[#A0A0A0]">{c.level}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="grid size-6 place-items-center rounded-full bg-[#1F1F1F] text-[10px] font-bold text-white/70">
                  {c.tutorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-white">{c.tutorName}</span>
                {c.verified && <BadgeCheck className="size-4 text-[#32CC6F]" />}
                {c.popular && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-[#32CC6F]">
                    <Sparkles className="size-3.5" /> Popular
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-white leading-none">TT${c.priceTTD}</div>
              <div className="text-xs text-[#A0A0A0] mt-1">per month</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-white/85 line-clamp-2">{c.description}</p>

          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="font-bold text-white inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#A0A0A0]" /> {c.schedule}
              </div>
              <div className="text-[#A0A0A0] mt-0.5">Live session</div>
            </div>
            <div>
              <div className="font-bold text-white">{c.enrolled}</div>
              <div className="text-[#A0A0A0]">Enrolled</div>
            </div>
            <div>
              <div className="font-bold text-white">{c.seatsLeft}</div>
              <div className="text-[#A0A0A0]">Seats left</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#A0A0A0]">
              <TrendingUp className="size-3.5" /> {c.recentJoins} students joined this week
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/classes/$id"
                params={{ id: c.id }}
                className="rounded-full border border-[#1F1F1F] text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
              >
                Details
              </Link>
              <Link
                to="/classes/$id"
                params={{ id: c.id }}
                className="rounded-full bg-[#32CC6F] text-black px-5 py-2.5 text-sm font-bold hover:brightness-110 transition"
              >
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassPreviewPanel({ c, hue }: { c: ClassRow | null; hue: number }) {
  if (!c) {
    return (
      <div className="rounded-3xl border border-dashed border-[#1F1F1F] p-6 text-center text-sm text-[#A0A0A0]">
        Hover a class to preview.
      </div>
    );
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={c.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-3"
      >
        <div
          className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#1F1F1F]"
          style={{ background: `linear-gradient(135deg, oklch(0.32 0.12 ${hue}), oklch(0.18 0.1 ${hue}))` }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <button className="size-16 rounded-full bg-[#32CC6F] text-black grid place-items-center shadow-lg hover:scale-105 transition">
              <Play className="size-7 fill-black ml-1" />
            </button>
          </div>
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] font-bold text-white">
            <Users className="size-3" /> Group class
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
            <div className="text-white font-bold text-lg drop-shadow line-clamp-2">{c.name}</div>
            <div className="text-white/80 text-xs mt-0.5">{c.schedule}</div>
          </div>
        </div>
        <Link
          to="/classes/$id"
          params={{ id: c.id }}
          className="block w-full text-center rounded-full border border-[#1F1F1F] bg-[#111111] py-3 text-sm font-semibold text-white hover:bg-white/5"
        >
          View class details
        </Link>
        <Link
          to="/classes/$id"
          params={{ id: c.id }}
          className="block w-full text-center rounded-full bg-[#32CC6F] py-3 text-sm font-bold text-black hover:brightness-110"
        >
          Enroll · TT${c.priceTTD}/mo
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

export const Route = createFileRoute("/classes/")({
  head: () => ({ meta: [{ title: "Classes — iTutor" }] }),
  component: ClassesPage,
});

function ClassesPage() {
  const [subject, setSubject] = useState("All subjects");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(CLASSES[0]?.id ?? null);

  useEffect(() => setPage(1), [subject, query]);

  const ql = query.trim().toLowerCase();
  const filtered = useMemo(() => CLASSES.filter((c) => {
    const subjOk = subject === "All subjects" || c.subject === subject;
    const qOk = !ql || c.name.toLowerCase().includes(ql) || c.tutorName.toLowerCase().includes(ql) || c.description.toLowerCase().includes(ql);
    return subjOk && qOk;
  }), [subject, ql]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hoveredClass = pageItems.find((c) => c.id === hovered) ?? pageItems[0] ?? null;
  const hue = Number(ACCENTS[hoveredClass?.subject ?? "Mathematics"] ?? 145);

  return (
    <ClassesShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Join a class that fits your goals</h1>
            <p className="text-sm text-[#A0A0A0] mt-1">
              Live group classes with verified Caribbean tutors — SEA, CSEC and CAPE.
            </p>
          </div>
          <div className="text-4xl">📚</div>
        </div>

        {/* Primary filter row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <FilterField label="Subject" value={subject === "All subjects" ? "Any subject" : subject} />
          <FilterField label="Price per month" value="TT$0 – TT$500+" />
          <FilterField label="Level" value="SEA · CSEC · CAPE" />
          <FilterField label="Schedule" value="Any time" />
        </div>

        {/* Subject chips + search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2 flex-1 min-w-[200px]">
            {SUBJECT_OPTIONS.map((s) => {
              const active = s === subject;
              return (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#32CC6F] text-black"
                      : "border border-[#1F1F1F] bg-[#111111] text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <button className="rounded-full border border-[#1F1F1F] bg-[#111111] px-4 py-2 text-sm font-medium text-white inline-flex items-center gap-2">
            Sort: Most popular
            <ChevronDown className="size-3.5 text-[#A0A0A0]" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A0A0A0]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search classes"
              className="pl-9 pr-4 py-2 rounded-full border border-[#1F1F1F] bg-[#111111] text-sm text-white outline-none focus:border-[#32CC6F] min-w-[220px]"
            />
          </div>
        </div>

        <div className="text-sm text-[#A0A0A0]">
          {filtered.length} class{filtered.length === 1 ? "" : "es"}
          {filtered.length > PAGE_SIZE && <> · Page {page} of {totalPages}</>}
        </div>

        {/* Grid: cards left, sticky preview right */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="space-y-4">
            {pageItems.map((c) => (
              <ClassRowCard
                key={c.id}
                c={c}
                hue={Number(ACCENTS[c.subject] ?? 145)}
                saved={saved.has(c.id)}
                toggleSave={() => setSaved((s) => {
                  const n = new Set(s);
                  n.has(c.id) ? n.delete(c.id) : n.add(c.id);
                  return n;
                })}
                onHover={() => setHovered(c.id)}
              />
            ))}
            {pageItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#1F1F1F] p-12 text-center text-[#A0A0A0]">
                No classes match these filters.
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="size-10 rounded-full border border-[#1F1F1F] grid place-items-center hover:bg-white/5 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-10 h-10 px-3 rounded-full text-sm font-bold transition ${
                      p === page ? "bg-[#32CC6F] text-black" : "border border-[#1F1F1F] text-white hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="size-10 rounded-full border border-[#1F1F1F] grid place-items-center hover:bg-white/5 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:block sticky top-24">
            <ClassPreviewPanel c={hoveredClass} hue={hue} />
          </div>
        </div>
      </div>
    </ClassesShell>
  );
}
