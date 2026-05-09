import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "./data";
import { Avatar } from "./Avatar";

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <article className="mx-3 flex w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-card transition-transform hover:-translate-y-1 sm:w-[360px]">
      <div className="flex items-center gap-3">
        <Avatar name={t.name} hue={t.hue} size={42} />
        <div>
          <p className="text-sm font-semibold text-ink">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
        <div className="ml-auto flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-coral text-coral" />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-ink/80">{t.quote}</p>
    </article>
  );
}

function Row({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const dup = [...items, ...items];
  return (
    <div className="marquee-mask group overflow-hidden">
      <div
        className="flex w-max"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${reverse ? 60 : 55}s linear infinite`,
        }}
      >
        {dup.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, half);
  const row2 = testimonials.slice(half);

  return (
    <section id="testimonials" className="relative bg-mint py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
            Real reviews
          </span>
          <h2 className="mt-4 text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">
            What Real Students &<br />
            Parents Are <span className="text-gradient-brand">Saying</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            SEA · CSEC · CAPE — real voices, real results from across Trinidad &amp; Tobago.
          </p>
        </motion.div>
      </div>

      <div className="mt-12 space-y-5">
        <Row items={row1} />
        <Row items={row2} reverse />
      </div>
    </section>
  );
}
