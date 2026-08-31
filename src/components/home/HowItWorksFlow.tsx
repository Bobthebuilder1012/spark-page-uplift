import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Monitor, MapPin } from "lucide-react";
import { sampleClasses, teacherOf } from "./marketplace-sample";

const steps = [
  {
    n: "01",
    title: "Search by level and subject",
    body: "Start with SEA, CSEC or CAPE, then narrow to the subject you need.",
  },
  {
    n: "02",
    title: "Explore teachers and active classes",
    body: "See who teaches it, what they teach and when the class actually runs.",
  },
  {
    n: "03",
    title: "Compare schedule, format and price",
    body: "Weeknight or weekend, online or in person, monthly or per session.",
  },
  {
    n: "04",
    title: "Register and start learning",
    body: "Reserve a place in the class and get the schedule and materials.",
  },
];

function StepScreen({ step }: { step: number }) {
  const c = sampleClasses[0]!;
  const t = teacherOf(c);

  if (step === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {["SEA", "CSEC", "CAPE"].map((l, i) => (
            <span
              key={l}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                i === 1
                  ? "bg-brand text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {l}
            </span>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink">
          Mathematics
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Chemistry", "English A", "Biology", "Geography"].map((s) => (
            <span
              key={s}
              className="rounded-xl border border-border px-3 py-2.5 text-sm text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-3">
        {sampleClasses.slice(0, 3).map((k) => {
          const kt = teacherOf(k);
          return (
            <div
              key={k.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <img
                src={kt.photo}
                alt={kt.name}
                loading="lazy"
                width={96}
                height={96}
                className="size-10 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{k.title}</p>
                <p className="text-xs text-muted-foreground">
                  {kt.name} · {k.level}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-3 gap-2 bg-muted px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Schedule</span>
          <span>Format</span>
          <span>Price</span>
        </div>
        {sampleClasses.slice(0, 3).map((k) => (
          <div
            key={k.id}
            className="grid grid-cols-3 items-center gap-2 border-t border-border bg-background px-4 py-3 text-xs text-ink"
          >
            <span>{k.day}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {k.format === "Online" ? (
                <Monitor className="h-3.5 w-3.5" />
              ) : (
                <MapPin className="h-3.5 w-3.5" />
              )}
              {k.format}
            </span>
            <span className="font-semibold">TTD ${k.priceTTD}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-3">
        <img
          src={t.photo}
          alt={t.name}
          loading="lazy"
          width={96}
          height={96}
          className="size-11 rounded-xl object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-ink">{c.title}</p>
          <p className="text-xs text-muted-foreground">
            {t.name} · {c.day} · {c.time}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-2 text-sm text-ink">
        {["Place reserved", "Schedule added", "Class materials unlocked"].map((s) => (
          <p key={s} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand" />
            {s}
          </p>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground"
      >
        Register
      </button>
    </div>
  );
}

export function HowItWorksFlow() {
  const [step, setStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-brand-soft/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          How it works
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <ol className="space-y-3">
            {steps.map((s, i) => {
              const active = i === step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onMouseEnter={() => setStep(i)}
                    onFocus={() => setStep(i)}
                    onClick={() => setStep(i)}
                    aria-current={active}
                    className={`w-full rounded-2xl border p-5 text-left transition-all ${
                      active
                        ? "border-brand bg-card"
                        : "border-transparent bg-transparent hover:bg-card/60"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          active ? "text-brand" : "text-muted-foreground"
                        }`}
                      >
                        {s.n}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-ink">{s.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_28px_60px_-40px_oklch(0.2_0.02_240/0.4)] sm:p-6">
              <div className="mb-4 flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-brand/30" />
                <span className="size-2.5 rounded-full bg-brand/30" />
                <span className="size-2.5 rounded-full bg-brand/30" />
                <span className="ml-3 text-xs text-muted-foreground">
                  iTutor · step {step + 1} of 4
                </span>
              </div>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <StepScreen step={step} />
              </motion.div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Interface preview with placeholder data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
