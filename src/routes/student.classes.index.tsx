import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Star, Flame, Heart, FileText, Lock, Loader2 } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { cn } from "@/lib/utils";
import {
  MARKET_CLASSES, SUBJECTS, LOW_STOCK_THRESHOLD,
  matchSubject, classState, type MarketClass,
} from "@/lib/marketplace-data";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  subject: fallback(z.string(), "All").default("All"),
  state: fallback(z.enum(["browse", "loading", "empty"]), "browse").default("browse"),
});

export const Route = createFileRoute("/student/classes/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Browse classes — iTutor" }] }),
  component: Marketplace,
});

function Marketplace() {
  const { q, subject, state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = MARKET_CLASSES
    .filter((c) => matchSubject(c, subject))
    .filter((c) => {
      const ql = query.trim().toLowerCase();
      if (!ql) return true;
      return [c.title, c.subject, c.tutorName, c.shortBlurb].join(" ").toLowerCase().includes(ql);
    });

  const isLoading = state === "loading";
  const isEmpty = state === "empty" || (state === "browse" && filtered.length === 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Browse classes</h1>
        <p className="text-sm text-muted-foreground mt-1">Join a recurring group class or a weekly 1:1 with a verified Caribbean tutor.</p>
      </header>

      {/* Search + state preview switcher (demo only) */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 rounded-2xl bg-background border border-border p-2 flex items-center gap-2 shadow-sm">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search classes, subjects, tutors…"
              className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
            />
          </div>
          <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-xl">
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>
        <div className="inline-flex p-1 rounded-2xl bg-muted text-xs">
          {(["browse", "loading", "empty"] as const).map((s) => (
            <button
              key={s}
              onClick={() => navigate({ search: { q: query, subject, state: s } })}
              className={cn("px-3 py-1.5 rounded-xl font-semibold capitalize transition", state === s ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {SUBJECTS.map((c) => (
          <button
            key={c}
            onClick={() => navigate({ search: (p: { q: string; subject: string; state: "browse" | "loading" | "empty" }) => ({ ...p, subject: c }) })}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border",
              subject === c ? "bg-ink text-white border-ink" : "bg-background text-muted-foreground border-border hover:border-ink/30",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {filtered.length} class{filtered.length === 1 ? "" : "es"}
            {query && <> matching "<span className="text-ink font-medium">{query}</span>"</>}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ClassCard
                key={c.id}
                c={c}
                saved={saved.has(c.id)}
                onSave={() => setSaved((s) => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ClassCard({ c, saved, onSave }: { c: MarketClass; saved: boolean; onSave: () => void }) {
  const state = classState(c);
  const remaining = c.seatsTotal - c.seatsTaken;
  const isFull = state === "full";
  const isLowStock = !isFull && remaining > 0 && remaining <= LOW_STOCK_THRESHOLD;
  const pctFull = Math.round((c.seatsTaken / c.seatsTotal) * 100);

  return (
    <Link
      to="/student/classes/$id"
      params={{ id: c.id }}
      className="group relative rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5 flex flex-col"
    >
      {/* Full overlay */}
      {isFull && (
        <div className="absolute inset-0 z-10 bg-ink/55 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-background text-ink text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Lock className="size-3.5" /> Class full · waitlist
          </span>
        </div>
      )}

      <div className={`relative h-24 bg-gradient-to-br ${c.bannerFrom} ${c.bannerTo} flex items-end p-3`}>
        <button
          onClick={(e) => { e.preventDefault(); onSave(); }}
          className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white z-20"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <Heart className={cn("size-4", saved ? "fill-coral text-coral" : "text-ink")} />
        </button>
        <div className="size-12 rounded-2xl bg-white grid place-items-center text-2xl shadow-md">{c.emoji}</div>

        {c.discountLabel && (
          <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-coral text-white text-[10px] font-bold uppercase tracking-wider">
            {c.discountLabel}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-ink leading-tight">{c.title}</h3>
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="size-3.5 fill-coral text-coral" />
              <span className="font-semibold">{c.tutorRating}</span>
            </div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            by {c.tutorName} · <span className="text-ink/60">{c.subject} · {c.level}</span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          {c.includesParentFeedback && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand-soft text-brand-deep">
              <FileText className="size-3" /> Parent feedback
            </span>
          )}
          {c.approvalRequired && c.kind === "group" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-ink/70">
              Approval required
            </span>
          )}
          {c.kind === "recurring-1on1" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-lavender text-ink">
              Recurring 1:1
            </span>
          )}
        </div>

        {/* Scarcity */}
        {isLowStock && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full self-start bg-coral-soft text-coral">
            <Flame className="size-3.5" /> Only {remaining} spot{remaining === 1 ? "" : "s"} left
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div>{c.schedule}</div>
          {c.kind === "group" && (
            <>
              <div>{c.seatsTaken}/{c.seatsTotal} enrolled</div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", isLowStock ? "bg-coral" : "bg-brand")} style={{ width: `${pctFull}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="flex items-end justify-between pt-3 mt-auto border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">TT${c.price}</span>
            {c.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">TT${c.originalPrice}</span>
            )}
            <span className="text-xs text-muted-foreground">
              /{c.billing === "per-month" ? "mo" : c.billing === "per-session" ? "session" : "term"}
            </span>
          </div>
          <span className="text-xs font-semibold text-brand-deep group-hover:underline">
            {state === "full" ? "Waitlist →"
              : state === "approval-required" ? "Request →"
              : state === "recurring-1on1" ? "Confirm terms →"
              : "View →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-background border border-border overflow-hidden animate-pulse">
      <div className="h-24 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded-full w-24" />
          <div className="h-5 bg-muted rounded-full w-20" />
        </div>
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="h-5 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
      </div>
      <div className="sr-only">
        <Loader2 className="size-4 animate-spin" /> Loading classes
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
        <Search className="size-5" />
      </div>
      <h2 className="font-bold text-ink">No classes match your filters</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        Try a different subject or clear your search. New classes are added every week.
      </p>
    </div>
  );
}
