import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { eligibleSubjects } from "./marketplace-sample";
import { ClassCardSkeleton, ClassMarketCard } from "./MarketCard";

/**
 * Subject Discovery.
 * Subjects come from eligibleSubjects() — a stand-in for the marketplace query.
 * If the list is empty the whole component renders its no-results state; never
 * advertise a subject a visitor cannot register for today.
 */
export function SubjectDiscovery() {
  const subjects = eligibleSubjects();
  const [active, setActive] = useState(subjects[0]?.subject ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [active]);

  const current = subjects.find((s) => s.subject === active);
  const classes = (current?.classes ?? []).slice(0, 4);

  return (
    <section id="subjects" className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            What are you working on?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore classes for the subjects Caribbean students are learning right now.
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="text-base font-semibold text-ink">No subjects available yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Subjects appear here automatically as soon as a teacher publishes an active
              class open for registration.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {subjects.map((s) => {
                const isActive = s.subject === active;
                return (
                  <button
                    key={s.subject}
                    type="button"
                    onClick={() => setActive(s.subject)}
                    aria-pressed={isActive}
                    className={`shrink-0 snap-start rounded-2xl border px-5 py-4 text-left transition-all ${
                      isActive
                        ? "border-brand bg-brand text-primary-foreground"
                        : "border-border bg-card text-ink hover:-translate-y-0.5 hover:border-ink/30"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{s.subject}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {s.count} active {s.count === 1 ? "class" : "classes"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <ClassCardSkeleton key={i} />)
              ) : classes.length === 0 ? (
                <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border border-dashed border-border p-12 text-center">
                  <p className="text-sm font-semibold text-ink">
                    No open classes for {active} right now
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {classes.map((c, i) => (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                      className="h-full"
                    >
                      <ClassMarketCard c={c} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <Link
              to="/classes"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink"
            >
              Explore all {active} classes
              <ArrowRight className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1" />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
