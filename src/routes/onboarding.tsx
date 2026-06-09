import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, GraduationCap, BookOpen, Sparkles } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Find your tutor — iTutor" }] }),
  component: OnboardingPage,
});

const SUBJECTS = {
  SEA: [
    "Mathematics",
    "English Language Arts",
    "Creative Writing",
    "Science",
    "Social Studies",
    "Comprehension",
    "Grammar",
    "Spelling",
  ],
  CSEC: [
    "Mathematics",
    "Additional Mathematics",
    "English A",
    "English B",
    "Physics",
    "Chemistry",
    "Biology",
    "Integrated Science",
    "Human & Social Biology",
    "Geography",
    "History",
    "Information Technology",
    "Principles of Business",
    "Principles of Accounts",
    "Economics",
    "Spanish",
    "French",
    "Social Studies",
    "Religious Education",
    "Office Administration",
    "Visual Arts",
    "Music",
    "Physical Education",
    "Agricultural Science",
    "Food & Nutrition",
    "Technical Drawing",
    "EDPM",
  ],
  CAPE: [
    "Pure Mathematics",
    "Applied Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Information Technology",
    "Accounting",
    "Economics",
    "Management of Business",
    "Law",
    "Sociology",
    "Caribbean Studies",
    "Communication Studies",
    "History",
    "Geography",
    "Literatures in English",
    "Spanish",
    "French",
    "Environmental Science",
    "Agricultural Science",
    "Digital Media",
    "Performing Arts",
    "Visual Arts",
    "Tourism",
    "Entrepreneurship",
    "Physical Education & Sport",
  ],
} as const;

type Level = keyof typeof SUBJECTS;
const LEVELS: { key: Level; label: string; icon: any }[] = [
  { key: "SEA", label: "SEA", icon: Sparkles },
  { key: "CSEC", label: "CSEC", icon: BookOpen },
  { key: "CAPE", label: "CAPE", icon: GraduationCap },
];

function BudgetSlider({ onChange }: { onChange: (v: [number, number]) => void }) {
  const [lo, setLo] = useState(15);
  const [hi, setHi] = useState(60);
  const MIN = 0;
  const MAX = 200;
  // Histogram bins for $0..$200 in 10-dollar bins (21 bins)
  const HIST = [2, 4, 7, 11, 16, 22, 30, 38, 44, 46, 42, 36, 28, 22, 16, 11, 8, 6, 4, 3, 2];

  useEffect(() => { onChange([lo, hi]); }, [lo, hi, onChange]);

  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      {/* Histogram */}
      <div className="relative h-24 flex items-end gap-1 px-1">
        {HIST.map((h, i) => {
          const v = MIN + ((MAX - MIN) * i) / (HIST.length - 1);
          const inRange = v >= lo - 5 && v <= hi + 5;
          return (
            <div
              key={i}
              className={cn("flex-1 rounded-t transition-colors", inRange ? "bg-brand" : "bg-brand/15")}
              style={{ height: `${h * 1.6}px` }}
            />
          );
        })}
      </div>

      {/* Slider track */}
      <div className="relative h-2 bg-muted rounded-full mt-1">
        <div
          className="absolute h-2 bg-ink rounded-full"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 1))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-20"
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 1))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute -top-2 size-6 rounded-full bg-background border-2 border-ink shadow pointer-events-none"
          style={{ left: `calc(${pct(lo)}% - 12px)` }}
        />
        <div
          className="absolute -top-2 size-6 rounded-full bg-background border-2 border-ink shadow pointer-events-none"
          style={{ left: `calc(${pct(hi)}% - 12px)` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Minimum</div>
          <div className="rounded-xl border border-border px-3 py-2.5 font-semibold text-ink">$ {lo}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Maximum</div>
          <div className="rounded-xl border border-border px-3 py-2.5 font-semibold text-ink">
            $ {hi}{hi >= MAX ? "+" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [level, setLevel] = useState<Level>("CSEC");
  const [subject, setSubject] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [, setBudget] = useState<[number, number]>([15, 60]);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => navigate({ to: "/student/tutors" }), 1800);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  if (step === 2) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 max-w-3xl"
        >
          <motion.div
            animate={{ rotate: [0, 8, -6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={64} />
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-bold text-ink leading-tight">
            Finding tutors who will<br />inspire you.
          </h1>
        </motion.div>
      </div>
    );
  }

  const filteredSubjects = SUBJECTS[level].filter((s) =>
    !search || s.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 py-4 border-b border-border flex items-center justify-between max-w-3xl mx-auto w-full">
        {step > 0 ? (
          <button onClick={() => setStep((s) => (s - 1) as 0 | 1)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Back
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Home
          </Link>
        )}
        <Logo size={24} />
        <div className="text-xs font-semibold text-muted-foreground">Step {step + 1} of 2</div>
      </header>

      <div className="h-1 bg-muted">
        <div className="h-full bg-brand transition-all" style={{ width: step === 0 ? "50%" : "100%" }} />
      </div>

      <main className="flex-1 flex items-start justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="w-full max-w-2xl"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What would you like to learn?</h2>
              <p className="text-center text-muted-foreground mt-2">
                Pick your exam level, then choose a subject.
              </p>

              {/* Level tabs */}
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-full bg-muted p-1">
                  {LEVELS.map((l) => {
                    const Icon = l.icon;
                    const active = level === l.key;
                    return (
                      <button
                        key={l.key}
                        onClick={() => { setLevel(l.key); setSubject(null); setSearch(""); }}
                        className={cn(
                          "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition",
                          active ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink",
                        )}
                      >
                        <Icon className="size-4" />
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${level} subjects…`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-background text-sm outline-none focus:border-brand"
                />
              </div>

              {/* Subjects list (scrollable) */}
              <div className="mt-4 rounded-2xl border border-border max-h-[360px] overflow-y-auto divide-y divide-border">
                {filteredSubjects.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">No subjects match "{search}".</div>
                ) : (
                  filteredSubjects.map((s) => {
                    const selected = subject === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSubject(s)}
                        className={cn(
                          "w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-muted/60 transition flex items-center justify-between",
                          selected && "bg-brand-soft text-ink",
                        )}
                      >
                        <span>{s}</span>
                        {selected && <span className="text-xs font-bold text-brand-deep">Selected</span>}
                      </button>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!subject}
                className={cn(
                  "mt-8 w-full py-4 rounded-full font-bold text-base transition",
                  subject ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground",
                )}
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="w-full max-w-2xl"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What's your budget?</h2>
              <p className="text-center text-muted-foreground mt-2">Hourly rate range in USD</p>
              <div className="mt-10">
                <BudgetSlider onChange={setBudget} />
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-10 w-full py-4 rounded-full bg-brand text-white font-bold text-base hover:bg-brand-deep"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
