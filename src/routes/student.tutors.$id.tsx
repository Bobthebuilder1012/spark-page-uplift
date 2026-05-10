import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, Heart, MapPin, Award, Clock, MessageSquare, Video, BadgeCheck, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, ShieldCheck, FileText, X, Check } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/tutors/$id")({
  head: () => ({ meta: [{ title: "Tutor profile — iTutor Student" }] }),
  component: TutorDetail,
});

type Qualification = { subject: string; credential: string; verified: boolean };

type Profile = {
  name: string;
  subjects: string[];
  level: string;
  price: number;
  hue: number;
  bio: string;
  tags: string[];
  qualifications: Qualification[];
  bannerFrom: string;
  bannerTo: string;
};

const TUTOR_PROFILES: Record<string, Profile> = {
  ramdeen: {
    name: "Mr. Ramdeen", subjects: ["Mathematics", "Physics"], level: "CSEC & CAPE", price: 120, hue: 145,
    bio: "Caribbean-trained tutor with a decade of experience preparing students for SEA, CSEC and CAPE exams. Friendly, patient, and focused on real understanding.",
    tags: ["Functions", "Calculus", "Trigonometry", "Mechanics", "Statistics"],
    qualifications: [
      { subject: "Mathematics", credential: "CAPE Pure Maths · Grade I", verified: true },
      { subject: "Mathematics", credential: "BSc Maths, UWI", verified: true },
      { subject: "Physics", credential: "CAPE Physics · Grade I", verified: true },
    ],
    bannerFrom: "from-brand", bannerTo: "to-brand-deep",
  },
  singh: { name: "Ms. Singh", subjects: ["Physics"], level: "CSEC & CAPE", price: 110, hue: 220, bio: "UWI Physics graduate. I make complex concepts intuitive through real-world examples.", tags: ["Mechanics", "Waves", "Electricity"], qualifications: [{ subject: "Physics", credential: "BSc Physics, UWI", verified: true }], bannerFrom: "from-sky", bannerTo: "to-lavender" },
  joseph: { name: "Mr. Joseph", subjects: ["English Literature", "English"], level: "CSEC", price: 100, hue: 20, bio: "Literature tutor with a love for Caribbean writers.", tags: ["Essays", "Poetry", "Drama"], qualifications: [{ subject: "English Literature", credential: "CSEC English Lit · Grade I", verified: true }, { subject: "English", credential: "BA English, UWI", verified: true }], bannerFrom: "from-coral", bannerTo: "to-peach" },
  ali: { name: "Ms. Ali", subjects: ["Biology"], level: "CSEC & CAPE", price: 115, hue: 280, bio: "Biology educator focused on diagrams, mnemonics, and exam technique.", tags: ["Cells", "Genetics", "Ecology"], qualifications: [{ subject: "Biology", credential: "Verification pending", verified: false }], bannerFrom: "from-lavender", bannerTo: "to-brand-soft" },
  thomas: { name: "Mr. Thomas", subjects: ["Chemistry"], level: "CAPE", price: 130, hue: 165, bio: "PhD Chemistry tutor specialising in CAPE preparation.", tags: ["Organic", "Inorganic", "Physical"], qualifications: [{ subject: "Chemistry", credential: "PhD Chemistry, UWI", verified: true }], bannerFrom: "from-brand-deep", bannerTo: "to-forest" },
  khan: { name: "Ms. Khan", subjects: ["SEA Prep", "Mathematics", "English"], level: "Primary", price: 80, hue: 35, bio: "Patient SEA preparation tutor. Building strong fundamentals one step at a time.", tags: ["Maths", "English", "Comprehension"], qualifications: [{ subject: "SEA Prep", credential: "B.Ed Primary Education", verified: true }, { subject: "Mathematics", credential: "CSEC Maths · Grade I", verified: true }], bannerFrom: "from-peach", bannerTo: "to-coral" },
};

function buildSlots(days = 30) {
  const out: { date: Date; times: string[] }[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    const pool = ["3:30 PM", "4:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
    let times: string[] = [];
    if (dow === 0) times = pool.slice(0, 2);
    else if (dow === 6) times = ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"];
    else times = pool.filter((_, idx) => (idx + i) % 2 === 0);
    if (i % 7 === 4) times = [];
    out.push({ date: d, times });
  }
  return out;
}

type Review = { id: string; name: string; hue: number; quote: string; rating: number; verifiedStudent: boolean; up: number; down: number };
const SEED_REVIEWS: Review[] = [
  { id: "r1", name: "Kareem H.", hue: 220, quote: "Made calculus actually click for me. Went from D to A in three months.", rating: 5, verifiedStudent: true, up: 24, down: 1 },
  { id: "r2", name: "Anika P.", hue: 20, quote: "Patient and explains things in different ways until you really understand.", rating: 5, verifiedStudent: true, up: 18, down: 0 },
  { id: "r3", name: "Devan R.", hue: 145, quote: "Good notes shared after every session.", rating: 4, verifiedStudent: true, up: 9, down: 2 },
];

function Avatar({ name, hue, size = 40, ring = false }: { name: string; hue: number; size?: number; ring?: boolean }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-full font-bold shrink-0", ring && "ring-4 ring-background")}
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function TutorDetail() {
  const { id } = Route.useParams();
  const profile = TUTOR_PROFILES[id] ?? TUTOR_PROFILES.ramdeen;
  const slots = useMemo(() => buildSlots(30), []);
  const [pickedSubject, setPickedSubject] = useState(profile.subjects[0]);
  const [pickedDay, setPickedDay] = useState(0);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [voted, setVoted] = useState<Record<string, "up" | "down" | undefined>>({});
  const dayScrollRef = useRef<HTMLDivElement>(null);

  const scrollDays = (dir: 1 | -1) => dayScrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const vote = (id: string, dir: "up" | "down") => {
    setReviews((rs) => rs.map((r) => {
      if (r.id !== id) return r;
      const prev = voted[id];
      let up = r.up, down = r.down;
      if (prev === "up") up--;
      if (prev === "down") down--;
      if (prev !== dir) { if (dir === "up") up++; else down++; }
      return { ...r, up, down };
    }));
    setVoted((v) => ({ ...v, [id]: v[id] === dir ? undefined : dir }));
  };

  const openBooking = () => { setBookingStep(1); setPickedTime(null); setShowBooking(true); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/student/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to tutors
      </Link>

      {/* LinkedIn-style header: banner with pfp overlapping bottom; name BELOW the banner */}
      <div className="rounded-3xl bg-background border border-border overflow-hidden">
        <div className={cn("h-32 sm:h-40 bg-gradient-to-br", profile.bannerFrom, profile.bannerTo)} />
        <div className="px-5 sm:px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 sm:-mt-14">
            <Avatar name={profile.name} hue={profile.hue} size={96} ring />
            <div className="flex gap-2 mb-1">
              <button onClick={() => setSaved((s) => !s)} className="size-10 rounded-full border border-border bg-background grid place-items-center hover:bg-muted">
                <Heart className={cn("size-4", saved && "fill-coral text-coral")} />
              </button>
              <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-muted">
                <MessageSquare className="size-4" /> Message
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-ink">{profile.name}</h1>
              {profile.qualifications.some((q) => q.verified) && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep bg-brand-soft px-2 py-0.5 rounded-full">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{profile.subjects.join(" · ")} · {profile.level}</p>
            <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-coral text-coral" />
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground">(128 reviews)</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="size-3.5" />Trinidad</span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="size-3.5" />Replies &lt; 1 hr</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
            {[
              { icon: Award, label: "Experience", value: "10+ years" },
              { icon: Clock, label: "Hourly rate", value: `TT$${profile.price}` },
              { icon: ShieldCheck, label: "Verified", value: `${profile.qualifications.filter((q) => q.verified).length} subj.` },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-mint p-3">
                <m.icon className="size-4 text-brand-deep mb-1" />
                <div className="text-[11px] text-muted-foreground">{m.label}</div>
                <div className="text-sm font-semibold text-ink">{m.value}</div>
              </div>
            ))}
          </div>

          <button onClick={openBooking} className="mt-4 w-full sm:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold">
            <Video className="size-4" /> Book a 1:1 — TT${profile.price}/hr
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-background border border-border p-6">
            <h2 className="font-semibold text-ink mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.tags.map((s) => <span key={s} className="px-3 py-1 rounded-full bg-brand-soft text-forest text-xs font-medium">{s}</span>)}
            </div>
          </section>

          {/* Verified qualifications */}
          <section className="rounded-3xl bg-background border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ink inline-flex items-center gap-2"><ShieldCheck className="size-4 text-brand-deep" /> Qualifications</h2>
              <span className="text-xs text-muted-foreground">Reviewed by iTutor</span>
            </div>
            <ul className="divide-y divide-border">
              {profile.qualifications.map((q, i) => (
                <li key={i} className="py-3 flex items-start gap-3">
                  <div className={cn("size-9 rounded-full grid place-items-center shrink-0", q.verified ? "bg-brand-soft text-brand-deep" : "bg-muted text-muted-foreground")}>
                    {q.verified ? <BadgeCheck className="size-5" /> : <FileText className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink">{q.subject}</div>
                    <div className="text-xs text-muted-foreground">{q.credential}</div>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", q.verified ? "bg-brand-soft text-forest" : "bg-muted text-muted-foreground")}>
                    {q.verified ? "Verified" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section className="rounded-3xl bg-background border border-border p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-ink">Reviews · {reviews.length}</h2>
              <span className="text-sm font-semibold inline-flex items-center gap-1"><Star className="size-4 fill-coral text-coral" /> 4.9</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Only students who've completed a class with this tutor can post or vote.</p>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar name={r.name} hue={r.hue} size={28} />
                    <span className="text-sm font-semibold">{r.name}</span>
                    {r.verifiedStudent && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase text-brand-deep bg-brand-soft px-1.5 py-0.5 rounded-full">
                        <Check className="size-2.5" /> Took class
                      </span>
                    )}
                    <div className="flex ml-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3 fill-coral text-coral" />)}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.quote}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button onClick={() => vote(r.id, "up")} className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition", voted[r.id] === "up" ? "border-brand bg-brand-soft text-brand-deep" : "border-border text-muted-foreground hover:border-brand/50")}>
                      <ThumbsUp className="size-3" /> {r.up}
                    </button>
                    <button onClick={() => vote(r.id, "down")} className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition", voted[r.id] === "down" ? "border-coral bg-coral-soft text-coral" : "border-border text-muted-foreground hover:border-coral/50")}>
                      <ThumbsDown className="size-3" /> {r.down}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Desktop booking sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-20 self-start space-y-4">
          <BookingCard
            profile={profile}
            slots={slots}
            pickedSubject={pickedSubject}
            setPickedSubject={setPickedSubject}
            pickedDay={pickedDay}
            setPickedDay={setPickedDay}
            pickedTime={pickedTime}
            setPickedTime={setPickedTime}
            scrollRef={dayScrollRef}
            scrollDays={scrollDays}
          />
        </aside>
      </div>

      {/* Mobile booking sheet */}
      {showBooking && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowBooking(false)}>
          <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Step {bookingStep} of 3</div>
                <div className="font-semibold text-ink text-sm">
                  {bookingStep === 1 ? "Pick a subject" : bookingStep === 2 ? "Pick a date & time" : "Confirm booking"}
                </div>
              </div>
              <button onClick={() => setShowBooking(false)} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
            </div>
            <div className="p-5">
              {bookingStep === 1 && (
                <div className="space-y-2">
                  {profile.subjects.map((s) => {
                    const q = profile.qualifications.find((x) => x.subject === s);
                    return (
                      <button key={s} onClick={() => { setPickedSubject(s); setBookingStep(2); }} className={cn("w-full text-left px-4 py-3 rounded-2xl border flex items-center justify-between transition", pickedSubject === s ? "border-brand bg-brand-soft" : "border-border hover:border-brand/50")}>
                        <div>
                          <div className="font-semibold text-ink text-sm">{s}</div>
                          {q && <div className="text-xs text-muted-foreground">{q.credential}</div>}
                        </div>
                        {q?.verified && <BadgeCheck className="size-5 text-brand-deep" />}
                      </button>
                    );
                  })}
                </div>
              )}
              {bookingStep === 2 && (
                <BookingCard
                  profile={profile}
                  slots={slots}
                  pickedSubject={pickedSubject}
                  setPickedSubject={setPickedSubject}
                  pickedDay={pickedDay}
                  setPickedDay={setPickedDay}
                  pickedTime={pickedTime}
                  setPickedTime={setPickedTime}
                  scrollRef={dayScrollRef}
                  scrollDays={scrollDays}
                  embedded
                  onContinue={() => setBookingStep(3)}
                />
              )}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border p-4 space-y-2 text-sm">
                    <Row label="Tutor" value={profile.name} />
                    <Row label="Subject" value={pickedSubject} />
                    <Row label="Date" value={slots[pickedDay].date.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })} />
                    <Row label="Time" value={pickedTime ?? "—"} />
                    <Row label="Duration" value="1 hr" />
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-ink">
                      <span>Total</span><span>TT${profile.price}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">By confirming, you agree to rate this tutor after the class. Free cancellation up to 24h before.</p>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep">
                    <Check className="size-4" /> Confirm & pay
                  </button>
                </div>
              )}
            </div>
            {bookingStep > 1 && bookingStep < 3 && (
              <div className="sticky bottom-0 bg-background border-t border-border p-4">
                <button onClick={() => setBookingStep((s) => (s - 1) as 1 | 2 | 3)} className="text-sm text-muted-foreground">← Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="text-ink font-medium">{value}</span></div>;
}

function BookingCard({
  profile, slots, pickedSubject, setPickedSubject, pickedDay, setPickedDay, pickedTime, setPickedTime, scrollRef, scrollDays, embedded, onContinue,
}: {
  profile: Profile;
  slots: { date: Date; times: string[] }[];
  pickedSubject: string;
  setPickedSubject: (s: string) => void;
  pickedDay: number;
  setPickedDay: (n: number) => void;
  pickedTime: string | null;
  setPickedTime: (s: string | null) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollDays: (dir: 1 | -1) => void;
  embedded?: boolean;
  onContinue?: () => void;
}) {
  return (
    <div className={cn(!embedded && "rounded-3xl bg-background border border-border p-5")}>
      {!embedded && (
        <div className="flex items-baseline justify-between mb-4">
          <div><span className="text-2xl font-bold text-ink">TT${profile.price}</span><span className="text-sm text-muted-foreground">/hr</span></div>
          <span className="text-xs px-2 py-1 rounded-full bg-brand-soft text-forest font-semibold">Available</span>
        </div>
      )}

      {profile.subjects.length > 1 && (
        <>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subject</div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.subjects.map((s) => (
              <button key={s} onClick={() => setPickedSubject(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition", pickedSubject === s ? "bg-ink text-white border-ink" : "border-border text-muted-foreground hover:border-ink/30")}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pick a day</div>
        <div className="flex gap-1">
          <button onClick={() => scrollDays(-1)} className="size-6 grid place-items-center rounded-full hover:bg-muted"><ChevronLeft className="size-3.5" /></button>
          <button onClick={() => scrollDays(1)} className="size-6 grid place-items-center rounded-full hover:bg-muted"><ChevronRight className="size-3.5" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-1 px-1 snap-x">
        {slots.map((s, i) => {
          const disabled = s.times.length === 0;
          return (
            <button key={i} onClick={() => { setPickedDay(i); setPickedTime(null); }} disabled={disabled} className={cn("shrink-0 w-14 py-2 rounded-xl text-center transition snap-start disabled:opacity-30 border", pickedDay === i ? "bg-ink text-white border-ink" : "border-border hover:border-brand")}>
              <div className="text-[10px] font-semibold opacity-70 uppercase">{i === 0 ? "Today" : s.date.toLocaleDateString("en", { weekday: "short" })}</div>
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
        {slots[pickedDay].times.length === 0 && <div className="col-span-2 text-sm text-muted-foreground py-3 text-center">No slots this day</div>}
        {slots[pickedDay].times.map((t) => (
          <button key={t} onClick={() => setPickedTime(t)} className={cn("py-2.5 rounded-xl text-sm font-medium border transition", pickedTime === t ? "bg-brand text-white border-brand" : "border-border hover:border-brand")}>
            {t}
          </button>
        ))}
      </div>

      <button
        disabled={!pickedTime}
        onClick={onContinue}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep transition disabled:opacity-50"
      >
        <Video className="size-4" /> {pickedTime ? (embedded ? `Continue with ${pickedTime}` : `Book ${pickedSubject} · ${pickedTime}`) : "Select a time"}
      </button>
      {!embedded && <p className="text-xs text-muted-foreground text-center mt-3">Free cancellation up to 24h before</p>}
    </div>
  );
}
