import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

export const Route = createFileRoute("/classes/")({
  head: () => ({ meta: [{ title: "Classes — iTutor" }] }),
  component: ClassesPage,
});

function ClassesPage() {
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState(SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = CLASSES.filter((c) => subject === "All" || c.subject === subject).map((c) => ({
    ...c,
    accent: ACCENTS[c.subject] ?? "#32CC6F",
  }));

  return (
    <ClassesShell>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Classes</h1>
        <p className="mt-2 text-[#A0A0A0]">Live group lessons taught by verified Caribbean tutors</p>
      </header>

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

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-[#1F1F1F] bg-[#111111] py-20 text-center">
          <div className="mb-4 size-20 rounded-2xl bg-[#1F1F1F]" />
          <div className="text-lg font-semibold">No classes found</div>
          <button onClick={() => setSubject("All")} className="mt-3 text-sm text-[#32CC6F] hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </ClassesShell>
  );
}
