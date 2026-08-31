import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const points = [
  {
    title: "Publish and promote classes",
    body: "Create a class, set the schedule and price, and put it in front of students searching for your subject.",
  },
  {
    title: "Reach students beyond your network",
    body: "Your class is discoverable by level and subject across the marketplace, not just by word of mouth.",
  },
  {
    title: "Manage schedules and registrations",
    body: "One place for your class list, session times and who has registered.",
  },
  {
    title: "Collect payments through the platform",
    body: "Students pay for the class on iTutor — no chasing transfers.",
  },
  {
    title: "Build a visible teaching presence",
    body: "A profile that shows what you teach, how you teach it and what you currently have open.",
  },
];

export function ForTeachers() {
  return (
    <section id="for-teachers" className="bg-ink py-20 text-background sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            For teachers
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Your classroom can reach further.
          </h2>

          <ul className="mt-10 space-y-6">
            {points.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-l-2 border-brand/40 pl-5"
              >
                <p className="text-base font-semibold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-background/65">{p.body}</p>
              </motion.li>
            ))}
          </ul>

          <Link
            to="/tutor/get-listed"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          >
            Start Teaching on iTutor
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Class creation interface preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl border border-background/12 bg-background/5 p-5 backdrop-blur sm:p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Create a class</p>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-[11px] font-semibold text-brand">
              Draft
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Class title" value="CSEC Mathematics — Algebra & Functions" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Level" value="CSEC" />
              <Field label="Subject" value="Mathematics" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Day" value="Tuesdays" />
              <Field label="Time" value="5:00 – 6:30 PM" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Format" value="Online" />
              <Field label="Price (TTD / month)" value="450" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-background/50">
                Registrations
              </p>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-background/12 px-4 py-3">
                <span className="text-sm text-background/80">Open for registration</span>
                <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-brand">
                  <span className="ml-auto mr-0.5 size-4 rounded-full bg-background" />
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-background py-3 text-sm font-semibold text-ink"
            >
              Publish class
            </button>
            <p className="text-center text-xs text-background/45">
              Dashboard preview with placeholder data.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-background/50">
        {label}
      </p>
      <div className="mt-2 rounded-xl border border-background/12 px-4 py-3 text-sm text-background/85">
        {value}
      </div>
    </div>
  );
}
