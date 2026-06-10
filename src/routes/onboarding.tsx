import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ChevronLeft, Search, GraduationCap, BookOpen, Sparkles, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Find your tutor — iTutor" }] }),
  component: OnboardingPage,
});

const SUBJECTS = {
  SEA: [
    "Mathematics", "English Language Arts", "Creative Writing", "Science",
    "Social Studies", "Comprehension", "Grammar", "Spelling",
  ],
  CSEC: [
    "Mathematics", "Additional Mathematics", "English A", "English B", "Physics",
    "Chemistry", "Biology", "Integrated Science", "Human & Social Biology",
    "Geography", "History", "Information Technology", "Principles of Business",
    "Principles of Accounts", "Economics", "Spanish", "French", "Social Studies",
    "Religious Education", "Office Administration", "Visual Arts", "Music",
    "Physical Education", "Agricultural Science", "Food & Nutrition",
    "Technical Drawing", "EDPM",
  ],
  CAPE: [
    "Pure Mathematics", "Applied Mathematics", "Physics", "Chemistry", "Biology",
    "Computer Science", "Information Technology", "Accounting", "Economics",
    "Management of Business", "Law", "Sociology", "Caribbean Studies",
    "Communication Studies", "History", "Geography", "Literatures in English",
    "Spanish", "French", "Environmental Science", "Agricultural Science",
    "Digital Media", "Performing Arts", "Visual Arts", "Tourism",
    "Entrepreneurship", "Physical Education & Sport",
  ],
} as const;

type Level = keyof typeof SUBJECTS;
const LEVELS: { key: Level; label: string; icon: any }[] = [
  { key: "SEA", label: "SEA", icon: Sparkles },
  { key: "CSEC", label: "CSEC", icon: BookOpen },
  { key: "CAPE", label: "CAPE", icon: GraduationCap },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES: { key: string; label: string; icon: any }[] = [
  { key: "morning", label: "Morning", icon: Sunrise },
  { key: "afternoon", label: "Afternoon", icon: Sun },
  { key: "evening", label: "Evening", icon: Sunset },
  { key: "night", label: "Night", icon: Moon },
];

function BudgetSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const MIN = 0, MAX = 200;
  const HIST = [2, 4, 7, 11, 16, 22, 30, 38, 44, 46, 42, 36, 28, 22, 16, 11, 8, 6, 4, 3, 2];
  const [lo, hi] = value;

  return (
    <div>
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

      <SliderPrimitive.Root
        value={[lo, hi]}
        min={MIN}
        max={MAX}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
        className="relative flex items-center w-full h-6 select-none touch-none mt-1"
      >
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-muted grow">
          <SliderPrimitive.Range className="absolute h-full bg-ink rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-6 rounded-full bg-background border-2 border-ink shadow focus:outline-none focus:ring-2 focus:ring-brand/40" />
        <SliderPrimitive.Thumb className="block size-6 rounded-full bg-background border-2 border-ink shadow focus:outline-none focus:ring-2 focus:ring-brand/40" />
      </SliderPrimitive.Root>

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
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [level, setLevel] = useState<Level>("CSEC");
  const [subject, setSubject] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<[number, number]>([15, 60]);
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => {
        navigate({
          to: "/student/tutors",
          search: {
            q: "",
            tab: "tutors",
            page: 1,
            subject: subject ?? "",
            priceMin: budget[0],
            priceMax: budget[1],
            days: days.join(","),
            times: times.join(","),
          } as any,
        });
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step, navigate, subject, budget, days, times]);

  if (step === 3) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 max-w-3xl">
          <motion.div animate={{ rotate: [0, 8, -6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <Logo size={64} />
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-bold text-ink leading-tight">
            Finding tutors who will<br />inspire you.
          </h1>
        </motion.div>
      </div>
    );
  }

  const filteredSubjects = SUBJECTS[level].filter((s) => !search || s.toLowerCase().includes(search.toLowerCase()));

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 py-4 border-b border-border flex items-center justify-between max-w-3xl mx-auto w-full">
        {step > 0 ? (
          <button onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Back
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Home
          </Link>
        )}
        <Logo size={24} />
        <div className="text-xs font-semibold text-muted-foreground">Step {step + 1} of 3</div>
      </header>

      <div className="h-1 bg-muted">
        <div className="h-full bg-brand transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      <main className="flex-1 flex items-start justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What would you like to learn?</h2>
              <p className="text-center text-muted-foreground mt-2">Pick your exam level, then choose a subject.</p>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-full bg-muted p-1">
                  {LEVELS.map((l) => {
                    const Icon = l.icon;
                    const active = level === l.key;
                    return (
                      <button
                        key={l.key}
                        onClick={() => { setLevel(l.key); setSubject(null); setSearch(""); }}
                        className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition", active ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}
                      >
                        <Icon className="size-4" />{l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${level} subjects…`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-background text-sm outline-none focus:border-brand"
                />
              </div>

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
                        className={cn("w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-muted/60 transition flex items-center justify-between", selected && "bg-brand-soft text-ink")}
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
                className={cn("mt-8 w-full py-4 rounded-full font-bold text-base transition", subject ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground")}
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What's your budget?</h2>
              <p className="text-center text-muted-foreground mt-2">Hourly rate range in USD</p>
              <div className="mt-10"><BudgetSlider value={budget} onChange={setBudget} /></div>
              <button onClick={() => setStep(2)} className="mt-10 w-full py-4 rounded-full bg-brand text-white font-bold text-base hover:bg-brand-deep">
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">When can you take lessons?</h2>
              <p className="text-center text-muted-foreground mt-2">Pick the days and times that work best. We'll match tutors to your schedule.</p>

              <div className="mt-8">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Days</div>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const active = days.includes(d);
                    return (
                      <button
                        key={d}
                        onClick={() => toggle(days, d, setDays)}
                        className={cn("px-5 py-2.5 rounded-2xl border-2 text-sm font-semibold transition", active ? "border-ink bg-ink text-white" : "border-border text-ink hover:border-ink/40")}
                      >{d}</button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Times</div>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((t) => {
                    const Icon = t.icon;
                    const active = times.includes(t.key);
                    return (
                      <button
                        key={t.key}
                        onClick={() => toggle(times, t.key, setTimes)}
                        className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 text-sm font-semibold transition", active ? "border-ink bg-ink text-white" : "border-border text-ink hover:border-ink/40")}
                      ><Icon className="size-4" />{t.label}</button>
                    );
                  })}
                </div>
              </div>

              <button onClick={() => setStep(3)} className="mt-10 w-full py-4 rounded-full bg-brand text-white font-bold text-base hover:bg-brand-deep">
                Find my tutors
              </button>
              <button onClick={() => setStep(3)} className="mt-2 w-full py-2 text-sm font-semibold text-muted-foreground hover:text-ink">
                Skip — show all tutors
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
