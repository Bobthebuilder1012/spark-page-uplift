import { Link } from "@tanstack/react-router";
import { Monitor, MapPin, CalendarDays } from "lucide-react";
import type { SampleClass } from "./marketplace-sample";
import { teacherOf } from "./marketplace-sample";

export function DataLabelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-deep">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}

/** Compact marketplace class card used in the hero and subject discovery. */
export function ClassMarketCard({ c }: { c: SampleClass }) {
  const t = teacherOf(c);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_18px_40px_-24px_oklch(0.2_0.02_240/0.35)]">
      <div className="h-1.5 w-full" style={{ background: c.accent }} />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <img
            src={t.photo}
            alt={t.name}
            loading="lazy"
            width={96}
            height={96}
            className="size-11 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
            <p className="truncate text-xs text-muted-foreground">{t.location}</p>
          </div>
        </div>

        <div>
          {c.label && (
            <div className="mb-2">
              <DataLabelChip label={c.label} />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-ink/70">{c.level}</span>
            <span>{c.subject}</span>
          </div>
          <h3 className="mt-2 text-[17px] font-semibold leading-snug text-ink">{c.title}</h3>
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-ink/40" />
            <dd>
              {c.day} · {c.time}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            {c.format === "Online" ? (
              <Monitor className="h-4 w-4 shrink-0 text-ink/40" />
            ) : (
              <MapPin className="h-4 w-4 shrink-0 text-ink/40" />
            )}
            <dd>{c.format}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm">
            <span className="font-semibold text-ink">TTD ${c.priceTTD}</span>
            <span className="text-muted-foreground"> / {c.per}</span>
          </p>
          <Link
            to="/classes/$id"
            params={{ id: c.id }}
            className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-primary-foreground"
          >
            View Class
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ClassCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-1.5 w-full bg-muted" />
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <div className="size-11 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
