import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// 12-hour-formatted hour keys (24h internal: "06" → 6 AM, "13" → 1 PM, etc.)
export const HOUR_SLOTS: { key: string; label: string; group: "morning" | "afternoon" | "evening" | "night" }[] = [
  { key: "06", label: "6 AM",  group: "morning" },
  { key: "07", label: "7 AM",  group: "morning" },
  { key: "08", label: "8 AM",  group: "morning" },
  { key: "09", label: "9 AM",  group: "morning" },
  { key: "10", label: "10 AM", group: "morning" },
  { key: "11", label: "11 AM", group: "morning" },
  { key: "12", label: "12 PM", group: "afternoon" },
  { key: "13", label: "1 PM",  group: "afternoon" },
  { key: "14", label: "2 PM",  group: "afternoon" },
  { key: "15", label: "3 PM",  group: "afternoon" },
  { key: "16", label: "4 PM",  group: "afternoon" },
  { key: "17", label: "5 PM",  group: "evening" },
  { key: "18", label: "6 PM",  group: "evening" },
  { key: "19", label: "7 PM",  group: "evening" },
  { key: "20", label: "8 PM",  group: "evening" },
  { key: "21", label: "9 PM",  group: "night" },
  { key: "22", label: "10 PM", group: "night" },
];

export const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRESETS: { label: string; hours: string[] }[] = [
  { label: "Morning",   hours: ["06","07","08","09","10","11"] },
  { label: "Afternoon", hours: ["12","13","14","15","16"] },
  { label: "Evening",   hours: ["17","18","19","20"] },
  { label: "Night",     hours: ["21","22"] },
];

export function hourLabel(key: string) {
  return HOUR_SLOTS.find((h) => h.key === key)?.label ?? key;
}

export function AvailabilityFilter({
  days,
  times,
  onApply,
}: {
  days: string[];
  times: string[];
  onApply: (days: string[], times: string[]) => void;
}) {
  const [d, setD] = useState(days);
  const [t, setT] = useState(times);

  const toggleArr = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const setRange = (start: number, end: number) => {
    const next = new Set(t);
    for (let i = start; i <= end; i++) next.add(String(i).padStart(2, "0"));
    setT(Array.from(next));
  };

  const togglePreset = (hours: string[]) => {
    const all = hours.every((h) => t.includes(h));
    if (all) setT(t.filter((x) => !hours.includes(x)));
    else setT(Array.from(new Set([...t, ...hours])));
  };

  const groupHours = (g: "morning" | "afternoon" | "evening" | "night") =>
    HOUR_SLOTS.filter((h) => h.group === g);

  // From/To range selectors (custom range)
  const [fromIdx, setFromIdx] = useState<number>(0);
  const [toIdx, setToIdx] = useState<number>(HOUR_SLOTS.length - 1);

  const section = (label: string, group: "morning" | "afternoon" | "evening" | "night") => (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">{label}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {groupHours(group).map((h) => (
          <button
            key={h.key}
            type="button"
            onClick={() => toggleArr(t, h.key, setT)}
            className={cn(
              "px-2 py-2 rounded-lg border text-xs font-semibold transition",
              t.includes(h.key) ? "bg-ink text-white border-ink" : "border-border text-ink hover:border-ink/40",
            )}
          >
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Quick presets */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-ink mb-2">Quick pick</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const active = p.hours.every((h) => t.includes(h));
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => togglePreset(p.hours)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                  active ? "bg-brand text-white border-brand" : "border-border text-ink hover:border-ink/40",
                )}
              >
                {p.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setT([])}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-ink"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Custom range */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-ink mb-2">Custom range</div>
        <div className="flex items-center gap-2">
          <select
            value={fromIdx}
            onChange={(e) => setFromIdx(Number(e.target.value))}
            className="flex-1 rounded-lg border border-border bg-background px-2 py-2 text-sm text-ink outline-none focus:border-brand"
          >
            {HOUR_SLOTS.map((h, i) => <option key={h.key} value={i}>{h.label}</option>)}
          </select>
          <span className="text-xs text-muted-foreground">to</span>
          <select
            value={toIdx}
            onChange={(e) => setToIdx(Number(e.target.value))}
            className="flex-1 rounded-lg border border-border bg-background px-2 py-2 text-sm text-ink outline-none focus:border-brand"
          >
            {HOUR_SLOTS.map((h, i) => <option key={h.key} value={i}>{h.label}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setRange(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx))}
            className="rounded-lg bg-ink text-white px-3 py-2 text-xs font-bold hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>

      {/* Detailed hourly grid */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {section("Morning", "morning")}
        {section("Afternoon", "afternoon")}
        {section("Evening", "evening")}
        {section("Night", "night")}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-ink mb-1.5">Days</div>
        <div className="grid grid-cols-4 gap-1.5">
          {DAY_KEYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleArr(d, day, setD)}
              className={cn(
                "py-2 rounded-lg border text-xs font-semibold transition",
                d.includes(day) ? "bg-ink text-white border-ink" : "border-border text-ink hover:border-ink/40",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApply(d, t)}
        className="w-full rounded-full bg-brand text-white py-2.5 text-sm font-bold hover:bg-brand-deep"
      >
        Apply
      </button>
    </div>
  );
}

export function useSummarizedTimes(times: string[]) {
  return useMemo(() => times.map(hourLabel), [times]);
}
