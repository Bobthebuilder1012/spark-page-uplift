import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ChevronLeft, Search, GraduationCap, BookOpen, Sparkles, Sunrise, Sun, Sunset, Moon, Check } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { cn } from "@/lib/utils";
import { setAuthed } from "@/lib/auth";

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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time bands grouped by part of day, AM/PM
const TIME_GROUPS: { key: "morning" | "afternoon" | "evening" | "night"; label: string; icon: any; bands: { key: string; label: string }[] }[] = [
  { key: "morning", label: "Morning", icon: Sunrise, bands: [
    { key: "6-9am",  label: "6–9 AM" },
    { key: "9-12am", label: "9 AM – 12 PM" },
  ]},
  { key: "afternoon", label: "Afternoon", icon: Sun, bands: [
    { key: "12-3pm", label: "12–3 PM" },
    { key: "3-6pm",  label: "3–6 PM" },
  ]},
  { key: "evening", label: "Evening", icon: Sunset, bands: [
    { key: "6-9pm",  label: "6–9 PM" },
    { key: "9-12pm", label: "9 PM – 12 AM" },
  ]},
  { key: "night", label: "Late night", icon: Moon, bands: [
    { key: "12-3am", label: "12–3 AM" },
    { key: "3-6am",  label: "3–6 AM" },
  ]},
];

// Loading animation word cycle
const INSPIRE_WORDS = ["inspire", "challenge", "support", "uplift", "guide", "encourage", "spark", "elevate"];

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
          return <div key={i} className={cn("flex-1 rounded-t transition-colors", inRange ? "bg-brand" : "bg-brand/15")} style={{ height: `${h * 1.6}px` }} />;
        })}
      </div>
      <SliderPrimitive.Root value={[lo, hi]} min={MIN} max={MAX} step={1} minStepsBetweenThumbs={1}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
        className="relative flex items-center w-full h-6 select-none touch-none mt-1">
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-muted grow">
          <SliderPrimitive.Range className="absolute h-full bg-ink rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-6 rounded-full bg-background border-2 border-ink shadow focus:outline-none" />
        <SliderPrimitive.Thumb className="block size-6 rounded-full bg-background border-2 border-ink shadow focus:outline-none" />
      </SliderPrimitive.Root>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Minimum</div>
          <div className="rounded-xl border border-border px-3 py-2.5 font-semibold text-ink">$ {lo}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Maximum</div>
          <div className="rounded-xl border border-border px-3 py-2.5 font-semibold text-ink">$ {hi}{hi >= MAX ? "+" : ""}</div>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  // 0=subjects, 1=budget, 2=availability, 3=name, 4=loading
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [level, setLevel] = useState<Level>("CSEC");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<[number, number]>([15, 60]);
  const [days, setDays] = useState<string[]>([]);
  const [openTimeGroup, setOpenTimeGroup] = useState<string | null>(null);
  const [timeBands, setTimeBands] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [wordIdx, setWordIdx] = useState(0);

  // cycle words on loading step
  useEffect(() => {
    if (step !== 4) return;
    const i = setInterval(() => setWordIdx((n) => (n + 1) % INSPIRE_WORDS.length), 700);
    return () => clearInterval(i);
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => {
        setAuthed(true);
        try { localStorage.setItem("itutor.name", name); } catch {}
        navigate({
          to: "/classes",
          search: {
            tab: "tutors", q: "", page: 1,
            subject: subjects[0] ?? "",
            priceMin: budget[0], priceMax: budget[1],
            days: days.join(","), times: timeBands.join(","),
          } as any,
        });
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [step, navigate, subjects, budget, days, timeBands, name]);

  if (step === 4) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 max-w-3xl">
          <motion.div animate={{ rotate: [0, 8, -6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <Logo size={64} />
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-bold text-ink leading-tight">
            Finding tutors who will<br />
            <AnimatePresence mode="wait">
              <motion.span key={wordIdx} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35 }} className="inline-block underline decoration-ink/40 underline-offset-4">
                {INSPIRE_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
            {" "}you.
          </h1>
        </motion.div>
      </div>
    );
  }

  const filteredSubjects = SUBJECTS[level].filter((s) => !search || s.toLowerCase().includes(search.toLowerCase()));
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const stepCount = 4;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 py-4 border-b border-border flex items-center justify-between max-w-3xl mx-auto w-full">
        {step > 0 ? (
          <button onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Back
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ChevronLeft className="size-4" /> Home
          </Link>
        )}
        <Logo size={24} />
        <div className="text-xs font-semibold text-muted-foreground">Step {step + 1} of {stepCount}</div>
      </header>

      <div className="h-1 bg-muted">
        <div className="h-full bg-brand transition-all" style={{ width: `${((step + 1) / stepCount) * 100}%` }} />
      </div>

      <main className="flex-1 flex items-start justify-center px-5 py-10">
        <AnimatePresence mode="wait">
          {/* STEP 0 — multi-subject */}
          {step === 0 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What would you like to learn?</h2>
              <p className="text-center text-muted-foreground mt-2">Pick your exam level, then choose one or more subjects.</p>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-full bg-muted p-1">
                  {LEVELS.map((l) => {
                    const Icon = l.icon;
                    const active = level === l.key;
                    return (
                      <button key={l.key} onClick={() => { setLevel(l.key); setSearch(""); }}
                        className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition", active ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
                        <Icon className="size-4" />{l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${level} subjects…`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-background text-sm outline-none focus:border-brand" />
              </div>

              {subjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <button key={s} onClick={() => toggle(subjects, s, setSubjects)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-deep text-xs font-bold px-3 py-1.5">
                      {s} <span className="opacity-60">✕</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-border max-h-[360px] overflow-y-auto divide-y divide-border">
                {filteredSubjects.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">No subjects match "{search}".</div>
                ) : (
                  filteredSubjects.map((s) => {
                    const selected = subjects.includes(s);
                    return (
                      <button key={s} onClick={() => toggle(subjects, s, setSubjects)}
                        className={cn("w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-muted/60 transition flex items-center justify-between", selected && "bg-brand-soft text-ink")}>
                        <span>{s}</span>
                        {selected && <Check className="size-4 text-brand-deep" />}
                      </button>
                    );
                  })
                )}
              </div>

              <button onClick={() => setStep(1)} disabled={subjects.length === 0}
                className={cn("mt-8 w-full py-4 rounded-full font-bold text-base transition", subjects.length > 0 ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground")}>
                Continue {subjects.length > 0 && `(${subjects.length} selected)`}
              </button>
            </motion.div>
          )}

          {/* STEP 1 — budget */}
          {step === 1 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What's your budget?</h2>
              <p className="text-center text-muted-foreground mt-2">Hourly rate range in USD</p>
              <div className="mt-10"><BudgetSlider value={budget} onChange={setBudget} /></div>
              <button onClick={() => setStep(2)} className="mt-10 w-full py-4 rounded-full bg-brand text-white font-bold text-base hover:bg-brand-deep">Continue</button>
            </motion.div>
          )}

          {/* STEP 2 — availability with drilldown */}
          {step === 2 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">When can you take lessons?</h2>
              <p className="text-center text-muted-foreground mt-2">Tap a time of day to see specific slots.</p>

              <div className="mt-8">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Days</div>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const active = days.includes(d);
                    return (
                      <button key={d} onClick={() => toggle(days, d, setDays)}
                        className={cn("px-5 py-2.5 rounded-2xl border-2 text-sm font-semibold transition", active ? "border-ink bg-ink text-white" : "border-border text-ink hover:border-ink/40")}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Times</div>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_GROUPS.map((g) => {
                    const Icon = g.icon;
                    const groupActive = g.bands.some((b) => timeBands.includes(b.key));
                    const expanded = openTimeGroup === g.key;
                    return (
                      <div key={g.key} className="space-y-2">
                        <button onClick={() => setOpenTimeGroup(expanded ? null : g.key)}
                          className={cn("w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition",
                            groupActive ? "border-ink bg-ink text-white" : expanded ? "border-ink bg-background text-ink" : "border-border text-ink hover:border-ink/40")}>
                          <Icon className="size-4" />{g.label}
                        </button>
                        <AnimatePresence>
                          {expanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-1.5">
                              {g.bands.map((b) => {
                                const on = timeBands.includes(b.key);
                                return (
                                  <button key={b.key} onClick={() => toggle(timeBands, b.key, setTimeBands)}
                                    className={cn("w-full px-3 py-2 rounded-xl border text-xs font-semibold transition",
                                      on ? "border-brand bg-brand-soft text-brand-deep" : "border-border text-ink hover:border-ink/40")}>
                                    {b.label}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button onClick={() => setStep(3)} className="mt-10 w-full py-4 rounded-full bg-brand text-white font-bold text-base hover:bg-brand-deep">
                Continue
              </button>
              <button onClick={() => setStep(3)} className="mt-2 w-full py-2 text-sm font-semibold text-muted-foreground hover:text-ink">
                Skip — any time works
              </button>
            </motion.div>
          )}

          {/* STEP 3 — name (auto-signup) */}
          {step === 3 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="w-full max-w-md">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">What should we call you?</h2>
              <p className="text-center text-muted-foreground mt-2">We'll set up your account so you can book lessons right away.</p>

              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(4)}
                placeholder="Your first name"
                className="mt-8 w-full px-5 py-4 rounded-2xl border-2 border-border bg-background text-lg font-semibold text-ink outline-none focus:border-brand"
              />

              <button onClick={() => name.trim() && setStep(4)} disabled={!name.trim()}
                className={cn("mt-6 w-full py-4 rounded-full font-bold text-base transition", name.trim() ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground")}>
                Find my tutors
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
