import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, BadgeCheck, Send, Check, Star, Users, Clock, CalendarDays,
  Sparkles, ChevronRight, Share2, MessageSquare, PlayCircle, FileText,
  ClipboardCheck, BookOpen, Video, TrendingUp,
} from "lucide-react";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { StarRating } from "@/components/classes/StarRating";
import { getClassById, getClassesByTutorId, getClassBadges, type ClassListing, type ClassBadge } from "@/lib/classes-catalog";
import { useEnrolledClasses, usePendingClassRequests, shareLink } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classes/$id")({
  head: () => ({ meta: [{ title: "Class — iTutor" }] }),
  component: ClassDetailPage,
});

const POSTS = [
  { id: "p1", author: "Tutor", role: "Tutor" as const, time: "2h ago", type: "Announcement" as const, body: "Reminder: tomorrow's session will focus on solving simultaneous equations. Please review the warm-up sheet I posted last week.", replies: 2 },
  { id: "p2", author: "Tutor", role: "Tutor" as const, time: "1d ago", type: "Assignment" as const, body: "Assignment 4: Complete questions 1–8 on page 42. Submit through the class stream by Friday.", replies: 5 },
  { id: "p3", author: "Jordan Williams", role: "Student" as const, time: "3d ago", type: "Discussion" as const, body: "Anyone else found the revision sheet helpful? Question 6 was tricky for me.", replies: 3 },
];

const POST_COLORS: Record<string, string> = {
  Announcement: "bg-sky/40 text-ink",
  Assignment: "bg-coral-soft text-ink",
  Discussion: "bg-lavender text-ink",
};

const REVIEWS = [
  { id: "r1", name: "Maya Khan", stars: 5, date: "Jun 12, 2026", comment: "The past-paper walkthroughs are gold. I went from a 3 to a 1 in my mock.", reply: "Thanks Maya — proud of you!" },
  { id: "r2", name: "Tariq Bharath", stars: 5, date: "Jun 8, 2026", comment: "Best class I've taken. The pace is just right.", reply: null },
  { id: "r3", name: "Ella Joseph", stars: 4, date: "May 30, 2026", comment: "Strong content. Would love a few more practice quizzes between sessions.", reply: "Noted — adding more quizzes from next month." },
];

const BREAKDOWN = [
  { stars: 5, pct: 78 }, { stars: 4, pct: 16 }, { stars: 3, pct: 4 }, { stars: 2, pct: 1 }, { stars: 1, pct: 1 },
];

const ASSIGNMENTS = [
  { id: "a1", title: "Past paper · Algebra 2024", due: "Due Fri 6:00 PM", status: "todo" as const },
  { id: "a2", title: "Warm-up worksheet — Functions", due: "Due Mon", status: "todo" as const },
  { id: "a3", title: "Diagnostic quiz", due: "Submitted", status: "done" as const },
];
const MATERIALS = [
  { id: "m1", title: "Module 3 notes (PDF)", kind: "pdf" as const, size: "1.4 MB" },
  { id: "m2", title: "Recording — Week 4 session", kind: "video" as const, size: "47 min" },
  { id: "m3", title: "Formula sheet", kind: "pdf" as const, size: "240 KB" },
];
const PEOPLE = [
  { name: "Aliyah Mohammed", hue: 145 }, { name: "Tariq Bharath", hue: 220 },
  { name: "Maya Khan", hue: 35 }, { name: "Ella Joseph", hue: 280 },
  { name: "Jordan Williams", hue: 165 }, { name: "Priya Singh", hue: 20 },
];

function Initials({ name }: { name: string }) {
  return <>{name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((s) => s[0]).slice(0, 2).join("")}</>;
}

function BadgePill({ b }: { b: ClassBadge }) {
  const tone: Record<ClassBadge["tone"], string> = {
    ink: "bg-ink text-white",
    coral: "bg-coral text-white",
    brand: "bg-brand-soft text-brand-deep",
    sky: "bg-sky text-ink",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider", tone[b.tone])}>
      {b.key === "popular" && <Sparkles className="size-3" />}
      {b.label}
    </span>
  );
}

function ClassDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const c = getClassById(id);
  const enrolled = useEnrolledClasses();
  const requests = usePendingClassRequests();
  const [tab, setTab] = useState<"about" | "home" | "stream" | "reviews">("about");
  const [toast, setToast] = useState<string | null>(null);

  if (!c) {
    return (
      <ClassesShell>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-ink">Class not found</h1>
          <Link to="/classes" className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-deep hover:underline">
            <ArrowLeft className="size-4" /> Back to Explore
          </Link>
        </div>
      </ClassesShell>
    );
  }

  const isEnrolled = enrolled.has(c.id);
  const isRequested = requests.has(c.id);
  const badges = getClassBadges(c);
  const moreClasses = getClassesByTutorId(c.tutorId, c.id);
  const seatsLeft = Math.max(0, c.seatsTotal - c.seatsTaken);

  // Tabs: pre-enroll = About / Reviews. Post-enroll = Home / Stream / Reviews.
  const tabs = isEnrolled
    ? (["home", "stream", "reviews"] as const)
    : (["about", "reviews"] as const);

  // If just enrolled and tab still says about, jump to home.
  if (isEnrolled && tab === "about") setTimeout(() => setTab("home"), 0);
  if (!isEnrolled && (tab === "home" || tab === "stream")) setTimeout(() => setTab("about"), 0);

  const primaryAction = () => {
    if (isEnrolled) return;
    if (c.requestToJoin) {
      requests.add(c.id);
      setToast("Request sent — the tutor will be in touch.");
      setTimeout(() => setToast(null), 2400);
    } else {
      navigate({ to: "/checkout/class/$id", params: { id: c.id } });
    }
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const result = await shareLink(url, c.title);
    setToast(result === "shared" ? "Shared" : "Link copied to clipboard");
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <ClassesShell>
      <Link to="/classes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to Explore
      </Link>

      {/* HERO BANNER */}
      <div
        className="relative mt-5 overflow-hidden rounded-3xl border border-border"
        style={{ background: `linear-gradient(135deg, oklch(0.88 0.09 ${c.hue}), oklch(0.55 0.16 ${c.hue}))` }}
      >
        <div className="absolute inset-y-0 right-0 hidden md:flex items-center justify-end pr-8 opacity-25 select-none">
          <div className="text-[18rem] leading-none font-black text-white">{c.emoji ?? c.subject[0]}</div>
        </div>
        <div className="relative p-6 sm:p-10 max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1">{c.level}</span>
            <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1">{c.subject}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-3 py-1">
              <Users className="size-3" /> Live group class
            </span>
            {badges.map((b) => <BadgePill key={b.key} b={b} />)}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{c.title}</h1>
          <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl">{c.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Star className="size-4 fill-amber-300 text-amber-300" /> {c.rating.toFixed(1)}
              <span className="text-white/75 font-normal">({c.ratingCount} ratings)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" /> {c.seatsTaken} enrolled
            </span>
            <Link to="/student/tutors/$id" params={{ id: c.tutorId }} className="inline-flex items-center gap-2 hover:underline">
              <span className="grid size-7 place-items-center rounded-full bg-white/25 text-[10px] font-bold">
                <Initials name={c.tutorName} />
              </span>
              <span className="font-semibold">Taught by {c.tutorName}</span>
              {c.tutorVerified && <BadgeCheck className="size-4" />}
            </Link>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-border bg-background overflow-hidden">
        <StatTile label="Schedule" value={c.cadence} sub={c.schedule.split(" · ")[1] ?? ""} icon={CalendarDays} />
        <StatTile label="Session length" value={c.duration} sub="per session" icon={Clock} />
        <StatTile label="Level" value={c.level} sub={c.subject} icon={Sparkles} />
        <StatTile label={seatsLeft <= 4 && seatsLeft > 0 ? "Seats left" : "Cohort"} value={seatsLeft > 0 ? `${seatsLeft}` : "Full"} sub={`${c.seatsTaken}/${c.seatsTotal} taken`} icon={Users} />
      </div>

      {/* MAIN GRID */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn(
                  "relative px-4 py-3 text-sm font-semibold capitalize transition",
                  tab === t ? "text-ink" : "text-muted-foreground hover:text-ink",
                )}>
                  {t === "home" ? "Class home" : t}
                  {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            {tab === "about" && <AboutTab c={c} />}
            {tab === "home" && <ClassHomeTab c={c} />}
            {tab === "stream" && <StreamTab />}
            {tab === "reviews" && <ReviewsTab rating={c.rating} count={c.ratingCount} />}
          </div>

          {tab === "about" && <InstructorSection c={c} />}

          {tab === "about" && moreClasses.length > 0 && (
            <section className="mt-12">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-2xl font-bold text-ink">More classes by {c.tutorName}</h2>
                <Link to="/student/tutors/$id" params={{ id: c.tutorId }} className="text-sm font-semibold text-brand-deep hover:underline inline-flex items-center gap-1">
                  View profile <ChevronRight className="size-4" />
                </Link>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {moreClasses.map((mc) => <MiniClassCard key={mc.id} c={mc} />)}
              </div>
            </section>
          )}
        </div>

        {/* Sticky enrollment card */}
        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="rounded-2xl border border-border bg-background p-6 space-y-5 shadow-card">
            {badges.find((b) => b.key === "early-bird" || b.key === "promo") && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft text-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="size-3" /> {badges.find((b) => b.key === "early-bird" || b.key === "promo")!.label}
              </div>
            )}
            <div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-ink">TTD ${c.priceTTD}</div>
                {c.originalPriceTTD && (
                  <div className="text-base text-muted-foreground line-through">${c.originalPriceTTD}</div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">per month · {c.startsLabel}</div>
            </div>

            {isEnrolled ? (
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand-deep">
                <Check className="size-4" /> You're enrolled
              </span>
            ) : isRequested ? (
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-peach px-4 py-2.5 text-sm font-semibold text-ink">
                <Clock className="size-4" /> Request pending
              </span>
            ) : (
              <button onClick={primaryAction} className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-deep transition">
                {seatsLeft === 0 ? "Join waitlist" : c.requestToJoin ? "Request to join" : `Enrol · TTD $${c.priceTTD}/mo`}
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link to="/student/messages" className="rounded-xl border border-border py-2.5 grid place-items-center gap-1.5 hover:bg-muted text-xs font-semibold text-ink">
                <MessageSquare className="size-4" /> Message
              </Link>
              <button onClick={onShare} className="rounded-xl border border-border py-2.5 grid place-items-center gap-1.5 hover:bg-muted text-xs font-semibold text-ink">
                <Share2 className="size-4" /> Share
              </button>
            </div>

            <ul className="space-y-2 pt-2 border-t border-border">
              {c.whatsIncluded.slice(0, 4).map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-deep" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-semibold shadow-pop">
          {toast}
        </div>
      )}
    </ClassesShell>
  );
}

function StatTile({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: any }) {
  return (
    <div className="p-4 border-r last:border-r-0 border-b sm:border-b-0 border-border">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="size-4 text-ink/60" />
        <span className="text-base font-bold text-ink">{value}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

// ---------- POST-JOIN COURSERA-STYLE HOME ----------
function ClassHomeTab({ c }: { c: ClassListing }) {
  const progress = 38; // mock — would come from backend
  const completed = 3; const total = 8;

  return (
    <div className="space-y-6">
      {/* Next session hero */}
      <div className="rounded-3xl border border-border overflow-hidden">
        <div
          className="relative p-6 sm:p-8 text-white"
          style={{ background: `linear-gradient(135deg, oklch(0.5 0.16 ${c.hue}), oklch(0.32 0.1 ${c.hue}))` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">Next live session</div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold">Tomorrow · 4:00 PM AST</div>
              <div className="mt-1 text-sm text-white/85">Module 4 — Solving simultaneous equations</div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-5 py-3 text-sm font-bold hover:bg-white/90">
              <Video className="size-4" /> Join lesson
            </button>
          </div>
        </div>
      </div>

      {/* Progress + quick stats */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-ink">Course progress</div>
            <div className="text-xs text-muted-foreground">{completed} of {total} modules complete</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{progress}% complete · keep it up!</div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5">
          <TrendingUp className="size-5 text-brand-deep" />
          <div className="mt-2 text-2xl font-bold text-ink">94%</div>
          <div className="text-xs text-muted-foreground">Your attendance</div>
        </div>
      </div>

      {/* Assignments + materials */}
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink inline-flex items-center gap-2"><ClipboardCheck className="size-4" /> Assignments</h3>
            <span className="text-xs text-muted-foreground">{ASSIGNMENTS.filter((a) => a.status === "todo").length} due</span>
          </div>
          <ul className="mt-3 space-y-2">
            {ASSIGNMENTS.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40">
                <span className={cn("grid size-7 place-items-center rounded-full shrink-0", a.status === "done" ? "bg-brand text-white" : "border border-border text-muted-foreground")}>
                  {a.status === "done" ? <Check className="size-3.5" /> : <FileText className="size-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.due}</div>
                </div>
                <button className="text-xs font-semibold text-brand-deep hover:underline">{a.status === "done" ? "View" : "Open"}</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5">
          <h3 className="text-sm font-bold text-ink inline-flex items-center gap-2"><BookOpen className="size-4" /> Materials</h3>
          <ul className="mt-3 space-y-2">
            {MATERIALS.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40">
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-ink shrink-0">
                  {m.kind === "video" ? <PlayCircle className="size-4" /> : <FileText className="size-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">{m.size}</div>
                </div>
                <button className="text-xs font-semibold text-brand-deep hover:underline">Open</button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Classmates */}
      <section className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink inline-flex items-center gap-2"><Users className="size-4" /> Classmates</h3>
          <span className="text-xs text-muted-foreground">{c.seatsTaken} enrolled</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {PEOPLE.map((p) => (
            <div key={p.name} className="flex items-center gap-2 rounded-full border border-border bg-background pl-1 pr-3 py-1">
              <span className="grid size-7 place-items-center rounded-full text-[10px] font-bold" style={{ background: `oklch(0.88 0.09 ${p.hue})`, color: `oklch(0.3 0.08 ${p.hue})` }}>
                <Initials name={p.name} />
              </span>
              <span className="text-xs font-medium text-ink">{p.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stream preview */}
      <section className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Latest in the stream</h3>
          <button className="text-xs font-semibold text-brand-deep hover:underline">View all</button>
        </div>
        <div className="mt-3 space-y-3">
          {POSTS.slice(0, 2).map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-ink">{p.author} · {p.time}</div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", POST_COLORS[p.type])}>{p.type}</span>
              </div>
              <p className="mt-2 text-sm text-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AboutTab({ c }: { c: ClassListing }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-ink">About this class</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">{c.description}</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-ink">What you'll learn</h2>
        <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {c.whatYouLearn.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm text-ink">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-deep" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-bold text-ink">What's included</h2>
        <ul className="mt-4 space-y-2">
          {c.whatsIncluded.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function InstructorSection({ c }: { c: ClassListing }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-ink">Instructor</h2>
      <Link to="/student/tutors/$id" params={{ id: c.tutorId }} className="mt-4 flex items-start gap-4 rounded-2xl border border-border bg-background p-5 hover:border-brand/50 transition shadow-card">
        <div className="grid size-16 place-items-center rounded-2xl text-xl font-bold shrink-0" style={{ background: `oklch(0.85 0.1 ${c.tutorHue})`, color: `oklch(0.28 0.07 ${c.tutorHue})` }}>
          <Initials name={c.tutorName} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-ink">{c.tutorName}</span>
            {c.tutorVerified && <BadgeCheck className="size-4 text-brand-deep" />}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" /> {c.rating.toFixed(2)}
            </span>
            <span>{c.subject} specialist</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            View full profile, qualifications, reviews and other classes by {c.tutorName.split(" ").pop()}.
          </p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground self-center shrink-0" />
      </Link>
    </section>
  );
}

function MiniClassCard({ c }: { c: ClassListing }) {
  const badges = getClassBadges(c).slice(0, 1);
  return (
    <Link to="/classes/$id" params={{ id: c.id }} className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-brand/50 transition shadow-card">
      <div className="relative h-24 grid place-items-center text-white" style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${c.hue}), oklch(0.55 0.16 ${c.hue}))` }}>
        <span className="text-5xl opacity-50">{c.emoji ?? c.subject[0]}</span>
        <span className="absolute top-2 left-2 rounded-full bg-white/25 backdrop-blur px-2 py-0.5 text-[10px] font-bold">{c.level}</span>
        {badges.map((b) => (
          <span key={b.key} className="absolute top-2 right-2 rounded-full bg-ink/80 backdrop-blur text-white px-2 py-0.5 text-[10px] font-bold">{b.label}</span>
        ))}
      </div>
      <div className="p-4">
        <div className="text-sm font-bold text-ink line-clamp-2 group-hover:text-brand-deep transition">{c.title}</div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-ink">
            <Star className="size-3 fill-amber-400 text-amber-400" /> {c.rating.toFixed(1)}
            <span className="text-muted-foreground">({c.ratingCount})</span>
          </span>
          <span className="font-bold text-ink">TTD ${c.priceTTD}</span>
        </div>
      </div>
    </Link>
  );
}

function StreamTab() {
  return (
    <div className="space-y-4">
      {POSTS.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

function PostCard({ post }: { post: typeof POSTS[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="rounded-2xl border border-border bg-background p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-muted text-xs font-bold text-ink">
            <Initials name={post.author} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{post.author}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {post.role}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{post.time}</div>
          </div>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", POST_COLORS[post.type])}>
          {post.type}
        </span>
      </div>
      <p className="mt-4 text-sm text-ink leading-relaxed">{post.body}</p>
      <button onClick={() => setExpanded((e) => !e)} className="mt-4 text-xs font-medium text-muted-foreground hover:text-ink">
        {post.replies} replies
      </button>
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="rounded-lg bg-muted/40 p-3 text-sm text-ink">
            <span className="font-medium">Sample reply</span> — placeholder threaded reply.
          </div>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-muted" />
            <input type="text" placeholder="Write a reply…" className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-brand" />
            <button className="grid size-9 place-items-center rounded-full bg-brand text-white">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function ReviewsTab({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-background p-6 shadow-card sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-ink">{rating.toFixed(1)}</div>
          <StarRating value={rating} size={18} showNumber={false} />
          <div className="mt-1 text-xs text-muted-foreground">{count} ratings</div>
        </div>
        <div className="space-y-2">
          {BREAKDOWN.map((b) => (
            <div key={b.stars} className="flex items-center gap-3 text-xs">
              <span className="w-6 text-muted-foreground">{b.stars}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="w-10 text-right tabular-nums text-muted-foreground">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {REVIEWS.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-background p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-muted text-xs font-bold text-ink">
                  <Initials name={r.name} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <StarRating value={r.stars} size={12} showNumber={false} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-ink">{r.comment}</p>
            {r.reply && (
              <div className="mt-4 ml-8 rounded-xl border border-border bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-muted" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-deep">Tutor response</span>
                </div>
                <p className="mt-2 text-sm text-ink">{r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
