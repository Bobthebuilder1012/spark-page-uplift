import { useState } from "react";
import { X, ChevronLeft, ChevronRight, TrendingUp, Sunrise, Sun, Sunset } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
  tutorHue: number;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MORNING = ["08:00", "09:00", "10:00", "10:30", "11:00"];
const AFTERNOON = ["13:00", "14:30", "15:00"];
const EVENING = ["18:00", "19:00", "20:00"];

function Initials({ name, hue }: { name: string; hue: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="size-11 rounded-full grid place-items-center font-bold text-sm shrink-0"
      style={{ background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})` }}
    >
      {initials}
    </div>
  );
}

export function BookTrialModal({ open, onClose, tutorId, tutorName, tutorHue }: Props) {
  const [duration, setDuration] = useState<30 | 60>(50);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayIdx, setDayIdx] = useState(1);
  const [slot, setSlot] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!open) return null;

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const month = days[0].toLocaleString("en-US", { month: "short" });
  const endMonth = days[6].toLocaleString("en-US", { month: "short" });
  const rangeLabel = `${month} ${days[0].getDate()} – ${endMonth === month ? "" : endMonth + " "}${days[6].getDate()}, ${days[0].getFullYear()}`;

  const onContinue = () => {
    if (!slot) return;
    navigate({
      to: "/checkout/$tutorId",
      params: { tutorId },
      search: { duration, slot, date: days[dayIdx].toISOString() } as any,
    });
  };

  const slotButton = (s: string) => (
    <button
      key={s}
      onClick={() => setSlot(s)}
      className={cn(
        "rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
        slot === s
          ? "border-brand bg-brand text-white"
          : "border-border bg-background text-ink hover:border-brand/50",
      )}
    >
      {s}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-background w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-start gap-3 z-10">
          <Initials name={tutorName} hue={tutorHue} />
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-ink leading-tight">Book a trial lesson</div>
            <div className="text-xs text-muted-foreground">To discuss your level and learning plan</div>
          </div>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-muted grid place-items-center -mr-2 -mt-1">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Duration toggle */}
          <div className="grid grid-cols-2 rounded-2xl bg-muted p-1">
            {[30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d as 30 | 60)}
                className={cn(
                  "py-2.5 rounded-xl text-sm font-semibold transition",
                  duration === d ? "bg-background text-ink shadow-sm" : "text-muted-foreground",
                )}
              >
                {d} mins
              </button>
            ))}
          </div>

          {/* Week navigator */}
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setWeekOffset((o) => o - 1)}
                className="size-9 rounded-xl border border-border grid place-items-center hover:bg-muted"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="text-sm font-semibold text-ink">{rangeLabel}</div>
              <button
                onClick={() => setWeekOffset((o) => o + 1)}
                className="size-9 rounded-xl border border-border grid place-items-center hover:bg-muted"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-3">
              {days.map((d, i) => {
                const active = i === dayIdx;
                return (
                  <button
                    key={i}
                    onClick={() => { setDayIdx(i); setSlot(null); }}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition",
                      active ? "border-brand bg-brand-soft" : "border-transparent hover:bg-muted",
                    )}
                  >
                    <span className={cn("text-[10px] font-bold uppercase", active ? "text-brand-deep" : "text-muted-foreground")}>
                      {WEEK_DAYS[i]}
                    </span>
                    <span className={cn("text-lg font-bold", active ? "text-brand-deep" : "text-ink")}>{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            In your time zone, America/Port_of_Spain (GMT -4:00)
          </div>

          {/* Time sections */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sunrise className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-ink">Morning</span>
              </div>
              <div className="grid grid-cols-3 gap-2">{MORNING.map(slotButton)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-ink">Afternoon</span>
              </div>
              <div className="grid grid-cols-3 gap-2">{AFTERNOON.map(slotButton)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sunset className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-ink">Evening</span>
              </div>
              <div className="grid grid-cols-3 gap-2">{EVENING.map(slotButton)}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <TrendingUp className="size-4" /> Very popular. Booked 21 times recently
          </div>

          <button
            onClick={onContinue}
            disabled={!slot}
            className={cn(
              "w-full py-3.5 rounded-full font-bold text-base transition",
              slot ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
