import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, Heart, Share2, MessageSquare, Play, BadgeCheck, Sparkles, TrendingUp, ShieldCheck, GraduationCap, Languages, Info, Smile, Target, MessageCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookTrialModal } from "@/components/booking/BookTrialModal";

export const Route = createFileRoute("/student/tutors/$id")({
  head: () => ({ meta: [{ title: "Tutor profile — iTutor" }] }),
  component: TutorDetail,
});

type Profile = {
  name: string;
  flag: string;
  country: string;
  subjects: string[];
  speaks: { lang: string; level: string }[];
  pricePerLesson: number;
  hue: number;
  rating: number;
  reviews: number;
  lessons: number;
  headline: string;
  bio: string;
  highlights: { label: string; color: string }[];
  ratings: { reassurance: number; clarity: number; progress: number; preparation: number };
  ratingsCount: number;
  recentBookings: number;
};

const PROFILES: Record<string, Profile> = {
  ramdeen: {
    name: "Mr. Ramdeen", flag: "🇹🇹", country: "Trinidad", subjects: ["Mathematics", "Physics"],
    speaks: [{ lang: "English", level: "Native" }, { lang: "Hindi", level: "B1" }],
    pricePerLesson: 35, hue: 145, rating: 4.9, reviews: 128, lessons: 14207,
    headline: "Expert Maths & Physics Tutor with 10+ Years' Experience | CSEC, CAPE, GCSE, A-Level, IB HL/SL, Cambridge, & More",
    bio: "Welcome to my profile! I'm Ramdeen, your dedicated guide to academic excellence and personal growth. With 10 years of experience, I am here to empower you to master Maths and Physics with confidence.",
    highlights: [{ label: "Patient", color: "bg-coral-soft text-ink" }, { label: "Structured", color: "bg-lavender text-ink" }, { label: "Goal-Focused", color: "bg-sky text-ink" }],
    ratings: { reassurance: 4.9, clarity: 4.8, progress: 4.8, preparation: 4.8 }, ratingsCount: 71, recentBookings: 13,
  },
  singh: { name: "Ms. Singh", flag: "🇹🇹", country: "Trinidad", subjects: ["Physics"], speaks: [{ lang: "English", level: "Native" }], pricePerLesson: 28, hue: 220, rating: 4.85, reviews: 94, lessons: 3120, headline: "UWI Physics graduate — making complex concepts intuitive for CSEC & CAPE", bio: "I make complex Physics concepts intuitive through real-world examples.", highlights: [{ label: "Clear", color: "bg-sky text-ink" }, { label: "Practical", color: "bg-coral-soft text-ink" }], ratings: { reassurance: 4.8, clarity: 4.9, progress: 4.8, preparation: 4.8 }, ratingsCount: 54, recentBookings: 9 },
  joseph: { name: "Mr. Joseph", flag: "🇹🇹", country: "Trinidad", subjects: ["English Literature", "English"], speaks: [{ lang: "English", level: "Native" }], pricePerLesson: 30, hue: 20, rating: 4.95, reviews: 211, lessons: 8400, headline: "CSEC English & Literature — essays, poetry, drama with Grade I track record", bio: "Literature tutor with a love for Caribbean writers.", highlights: [{ label: "Encouraging", color: "bg-coral-soft text-ink" }, { label: "Creative", color: "bg-lavender text-ink" }], ratings: { reassurance: 4.95, clarity: 4.9, progress: 4.9, preparation: 4.9 }, ratingsCount: 142, recentBookings: 16 },
  ali: { name: "Ms. Ali", flag: "🇹🇹", country: "Trinidad", subjects: ["Biology"], speaks: [{ lang: "English", level: "Native" }], pricePerLesson: 30, hue: 280, rating: 4.7, reviews: 67, lessons: 1800, headline: "Biology — diagrams, mnemonics, exam strategy for CSEC & CAPE", bio: "I help students remember biology through visuals and stories.", highlights: [{ label: "Visual", color: "bg-lavender text-ink" }, { label: "Patient", color: "bg-coral-soft text-ink" }], ratings: { reassurance: 4.7, clarity: 4.7, progress: 4.6, preparation: 4.7 }, ratingsCount: 36, recentBookings: 5 },
  thomas: { name: "Mr. Thomas", flag: "🇹🇹", country: "Trinidad", subjects: ["Chemistry"], speaks: [{ lang: "English", level: "Native" }, { lang: "French", level: "B2" }], pricePerLesson: 32, hue: 165, rating: 4.9, reviews: 142, lessons: 5600, headline: "PhD Chemistry — Organic, Inorganic & Physical for CAPE", bio: "PhD-trained chemist focusing on CAPE preparation and deep conceptual understanding.", highlights: [{ label: "Expert", color: "bg-sky text-ink" }, { label: "Rigorous", color: "bg-coral-soft text-ink" }], ratings: { reassurance: 4.9, clarity: 4.9, progress: 4.9, preparation: 4.9 }, ratingsCount: 95, recentBookings: 11 },
  khan: { name: "Ms. Khan", flag: "🇹🇹", country: "Trinidad", subjects: ["SEA Prep", "Mathematics", "English"], speaks: [{ lang: "English", level: "Native" }], pricePerLesson: 22, hue: 35, rating: 4.92, reviews: 178, lessons: 9100, headline: "SEA Prep specialist — building strong fundamentals with patience and care", bio: "Patient SEA preparation tutor with 7 years of experience.", highlights: [{ label: "Patient", color: "bg-coral-soft text-ink" }, { label: "Caring", color: "bg-lavender text-ink" }], ratings: { reassurance: 4.95, clarity: 4.9, progress: 4.92, preparation: 4.9 }, ratingsCount: 118, recentBookings: 19 },
};

const REVIEWS = [
  { id: "r1", name: "Ayza S.", hue: 280, date: "June 7, 2026", rating: 5, text: "I have been studying physics with this tutor for almost a year now and I can say that they are amazing! Helps me achieve top grades by explaining the…" },
  { id: "r2", name: "Remya", hue: 165, date: "June 6, 2026", rating: 5, text: "She is very friendly and would explain the topics according to the student's pace of choice." },
  { id: "r3", name: "Abraham", hue: 220, date: "June 5, 2026", rating: 5, text: "It is my pleasure to recognize this tutor for her outstanding service. She consistently demonstrates exceptional dedication, patience, and genuine care f…" },
  { id: "r4", name: "Tricia N.", hue: 35, date: "June 2, 2026", rating: 5, text: "Great teacher explains really well. She's patient and knowledgable. I really enjoy the lessons with her." },
];

function Avatar({ name, hue, size = 40, square = false }: { name: string; hue: number; size?: number; square?: boolean }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={cn("grid place-items-center font-bold shrink-0", square ? "rounded-xl" : "rounded-full")}
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("size-3.5", i < n ? "fill-ink text-ink" : "text-muted-foreground/30")} />
      ))}
    </div>
  );
}

function RatingTile({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-bold text-ink">{value.toFixed(1)}</div>
        <Icon className="size-5 text-ink" />
      </div>
      <div className="mt-2 text-sm font-semibold text-ink">{label}</div>
    </div>
  );
}

function TutorDetail() {
  const { id } = Route.useParams();
  const p = PROFILES[id] ?? PROFILES.ramdeen;
  const [saved, setSaved] = useState(false);
  const [booking, setBooking] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <Link to="/student/tutors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to tutors
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Video intro */}
          <div
            className="relative aspect-video rounded-3xl overflow-hidden border border-border"
            style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${p.hue}), oklch(0.6 0.15 ${p.hue}))` }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <button className="size-20 rounded-full bg-brand text-white grid place-items-center shadow-pop hover:scale-105 transition">
                <Play className="size-9 fill-white ml-1" />
              </button>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              <Play className="size-3 fill-white" /> iTutor introduction
            </div>
          </div>

          {/* Identity */}
          <div className="flex items-start gap-4">
            <Avatar name={p.name} hue={p.hue} size={88} square />
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-4xl font-bold text-ink leading-tight">{p.name}</h1>
              <div className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-2">
                {p.subjects[0].toLowerCase()} tutor <span>·</span> From {p.country} <span className="text-base">{p.flag}</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <p className="text-base text-ink leading-relaxed">{p.headline}</p>

          {/* Highlights */}
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-ink">
              <Sparkles className="size-4 text-brand-deep" /> {p.name.split(" ").pop()}'s highlights
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.highlights.map((h) => (
                <span key={h.label} className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold", h.color)}>
                  {h.label}
                </span>
              ))}
            </div>
          </div>

          {/* More about me */}
          <section>
            <h2 className="text-2xl font-bold text-ink">More about me</h2>
            <p className="mt-3 text-sm text-ink leading-relaxed">
              {p.bio} <button className="font-semibold underline">…read more</button>
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="inline-flex items-center gap-2 text-ink">
                <GraduationCap className="size-4 text-muted-foreground" />
                I teach: <span className="underline font-semibold">{p.subjects.join(", ")}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-ink">
                <Languages className="size-4 text-muted-foreground" />
                I speak: {p.speaks.map((s) => `${s.lang} (${s.level})`).join(" · ")}
              </div>
            </div>
          </section>

          {/* Lesson rating */}
          <section>
            <h2 className="text-2xl font-bold text-ink">Lesson rating</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <RatingTile icon={Smile} label="Reassurance" value={p.ratings.reassurance} />
              <RatingTile icon={MessageCircle} label="Clarity" value={p.ratings.clarity} />
              <RatingTile icon={Target} label="Progress" value={p.ratings.progress} />
              <RatingTile icon={Pencil} label="Preparation" value={p.ratings.preparation} />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Based on {p.ratingsCount} anonymous student reviews</div>
          </section>

          {/* What my students say */}
          <section>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-ink">What my students say</h2>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-4xl font-bold text-ink">{p.rating.toFixed(1)}</span>
              <div className="size-10 rounded-full bg-amber-400 grid place-items-center">
                <Star className="size-5 fill-ink text-ink" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Based on {p.reviews} student reviews</div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-6">
              {REVIEWS.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} hue={r.hue} size={40} square />
                    <div>
                      <div className="font-bold text-ink text-sm">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <div className="mt-3"><Stars n={r.rating} /></div>
                  <p className="text-sm text-ink mt-2 leading-relaxed">{r.text}</p>
                  <button className="mt-2 text-sm font-semibold text-ink underline">Show more</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT — sticky booking card */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="rounded-3xl border border-border bg-background p-5 shadow-card space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-ink">${p.pricePerLesson}</span>
              <span className="text-sm text-muted-foreground">50-min lesson</span>
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

            <button
              onClick={() => setBooking(true)}
              className="w-full py-3.5 rounded-2xl bg-brand text-white font-bold hover:bg-brand-deep transition"
            >
              Book trial lesson
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-xl border border-border py-3 grid place-items-center hover:bg-muted">
                <MessageSquare className="size-4" />
              </button>
              <button onClick={() => setSaved((s) => !s)} className="rounded-xl border border-border py-3 grid place-items-center hover:bg-muted">
                <Heart className={cn("size-4", saved && "fill-coral text-coral")} />
              </button>
              <button className="rounded-xl border border-border py-3 grid place-items-center hover:bg-muted">
                <Share2 className="size-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-trust-bg p-4">
              <div className="inline-flex items-center gap-2 font-bold text-trust-text">
                <ShieldCheck className="size-4 fill-ink text-trust-bg" />
                Not a match?
              </div>
              <div className="text-sm text-trust-text mt-1">You still have 2 free tutor trials.</div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="size-4 text-ink mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-ink">Very popular</div>
                <div className="text-muted-foreground text-xs">{p.recentBookings} lesson bookings in the last 2 days.</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile floating book bar */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-ink">${p.pricePerLesson}</div>
          <div className="text-[11px] text-muted-foreground">50-min lesson</div>
        </div>
        <button onClick={() => setBooking(true)} className="rounded-full bg-brand text-white px-6 py-2.5 text-sm font-bold">
          Book trial lesson
        </button>
      </div>

      {booking && (
        <BookTrialModal open onClose={() => setBooking(false)} tutorId={id} tutorName={p.name} tutorHue={p.hue} />
      )}
    </div>
  );
}
