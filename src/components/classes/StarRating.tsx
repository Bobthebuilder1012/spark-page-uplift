import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = 14,
  showNumber = true,
}: {
  value: number;
  count?: number;
  size?: number;
  showNumber?: boolean;
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={
                filled || half
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-ink tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count} ratings)</span>
      )}
    </div>
  );
}
