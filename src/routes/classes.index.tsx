import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, GraduationCap, Users, Star, BadgeCheck, Clock } from "lucide-react";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { ClassCard, type ClassCardData } from "@/components/classes/ClassCard";

const SUBJECTS = ["All", "Mathematics", "English", "Biology", "Chemistry", "Physics"];
const SORTS = ["Most Popular", "Newest", "Rating"];

const ACCENTS: Record<string, string> = {
  Mathematics: "#32CC6F",
  English: "#6E8BFF",
  Biology: "#FF8A65",
  Chemistry: "#C77DFF",
  Physics: "#FFC857",
};

const CLASSES: ClassCardData[] = [
  { id: "c1", name: "CSEC Mathematics — Algebra & Functions", subject: "Mathematics", description: "A weekly group class covering core algebra topics with worked past-paper questions and quick assessments.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 24, priceTTD: 350 },
  { id: "c2", name: "English A — Paper 2 Essay Workshop", subject: "English", description: "Structured essay-writing sessions focused on Paper 2, including planning, argumentation and revision feedback.", tutorName: "Marcus Hill", verified: true, rating: 4.7, ratingCount: 18, priceTTD: 300 },
  { id: "c3", name: "CSEC Biology — Cells, Genetics & Systems", subject: "Biology", description: "Live group lessons walking through every CSEC Biology unit with diagrams, mnemonics and weekly quizzes.", tutorName: "Dr. Renee Joseph", verified: true, rating: 4.9, ratingCount: 41, priceTTD: 400 },
  { id: "c4", name: "Chemistry Crash Course — Acids, Bases & Salts", subject: "Chemistry", description: "Focused monthly programme covering exam-priority topics with live demos and structured practice sets.", tutorName: "Ravi Singh", verified: true, rating: 4.6, ratingCount: 12, priceTTD: 375 },
  { id: "c5", name: "CSEC Physics — Mechanics Mastery", subject: "Physics", description: "Group classes that break mechanics down into bite-size problems, with weekly check-ins and homework reviews.", tutorName: "Kieran Pierre", verified: true, rating: 4.5, ratingCount: 9, priceTTD: 350 },
  { id: "c6", name: "Mathematics — Geometry & Trigonometry", subject: "Mathematics", description: "Step-by-step group sessions for geometry and trigonometry with visual proofs and timed practice.", tutorName: "Asha Persad", verified: true, rating: 4.8, ratingCount: 33, priceTTD: 350 },
];

type TutorCardData = {
  id: string;
  name: string;
  subjects: string[];
  level: string;
  blurb: string;
  rating: number;
  reviewCount: number;
  priceTTD: number;
  verified: boolean;
  nextSlot: string;
  hue: number;
};

const TUTORS: TutorCardData[] = [
  { id: "t1", name: "Asha Persad", subjects: ["Mathematics", "Physics"], level: "CSEC · CAPE", blurb: "10+ yrs · Calculus, Trig, Mechanics", rating: 4.9, reviewCount: 128, priceTTD: 120, verified: true, nextSlot: "Today 6:00 PM", hue: 145 },
  { id: "t2", name: "Marcus Hill", subjects: ["English A", "English Lit"], level: "CSEC", blurb: "Essay & poetry coaching", rating: 4.95, reviewCount: 211, priceTTD: 100, verified: true, nextSlot: "Today 8:00 PM", hue: 20 },
  { id: "t3", name: "Dr. Renee Joseph", subjects: ["Biology"], level: "CSEC · CAPE", blurb: "PhD · Cells, Genetics, Systems", rating: 4.85, reviewCount: 67, priceTTD: 130, verified: true, nextSlot: "Wed 5:00 PM", hue: 280 },
  { id: "t4", name: "Ravi Singh", subjects: ["Chemistry"], level: "CAPE", blurb: "Organic & Physical chem specialist", rating: 4.8, reviewCount: 142, priceTTD: 125, verified: true, nextSlot: "Tomorrow 7:00 PM", hue: 165 },
  { id: "t5", name: "Kieran Pierre", subjects: ["Physics"], level: "CSEC · CAPE", blurb: "UWI grad · Mechanics, Waves", rating: 4.7, reviewCount: 94, priceTTD: 110, verified: true, nextSlot: "Tomorrow 4:00 PM", hue: 220 },
  { id: "t6", name: "Ms. Khan", subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", blurb: "5+ yrs SEA prep · all subjects", rating: 4.92, reviewCount: 178, priceTTD: 80, verified: true, nextSlot: "Today 5:30 PM", hue: 35 },
];

export const Route = createFileRoute("/classes/")({
  head: () => ({ meta: [{ title: "Classes — iTutor" }] }),
  component: ClassesPage,
});

function TutorAvatar({ name, hue, size = 56 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: `oklch(0.75 0.12 ${hue})`,
        color: `oklch(0.22 0.08 ${hue})`,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function TutorCard({ t }: { t: TutorCardData }) {
  return (
    <Link
      to="/student/tutors/$id"
      params={{ id: t.id }}
      className="group flex flex-col gap-3 rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5 transition hover:border-[#32CC6F]/50"
    >
      <div className="flex items-start gap-3">
        <TutorAvatar name={t.name} hue={t.hue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-bold text-white">{t.name}</h3>
            {t.verified && <BadgeCheck className="size-4 shrink-0 text-[#32CC6F]" />}
          </div>
          <div className="mt-0.5 truncate text-xs text-[#A0A0A0]">{t.subjects.join(" · ")}</div>
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#1F1F1F] px-2 py-0.5 text-[11px] font-medium text-[#A0A0A0]">
            {t.level}
          </div>
        </div>
      </div>

      <p className="text-sm text-[#A0A0A0] line-clamp-2">{t.blurb}</p>

      <div className="flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-bold tabular-nums text-amber-400">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {t.rating.toFixed(1)}
        </span>
        <span className="text-[#A0A0A0]">{t.reviewCount} reviews</span>
      </div>

      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#32CC6F]">
        <Clock className="size-3" /> Next: {t.nextSlot}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#1F1F1F] pt-3">
        <div>
          <div className="text-base font-bold text-white">TTD ${t.priceTTD}</div>
          <div className="text-[11px] text-[#A0A0A0]">per hour</div>
        </div>
        <span className="rounded-full bg-[#32CC6F] px-4 py-2 text-xs font-semibold text-black transition group-hover:brightness-110">
          Book trial
        </span>
      </div>
    </Link>
  );
}

function ClassesPage() {
  const [tab, setTab] = useState<"classes" | "tutors">("classes");
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState(SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const filteredClasses = CLASSES.filter((c) => subject === "All" || c.subject === subject).map((c) => ({
    ...c,
    accent: ACCENTS[c.subject] ?? "#32CC6F",
  }));

  const filteredTutors = TUTORS.filter(
    (t) => subject === "All" || t.subjects.some((s) => s === subject || (subject === "Mathematics" && s === "Mathematics")),
  );

  return (
    <ClassesShell>
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Explore</h1>
        <p className="mt-2 text-[#A0A0A0]">Join a live group class, or book a 1:1 with a verified Caribbean tutor.</p>
      </header>

      <div className="mb-6 inline-flex rounded-2xl border border-[#1F1F1F] bg-[#111111] p-1">
        <button
          onClick={() => setTab("classes")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "classes" ? "bg-[#32CC6F] text-black" : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          <Users className="size-4" /> Group Classes
        </button>
        <button
          onClick={() => setTab("tutors")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === "tutors" ? "bg-[#32CC6F] text-black" : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          <GraduationCap className="size-4" /> 1:1 Tutors
        </button>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
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
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#111111] px-4 py-2 text-sm font-medium text-white"
          >
            Sort: {sort} <ChevronDown className="size-4" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] shadow-xl z-10">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSort(s);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 ${
                    sort === s ? "text-[#32CC6F]" : "text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {tab === "classes" ? (
        filteredClasses.length === 0 ? (
          <EmptyState label="No classes found" onClear={() => setSubject("All")} />
        ) : (
          <>
            <div className="mb-4 text-sm text-[#A0A0A0]">
              {filteredClasses.length} class{filteredClasses.length === 1 ? "" : "es"} available
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((c) => (
                <ClassCard key={c.id} c={c} />
              ))}
            </div>
          </>
        )
      ) : filteredTutors.length === 0 ? (
        <EmptyState label="No tutors found" onClear={() => setSubject("All")} />
      ) : (
        <>
          <div className="mb-4 text-sm text-[#A0A0A0]">
            {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"} for 1:1 sessions
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((t) => (
              <TutorCard key={t.id} t={t} />
            ))}
          </div>
        </>
      )}
    </ClassesShell>
  );
}

function EmptyState({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[#1F1F1F] bg-[#111111] py-20 text-center">
      <div className="mb-4 size-20 rounded-2xl bg-[#1F1F1F]" />
      <div className="text-lg font-semibold">{label}</div>
      <button onClick={onClear} className="mt-3 text-sm text-[#32CC6F] hover:underline">
        Clear filters
      </button>
    </div>
  );
}
