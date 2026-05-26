import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Search, Star, Users, FileText, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKET_CLASSES, SUBJECTS, matchSubject, classState, LOW_STOCK_THRESHOLD, type MarketClass } from "@/lib/marketplace-data";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  subject: fallback(z.string(), "All").default("All"),
  state: fallback(z.enum(["browse", "loading", "empty"]), "browse").default("browse"),
});

export const Route = createFileRoute("/parent/classes/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Find classes — iTutor Parent" }] }),
  component: ParentMarketplace,
});

function ParentMarketplace() {
  const { q, subject, state } = Route.useSearch();
  const navigate = Route.useNavigate();

  const filtered = state === "empty" ? [] : MARKET_CLASSES.filter((c) => {
    if (!matchSubject(c, subject)) return false;
    if (q.trim()) {
      const t = q.toLowerCase();
      return c.title.toLowerCase().includes(t) || c.tutorName.toLowerCase().includes(t) || c.subject.toLowerCase().includes(t);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Marketplace</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">Find tutors & classes</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse on behalf of your children and enroll them directly. You consent and pay in one step.</p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-muted text-xs">
          {(["browse", "loading", "empty"] as const).map((s) => (
            <button key={s} onClick={() => navigate({ search: { q, subject, state: s } })}
              className={cn("px-2.5 py-1 rounded-lg font-semibold capitalize", state === s ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>{s}</button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => navigate({ search: { q: e.target.value, subject, state } })}
          placeholder="Search classes, tutors, subjects…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map((s) => (
          <button key={s} onClick={() => navigate({ search: { q, subject: s, state } })}
            className={cn("px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition",
              subject === s ? "bg-ink text-white border-ink" : "bg-background border-border text-muted-foreground hover:border-brand")}>{s}</button>
        ))}
      </div>

      {state === "loading" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-background overflow-hidden animate-pulse">
              <div className="h-28 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
          <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
            <GraduationCap className="size-5" />
          </div>
          <h2 className="font-bold text-ink">No classes match</h2>
          <p className="text-sm text-muted-foreground mt-1">Try a different subject or clear your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <ClassCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}

function ClassCard({ c }: { c: MarketClass }) {
  const st = classState(c);
  const remaining = c.seatsTotal - c.seatsTaken;
  const showScarcity = c.kind === "group" && remaining > 0 && remaining <= LOW_STOCK_THRESHOLD;
  const isFull = st === "full";

  return (
    <Link to="/parent/classes/$id" params={{ id: c.id }}
      className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-brand-deep/40 hover:shadow-card transition flex flex-col">
      <div className={cn("relative h-28 bg-gradient-to-br grid place-items-center text-4xl", c.bannerFrom, c.bannerTo)}>
        <span>{c.emoji}</span>
        {c.discountLabel && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-coral text-white">{c.discountLabel}</span>
        )}
        {isFull && (
          <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-ink/80 text-white">Class full</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-deep bg-brand-soft px-1.5 py-0.5 rounded">{c.subject}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{c.level}</span>
          <span className="text-[10px] font-bold text-ink bg-muted px-1.5 py-0.5 rounded">{c.formLevel}</span>
        </div>
        <h3 className="font-bold text-ink leading-tight">{c.title}</h3>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          <span>{c.tutorName}</span>
          <span className="inline-flex items-center gap-0.5 text-amber-600"><Star className="size-3 fill-current" /> {c.tutorRating}</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div>
            {c.originalPrice && <span className="text-xs text-muted-foreground line-through mr-1">TT${c.originalPrice}</span>}
            <span className="font-bold text-ink">TT${c.price}</span>
            <span className="text-[11px] text-muted-foreground">/{c.billing === "per-month" ? "mo" : c.billing === "per-session" ? "session" : "term"}</span>
          </div>
          {showScarcity && <span className="text-[11px] font-semibold text-coral inline-flex items-center gap-1"><Users className="size-3" /> Only {remaining} left</span>}
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px]">
          {c.includesParentFeedback && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand text-white"><Sparkles className="size-3" /> Free parent feedback</span>}
          <span className={cn("ml-auto font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
            st === "open" ? "bg-brand-soft text-brand-deep"
            : st === "approval-required" ? "bg-sky-100 text-sky-800"
            : st === "full" ? "bg-muted text-muted-foreground"
            : "bg-amber-100 text-amber-800")}>
            {st === "open" ? "Join" : st === "approval-required" ? "Request" : st === "full" ? "Waitlist" : "1:1"}
          </span>
        </div>
      </div>
    </Link>
  );
}
