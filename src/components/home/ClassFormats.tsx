import { motion } from "framer-motion";
import { Users, User, FileText, Zap, Monitor, MapPin } from "lucide-react";

const formats = [
  {
    icon: Users,
    title: "Weekly group classes",
    body: "A fixed day and time each week with the same teacher and classmates.",
  },
  {
    icon: User,
    title: "One-on-one lessons",
    body: "Private sessions where the teacher offers them.",
  },
  {
    icon: FileText,
    title: "Exam preparation",
    body: "Past paper practice and marking against the scheme.",
  },
  {
    icon: Zap,
    title: "Short intensive programmes",
    body: "A few concentrated weeks before an exam period.",
  },
  {
    icon: Monitor,
    title: "Online classes",
    body: "Join from anywhere in the region.",
  },
  {
    icon: MapPin,
    title: "Physical classes where available",
    body: "In-person sessions offered by some teachers in some areas.",
  },
];

export function ClassFormats() {
  return (
    <section className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Classes built around students
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Teachers choose how they teach, so formats vary by subject and by teacher.
            Availability is always shown on the class itself.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                <f.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
