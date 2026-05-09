import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, Heart, MapPin, Award, Clock, MessageSquare, Video, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/tutors/$id")({
  head: () => ({
    meta: [{ title: "Tutor profile — iTutor Student" }],
  }),
  component: TutorDetail,
});

const TUTOR_PROFILES: Record<string, { name: string; subject: string; level: string; price: number; bio: string; tags: string[] }> = {
  ramdeen: { name: "Mr. Ramdeen", subject: "Mathematics", level: "CSEC & CAPE", price: 120, bio: "Caribbean-trained mathematics tutor with a decade of experience preparing students for SEA, CSEC and CAPE exams. Friendly, patient, and focused on building confidence through real understanding.", tags: ["Functions", "Calculus", "Trigonometry", "Algebra", "Statistics"] },
  singh: { name: "Ms. Singh", subject: "Physics", level: "CSEC & CAPE", price: 110, bio: "Physics tutor and UWI graduate. I make complex concepts intuitive through real-world examples and lots of practice.", tags: ["Mechanics", "Waves", "Electricity", "Modern Physics"] },
  joseph: { name: "Mr. Joseph", subject: "English Literature", level: "CSEC", price: 100, bio: "Literature tutor with a love for Caribbean writers. Helping students find their voice in essays and analysis.", tags: ["Essays", "Poetry", "Drama", "Prose"] },
  ali: { name: "Ms. Ali", subject: "Biology", level: "CSEC & CAPE", price: 115, bio: "Biology educator focused on diagrams, mnemonics, and exam technique.", tags: ["Cells", "Genetics", "Ecology"] },
  thomas: { name: "Mr. Thomas", subject: "Chemistry", level: "CAPE", price: 130, bio: "PhD Chemistry tutor specialising in CAPE preparation.", tags: ["Organic", "Inorganic", "Physical"] },
  khan: { name: "Ms. Khan", subject: "SEA Prep", level: "Primary", price: 80, bio: "Patient SEA preparation tutor. Building strong fundamentals one step at a time.", tags: ["Maths", "English", "Comprehension"] },
};

function buildSlots(days = 30) {
  const out: { date: Date; times: string[] }[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    // Vary availability deterministically
    const pool = ["3:30 PM", "4:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
    let times: string[] = [];
    if (dow === 0) times = pool.slice(0, 2);
    else if (dow === 6) times = ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"];
    else times = pool.filter((_, idx) => (idx + i) % 2 === 0);
    if (i % 7 === 4) times = []; // occasional day off
    out.push({ date: d, times });
  }
  return out;
}


function TutorDetail() {
  const { id } = Route.useParams();
  const profile = TUTOR_PROFILES[id] ?? { name: "Tutor", subject: "Mathematics", level: "CSEC & CAPE", price: 120, bio: "", tags: [] };
  const slots = useMemo(() => buildSlots(30), []);
  const [pickedDay, setPickedDay] = useState(0);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  const initials = profile.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const scrollDays = (dir: 1 | -1) => {
    dayScrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/student/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to tutors
      </Link>

      {/* Header */}
      <div className="rounded-3xl bg-background border border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-brand to-brand-deep" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4">
              <div className="size-24 rounded-3xl bg-white border-4 border-background grid place-items-center text-2xl font-bold text-forest shadow-card">
                {initials}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-ink">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">{profile.subject} · {profile.level}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-coral text-coral" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-muted-foreground">(128)</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="inline-flex items-center gap-1 text-brand-deep font-medium">
                    <CheckCircle2 className="size-4" /> Verified
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSaved((s) => !s)}
                className="size-11 rounded-2xl border border-border grid place-items-center hover:bg-muted"
              >
                <Heart className={cn("size-4", saved && "fill-coral text-coral")} />
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-border font-semibold text-sm hover:bg-muted">
                <MessageSquare className="size-4" /> Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Award, label: "Experience", value: "10+ years" },
              { icon: Clock, label: "Response", value: "< 1 hr" },
              { icon: MapPin, label: "Location", value: "Trinidad" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-mint p-3">
                <m.icon className="size-4 text-brand-deep mb-1" />
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-sm font-semibold text-ink">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* About + reviews */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-background border border-border p-6">
            <h2 className="font-semibold text-ink mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Caribbean-trained mathematics tutor with a decade of experience preparing students for SEA, CSEC and CAPE exams. Friendly, patient, and focused on building confidence through real understanding.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Functions", "Calculus", "Trigonometry", "Algebra", "Statistics"].map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-brand-soft text-forest text-xs font-medium">{s}</span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-background border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink">Reviews · 128</h2>
              <span className="text-sm font-semibold inline-flex items-center gap-1">
                <Star className="size-4 fill-coral text-coral" /> 4.9
              </span>
            </div>
            <div className="space-y-4">
              {[
                { name: "Kareem H.", quote: "Mr. Ramdeen made calculus actually click for me. Went from D to A in three months.", rating: 5 },
                { name: "Anika P.", quote: "Patient and explains things in different ways until you really understand.", rating: 5 },
              ].map((r) => (
                <div key={r.name} className="border-t border-border pt-4 first:border-0 first:pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-7 rounded-full bg-lavender grid place-items-center text-xs font-semibold text-forest">{r.name[0]}</div>
                    <span className="text-sm font-semibold">{r.name}</span>
                    <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3 fill-coral text-coral" />)}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.quote}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booking */}
        <aside className="lg:sticky lg:top-20 self-start space-y-4">
          <div className="rounded-3xl bg-background border border-border p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-ink">TT${profile.price}</span>
                <span className="text-sm text-muted-foreground">/hr</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-brand-soft text-forest font-semibold">Available</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pick a day · next 30 days</div>
              <div className="flex gap-1">
                <button onClick={() => scrollDays(-1)} className="size-6 grid place-items-center rounded-full hover:bg-muted" aria-label="Previous days"><ChevronLeft className="size-3.5" /></button>
                <button onClick={() => scrollDays(1)} className="size-6 grid place-items-center rounded-full hover:bg-muted" aria-label="Next days"><ChevronRight className="size-3.5" /></button>
              </div>
            </div>

            <div ref={dayScrollRef} className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin -mx-1 px-1 snap-x">
              {slots.map((s, i) => {
                const disabled = s.times.length === 0;
                const isToday = i === 0;
                return (
                  <button
                    key={i}
                    onClick={() => { setPickedDay(i); setPickedTime(null); }}
                    disabled={disabled}
                    className={cn(
                      "shrink-0 w-14 py-2 rounded-xl text-center transition snap-start disabled:opacity-30 border",
                      pickedDay === i ? "bg-ink text-white border-ink" : "border-border hover:border-brand"
                    )}
                  >
                    <div className="text-[10px] font-semibold opacity-70 uppercase">
                      {isToday ? "Today" : s.date.toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div className="text-base font-bold mt-0.5">{s.date.getDate()}</div>
                    <div className="text-[9px] opacity-60 mt-0.5">{s.date.toLocaleDateString("en", { month: "short" })}</div>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Available times · {slots[pickedDay].date.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {slots[pickedDay].times.length === 0 && (
                <div className="col-span-2 text-sm text-muted-foreground py-3 text-center">No slots this day</div>
              )}
              {slots[pickedDay].times.map((t) => (
                <button
                  key={t}
                  onClick={() => setPickedTime(t)}
                  className={cn(
                    "py-2.5 rounded-xl text-sm font-medium border transition",
                    pickedTime === t
                      ? "bg-brand text-white border-brand"
                      : "border-border hover:border-brand"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              disabled={!pickedTime}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep transition disabled:opacity-50"
            >
              <Video className="size-4" /> {pickedTime ? `Book ${pickedTime}` : "Select a time"}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3">Free cancellation up to 24h before</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
