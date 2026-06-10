import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Star, ShieldCheck, TrendingUp, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/tutors/$id/book")({
  head: () => ({ meta: [{ title: "Book a lesson — iTutor" }] }),
  component: BookingPage,
});

// Lightweight tutor lookup mirroring the rest of the app's demo data
const TUTORS: Record<string, { name: string; hue: number; rating: number; reviews: number; lessons: number; pricePerLesson: number; subjects: string[]; flag: string; country: string; recentBookings: number }> = {
  ramdeen: { name: "Mr. Ramdeen", hue: 145, rating: 4.9, reviews: 128, lessons: 14207, pricePerLesson: 35, subjects: ["Mathematics", "Physics"], flag: "🇹🇹", country: "Trinidad", recentBookings: 21 },
  singh: { name: "Ms. Singh", hue: 220, rating: 4.85, reviews: 94, lessons: 3120, pricePerLesson: 28, subjects: ["Physics"], flag: "🇹🇹", country: "Trinidad", recentBookings: 12 },
  joseph: { name: "Mr. Joseph", hue: 20, rating: 4.95, reviews: 211, lessons: 8400, pricePerLesson: 30, subjects: ["English"], flag: "🇹🇹", country: "Trinidad", recentBookings: 18 },
  ali: { name: "Ms. Ali", hue: 280, rating: 4.7, reviews: 67, lessons: 1800, pricePerLesson: 30, subjects: ["Biology"], flag: "🇹🇹", country: "Trinidad", recentBookings: 6 },
  thomas: { name: "Mr. Thomas", hue: 165, rating: 4.9, reviews: 142, lessons: 5600, pricePerLesson: 32, subjects: ["Chemistry"], flag: "🇹🇹", country: "Trinidad", recentBookings: 14 },
  khan: { name: "Ms. Khan", hue: 35, rating: 4.92, reviews: 178, lessons: 9100, pricePerLesson: 22, subjects: ["SEA Prep"], flag: "🇹🇹", country: "Trinidad", recentBookings: 24 },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Stable pseudo-random slot generator so the schedule doesn't shuffle per render
function slotsForDay(seed: number): string[] {
  const slots: string[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let h = 8; h <= 21; h++) {
    if (rand() > 0.45) slots.push(`${String(h).padStart(2, "0")}:00`);
    if (rand() > 0.65) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function Initials({ name, hue, size = 48 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-2xl grid place-items-center font-bold shrink-0"
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function BookingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const p = TUTORS[id] ?? TUTORS.ramdeen;

  const [duration, setDuration] = useState<30 | 60>(60);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<{ dayIdx: number; time: string } | null>(null);

  const monday = useMemo(() => {
    const t = new Date();
    const m = new Date(t);
    m.setDate(t.getDate() - ((t.getDay() + 6) % 7) + weekOffset * 7);
    m.setHours(0, 0, 0, 0);
    return m;
  }, [weekOffset]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  }), [monday]);

  const slotsByDay = useMemo(
    () => days.map((d) => slotsForDay(d.getDate() + d.getMonth() * 31 + (id.length * 7))),
    [days, id],
  );

  const month = days[0].toLocaleString("en-US", { month: "short" });
  const endMonth = days[6].toLocaleString("en-US", { month: "short" });
  const rangeLabel = `${month} ${days[0].getDate()} – ${endMonth === month ? "" : endMonth + " "}${days[6].getDate()}, ${days[0].getFullYear()}`;

  const onContinue = () => {
    if (!selected) return;
    const date = days[selected.dayIdx].toISOString();
    navigate({
      to: "/checkout/$tutorId",
      params: { tutorId: id },
      search: { duration, slot: selected.time, date } as any,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/student/tutors/$id" params={{ id }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to profile
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* LEFT — schedule */}
        <div className="space-y-6">
          <header>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">Schedule</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Pick a time for your first lesson with <span className="font-semibold text-ink">{p.name}</span>.
            </p>
          </header>

          <div className="rounded-2xl border border-sky/40 bg-sky/30 p-4 inline-flex items-start gap-3 text-sm text-ink">
            <Info className="size-4 mt-0.5 shrink-0" />
            <p>Choose the time for your first lesson. The timings are displayed in your local timezone.</p>
          </div>

          {/* Duration toggle */}
          <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 max-w-md">
            {[30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d as 30 | 60)}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold transition",
                  duration === d ? "bg-background text-ink shadow-sm" : "text-muted-foreground",
                )}
              >
                {d} mins
              </button>
            ))}
          </div>

          {/* Week navigator */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setWeekOffset((o) => o - 1)}
                className="size-9 rounded-xl border border-border grid place-items-center hover:bg-muted"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setWeekOffset((o) => o + 1)}
                className="size-9 rounded-xl border border-border grid place-items-center hover:bg-muted"
              >
                <ChevronRight className="size-4" />
              </button>
              <span className="ml-2 text-sm font-semibold text-ink">{rangeLabel}</span>
            </div>
            <div className="text-xs text-muted-foreground rounded-xl border border-border px-3 py-2">
              America/Port_of_Spain · GMT -4:00
            </div>
          </div>

          {/* Day headers + slots */}
          <div className="rounded-3xl border border-border overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-muted/40">
              {days.map((d, i) => {
                const hasSlots = slotsByDay[i].length > 0;
                return (
                  <div key={i} className={cn("py-3 text-center", hasSlots && "border-b-2 border-brand")}>
                    <div className="text-xs font-bold uppercase text-muted-foreground">{DAY_LABELS[i]}</div>
                    <div className="text-lg font-bold text-ink mt-0.5">{d.getDate()}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 divide-x divide-border min-h-[420px]">
              {slotsByDay.map((slots, dayIdx) => (
                <div key={dayIdx} className="p-2 space-y-1.5">
                  {slots.length === 0 ? (
                    <div className="text-center text-xs text-muted-foreground/60 py-6">—</div>
                  ) : (
                    slots.map((time) => {
                      const isSelected = selected?.dayIdx === dayIdx && selected?.time === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelected({ dayIdx, time })}
                          className={cn(
                            "w-full py-2 text-sm font-semibold rounded-lg transition",
                            isSelected
                              ? "bg-brand text-white"
                              : "text-ink underline-offset-2 hover:bg-brand-soft hover:no-underline underline decoration-1",
                          )}
                        >
                          {time}
                        </button>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — sticky summary */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="rounded-3xl border border-border bg-background p-5 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <Initials name={p.name} hue={p.hue} />
              <div className="min-w-0">
                <div className="font-bold text-ink truncate">{p.name} {p.flag}</div>
                <div className="text-xs text-muted-foreground">{p.subjects.join(" · ")}</div>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-ink">${p.pricePerLesson}</span>
              <span className="text-sm text-muted-foreground">{duration}-min lesson</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
              <div>
                <div className="inline-flex items-center gap-1">
                  <Star className="size-4 fill-ink text-ink" />
                  <span className="text-xl font-bold text-ink">{p.rating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.reviews} reviews</div>
              </div>
              <div>
                <div className="text-xl font-bold text-ink">{p.lessons.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-0.5">lessons</div>
              </div>
            </div>

            <div className="rounded-2xl bg-muted/60 p-3 text-sm">
              <div className="text-xs text-muted-foreground">Your selection</div>
              {selected ? (
                <div className="font-semibold text-ink mt-1">
                  {days[selected.dayIdx].toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · {selected.time}
                </div>
              ) : (
                <div className="text-muted-foreground mt-1">Pick a time slot →</div>
              )}
            </div>

            <button
              onClick={onContinue}
              disabled={!selected}
              className={cn(
                "w-full py-3.5 rounded-2xl font-bold text-base transition",
                selected ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              Continue to checkout
            </button>

            <div className="rounded-2xl bg-trust-bg p-4">
              <div className="inline-flex items-center gap-2 font-bold text-trust-text">
                <ShieldCheck className="size-4" />
                Not a match?
              </div>
              <div className="text-sm text-trust-text mt-1">You still have 2 free tutor trials.</div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="size-4 text-ink mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-ink">Very popular</div>
                <div className="text-muted-foreground text-xs">{p.recentBookings} bookings in the last 2 days.</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
