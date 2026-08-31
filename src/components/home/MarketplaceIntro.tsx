import { motion } from "framer-motion";
import { Monitor, MapPin, Clock, GraduationCap } from "lucide-react";
import { sampleTeachers } from "./marketplace-sample";

const facets = [
  { icon: GraduationCap, label: "Level", value: "SEA · CSEC · CAPE" },
  { icon: Monitor, label: "Format", value: "Online" },
  { icon: MapPin, label: "Format", value: "In person" },
  { icon: Clock, label: "Schedule", value: "Weeknights & weekends" },
];

export function MarketplaceIntro() {
  const teachers = Object.values(sampleTeachers);

  return (
    <section className="border-b border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Meet the new Caribbean classroom.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            The right teacher may not teach at your school — or even live in your town.
            iTutor brings Caribbean teachers and students together in one marketplace.
          </p>

          <dl className="mt-10 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {facets.map((f) => (
              <div key={f.value} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-card text-ink ring-1 ring-border">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="text-sm font-semibold text-ink">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Composition: students discovering teachers across formats */}
        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-2">
            {teachers.map((t, i) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className={`overflow-hidden rounded-2xl border border-border bg-card ${
                  i === 2 ? "sm:col-span-2 sm:flex" : ""
                }`}
              >
                <img
                  src={t.photo}
                  alt={`${t.name}, ${t.specialisation}`}
                  loading="lazy"
                  width={896}
                  height={1152}
                  className={`w-full object-cover ${i === 2 ? "sm:h-40 sm:w-40" : "h-48"}`}
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.specialisation}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {t.location} · image and profile copy are placeholders
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
