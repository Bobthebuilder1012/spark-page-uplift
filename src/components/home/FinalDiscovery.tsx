import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { sampleClasses, type Level } from "./marketplace-sample";
import { ClassMarketCard } from "./MarketCard";

const levels: Level[] = ["SEA", "CSEC", "CAPE"];

export function FinalDiscovery() {
  const [level, setLevel] = useState<Level | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  const subjects = useMemo(
    () =>
      level
        ? [...new Set(sampleClasses.filter((c) => c.level === level).map((c) => c.subject))]
        : [],
    [level],
  );

  const matches = useMemo(
    () =>
      level && subject
        ? sampleClasses.filter((c) => c.level === level && c.subject === subject)
        : [],
    [level, subject],
  );

  return (
    <section className="border-b border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            What are you trying to improve?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps: pick a level, pick a subject, see what&apos;s open.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12">
          <div className="space-y-8">
            <Stepper n="1" title="Choose level" done={!!level}>
              <div className="flex flex-wrap gap-2">
                {levels.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLevel(l);
                      setSubject(null);
                    }}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      level === l
                        ? "border-brand bg-brand text-primary-foreground"
                        : "border-border bg-card text-ink hover:border-ink/30"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Stepper>

            <Stepper n="2" title="Choose subject" done={!!subject}>
              {!level ? (
                <p className="text-sm text-muted-foreground">Pick a level first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        subject === s
                          ? "border-brand bg-brand text-primary-foreground"
                          : "border-border bg-card text-ink hover:border-ink/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </Stepper>

            <Link
              to="/classes"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-background transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              Find My Teacher
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step 3 — available classes
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {matches.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center sm:col-span-2">
                  <p className="text-sm font-semibold text-ink">
                    {level && subject
                      ? "No classes open for that combination right now"
                      : "Make a selection to see open classes"}
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Only classes that are published and accepting registrations appear
                    here.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {matches.map((c, i) => (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, delay: i * 0.05 }}
                    >
                      <ClassMarketCard c={c} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stepper({
  n,
  title,
  done,
  children,
}: {
  n: string;
  title: string;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${
            done ? "bg-brand text-primary-foreground" : "bg-card text-ink ring-1 ring-border"
          }`}
        >
          {done ? <Check className="h-3.5 w-3.5" /> : n}
        </span>
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <div className="mt-4 pl-10">{children}</div>
    </div>
  );
}
