import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Find your tutor — iTutor" }] }),
  component: OnboardingPage,
});

const SUBJECTS = ["Mathematics", "English", "Physics", "Chemistry", "Biology", "SEA Prep", "Spanish", "French"];

function BudgetSlider({ min, max, onChange }: { min: number; max: number; onChange: (v: [number, number]) => void }) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  const HIST = [3, 5, 6, 9, 11, 14, 17, 22, 28, 32, 38, 30, 24, 17, 12, 8, 5, 3];

  useEffect(() => { onChange([lo, hi]); }, [lo, hi, onChange]);

  const pct = (v: number) => ((v - 5) / (60 - 5)) * 100;

  return (
    <div>
      {/* Histogram */}
      <div className="relative h-20 flex items-end gap-1 px-1">
        {HIST.map((h, i) => {
          const v = 5 + (55 * i) / (HIST.length - 1);
          const inRange = v >= lo && v <= hi;
          return (
            <div
              key={i}
              className={cn("flex-1 rounded-t transition-colors", inRange ? "bg-brand" : "bg-muted")}
              style={{ height: `${h * 2}px` }}
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
          min={5}
          max={60}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 5))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={5}
          max={60}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 5))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute -top-2 size-6 rounded-full bg-background border-2 border-ink shadow"
          style={{ left: `calc(${pct(lo)}% - 12px)` }}
        />
        <div
          className="absolute -top-2 size-6 rounded-full bg-background border-2 border-ink shadow"
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
          <div className="rounded-xl border border-border px-3 py-2.5 font-semibold text-ink">$ {hi}{hi === 60 ? "+" : ""}</div>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [subject, setSubject] = useState<string | null>(null);
  const [budget, setBudget] = useState<[number, number]>([15, 40]);

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

      <main className="flex-1 flex items-center justify-center px-5 py-10">
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
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={cn(
                      "px-5 py-3 rounded-full border-2 font-semibold transition",
                      subject === s
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-background text-ink hover:border-brand/50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!subject}
                className={cn(
                  "mt-10 w-full py-4 rounded-full font-bold text-base transition",
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
                <BudgetSlider min={15} max={40} onChange={setBudget} />
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
