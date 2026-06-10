import { BadgeCheck, Check } from "lucide-react";
import { StarRating } from "./StarRating";

export type EnrollmentClass = {
  name: string;
  priceTTD: number;
  nextBilling: string;
  enrolled: boolean;
  highlights: string[];
  tutor: {
    name: string;
    avatar?: string;
    verified?: boolean;
    rating: number;
    students: number;
  };
};

export function ClassEnrollmentCard({ c, onJoin }: { c: EnrollmentClass; onJoin?: () => void }) {
  return (
    <aside className="sticky top-24 rounded-2xl border border-border bg-background p-6 space-y-5 shadow-card">
      <div>
        <div className="text-3xl font-bold text-ink">TTD ${c.priceTTD}</div>
        <div className="text-xs text-muted-foreground">per month · next billing {c.nextBilling}</div>
      </div>

      {c.enrolled ? (
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand-deep">
          <Check className="size-4" /> You're enrolled
        </span>
      ) : (
        <button onClick={onJoin} className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-deep transition">
          Join Class
        </button>
      )}

      <ul className="space-y-2">
        {c.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-ink">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-deep" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-muted text-xs font-bold text-ink overflow-hidden">
            {c.tutor.avatar ? (
              <img src={c.tutor.avatar} alt={c.tutor.name} className="size-full object-cover" />
            ) : (
              c.tutor.name.split(" ").map((s) => s[0]).slice(0, 2).join("")
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-semibold text-ink">
              {c.tutor.name}
              {c.tutor.verified && <BadgeCheck className="size-4 text-brand-deep" />}
            </div>
            <div className="text-xs text-muted-foreground">{c.tutor.students} students</div>
          </div>
        </div>
        <div className="mt-3">
          <StarRating value={c.tutor.rating} />
        </div>
      </div>
    </aside>
  );
}
