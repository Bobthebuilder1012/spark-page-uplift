import { cn } from "@/lib/utils";
import { StarRow } from "./StarInput";
import { distPct, fmtCount, type RatingSummary } from "@/lib/ratings-store";

type Props = {
  summary: RatingSummary;
  activeFilter: number | null;
  onFilterChange: (stars: number | null) => void;
  className?: string;
};

export function RatingBreakdown({ summary, activeFilter, onFilterChange, className }: Props) {
  const empty = summary.total === 0;
  const lowCount = summary.total > 0 && summary.total < 5;

  return (
    <section className={cn("rounded-2xl border border-border bg-background p-5 sm:p-6", className)} aria-label="Rating breakdown">
      <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
        {/* Left column — overall */}
        <div className="text-center sm:text-left">
          <div className="text-5xl sm:text-6xl font-extrabold text-ink leading-none tabular-nums">
            {empty ? "—" : summary.average.toFixed(summary.average >= 10 ? 1 : 2).replace(/0$/, "")}
          </div>
          <div className="mt-2 flex justify-center sm:justify-start">
            <StarRow value={empty ? 0 : summary.average} size={20} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {empty ? "No ratings yet" : `${fmtCount(summary.total)} ${summary.total === 1 ? "rating" : "ratings"}`}
          </div>
        </div>

        {/* Right column — distribution */}
        <div className="space-y-1.5 min-w-0">
          {([5, 4, 3, 2, 1] as const).map((stars) => {
            const pct = distPct(summary, stars);
            const fillWidth = empty ? 0 : Math.max(pct, summary.dist[stars] > 0 ? 3 : 0);
            const isActive = activeFilter === stars;
            const clickable = !empty;
            return (
              <button
                key={stars}
                type="button"
                disabled={!clickable}
                onClick={() => onFilterChange(isActive ? null : stars)}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-1.5 py-1 rounded-md text-left transition",
                  clickable && "hover:bg-muted",
                  isActive && "bg-brand-soft/50",
                  !clickable && "cursor-default",
                )}
                aria-pressed={isActive}
              >
                <span
                  className={cn(
                    "w-4 text-xs tabular-nums text-right",
                    isActive ? "font-bold text-brand-deep" : "text-muted-foreground",
                  )}
                >
                  {stars}
                </span>
                <div
                  className={cn(
                    "flex-1 h-2.5 rounded-full bg-muted overflow-hidden",
                    isActive && "ring-2 ring-brand",
                  )}
                >
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${fillWidth}%` }} />
                </div>
                <span className="w-10 text-[11px] tabular-nums text-right text-muted-foreground">
                  {empty ? "0" : `${Math.round(pct)}%`}
                </span>
              </button>
            );
          })}
          {lowCount && (
            <p className="text-[11px] text-muted-foreground italic pt-1">Based on a small number of ratings.</p>
          )}
        </div>
      </div>
    </section>
  );
}
