import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALL_LESSONS, UPCOMING_EVENTS } from "@/lib/student-store";
import {
  ArrowLeft, FileText, Video, MessageCircle, Paperclip, Bell, Sparkles, Link as LinkIcon,
  Calendar as CalendarIcon, Users, Pin, ExternalLink, Star, Download, Clock, Check, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/lessons/$id")({
  head: () => ({ meta: [{ title: "Class — iTutor Student" }] }),
  component: ClassDetail,
});

type Tab = "stream" | "sessions" | "members";

type StreamPost = {
  id: string;
  kind: "announcement" | "ai-recap" | "attachment" | "link";
  title: string;
  body: string;
  at: string;
  pinned?: boolean;
  attachmentName?: string;
  linkUrl?: string;
};

const STREAM: StreamPost[] = [
  { id: "sp1", kind: "announcement", title: "📌 Bring past-paper booklets to Saturday's session", body: "Make sure you have the 2019–2023 booklet printed and on hand. We'll work Paper 2 Q1–5 together.", at: "Pinned · 2 days ago", pinned: true },
  { id: "sp2", kind: "ai-recap", title: "AI Recap · Saturday's session", body: "Covered: simultaneous equations, word-problem translation, exam strategy for Paper 1 Section A. Next session: trig identities deep-dive.", at: "Yesterday" },
  { id: "sp3", kind: "attachment", title: "Worksheet · Trig Identities Drill", body: "20 questions, answer key included. Due before next session.", at: "Yesterday", attachmentName: "trig-drill-w8.pdf" },
  { id: "sp4", kind: "link", title: "Useful video · Khan Academy Trig Identities", body: "10-minute primer before Saturday's class.", at: "3 days ago", linkUrl: "https://khanacademy.org/math/trigonometry" },
  { id: "sp5", kind: "announcement", title: "Welcome to the cohort!", body: "Looking forward to a great term. Bring your textbook and a positive attitude.", at: "1 week ago" },
];

const MEMBERS = [
  { id: "m1", name: "Aliyah Mohammed", initials: "AM", joined: "Mar 2026" },
  { id: "m2", name: "Devon Charles", initials: "DC", joined: "Mar 2026" },
  { id: "m3", name: "Trinity Hosein", initials: "TH", joined: "Apr 2026" },
  { id: "m4", name: "Marcus Ali", initials: "MA", joined: "Apr 2026" },
  { id: "m5", name: "Sade Williams", initials: "SW", joined: "May 2026" },
  { id: "m6", name: "You", initials: "YOU", joined: "May 2026", self: true },
];

function ClassDetail() {
  const { id } = Route.useParams();
  const lesson = ALL_LESSONS.find((l) => l.id === id);
  if (!lesson) throw notFound();

  const [tab, setTab] = useState<Tab>("stream");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/student/lessons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All classes
      </Link>

      {/* Banner */}
      <div
        className="rounded-3xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, color-mix(in oklab, var(--${lesson.color}) 50%, white), color-mix(in oklab, var(--${lesson.color}) 20%, white))` }}
      >
        <div className="flex flex-wrap items-start gap-4">
          <div className="text-5xl">{lesson.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-ink/70 font-bold">{lesson.subject} · Group class</div>
            <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">{lesson.title}</h1>
            <div className="text-sm text-ink/80 mt-1 inline-flex items-center gap-1.5">
              with {lesson.tutor}
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              <span className="font-semibold">4.9</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-forest shrink-0">
            <Video className="size-4" /> Join next session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6 overflow-x-auto">
        {([
          { key: "stream", label: "Stream", icon: MessageCircle },
          { key: "sessions", label: "Sessions", icon: CalendarIcon },
          { key: "members", label: "Members", icon: Users },
        ] as const).map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("relative pb-3 text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap",
                tab === t.key ? "text-brand-deep" : "text-muted-foreground hover:text-ink")}>
              <Icon className="size-4" /> {t.label}
              {tab === t.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand" />}
            </button>
          );
        })}
      </div>

      {tab === "stream" && <Stream lesson={lesson} />}
      {tab === "sessions" && <Sessions lesson={lesson} />}
      {tab === "members" && <Members />}
    </div>
  );
}

/* ---------------- Stream ---------------- */

function Stream({ lesson }: { lesson: (typeof ALL_LESSONS)[number] }) {
  const sorted = [...STREAM].sort((a, b) => (a.pinned ? -1 : 0) - (b.pinned ? -1 : 0));
  const meta: Record<StreamPost["kind"], { icon: any; cls: string; tag: string }> = {
    announcement: { icon: Bell, cls: "bg-amber-100 text-amber-700", tag: "Announcement" },
    "ai-recap":   { icon: Sparkles, cls: "bg-emerald-100 text-emerald-700", tag: "AI Recap" },
    attachment:   { icon: Paperclip, cls: "bg-violet-100 text-violet-700", tag: "Attachment" },
    link:         { icon: LinkIcon, cls: "bg-sky-100 text-sky-700", tag: "Link" },
  };

  return (
    <div className="grid lg:grid-cols-[1fr,280px] gap-6">
      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          The stream is read-only — your tutor posts here. Use Messages to reply.
        </div>
        {sorted.map((p) => {
          const M = meta[p.kind];
          const Icon = M.icon;
          return (
            <div key={p.id} className={cn("rounded-2xl bg-background border p-4 flex gap-3", p.pinned ? "border-coral/40 ring-1 ring-coral/20" : "border-border")}>
              <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", M.cls)}><Icon className="size-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{M.tag}</span>
                  {p.pinned && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-coral-soft text-coral inline-flex items-center gap-1"><Pin className="size-3" /> Pinned</span>}
                </div>
                <div className="mt-1 font-semibold text-ink">{p.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{p.body}</p>
                {p.attachmentName && (
                  <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-semibold text-ink hover:bg-muted">
                    <Download className="size-3.5" /> {p.attachmentName}
                  </button>
                )}
                {p.linkUrl && (
                  <a href={p.linkUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-semibold text-brand-deep hover:bg-brand-soft">
                    <ExternalLink className="size-3.5" /> {p.linkUrl}
                  </a>
                )}
                <div className="mt-2 text-[11px] text-muted-foreground">{p.at}</div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl bg-background border border-border p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Class info</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Tutor" value={lesson.tutor} />
            <Row label="Subject" value={lesson.subject} />
            <Row label="Format" value="Group · weekly" />
          </div>
        </div>
        <div className="rounded-2xl bg-background border border-border p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pinned</div>
          <ul className="mt-3 space-y-2 text-sm">
            {sorted.filter((p) => p.pinned).map((p) => (
              <li key={p.id} className="flex items-start gap-2"><Pin className="size-3.5 text-coral mt-0.5 shrink-0" /> <span className="text-ink line-clamp-2">{p.title}</span></li>
            ))}
            {sorted.filter((p) => p.pinned).length === 0 && <li className="text-xs text-muted-foreground">Nothing pinned yet.</li>}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
      <span className="text-ink font-medium text-right truncate">{value}</span>
    </div>
  );
}

/* ---------------- Sessions ---------------- */

function Sessions({ lesson }: { lesson: (typeof ALL_LESSONS)[number] }) {
  const sessions = useMemo(() => {
    // Derive a session list from the matching tutor's upcoming events + a few past sessions.
    const baseUpcoming = UPCOMING_EVENTS.filter((e) => e.tutor === lesson.tutor).slice(0, 3);
    const today = new Date();
    const mk = (offsetDays: number, hour: number, attendance: "attended" | "missed" | "pending", topic: string) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offsetDays);
      d.setHours(hour, 0, 0, 0);
      return { date: d.toISOString(), durationMin: 60, topic, attendance };
    };
    const past = [
      mk(-14, 16, "attended", "Intro & diagnostics"),
      mk(-7, 16, "attended", "Past Paper 2022 walkthrough"),
      mk(-3, 16, "missed", "Word problems"),
    ];
    const upcoming = baseUpcoming.length > 0
      ? baseUpcoming.map((e, i) => mk(i * 7 + 2, Math.floor(e.startHour), "pending", e.title))
      : [mk(2, 16, "pending", "Trig identities deep-dive"), mk(9, 16, "pending", "SBA prep"), mk(16, 16, "pending", "Mock paper 1")];
    return [...upcoming, ...past];
  }, [lesson.tutor]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex items-start gap-2">
        <Video className="size-3.5 mt-0.5 shrink-0 text-brand-deep" />
        <span>Meeting links are generated automatically from your tutor's connected Zoom or Google Meet account when each session starts.</span>
      </div>

      {sessions.map((s, i) => {
        const d = new Date(s.date);
        const future = d > new Date();
        const att = s.attendance;
        return (
          <div key={i} className="rounded-2xl bg-background border border-border p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 md:w-72">
              <div className="text-center bg-brand-soft text-brand-deep rounded-lg px-3 py-1.5 leading-tight shrink-0">
                <div className="text-base font-bold tabular-nums">{d.getDate()}</div>
                <div className="text-[9px] uppercase font-bold tracking-wider">{d.toLocaleString(undefined, { month: "short" })}</div>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-ink text-sm truncate">{s.topic}</div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {s.durationMin}m
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 flex-wrap">
              {future ? (
                <Pill tone="amber" icon={Clock} label="Upcoming" />
              ) : att === "attended" ? (
                <Pill tone="emerald" icon={Check} label="Attended" />
              ) : att === "missed" ? (
                <Pill tone="rose" icon={X} label="Missed" />
              ) : (
                <Pill tone="slate" label="Pending" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {future && (
                <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">
                  <Video className="size-3.5" /> Join
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Pill({ tone, icon: Icon, label }: { tone: "emerald" | "rose" | "amber" | "slate"; icon?: any; label: string }) {
  const cls = {
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-800",
    slate: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", cls)}>{Icon && <Icon className="size-3" />} {label}</span>;
}

/* ---------------- Members ---------------- */

function Members() {
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">{MEMBERS.length} students in this class.</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {MEMBERS.map((m) => (
          <div key={m.id} className={cn("rounded-2xl border bg-background p-4 flex items-center gap-3", (m as any).self ? "border-brand bg-brand-soft/30" : "border-border")}>
            <div className="size-10 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-white font-bold text-xs">{m.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink text-sm truncate">{m.name}{(m as any).self && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep">(you)</span>}</div>
              <div className="text-xs text-muted-foreground">Joined {m.joined}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
