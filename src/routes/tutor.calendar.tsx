import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Video, MessageSquare, Edit3, Trash2, Globe, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_SESSIONS, PLACEHOLDER_LESSONS, LESSON_KIND_META, type TutorSession } from "@/lib/tutor-store";

export const Route = createFileRoute("/tutor/calendar")({
  head: () => ({ meta: [{ title: "Calendar — iTutor Tutor" }] }),
  component: CalendarPage,
});

type View = "day" | "week" | "month";
type EventLike = TutorSession & { isBlocked?: boolean; cancelled?: boolean };

// TODO(cursor): wire to real calendar / scheduling backend (drag-to-reschedule, resize).
const BLOCKED: EventLike[] = [
  { id: "b1", student: "Personal · Eid holiday", subject: "Blocked", date: new Date(Date.now() + 1000*60*60*24*2).toISOString(), durationMin: 480, type: "1-on-1", status: "upcoming", isBlocked: true } as EventLike,
];

const ALL_EVENTS: EventLike[] = [...PLACEHOLDER_SESSIONS, ...BLOCKED];

const DAY_HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am-8pm

function startOfWeek(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - x.getDay()); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }
function fmt(d: Date, opts: Intl.DateTimeFormatOptions) { return d.toLocaleString(undefined, opts); }

function CalendarPage() {
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selected, setSelected] = useState<EventLike | null>(null);
  const [quickSlot, setQuickSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [filters, setFilters] = useState({ oneOnOne: true, group: true, pending: true, blocked: true });
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const subjects = useMemo(() => Array.from(new Set(PLACEHOLDER_LESSONS.map((l) => l.subject))), []);

  const visible = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      if (e.isBlocked) return filters.blocked;
      if (e.status === "pending") return filters.pending;
      if (e.type === "1-on-1") return filters.oneOnOne && (subjectFilter === "all" || e.subject.includes(subjectFilter));
      if (e.type === "Group") return filters.group && (subjectFilter === "all" || e.subject.includes(subjectFilter));
      return true;
    });
  }, [filters, subjectFilter]);

  const navPrev = () => setCursor((c) => view === "month" ? new Date(c.getFullYear(), c.getMonth() - 1, 1) : addDays(c, view === "week" ? -7 : -1));
  const navNext = () => setCursor((c) => view === "month" ? new Date(c.getFullYear(), c.getMonth() + 1, 1) : addDays(c, view === "week" ? 7 : 1));

  const headerLabel = useMemo(() => {
    if (view === "day") return fmt(cursor, { weekday: "long", month: "long", day: "numeric" });
    if (view === "month") return fmt(cursor, { month: "long", year: "numeric" });
    const s = startOfWeek(cursor); const e = addDays(s, 6);
    return `${fmt(s, { month: "short", day: "numeric" })} – ${fmt(e, { month: "short", day: "numeric", year: "numeric" })}`;
  }, [view, cursor]);

  return (
    <div className="max-w-[1400px] -mx-4 lg:-mx-8 -my-6 lg:-my-8 h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-background px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3">
        <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Today</button>
        <div className="flex items-center">
          <button onClick={navPrev} className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><ChevronLeft className="size-4" /></button>
          <button onClick={navNext} className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><ChevronRight className="size-4" /></button>
        </div>
        <h1 className="text-lg lg:text-xl font-bold text-ink truncate">{headerLabel}</h1>
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground"><Globe className="size-3.5" /> AST · Trinidad</div>
        <div className="ml-auto flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {(["day","week","month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-3 py-1 rounded-md text-xs font-semibold capitalize", view === v ? "bg-brand text-white" : "text-muted-foreground hover:text-ink")}>{v}</button>
            ))}
          </div>
          <button onClick={() => setQuickSlot({ date: cursor, hour: 16 })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Plus className="size-4" /> New</button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[240px_1fr] min-h-0">
        {/* Sidebar */}
        <aside className="hidden lg:block border-r border-border bg-card p-4 space-y-5 overflow-y-auto">
          <MiniMonth cursor={cursor} onPick={setCursor} />
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Filters</div>
            <div className="space-y-1.5">
              {([["oneOnOne","1:1 lessons","bg-brand"],["group","Group classes","bg-sky-500"],["pending","Pending requests","bg-amber-500"],["blocked","Blocked time","bg-muted-foreground"]] as const).map(([k,l,c]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={filters[k as keyof typeof filters]} onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.checked }))} className="rounded" />
                  <span className={cn("size-2.5 rounded-sm", c)} />
                  <span className="text-ink">{l}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Subject</div>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm">
              <option value="all">All subjects</option>
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Lessons</div>
            <div className="space-y-1">
              {PLACEHOLDER_LESSONS.slice(0, 4).map((l) => (
                <label key={l.id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className={cn("size-2 rounded-full", LESSON_KIND_META[l.kind].dot)} />
                  <span className="text-muted-foreground truncate">{l.title}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div className="overflow-auto bg-mint">
          {view === "week" && <WeekGrid cursor={cursor} events={visible} onSelect={setSelected} onSlotClick={setQuickSlot} />}
          {view === "day" && <DayGrid cursor={cursor} events={visible} onSelect={setSelected} onSlotClick={setQuickSlot} />}
          {view === "month" && <MonthGrid cursor={cursor} events={visible} onSelect={setSelected} />}
        </div>
      </div>

      {selected && <EventPanel event={selected} onClose={() => setSelected(null)} />}
      {quickSlot && <QuickCreate slot={quickSlot} onClose={() => setQuickSlot(null)} />}
    </div>
  );
}

// ---------- Mini month ----------
function MiniMonth({ cursor, onPick }: { cursor: Date; onPick: (d: Date) => void }) {
  const [m, setM] = useState(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
  const first = new Date(m.getFullYear(), m.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const today = new Date();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))} className="size-6 grid place-items-center rounded hover:bg-muted text-muted-foreground"><ChevronLeft className="size-3.5" /></button>
        <div className="text-xs font-semibold text-ink">{fmt(m, { month: "long", year: "numeric" })}</div>
        <button onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))} className="size-6 grid place-items-center rounded hover:bg-muted text-muted-foreground"><ChevronRight className="size-3.5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-muted-foreground mb-1">{["S","M","T","W","T","F","S"].map((d,i) => <div key={i}>{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => {
          const isMonth = d.getMonth() === m.getMonth();
          const isToday = sameDay(d, today);
          const isSel = sameDay(d, cursor);
          return (
            <button key={i} onClick={() => onPick(d)}
              className={cn("aspect-square text-[11px] rounded grid place-items-center font-medium",
                !isMonth && "text-muted-foreground/40",
                isMonth && !isSel && "text-ink hover:bg-muted",
                isToday && !isSel && "text-brand-deep",
                isSel && "bg-brand text-white")}>{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Week grid ----------
function WeekGrid({ cursor, events, onSelect, onSlotClick }: { cursor: Date; events: EventLike[]; onSelect: (e: EventLike) => void; onSlotClick: (s: { date: Date; hour: number }) => void }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = new Date();
  return (
    <div className="min-w-[760px]">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] sticky top-0 bg-background border-b border-border z-10">
        <div />
        {days.map((d) => (
          <div key={d.toISOString()} className="p-2 text-center border-l border-border">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">{fmt(d, { weekday: "short" })}</div>
            <div className={cn("text-lg font-bold tabular-nums", sameDay(d, today) ? "text-brand-deep" : "text-ink")}>{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        <div>
          {DAY_HOURS.map((h) => (
            <div key={h} className="h-16 text-[10px] text-muted-foreground text-right pr-2 pt-1 border-t border-border">{h % 12 || 12}{h < 12 ? "a" : "p"}</div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d.toISOString()} className="border-l border-border relative">
            {DAY_HOURS.map((h) => (
              <button key={h} onClick={() => onSlotClick({ date: d, hour: h })} className="block w-full h-16 border-t border-border hover:bg-brand/5 transition" />
            ))}
            {events.filter((e) => sameDay(new Date(e.date), d)).map((e) => <EventBlock key={e.id} event={e} onClick={() => onSelect(e)} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayGrid({ cursor, events, onSelect, onSlotClick }: { cursor: Date; events: EventLike[]; onSelect: (e: EventLike) => void; onSlotClick: (s: { date: Date; hour: number }) => void }) {
  return (
    <div className="grid grid-cols-[60px_1fr]">
      <div>
        {DAY_HOURS.map((h) => (
          <div key={h} className="h-20 text-xs text-muted-foreground text-right pr-2 pt-1 border-t border-border">{h % 12 || 12}{h < 12 ? "am" : "pm"}</div>
        ))}
      </div>
      <div className="border-l border-border relative">
        {DAY_HOURS.map((h) => (
          <button key={h} onClick={() => onSlotClick({ date: cursor, hour: h })} className="block w-full h-20 border-t border-border hover:bg-brand/5" />
        ))}
        {events.filter((e) => sameDay(new Date(e.date), cursor)).map((e) => <EventBlock key={e.id} event={e} onClick={() => onSelect(e)} tall />)}
      </div>
    </div>
  );
}

function EventBlock({ event, onClick, tall }: { event: EventLike; onClick: () => void; tall?: boolean }) {
  const d = new Date(event.date);
  const hour = d.getHours() + d.getMinutes()/60;
  const top = (hour - 7) * (tall ? 80 : 64);
  const height = (event.durationMin / 60) * (tall ? 80 : 64) - 2;
  if (top < 0 || top > 14 * (tall ? 80 : 64)) return null;

  const isPending = event.status === "pending";
  const isBlocked = event.isBlocked;
  const is1on1 = event.type === "1-on-1";

  const base = isBlocked
    ? "bg-[repeating-linear-gradient(45deg,oklch(0.92_0.005_240),oklch(0.92_0.005_240)_4px,oklch(0.86_0.005_240)_4px,oklch(0.86_0.005_240)_8px)] text-muted-foreground"
    : is1on1 ? "bg-brand text-white" : "bg-sky-500 text-white";

  return (
    <button onClick={onClick} title={`${event.subject} · ${event.student}`}
      style={{ top, height, left: 4, right: 4 }}
      className={cn("absolute rounded-md px-2 py-1 text-[11px] font-semibold text-left overflow-hidden shadow-sm hover:z-20 hover:shadow-pop transition", base, isPending && "border-2 border-dashed opacity-80 bg-amber-100 !text-amber-900")}>
      <div className="truncate">{event.subject}</div>
      <div className="truncate opacity-90 text-[10px] font-normal">{event.student} · {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
    </button>
  );
}

function MonthGrid({ cursor, events, onSelect }: { cursor: Date; events: EventLike[]; onSelect: (e: EventLike) => void }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const today = new Date();
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border bg-background">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="p-2 text-[10px] uppercase font-bold text-muted-foreground text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const dayEvents = events.filter((e) => sameDay(new Date(e.date), d));
          return (
            <div key={i} className={cn("min-h-[110px] border-r border-b border-border p-1.5 bg-background", d.getMonth() !== cursor.getMonth() && "bg-mint")}>
              <div className={cn("text-xs font-semibold mb-1 size-6 grid place-items-center rounded-full",
                sameDay(d, today) ? "bg-brand text-white" : "text-ink")}>{d.getDate()}</div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <button key={e.id} onClick={() => onSelect(e)} className={cn("block w-full text-left text-[10px] font-semibold rounded px-1.5 py-0.5 truncate",
                    e.isBlocked ? "bg-muted text-muted-foreground" : e.status === "pending" ? "bg-amber-100 text-amber-900 border border-dashed border-amber-400" : e.type === "1-on-1" ? "bg-brand text-white" : "bg-sky-500 text-white")}>
                    {new Date(e.date).toLocaleTimeString([], { hour: "numeric" })} {e.subject}
                  </button>
                ))}
                {dayEvents.length > 3 && <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventPanel({ event, onClose }: { event: EventLike; onClose: () => void }) {
  const d = new Date(event.date);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-ink/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-background border-l border-border flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-ink">Session details</h2>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">{event.type}{event.status === "pending" && " · Pending"}</div>
            <div className="text-xl font-bold text-ink mt-1">{event.subject}</div>
            <div className="text-sm text-muted-foreground mt-1">{event.student}</div>
          </div>
          <div className="rounded-xl bg-mint p-4 text-sm">
            <div className="font-semibold text-ink">{fmt(d, { weekday: "long", month: "long", day: "numeric" })}</div>
            <div className="text-muted-foreground">{d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {event.durationMin} min · AST</div>
          </div>
          {event.paymentStatus && <div className="text-sm"><span className="text-muted-foreground">Payment:</span> <span className="font-semibold capitalize text-ink">{event.paymentStatus}</span></div>}
          <div className="flex flex-col gap-2">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Video className="size-4" /> Join session</button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><MessageSquare className="size-4" /> Message student</button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><Edit3 className="size-4" /> Edit / reschedule</button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-coral-soft text-coral text-sm font-semibold hover:bg-coral-soft"><Trash2 className="size-4" /> Cancel session</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCreate({ slot, onClose }: { slot: { date: Date; hour: number }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-pop w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-3"><CalendarDays className="size-4 text-brand-deep" /><div className="font-bold text-ink">Quick create</div></div>
        <div className="text-xs text-muted-foreground mb-4">{fmt(slot.date, { weekday: "long", month: "short", day: "numeric" })} · {slot.hour}:00</div>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:border-brand hover:bg-brand-soft text-sm font-semibold text-ink">+ New 1:1 lesson</button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:border-brand hover:bg-brand-soft text-sm font-semibold text-ink">+ New group class</button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:border-brand hover:bg-brand-soft text-sm font-semibold text-ink">⏸ Block time</button>
        </div>
        <button onClick={onClose} className="mt-4 w-full px-3 py-2 text-sm text-muted-foreground hover:text-ink">Cancel</button>
      </div>
    </div>
  );
}
