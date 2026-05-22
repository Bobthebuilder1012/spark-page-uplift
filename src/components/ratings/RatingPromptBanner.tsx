import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PENDING_RATINGS, type PendingRating } from "@/lib/ratings-store";
import { RateClassModal } from "./RateClassModal";

/**
 * Soft prompt banner shown above the student dashboard. Only one banner at a
 * time; escalates after 3 dismissals.
 */
export function RatingPromptBanner() {
  const [queue, setQueue] = useState<PendingRating[]>(PENDING_RATINGS);
  const [open, setOpen] = useState(false);
  const current = queue[0];

  if (!current) return null;
  const escalated = current.dismissals >= 3;

  const dismiss = () => {
    setQueue((q) => {
      const [head, ...rest] = q;
      return [...rest, { ...head, dismissals: head.dismissals + 1 }];
    });
    toast("Reminder snoozed");
  };

  const submit = () => {
    setQueue((q) => q.slice(1));
    setOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border-l-4 bg-background shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3",
          escalated ? "border-coral bg-coral-soft/40" : "border-brand",
        )}
      >
        <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", escalated ? "bg-coral-soft text-coral" : "bg-brand-soft text-brand-deep")}>
          <Star className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-ink">
            Rate <span className="font-bold">{current.className}</span>{" "}
            <span className="text-muted-foreground">for {current.billingPeriod} — {current.tutorName}</span>
          </div>
          {escalated && (
            <div className="text-xs italic text-coral mt-0.5">This rating expires in {current.expiresInDays} days</div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={dismiss}
            className="px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            Remind Me Later
          </button>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep"
          >
            Rate Now
          </button>
        </div>
      </div>

      {open && (
        <RateClassModal
          className={current.className}
          billingPeriod={current.billingPeriod}
          tutorName={current.tutorName}
          tutorHue={current.tutorHue}
          onClose={() => setOpen(false)}
          onSubmit={submit}
        />
      )}
    </>
  );
}
