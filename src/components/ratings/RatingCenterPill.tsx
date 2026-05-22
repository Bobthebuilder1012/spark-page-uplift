import { useState } from "react";
import { Star } from "lucide-react";
import { PENDING_RATINGS, type PendingRating } from "@/lib/ratings-store";
import { RateClassModal } from "./RateClassModal";

/**
 * Rating Centre pill for the student top nav. Click → dropdown of pending
 * class ratings, each with a Rate button.
 */
export function RatingCenterPill() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<PendingRating | null>(null);
  const [pending, setPending] = useState<PendingRating[]>(PENDING_RATINGS);

  if (pending.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-brand-soft text-brand-deep text-xs font-bold hover:bg-brand-soft/70"
        title="Pending ratings"
      >
        <Star className="size-3.5 fill-brand-deep" />
        ({pending.length}) pending
      </button>
      {/* Mobile icon-only fallback */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="sm:hidden relative size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground"
        title="Pending ratings"
      >
        <Star className="size-4" />
        <span className="absolute -top-0.5 -right-0.5 size-4 grid place-items-center rounded-full bg-brand text-white text-[9px] font-bold">{pending.length}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-background border border-border shadow-pop p-2 z-40">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending ratings</div>
            <div className="space-y-1">
              {pending.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{p.className}</div>
                    <div className="text-[11px] text-muted-foreground">{p.billingPeriod} · Expires in {p.expiresInDays} days</div>
                  </div>
                  <button
                    onClick={() => { setActive(p); setOpen(false); }}
                    className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-deep"
                  >
                    Rate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {active && (
        <RateClassModal
          className={active.className}
          billingPeriod={active.billingPeriod}
          tutorName={active.tutorName}
          tutorHue={active.tutorHue}
          onClose={() => setActive(null)}
          onSubmit={() => {
            setPending((q) => q.filter((x) => x.id !== active.id));
            setActive(null);
          }}
        />
      )}
    </div>
  );
}
