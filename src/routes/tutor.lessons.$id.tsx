import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PLACEHOLDER_LESSONS, PLACEHOLDER_SESSIONS, LESSON_KIND_META, useTutor, type TutorLesson } from "@/lib/tutor-store";
import {
  ArrowLeft, Settings, Calendar as CalendarIcon, Users, UserPlus, Pencil, Copy, Check, Star,
  Bell, FileText, MessageCircle, X, Plus, ExternalLink, MessageSquare, BarChart3, Trash2, Archive, ArrowUpRight, Lock, Globe, Eye,
  Image as ImageIcon, DollarSign, Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/lessons/$id")({
  head: () => ({ meta: [{ title: "Lesson — iTutor Tutor" }] }),
  component: LessonDetailPage,
});

type Tab = "stream" | "sessions" | "feedback" | "whatsapp" | "analytics";

function LessonDetailPage() {
  const { id } = Route.useParams();
  const initial = PLACEHOLDER_LESSONS.find((l) => l.id === id);
  if (!initial) throw notFound();

  const [lesson, setLesson] = useState<TutorLesson>(initial);
  const [tab, setTab] = useState<Tab>("stream");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const m = LESSON_KIND_META[lesson.kind];
  const next = new Date(lesson.startDate);
  const upcoming = useMemo(
    () => PLACEHOLDER_SESSIONS.filter((s) => s.lessonId === lesson.id && s.status === "upcoming").slice(0, 4),
    [lesson.id]
  );
  const inviteUrl = `https://itutor.app/lessons/${lesson.id}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

  return (
    <div className="-m-6 lg:-m-8">
      {/* Hero */}
      <div className={cn("relative h-48 lg:h-56 bg-gradient-to-br", lesson.thumbnailGradient ?? "from-brand to-emerald-400")}>
        <Link to="/tutor/lessons" className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs font-semibold text-white/90 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full backdrop-blur">
          <ArrowLeft className="size-3.5" /> All lessons
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 size-24 rounded-2xl bg-white/95 grid place-items-center shadow-lg">
          <div className={cn("size-16 rounded-xl bg-gradient-to-br grid place-items-center", lesson.thumbnailGradient ?? "from-brand to-emerald-400")}>
            <FileText className="size-8 text-white" />
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 pt-16 pb-12 max-w-7xl mx-auto">
        {/* Title card */}
        <section className="rounded-2xl bg-card border border-border p-6 lg:p-8 -mt-6 relative shadow-sm">
          <button onClick={() => setSettingsOpen(true)} className="absolute top-5 right-5 size-10 rounded-full bg-brand text-white grid place-items-center hover:bg-brand/90 shadow">
            <Settings className="size-4" />
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-ink">{lesson.title}</h1>
              <Link to="/tutor/profile" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink">
                <span className="size-7 rounded-full bg-brand-soft text-brand-deep grid place-items-center text-[11px] font-bold">LR</span>
                Liam Rampersad
              </Link>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {lesson.rating ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("size-4", i < Math.round(lesson.rating!) ? "fill-amber-400 text-amber-400" : "text-muted")} />
                    ))}
                    <span className="ml-1 text-ink font-semibold">{lesson.rating?.toFixed(1)}</span>
                    <span className="text-muted-foreground">· {lesson.reviewCount} reviews</span>
                  </>
                ) : (
                  <>
                    <Star className="size-4 text-muted" /><Star className="size-4 text-muted" /><Star className="size-4 text-muted" /><Star className="size-4 text-muted" /><Star className="size-4 text-muted" />
                    <span className="ml-1 text-muted-foreground">No reviews yet</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground self-center">Quick actions</div>
              <div className="flex gap-2">
                <QuickAction icon={Pencil} label="Edit Class Details" onClick={() => setSettingsOpen(true)} />
                <QuickAction icon={CalendarIcon} label="Schedule Session" />
                <QuickAction icon={UserPlus} label="Invite Members" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BigStat label="Members" value={String(lesson.enrollments.length)} accent="text-ink" />
            <BigStat label="Next session" value={next > new Date() ? next.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"} accent="text-purple-600" />
            <BigStat label="Price" value={lesson.rateTtd === 0 ? "Free" : `TTD ${lesson.rateTtd}`} accent="text-brand-deep" />
            <BigStat label="Student limit" value={String(lesson.capacity)} accent="text-ink" />
          </div>

          <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SmallStat color="brand" value={`${lesson.totalSessionsRun ?? 0}`} label="Total sessions" />
            <SmallStat color="indigo" value={`${lesson.avgAttendance ?? 0}%`} label="Avg attendance" />
            <SmallStat color="orange" value={`${lesson.retention ?? 0}%`} label="Retention" />
            <SmallStat color="amber" value={`$${(lesson.earningsTtd ?? 0).toLocaleString()}`} label="Total earnings" />
          </div>
        </section>

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-6 mt-6">
          <div className="min-w-0 space-y-4">
            {/* Tabs */}
            <div className="border-b border-border flex items-center gap-6 overflow-x-auto rounded-2xl bg-card px-4 pt-2">
              {(["stream", "sessions", "feedback", "whatsapp", "analytics"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn("relative pb-3 text-sm font-semibold capitalize whitespace-nowrap transition", tab === t ? "text-brand-deep" : "text-muted-foreground hover:text-ink")}>
                  {t}
                  {tab === t && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand" />}
                </button>
              ))}
            </div>

            {tab === "stream" && <StreamTab lesson={lesson} />}
            {tab === "sessions" && <SessionsTab lessonId={lesson.id} />}
            {tab === "feedback" && <FeedbackTab lesson={lesson} />}
            {tab === "whatsapp" && <WhatsappTab lesson={lesson} setLesson={setLesson} />}
            {tab === "analytics" && <AnalyticsTab lesson={lesson} />}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Members</h3>
                <span className="size-7 grid place-items-center rounded-full bg-brand-soft text-brand-deep text-xs font-bold">{lesson.enrollments.length}</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {lesson.enrollments.map((e) => (
                  <li key={e.studentId} className="flex items-center gap-3">
                    <div className={cn("size-9 rounded-full grid place-items-center text-xs font-bold text-white", "bg-gradient-to-br from-brand to-emerald-400")}>
                      {e.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to="/tutor/students/$id" params={{ id: e.studentId }} className="text-sm font-semibold text-ink hover:underline truncate block">{e.name}</Link>
                      <div className="text-[11px] text-muted-foreground">Member</div>
                    </div>
                  </li>
                ))}
                {lesson.enrollments.length === 0 && <li className="text-sm text-muted-foreground text-center py-4">No members found</li>}
              </ul>
              <input placeholder="Search members…" className="mt-4 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground truncate font-mono">{inviteUrl}</span>
                <button onClick={copyLink} className="text-xs font-semibold text-brand-deep hover:underline inline-flex items-center gap-1">
                  {linkCopied ? <Check className="size-3" /> : <Copy className="size-3" />} {linkCopied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Upcoming sessions</h3>
              <ul className="mt-4 space-y-3">
                {upcoming.map((s) => {
                  const d = new Date(s.date);
                  return (
                    <li key={s.id} className="flex items-start gap-3">
                      <div className="text-center bg-purple-50 text-purple-700 rounded-lg px-2.5 py-1.5 leading-tight">
                        <div className="text-base font-bold">{d.getDate()}</div>
                        <div className="text-[9px] uppercase font-bold tracking-wider">{d.toLocaleString(undefined, { month: "short" })}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink">
                          {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – {new Date(d.getTime() + s.durationMin*60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{lesson.title}</div>
                      </div>
                    </li>
                  );
                })}
                {upcoming.length === 0 && <li className="text-sm text-muted-foreground text-center py-3">No upcoming sessions.</li>}
              </ul>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-brand hover:text-brand-deep">
                <Plus className="size-4" /> Schedule a Session
              </button>
            </div>
          </aside>
        </div>
      </div>

      {settingsOpen && <SettingsSheet lesson={lesson} setLesson={setLesson} onClose={() => setSettingsOpen(false)} />}
      {/* TODO(cursor): wire all settings + invite + analytics + ownership transfer to backend. */}
    </div>
  );
}

/* ---------- atoms ---------- */

function QuickAction({ icon: Icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-ink hover:bg-muted">
      <Icon className="size-3.5 text-muted-foreground" /> {label}
    </button>
  );
}

function BigStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="text-center">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
      <div className={cn("mt-1 text-2xl font-bold", accent)}>{value}</div>
    </div>
  );
}

function SmallStat({ color, value, label }: { color: "brand" | "indigo" | "orange" | "amber"; value: string; label: string }) {
  const ring = {
    brand: "border-t-brand text-brand-deep",
    indigo: "border-t-indigo-500 text-indigo-600",
    orange: "border-t-orange-500 text-orange-600",
    amber: "border-t-amber-500 text-amber-600",
  }[color];
  return (
    <div className={cn("rounded-xl border-t-2 border-x border-b border-border bg-card px-4 py-3", ring)}>
      <div className={cn("text-2xl font-bold tabular-nums")}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">{label}</div>
    </div>
  );
}

/* ---------- tabs ---------- */

function StreamTab({ lesson }: { lesson: TutorLesson }) {
  const [composer, setComposer] = useState<"announce" | "assign" | "material" | null>(null);
  const posts = [
    { id: "p1", kind: "announcement" as const, who: "You", at: "2h ago", title: "Welcome to the cohort", body: "Looking forward to a great term. Bring your textbook on Saturday." },
    { id: "p2", kind: "assignment" as const, who: "You", at: "Yesterday", title: "Past paper · 2023 Q1–5", body: "Due Friday 6pm. Submit through the materials tab." },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ComposerChip active={composer === "announce"} icon={Bell} color="amber" label="New announcement" onClick={() => setComposer("announce")} />
          <ComposerChip active={composer === "assign"} icon={FileText} color="violet" label="New assignment" onClick={() => setComposer("assign")} />
          <ComposerChip active={composer === "material"} icon={ImageIcon} color="sky" label="Upload material" onClick={() => setComposer("material")} />
        </div>
        {composer && (
          <div className="space-y-2">
            <input placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <textarea placeholder="Write a message to your students…" className="w-full min-h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setComposer(null)} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Post</button>
            </div>
          </div>
        )}
      </div>

      {posts.map((p) => (
        <div key={p.id} className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center gap-3">
            <div className={cn("size-10 rounded-xl grid place-items-center", p.kind === "announcement" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700")}>
              {p.kind === "announcement" ? <Bell className="size-4" /> : <FileText className="size-4" />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ink">{p.title}</div>
              <div className="text-[11px] text-muted-foreground">{p.who} · {p.at}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
            <button className="hover:text-ink inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> 0 replies</button>
            <button className="hover:text-ink inline-flex items-center gap-1"><Eye className="size-3.5" /> {lesson.enrollments.length} seen</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComposerChip({ icon: Icon, color, label, active, onClick }: any) {
  const c = { amber: "bg-amber-50 text-amber-700 border-amber-200", violet: "bg-violet-50 text-violet-700 border-violet-200", sky: "bg-sky-50 text-sky-700 border-sky-200" }[color as "amber" | "violet" | "sky"];
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", c, active && "ring-2 ring-brand")}>
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

function SessionsTab({ lessonId }: { lessonId: string }) {
  const [tab, setTab] = useState<"all" | "upcoming" | "ended" | "deleted">("all");
  const all = PLACEHOLDER_SESSIONS.filter((s) => s.lessonId === lessonId);
  const filtered = all.filter((s) => tab === "all" ? true : tab === "upcoming" ? s.status === "upcoming" : tab === "ended" ? s.status === "past" : false);
  const grouped = {
    upcoming: filtered.filter((s) => s.status === "upcoming"),
    ended: filtered.filter((s) => s.status === "past"),
  };
  return (
    <div className="rounded-2xl bg-card border border-border p-5 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {(["all", "upcoming", "ended", "deleted"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-1.5 rounded-full text-xs font-semibold capitalize border", tab === t ? "bg-ink text-white border-ink" : "bg-background border-border text-muted-foreground hover:text-ink")}>{t}</button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90">
          <Plus className="size-4" /> Add Session
        </button>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-900 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-sky-500" /> Upcoming session rooms open 15 minutes before the scheduled start time.
      </div>

      {grouped.upcoming.length > 0 && (
        <Section title="Upcoming">
          {grouped.upcoming.map((s) => <SessionRow key={s.id} s={s} />)}
        </Section>
      )}
      {grouped.ended.length > 0 && (
        <Section title="Ended">
          {grouped.ended.map((s) => <SessionRow key={s.id} s={s} />)}
        </Section>
      )}
      {filtered.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No sessions to show.</div>}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-2">{title}</div>
      <ul className="divide-y divide-border border border-border rounded-xl">{children}</ul>
    </div>
  );
}

function SessionRow({ s }: any) {
  const d = new Date(s.date);
  const future = d > new Date();
  return (
    <li className="px-4 py-3 flex items-center gap-4">
      <span className={cn("size-2.5 rounded-full", s.status === "upcoming" ? "bg-emerald-500" : s.status === "past" ? "bg-rose-500" : "bg-muted")} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink text-sm">{d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
        <input defaultValue="" placeholder="Untitled session" className="mt-1 text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-brand w-56" />
        <div className="text-[11px] text-muted-foreground mt-1">{d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – {new Date(d.getTime() + s.durationMin*60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {Math.round(s.durationMin/60)} hr</div>
      </div>
      <button disabled={!future} className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1", future ? "bg-brand text-white hover:bg-brand/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
        <Lock className="size-3" /> Join
      </button>
      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{future ? "soon" : "ended"}</span>
      <button className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button>
    </li>
  );
}

function FeedbackTab({ lesson }: { lesson: TutorLesson }) {
  const reviews = [
    { id: "r1", who: "Aliyah Mohammed", initials: "AM", rating: 5, at: "2 weeks ago", text: "Patient and explains everything clearly. The past-paper drills made all the difference." },
    { id: "r2", who: "Keshawn Boodoo", initials: "KB", rating: 5, at: "1 month ago", text: "Honestly the best tutor I've had. Highly recommend." },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card border border-border p-6 grid md:grid-cols-[180px,1fr] gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-ink">{lesson.rating?.toFixed(1) ?? "—"}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("size-4", lesson.rating && i < Math.round(lesson.rating) ? "fill-amber-400 text-amber-400" : "text-muted")} />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{lesson.reviewCount ?? 0} reviews</div>
        </div>
        <div className="space-y-1.5">
          {[5,4,3,2,1].map((n) => (
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-muted-foreground">{n}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: n === 5 ? "78%" : n === 4 ? "18%" : n === 3 ? "4%" : "0%" }} />
              </div>
              <span className="w-10 text-right text-muted-foreground tabular-nums">{n === 5 ? "78%" : n === 4 ? "18%" : n === 3 ? "4%" : "0%"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-brand-soft text-brand-deep grid place-items-center text-xs font-bold">{r.initials}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{r.who}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  {Array.from({length:5}).map((_,i) => <Star key={i} className={cn("size-3", i<r.rating?"fill-amber-400 text-amber-400":"text-muted")}/>)}
                  <span className="ml-1">· {r.at}</span>
                </div>
              </div>
              <button className="text-xs font-semibold text-brand-deep hover:underline">Reply</button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsappTab({ lesson, setLesson }: { lesson: TutorLesson; setLesson: (l: TutorLesson) => void }) {
  const [link, setLink] = useState(lesson.whatsappLink ?? "");
  const [classroom, setClassroom] = useState(lesson.classroomLink ?? "");
  const connected = !!lesson.whatsappLink;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center"><MessageSquare className="size-5" /></div>
          <div className="flex-1">
            <div className="font-bold text-ink">WhatsApp Group</div>
            <div className="text-sm text-muted-foreground">Connect a WhatsApp group for your class</div>
          </div>
          <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full", connected ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>
        <div className="mt-5 pt-5 border-t border-border">
          <label className="text-sm font-semibold text-ink">WhatsApp group invite link</label>
          <p className="text-xs text-muted-foreground mt-0.5">Paste the invite link from your WhatsApp group. Only approved members will see the join button.</p>
          <div className="mt-3 flex gap-2">
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://chat.whatsapp.com/…" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <button className="px-3 py-2 rounded-lg border border-border text-sm font-semibold inline-flex items-center gap-1 hover:bg-muted"><ExternalLink className="size-3.5" /> Test</button>
            <button onClick={() => setLesson({ ...lesson, whatsappLink: link })} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 inline-flex items-center gap-1"><Check className="size-3.5" /> Save</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-sky-100 text-sky-700 grid place-items-center"><Globe className="size-5" /></div>
          <div className="flex-1">
            <div className="font-bold text-ink">Google Classroom</div>
            <div className="text-sm text-muted-foreground">Link an existing Classroom so members can self-enroll</div>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-border flex gap-2">
          <input value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="https://classroom.google.com/c/…" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          <button onClick={() => setLesson({ ...lesson, classroomLink: classroom })} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 inline-flex items-center gap-1"><Check className="size-3.5" /> Save</button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ lesson }: { lesson: TutorLesson }) {
  const trend = [62, 68, 71, 78, 82, 85, 88];
  const max = Math.max(...trend);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={Users} label="Active members" value={String(lesson.enrollments.length)} delta="+2 this week" />
        <KPICard icon={CalendarIcon} label="Sessions run" value={String(lesson.totalSessionsRun ?? 0)} delta="On track" />
        <KPICard icon={BarChart3} label="Avg attendance" value={`${lesson.avgAttendance ?? 0}%`} delta="+4% vs last month" />
        <KPICard icon={DollarSign} label="Earnings" value={`$${(lesson.earningsTtd ?? 0).toLocaleString()}`} delta="+TTD 240 this wk" />
      </div>
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">Engagement trend</h3>
          <span className="text-[11px] text-muted-foreground">Last 7 sessions</span>
        </div>
        <div className="mt-6 h-40 flex items-end gap-3">
          {trend.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-brand to-emerald-300" style={{ height: `${(v/max)*100}%` }} />
              <div className="text-[10px] text-muted-foreground">S{i+1}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="font-semibold text-ink">Per-student performance</h3>
        <ul className="mt-3 divide-y divide-border">
          {lesson.enrollments.map((e) => (
            <li key={e.studentId} className="py-3 flex items-center gap-3">
              <div className="size-9 rounded-full bg-brand-soft text-brand-deep grid place-items-center text-xs font-bold">{e.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{e.name}</div>
                <div className="text-[11px] text-muted-foreground">Attendance · {Math.round(60 + Math.random()*40)}%</div>
              </div>
              <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${60 + Math.random()*40}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, delta }: any) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className="size-4" /><span className="text-[11px] uppercase tracking-wider font-bold">{label}</span></div>
      <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">{delta}</div>
    </div>
  );
}

/* ---------- settings sheet ---------- */

function SettingsSheet({ lesson, setLesson, onClose }: { lesson: TutorLesson; setLesson: (l: TutorLesson) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<TutorLesson>(lesson);
  const update = <K extends keyof TutorLesson>(k: K, v: TutorLesson[K]) => setDraft({ ...draft, [k]: v });
  const gradients = [
    "from-orange-500 to-amber-400","from-fuchsia-500 to-purple-500","from-sky-500 to-cyan-400","from-emerald-500 to-teal-400",
    "from-rose-500 to-pink-400","from-indigo-500 to-blue-500","from-yellow-500 to-orange-500","from-slate-600 to-slate-400",
  ];
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-ink/50 backdrop-blur-sm" />
      <aside className="w-full max-w-xl bg-background h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Class settings</h2>
            <p className="text-xs text-muted-foreground">Customize how this class appears and behaves.</p>
          </div>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </header>

        <div className="p-6 space-y-8">
          {/* Thumbnail */}
          <Field label="Thumbnail">
            <div className={cn("h-24 rounded-xl bg-gradient-to-br grid place-items-center", draft.thumbnailGradient ?? "from-brand to-emerald-400")}>
              <ImageIcon className="size-8 text-white/80" />
            </div>
            <div className="mt-3 grid grid-cols-8 gap-2">
              {gradients.map((g) => (
                <button key={g} onClick={() => update("thumbnailGradient", g)} className={cn("h-8 rounded-md bg-gradient-to-br", g, draft.thumbnailGradient === g && "ring-2 ring-brand ring-offset-2")} />
              ))}
            </div>
            <button className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand-deep hover:underline"><ImageIcon className="size-3.5" /> Upload custom image</button>
          </Field>

          {/* Basics */}
          <Field label="Class title">
            <input value={draft.title} onChange={(e) => update("title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject"><input value={draft.subject} onChange={(e) => update("subject", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
            <Field label="Level"><input value={draft.level} onChange={(e) => update("level", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
          </div>
          <Field label="Class bio" hint="Long-form description shown on your public listing.">
            <textarea value={draft.bio ?? ""} onChange={(e) => update("bio", e.target.value)} className="w-full min-h-28 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </Field>

          {/* Pricing */}
          <Field label="Pricing">
            <div className="grid grid-cols-2 gap-3">
              <select value={draft.pricingMode} onChange={(e) => update("pricingMode", e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="per-session">Per session</option>
                <option value="per-block">Per block</option>
                <option value="per-student">Per student</option>
              </select>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">TTD</span>
                <input type="number" value={draft.rateTtd} onChange={(e) => update("rateTtd", Number(e.target.value))} className="w-full pl-12 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </div>
          </Field>

          {/* Capacity & rules */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Max class size"><input type="number" value={draft.capacity} onChange={(e) => update("capacity", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
            <Field label="Session length (min)"><input type="number" value={draft.durationMin} onChange={(e) => update("durationMin", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
          </div>

          <Toggle label="Require approval to join" hint="Students must be approved before they can enroll." value={!!draft.approvalRequired} onChange={(v) => update("approvalRequired", v)} />
          <Toggle label="Enable waitlist" hint="When the class fills up, allow students to join the waitlist." value={!!draft.waitlistEnabled} onChange={(v) => update("waitlistEnabled", v)} />

          {/* Visibility */}
          <Field label="Visibility" hint="Public classes appear in the marketplace.">
            <div className="grid grid-cols-3 gap-2">
              {(["public","unlisted","private"] as const).map((v) => (
                <button key={v} onClick={() => update("visibility", v)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize inline-flex items-center justify-center gap-1.5", draft.visibility === v ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                  {v === "public" ? <Globe className="size-3.5" /> : v === "private" ? <Lock className="size-3.5" /> : <Eye className="size-3.5" />} {v}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Video provider" hint="Where live sessions take place.">
            <div className="grid grid-cols-3 gap-2">
              {(["zoom","google-meet","itutor"] as const).map((v) => (
                <button key={v} onClick={() => update("videoProvider", v)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5", draft.videoProvider === v ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                  <Video className="size-3.5" /> {v === "google-meet" ? "Google Meet" : v === "itutor" ? "iTutor" : "Zoom"}
                </button>
              ))}
            </div>
          </Field>

          {/* Danger zone */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 space-y-3">
            <h3 className="text-sm font-bold text-rose-700">Danger zone</h3>
            <DangerRow icon={Archive} label={draft.archived ? "Unarchive class" : "Archive class"} hint="Hide from the marketplace and stop new enrollments." onClick={() => update("archived", !draft.archived)} />
            <DangerRow icon={ArrowUpRight} label="Transfer ownership" hint="Move this class to another tutor on iTutor." />
            <DangerRow icon={Trash2} label="Delete class" hint="Permanently remove this class and its data." destructive />
          </div>
        </div>

        <footer className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={() => { setLesson(draft); onClose(); }} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Save changes</button>
        </footer>
      </aside>
    </div>
  );
}

function Field({ label, hint, children }: any) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink">{label}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5 mb-2">{hint}</div>}
      <div className={cn(!hint && "mt-2")}>{children}</div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={cn("w-11 h-6 rounded-full p-0.5 transition", value ? "bg-brand" : "bg-muted")}>
        <span className={cn("block size-5 rounded-full bg-white shadow transition", value && "translate-x-5")} />
      </button>
    </div>
  );
}

function DangerRow({ icon: Icon, label, hint, destructive, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-start justify-between gap-3 rounded-xl border bg-background px-4 py-3 text-left hover:bg-muted/40", destructive ? "border-rose-200" : "border-border")}>
      <div className="flex items-start gap-3">
        <Icon className={cn("size-4 mt-0.5", destructive ? "text-rose-600" : "text-ink")} />
        <div>
          <div className={cn("text-sm font-semibold", destructive ? "text-rose-700" : "text-ink")}>{label}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
      </div>
    </button>
  );
}
