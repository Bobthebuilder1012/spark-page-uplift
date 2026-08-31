import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Monitor, MapPin } from "lucide-react";
import { sampleClasses, sampleTeachers } from "./marketplace-sample";

export function FeaturedTeachers() {
  const featured = Object.values(sampleTeachers).map((t) => ({
    teacher: t,
    klass: sampleClasses.find((c) => c.teacherId === t.id)!,
  }));

  return (
    <section className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              The teachers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every class on iTutor belongs to a teacher. Profiles below use placeholder
              content for the prototype.
            </p>
          </div>
          <Link
            to="/student/tutors"
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Explore Teachers
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map(({ teacher, klass }, i) => (
            <motion.article
              key={teacher.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-[0_28px_60px_-38px_color-mix(in_oklab,var(--brand-deep)_20%,transparent)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={teacher.photo}
                  alt={`${teacher.name} — ${teacher.specialisation}`}
                  loading="lazy"
                  width={896}
                  height={1152}
                  className="h-[340px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16">
                  <p className="text-xl font-semibold text-background">{teacher.name}</p>
                  <p className="mt-1 text-sm text-background/75">{teacher.specialisation}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {teacher.intro}
                </p>

                <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Available class
                  </p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug text-ink">
                    {klass.title}
                  </p>
                  <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {klass.day} · {klass.time}
                    </span>
                    <span className="flex items-center gap-2">
                      {klass.format === "Online" ? (
                        <Monitor className="h-3.5 w-3.5" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      {klass.format} · TTD ${klass.priceTTD} / {klass.per}
                    </span>
                  </div>
                </div>

                <Link
                  to="/classes/$id"
                  params={{ id: klass.id }}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-brand hover:text-primary-foreground"
                >
                  View Class
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
