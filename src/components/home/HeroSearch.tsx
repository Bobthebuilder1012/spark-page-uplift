import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import {
  eligibleSubjects,
  sampleClasses,
  type SampleClass,
} from "./marketplace-sample";
import { ClassCardSkeleton, ClassMarketCard } from "./MarketCard";

const suggestions = [
  "CSEC Mathematics",
  "CAPE Chemistry",
  "SEA Mathematics",
  "CSEC English A",
];

function match(q: string, c: SampleClass) {
  const hay = `${c.level} ${c.subject} ${c.title}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((tok) => hay.includes(tok));
}

export function HeroSearch() {
  const [query, setQuery] = useState("CSEC Mathematics");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const list = query.trim() ? sampleClasses.filter((c) => match(query, c)) : sampleClasses;
    return list.slice(0, 3);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 420);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const subjectCount = eligibleSubjects().length;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.55]"
        style={{
          background:
            "radial-gradient(60% 100% at 15% 0%, var(--brand-soft) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16 lg:py-24">
        <div className="lg:sticky lg:top-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">
            Built here, for here
          </p>
          <h1 className="mt-6 max-w-[15ch] text-[2.6rem] font-bold leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            There&apos;s a teacher for the way{" "}
            <span className="relative whitespace-nowrap">
              you learn.
              <svg
                viewBox="0 0 240 12"
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-brand"
              >
                <path
                  d="M2 8C60 3 150 11 238 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Discover Caribbean teachers and classes for SEA, CSEC and CAPE — all in one
            place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/classes"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              Find Your iTutor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/tutor/get-listed"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Teach on iTutor
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Live marketplace data · {subjectCount} subjects currently accepting
            registrations
          </p>
        </div>

        {/* Interactive product surface */}
        <div className="relative">
          <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_30px_70px_-40px_color-mix(in_oklab,var(--brand-deep)_20%,transparent)] sm:p-6">
            <label
              htmlFor="hero-search"
              className="block text-sm font-semibold text-ink"
            >
              What do you need help with?
            </label>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 transition-colors focus-within:border-brand">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CSEC Mathematics"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-xs font-medium text-muted-foreground hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => {
                const active = s.toLowerCase() === query.trim().toLowerCase();
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-brand bg-brand text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Matching classes</span>
                <span>{loading ? "Searching…" : `${results.length} shown`}</span>
              </div>

              <div className="mt-4 grid gap-4">
                {loading ? (
                  <>
                    <ClassCardSkeleton />
                    <ClassCardSkeleton />
                  </>
                ) : results.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="text-sm font-semibold text-ink">
                      No classes match that yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try another subject, or tell us what you&apos;re looking for and
                      we&apos;ll notify you when a class opens.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {results.map((c, i) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.28, delay: i * 0.05, ease: "easeOut" }}
                      >
                        <ClassMarketCard c={c} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Sample content for prototype — replace with live marketplace results.
          </p>
        </div>
      </div>
    </section>
  );
}
