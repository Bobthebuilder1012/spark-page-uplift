import { motion } from "framer-motion";
import studentsImg from "@/assets/students-study.jpg";

const artefacts = [
  { label: "Past papers", note: "Placeholder — syllabus material by subject" },
  { label: "Class notes", note: "Placeholder — teacher-uploaded resources" },
  { label: "Term schedules", note: "Placeholder — set by each teacher" },
];

export function BuiltHere() {
  return (
    <section className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-border"
          >
            <img
              src={studentsImg}
              alt="Two students working through past exam papers together"
              loading="lazy"
              width={1408}
              height={1024}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-ink">
              Image placeholder — replace with commissioned photography
            </span>
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Built here, for here.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              SEA. CSEC. CAPE. Teachers who understand the syllabus, the schools and what
              exam season actually feels like.
            </p>

            <div className="mt-9 space-y-3">
              {artefacts.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-3"
                >
                  <span className="text-sm font-semibold text-ink">{a.label}</span>
                  <span className="text-xs text-muted-foreground">{a.note}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-9 rounded-2xl border border-dashed border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Verified testimonial goes here
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reserved for a real, attributable parent or student quote once collected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
