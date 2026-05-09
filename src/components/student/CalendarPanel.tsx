import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { UPCOMING_EVENTS, type CalendarEvent } from "@/lib/student-store";
import { cn } from "@/lib/utils";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

const COLOR_MAP: Record<string, string> = {
  coral: "bg-coral/15 border-coral text-coral",
  sky: "bg-sky border-sky/60 text-ink",
  lavender: "bg-lavender border-lavender/70 text-ink",
  peach: "bg-peach border-peach/70 text-ink",
  brand: "bg-brand-soft border-brand text-forest",
};

export function CalendarGrid({ compact = false }: { compact?: boolean }) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const dates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const rowHeight = compact ? 36 : 56;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-[40px_repeat(7,minmax(0,1fr))] border-b border-border bg-background sticky top-0 z-10">
        <div className="text-[9px] text-muted-foreground p-2">GMT-4</div>
        {DAYS.map((d, i) => {
          const isToday = dates[i].toDateString() === today.toDateString();
          return (
            <div key={d} className="text-center py-2 border-l border-border">
              <div className={cn("text-[10px] font-semibold tracking-wider", isToday ? "text-brand-deep" : "text-muted-foreground")}>{d}</div>
              <div className={cn("text-base font-bold mt-0.5", isToday && "size-7 rounded-full bg-brand text-white grid place-items-center mx-auto")}>{dates[i].getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative grid grid-cols-[40px_repeat(7,minmax(0,1fr))]">
          {/* Hour labels + cells */}
          {HOURS.map((h) => (
            <>
              <div key={`h-${h}`} className="text-[10px] text-muted-foreground p-1 text-right pr-2 border-t border-border" style={{ height: rowHeight }}>
                {h % 12 || 12}{h < 12 ? "am" : "pm"}
              </div>
              {DAYS.map((_, di) => (
                <div key={`c-${h}-${di}`} className="border-t border-l border-border bg-mint/30" style={{ height: rowHeight }} />
              ))}
            </>
          ))}

          {/* Events absolutely positioned */}
          {UPCOMING_EVENTS.map((e) => {
            const top = (e.startHour - HOURS[0]) * rowHeight;
            const height = (e.endHour - e.startHour) * rowHeight - 2;
            if (top < 0) return null;
            return (
              <div
                key={e.id}
                className={cn("absolute rounded-lg border-l-4 p-1.5 text-[11px] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition", COLOR_MAP[e.color])}
                style={{
                  top,
                  height,
                  left: `calc(40px + ${(e.day / 7) * 100}% - ${(40 / 7)}px + 2px)`,
                  width: `calc(${100 / 7}% - 4px)`,
                }}
              >
                <div className="font-semibold leading-tight truncate">{e.title}</div>
                {height > 30 && <div className="opacity-70 truncate text-[10px]">{e.tutor}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CalendarPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [offset, setOffset] = useState(0);
  if (!open) return null;
  const monthLabel = new Date().toLocaleString("en", { month: "long", year: "numeric" });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl h-[80vh] rounded-3xl bg-background shadow-pop border border-border overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-ink mr-2">Calendar</h2>
          <button onClick={() => setOffset(o => o - 1)} className="size-8 grid place-items-center rounded-full hover:bg-muted"><ChevronLeft className="size-4" /></button>
          <button onClick={() => setOffset(o => o + 1)} className="size-8 grid place-items-center rounded-full hover:bg-muted"><ChevronRight className="size-4" /></button>
          <div className="font-semibold text-ink ml-1">{monthLabel}</div>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/student/calendar" onClick={onClose} className="size-8 grid place-items-center rounded-full hover:bg-muted" title="Open full calendar">
              <Maximize2 className="size-4" />
            </Link>
            <button onClick={onClose} className="size-8 grid place-items-center rounded-full hover:bg-muted">
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CalendarGrid />
        </div>
      </div>
    </div>
  );
}
