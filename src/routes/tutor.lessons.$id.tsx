import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo, useRef, useState } from "react";
import {
  PLACEHOLDER_LESSONS, PLACEHOLDER_SESSIONS, PLACEHOLDER_STREAM_POSTS,
  LESSON_KIND_META, MEMBER_STATUS_META, PAYMENT_STATUS_META, PAYMENT_PERIODS,
  generatePaymentGrid, getStudentContact,
  useTutor,
  type TutorLesson, type EnrolledStudent, type MemberStatus, type StreamPost, type PaymentCellStatus,
} from "@/lib/tutor-store";
import {
  ArrowLeft, Settings, Calendar as CalendarIcon, Users, UserPlus, Copy, Check, Star,
  Bell, FileText, MessageCircle, X, Plus, ExternalLink, Trash2, Archive, ArrowUpRight, Lock, Globe, Eye,
  Image as ImageIcon, Video, MoreVertical, Pin, Sparkles, Link as LinkIcon, Paperclip, AlertTriangle, ShieldAlert,
  Mail, MessageSquare, DollarSign, BarChart3, ArrowUp, ArrowDown, Pencil, Info, Ban, Repeat, Clock, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import { UnsavedBar } from "@/components/UnsavedBar";

export const Route = createFileRoute("/tutor/lessons/$id")({
  head: () => ({ meta: [{ title: "Class — iTutor Tutor" }] }),
  component: ClassHubPage,
});

type Tab = "stream" | "sessions" | "roster" | "payments" | "settings" | "analytics";

function ClassHubPage() {
  const { id } = Route.useParams();
  const initial = PLACEHOLDER_LESSONS.find((l) => l.id === id);
  if (!initial) throw notFound();

  const [lesson, setLesson] = useState<TutorLesson>(() => ({
    billingModel: "per-session",
    memberServiceFee: 5,
    autoSuspend: false,
    graceWindowDays: 7,
    joinRequests: false,
    primaryChannel: "native",
    parentFeedbackMode: "off",
    parentFeedbackPrice: 0,
    promotion: null,
    ...initial,
  }));
  const [tab, setTab] = useState<Tab>("stream");
  const isOneOnOne = lesson.capacity === 1;
  const enrolledCount = lesson.enrollments.filter((e) => (e.status ?? "active") !== "removed").length;
  const atCapacity = enrolledCount >= lesson.capacity;

  const tabs: { key: Tab; label: string }[] = [
    { key: "stream", label: "Stream" },
    { key: "sessions", label: "Sessions" },
    { key: "roster", label: "Roster" },
    { key: "payments", label: "Payments" },
    { key: "settings", label: "Settings" },
    ...(isOneOnOne ? [] : [{ key: "analytics" as Tab, label: "Analytics" }]),
  ];

  return (
    <div className="-m-6 lg:-m-8">
      <Header lesson={lesson} enrolledCount={enrolledCount} atCapacity={atCapacity} isOneOnOne={isOneOnOne} />

      <div className="px-4 lg:px-8 pb-12 max-w-7xl mx-auto">
        <div className="border-b border-border mt-6 flex items-center gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("relative pb-3 text-sm font-semibold capitalize whitespace-nowrap transition", tab === t.key ? "text-brand-deep" : "text-muted-foreground hover:text-ink")}>
              {t.label}
              {tab === t.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "stream"    && <StreamTab lesson={lesson} />}
          {tab === "sessions"  && <SessionsTab lesson={lesson} />}
          {tab === "roster"    && <RosterTab lesson={lesson} setLesson={setLesson} isOneOnOne={isOneOnOne} />}
          {tab === "payments"  && <PaymentsTab lesson={lesson} />}
          {tab === "settings"  && <SettingsTab lesson={lesson} setLesson={setLesson} isOneOnOne={isOneOnOne} />}
          {tab === "analytics" && !isOneOnOne && <AnalyticsTab lesson={lesson} />}
        </div>
      </div>
      {/* TODO(cursor): wire all Class Hub tabs to real backend (stream posts, sessions, roster ops, payments, settings, analytics). */}
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header({ lesson, enrolledCount, atCapacity, isOneOnOne }: { lesson: TutorLesson; enrolledCount: number; atCapacity: boolean; isOneOnOne: boolean }) {
  const m = LESSON_KIND_META[lesson.kind];
  const promo = lesson.promotion;
  return (
    <div className={cn("relative h-44 lg:h-52 bg-gradient-to-br", lesson.thumbnailGradient ?? "from-brand to-emerald-400")}>
      <Link to="/tutor/lessons" className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs font-semibold text-white/95 bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur">
        <ArrowLeft className="size-3.5" /> All Classes
      </Link>
      <div className="absolute inset-x-0 bottom-0">
        <div className="px-4 lg:px-8 max-w-7xl mx-auto pb-5 text-white flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-ink")}>{m.short}</span>
              {lesson.visibility && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 inline-flex items-center gap-1">
                  {lesson.visibility === "private" ? <Lock className="size-3" /> : <Globe className="size-3" />} {lesson.visibility}
                </span>
              )}
              {atCapacity && !isOneOnOne && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white">At capacity</span>}
            </div>
            <h1 className="mt-2 text-2xl lg:text-3xl font-bold truncate">{lesson.title}</h1>
            <div className="mt-1 text-sm text-white/85">{lesson.subject} · {lesson.level} · {lesson.recurrenceRule ?? "One-off"}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/95 text-ink px-4 py-2 text-right">
              {promo ? (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-coral font-bold">{promo.label ?? promo.kind}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">TTD {promo.discountedPrice}</span>
                    <span className="text-xs line-through text-muted-foreground">TTD {promo.originalPrice}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{lesson.billingModel ?? "per-session"}</div>
                  <div className="text-lg font-bold">TTD {lesson.rateTtd}</div>
                </>
              )}
            </div>
            {!isOneOnOne && (
              <div className="rounded-xl bg-white/95 text-ink px-4 py-2 text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Members</div>
                <div className="text-lg font-bold tabular-nums">{enrolledCount}/{lesson.capacity}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stream ---------------- */

function StreamTab({ lesson }: { lesson: TutorLesson }) {
  const [posts, setPosts] = useState<StreamPost[]>(PLACEHOLDER_STREAM_POSTS);
  const [composer, setComposer] = useState<null | StreamPost["kind"]>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sorted = [...posts].sort((a, b) => (a.pinned ? -1 : 0) - (b.pinned ? -1 : 0));

  const submit = () => {
    if (!title.trim()) return;
    setPosts([{ id: `sp${Date.now()}`, kind: composer!, title, body, at: "Just now" }, ...posts]);
    setTitle(""); setBody(""); setComposer(null);
  };

  const approveAI = (id: string) => setPosts(posts.map((p) => p.id === id ? { ...p, pendingApproval: false } : p));
  const togglePin = (id: string) => setPosts(posts.map((p) => p.id === id ? { ...p, pinned: !p.pinned } : p));
  const remove = (id: string) => setPosts(posts.filter((p) => p.id !== id));

  return (
    <div className="grid lg:grid-cols-[1fr,280px] gap-6">
      <div className="space-y-4">
        <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Post to your class</div>
          <div className="flex items-center gap-2 flex-wrap">
            <ComposerChip active={composer === "announcement"} icon={Bell} color="amber" label="Announcement" onClick={() => setComposer("announcement")} />
            <ComposerChip active={composer === "attachment"} icon={Paperclip} color="violet" label="File attachment" onClick={() => setComposer("attachment")} />
            <ComposerChip active={composer === "link"} icon={LinkIcon} color="sky" label="Link" onClick={() => setComposer("link")} />
          </div>
          {composer && (
            <div className="space-y-2 pt-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message to your students…" className="w-full min-h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-muted-foreground">Stream posts are one-way — students cannot reply here. Use Messages for replies.</div>
                <div className="flex gap-2">
                  <button onClick={() => { setComposer(null); setTitle(""); setBody(""); }} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
                  <button onClick={submit} className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Post</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {sorted.length === 0 && (
          <EmptyState icon={MessageCircle} title="No posts yet" body="Start the conversation with an announcement or share a file." />
        )}

        {sorted.map((p) => (
          <StreamCard key={p.id} post={p} onApprove={() => approveAI(p.id)} onPin={() => togglePin(p.id)} onRemove={() => remove(p.id)} />
        ))}
      </div>

      {/* Aside */}
      <aside className="space-y-4">
        <SideCard title="Class info">
          <InfoRow label="Subject" value={`${lesson.subject} · ${lesson.level}`} />
          <InfoRow label="Schedule" value={lesson.recurrenceRule ?? "One-off"} />
          <InfoRow label="Video" value={lesson.videoProvider ?? "—"} />
          <InfoRow label="Channel" value={lesson.primaryChannel ?? "native"} />
        </SideCard>
        <SideCard title="Pinned">
          <ul className="space-y-2 text-sm">
            {sorted.filter((p) => p.pinned).map((p) => (
              <li key={p.id} className="flex items-start gap-2"><Pin className="size-3.5 text-coral mt-0.5" /> <span className="text-ink line-clamp-2">{p.title}</span></li>
            ))}
            {sorted.filter((p) => p.pinned).length === 0 && <li className="text-xs text-muted-foreground">Nothing pinned yet.</li>}
          </ul>
        </SideCard>
      </aside>
    </div>
  );
}

function StreamCard({ post, onApprove, onPin, onRemove }: { post: StreamPost; onApprove: () => void; onPin: () => void; onRemove: () => void }) {
  const meta: Record<StreamPost["kind"], { icon: any; cls: string; tag: string }> = {
    announcement: { icon: Bell, cls: "bg-amber-100 text-amber-700", tag: "Announcement" },
    attachment:   { icon: Paperclip, cls: "bg-violet-100 text-violet-700", tag: "Attachment" },
    link:         { icon: LinkIcon, cls: "bg-sky-100 text-sky-700", tag: "Link" },
  };
  const M = meta[post.kind];
  const Icon = M.icon;
  return (
    <div className={cn("rounded-2xl bg-card border p-5", post.pinned ? "border-coral/40 ring-1 ring-coral/20" : "border-border")}>
      <div className="flex items-start gap-3">
        <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", M.cls)}><Icon className="size-4" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{M.tag}</span>
            {post.pinned && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-coral-soft text-coral">Pinned</span>}
            {post.pendingApproval && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 inline-flex items-center gap-1"><AlertTriangle className="size-3" /> Pending approval</span>}
          </div>
          <div className="mt-1 font-semibold text-ink">{post.title}</div>
          <p className="text-sm text-muted-foreground mt-1">{post.body}</p>
          {post.attachmentName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-semibold">
              <Paperclip className="size-3.5" /> {post.attachmentName}
            </div>
          )}
          {post.linkUrl && (
            <a href={post.linkUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-semibold text-brand-deep hover:bg-brand-soft">
              <ExternalLink className="size-3.5" /> {post.linkUrl}
            </a>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground">{post.at}</div>
            <div className="flex items-center gap-1">
              {post.pendingApproval && (
                <button onClick={onApprove} className="text-xs font-semibold px-3 py-1 rounded-md bg-brand text-white hover:bg-brand/90 inline-flex items-center gap-1">
                  <Check className="size-3" /> Approve & post
                </button>
              )}
              <button onClick={onPin} className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground" title={post.pinned ? "Unpin" : "Pin"}>
                <Pin className={cn("size-3.5", post.pinned && "fill-coral text-coral")} />
              </button>
              <button onClick={onRemove} className="size-7 grid place-items-center rounded-md hover:bg-rose-50 text-rose-600" title="Delete">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposerChip({ icon: Icon, color, label, active, onClick }: any) {
  const c = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[color as "amber" | "violet" | "sky" | "emerald"];
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", c, active && "ring-2 ring-brand")}>
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

/* ---------------- Sessions ---------------- */

type Recurrence = "none" | "daily" | "weekly";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

function SessionsTab({ lesson }: { lesson: TutorLesson }) {
  const initial = useMemo(
    () => PLACEHOLDER_SESSIONS.filter((s) => s.lessonId === lesson.id).slice(0, 6),
    [lesson.id]
  );
  const [sessions, setSessions] = useState(initial);
  const [addOpen, setAddOpen] = useState(false);
  const upcoming = sessions.filter((s) => s.status === "upcoming");

  const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(16, 0, 0, 0); return d; };
  const blankForm = () => {
    const d = tomorrow();
    return {
      date: d as Date | undefined,
      time: "16:00",
      duration: 60,
      recurrence: "none" as Recurrence,
      weekdays: [d.getDay()] as number[],
      endDate: undefined as Date | undefined,
      notes: "",
    };
  };
  const [form, setForm] = useState(blankForm);

  const buildOccurrences = (): Date[] => {
    if (!form.date) return [];
    const [hh, mm] = form.time.split(":").map(Number);
    const start = new Date(form.date);
    start.setHours(hh, mm, 0, 0);
    if (form.recurrence === "none") return [start];

    const horizon = form.endDate ? new Date(form.endDate) : (() => { const d = new Date(start); d.setMonth(d.getMonth() + 3); return d; })();
    horizon.setHours(23, 59, 59, 999);
    const out: Date[] = [];
    const cursor = new Date(start);
    const cap = 60;
    while (cursor <= horizon && out.length < cap) {
      if (form.recurrence === "daily") {
        out.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      } else {
        if (form.weekdays.includes(cursor.getDay())) out.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return out;
  };

  const occurrences = buildOccurrences();

  const createSession = () => {
    if (!form.date) { toast.error("Pick a date"); return; }
    if (form.recurrence === "weekly" && form.weekdays.length === 0) { toast.error("Pick at least one weekday"); return; }
    if (occurrences.length === 0) { toast.error("No occurrences in selected range"); return; }
    const created = occurrences.map((d, i) => ({
      id: `s${Date.now()}-${i}`,
      lessonId: lesson.id,
      student: lesson.title,
      subject: lesson.subject,
      date: d.toISOString(),
      durationMin: Number(form.duration) || 60,
      type: lesson.capacity === 1 ? "1-on-1" : "Group",
      status: "upcoming",
      paymentStatus: "pending",
    } as any));
    setSessions([...sessions, ...created].sort((a, b) => +new Date(a.date) - +new Date(b.date)));
    toast.success(
      created.length === 1
        ? "Session added · students will see it on their calendar"
        : `${created.length} sessions added · students notified`,
    );
    setAddOpen(false);
    setForm(blankForm());
  };

  const toggleWeekday = (i: number) =>
    setForm((f) => ({ ...f, weekdays: f.weekdays.includes(i) ? f.weekdays.filter((x) => x !== i) : [...f.weekdays, i].sort() }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Sessions</h2>
          <p className="text-xs text-muted-foreground">Next {upcoming.length} upcoming · manage attendance and join links.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">
            <Plus className="size-3.5" /> Add Session
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex items-start gap-2">
        <Video className="size-3.5 mt-0.5 shrink-0 text-brand-deep" />
        <span>Meeting links are generated automatically from the video provider connected to your tutor account (Zoom or Google Meet) — no manual setup per session.</span>
      </div>

      {sessions.length === 0 && <EmptyState icon={CalendarIcon} title="No sessions scheduled" body="Add your first session to publish a calendar entry to enrolled students." />}

      <div className="space-y-3">
        {sessions.map((s) => {
          const d = new Date(s.date);
          const future = d > new Date();
          const att = s.attendance;
          const pay = s.paymentStatus ?? "pending";
          return (
            <div key={s.id} className="rounded-2xl bg-card border border-border p-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 md:w-64">
                <div className="text-center bg-brand-soft text-brand-deep rounded-lg px-3 py-1.5 leading-tight">
                  <div className="text-base font-bold">{d.getDate()}</div>
                  <div className="text-[9px] uppercase font-bold tracking-wider">{d.toLocaleString(undefined, { month: "short" })}</div>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {Math.round(s.durationMin / 60 * 10) / 10}hr
                  </div>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 flex-wrap">
                <Pill tone={att === "attended" ? "emerald" : att === "no-show" ? "rose" : "slate"} label={`Attendance: ${att ?? (future ? "—" : "pending")}`} />
                <Pill tone={pay === "paid" ? "emerald" : pay === "overdue" ? "rose" : "amber"} label={`Payment: ${pay}`} />
              </div>
              <div className="flex items-center gap-1.5">
                {future && (
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">
                    <Video className="size-3.5" /> Join
                  </button>
                )}
                <button onClick={() => { setSessions(sessions.filter((x) => x.id !== s.id)); toast.success("Session cancelled"); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-rose-600 hover:bg-rose-50">
                  <X className="size-3.5" /> Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur-sm p-4" onClick={() => setAddOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-background shadow-pop border border-border max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <div className="font-bold text-ink">Add session</div>
                <div className="text-xs text-muted-foreground mt-0.5">{lesson.title}</div>
              </div>
              <button onClick={() => setAddOpen(false)} className="size-8 grid place-items-center rounded-lg hover:bg-muted"><X className="size-4" /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="mt-1 w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:border-ink/30">
                        <span className={cn(!form.date && "text-muted-foreground")}>{form.date ? format(form.date, "EEE, MMM d, yyyy") : "Pick a date"}</span>
                        <CalendarIcon className="size-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={form.date} onSelect={(d) => setForm({ ...form, date: d, weekdays: d ? [d.getDay()] : form.weekdays })} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start time</label>
                  <div className="mt-1 relative">
                    <Clock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand appearance-none">
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration (minutes)</label>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {[30, 45, 60, 90, 120].map((d) => (
                    <button key={d} onClick={() => setForm({ ...form, duration: d })}
                      className={cn("px-3 py-1.5 rounded-lg border text-xs font-semibold", form.duration === d ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                  <Repeat className="size-3.5" /> Recurrence
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(["none", "daily", "weekly"] as Recurrence[]).map((r) => (
                    <button key={r} onClick={() => setForm({ ...form, recurrence: r })}
                      className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize", form.recurrence === r ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                      {r === "none" ? "One-off" : r}
                    </button>
                  ))}
                </div>
              </div>

              {form.recurrence === "weekly" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Repeat on</label>
                  <div className="mt-1 flex gap-1.5 flex-wrap">
                    {WEEKDAYS.map((w, i) => (
                      <button key={w} onClick={() => toggleWeekday(i)}
                        className={cn("size-10 rounded-lg border text-xs font-semibold", form.weekdays.includes(i) ? "bg-brand text-white border-brand" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                        {w[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.recurrence !== "none" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End date <span className="font-normal lowercase text-muted-foreground/70">(optional · default: 3 months)</span></label>
                  <div className="mt-1 flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex-1 inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:border-ink/30">
                          <span className={cn(!form.endDate && "text-muted-foreground")}>{form.endDate ? format(form.endDate, "EEE, MMM d, yyyy") : "No end date"}</span>
                          <CalendarIcon className="size-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={form.endDate} onSelect={(d) => setForm({ ...form, endDate: d })} disabled={(d) => !form.date || d < form.date} initialFocus className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                    {form.endDate && (
                      <button onClick={() => setForm({ ...form, endDate: undefined })} className="size-9 grid place-items-center rounded-lg border border-border hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Topic, prep, anything students should know…" className="mt-1 w-full min-h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>

              {form.recurrence !== "none" && occurrences.length > 0 && (
                <div className="rounded-lg bg-brand-soft/40 border border-brand/30 px-3 py-2 text-xs text-brand-deep">
                  Will create <strong>{occurrences.length}</strong> session{occurrences.length === 1 ? "" : "s"} between{" "}
                  <strong>{format(occurrences[0], "MMM d")}</strong> and <strong>{format(occurrences[occurrences.length - 1], "MMM d, yyyy")}</strong>.
                </div>
              )}

              <div className="rounded-lg bg-muted/40 border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground flex items-start gap-2">
                <Video className="size-3.5 mt-0.5 shrink-0 text-brand-deep" />
                <span>Meeting link is auto-generated from your connected {lesson.videoProvider ?? "Zoom/Meet"} account when each session goes live.</span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border flex justify-end gap-2 shrink-0">
              <button onClick={() => setAddOpen(false)} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={createSession} className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
                {form.recurrence === "none" ? "Add session" : `Add ${occurrences.length} session${occurrences.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Roster ---------------- */

function RosterTab({ lesson, setLesson, isOneOnOne }: { lesson: TutorLesson; setLesson: (l: TutorLesson) => void; isOneOnOne: boolean }) {
  const [copied, setCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState<null | "link" | "user">(null);
  const inviteUrl = `https://itutor.app/c/${lesson.id}`;
  const enrolledCount = lesson.enrollments.filter((e) => (e.status ?? "active") !== "removed").length;
  const atCapacity = !isOneOnOne && enrolledCount >= lesson.capacity;

  const updateMember = (sid: string, patch: Partial<EnrolledStudent>) => {
    setLesson({ ...lesson, enrollments: lesson.enrollments.map((e) => e.studentId === sid ? { ...e, ...patch } : e) });
  };

  const copy = () => { navigator.clipboard?.writeText(inviteUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Roster</h2>
          <p className="text-xs text-muted-foreground">
            {isOneOnOne ? "1:1 — your recurring student." : `${enrolledCount} of ${lesson.capacity} seats filled.`}
          </p>
        </div>
        {!isOneOnOne && (
          <div className="flex items-center gap-2">
            <button disabled={atCapacity} onClick={() => setInviteOpen("link")}
              className={cn("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold", atCapacity ? "border-border text-muted-foreground cursor-not-allowed" : "border-border bg-background hover:bg-muted")}>
              <LinkIcon className="size-3.5" /> Invite by Link
            </button>
            <button disabled={atCapacity} onClick={() => setInviteOpen("user")}
              className={cn("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold", atCapacity ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-brand text-white hover:bg-brand/90")}>
              <UserPlus className="size-3.5" /> Invite by User
            </button>
          </div>
        )}
      </div>

      {atCapacity && (
        <Banner tone="rose" icon={ShieldAlert} title="Class is at capacity"
          body="New invites are paused. Increase max class size in Settings or wait for a member to leave." />
      )}

      {!isOneOnOne && inviteOpen === "link" && (
        <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
          <div className="font-semibold text-ink">Invite link</div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground truncate font-mono flex-1">{inviteUrl}</span>
            <button onClick={copy} className="text-xs font-semibold text-brand-deep hover:underline inline-flex items-center gap-1">
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Anyone with this link can request to join. They'll appear as <strong>Invited</strong> until you approve them.</p>
        </div>
      )}

      {!isOneOnOne && inviteOpen === "user" && (
        <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
          <div className="font-semibold text-ink">Invite by username or email</div>
          <div className="flex items-center gap-2">
            <input placeholder="e.g. aliyah@example.tt" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <button className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> Send invite
            </button>
          </div>
        </div>
      )}

      {lesson.enrollments.length === 0 ? (
        <EmptyState icon={Users} title="No members yet" body="Invite by link or by user to start filling this class." />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-bold px-4 py-2">Member</th>
                <th className="text-left font-bold px-4 py-2">Status</th>
                <th className="text-left font-bold px-4 py-2">Payment</th>
                <th className="text-left font-bold px-4 py-2">Joined</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lesson.enrollments.map((e) => <RosterRow key={e.studentId} e={e} onUpdate={(p) => updateMember(e.studentId, p)} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RosterRow({ e, onUpdate }: { e: EnrolledStudent; onUpdate: (p: Partial<EnrolledStudent>) => void }) {
  const status = e.status ?? "active";
  const sm = MEMBER_STATUS_META[status];
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState<null | "suspend" | "ban" | "remove">(null);
  const overdue = e.paymentStatus === "overdue";

  const confirmCopy = {
    suspend: {
      title: `Suspend ${e.name}?`,
      body: overdue
        ? `${e.name} has TTD ${e.outstandingTtd ?? 0} outstanding. Suspending pauses their access to the stream, sessions, and meeting links until you reactivate them or they settle the balance.`
        : `${e.name} will lose access to the stream, sessions, and meeting links until you reactivate them.`,
      action: "Suspend",
      tone: "amber" as const,
      run: () => { onUpdate({ status: "suspended" }); toast.success(`${e.name} suspended`); },
    },
    ban: {
      title: `Ban ${e.name} from this class?`,
      body: `${e.name} will be permanently removed and blocked from rejoining or requesting access to this class. They'll be notified. This cannot be undone from here.`,
      action: "Ban from class",
      tone: "rose" as const,
      run: () => { onUpdate({ status: "banned" }); toast.success(`${e.name} banned from class`); },
    },
    remove: {
      title: `Remove ${e.name} from this class?`,
      body: `${e.name} will lose access immediately. They can be re-invited later.`,
      action: "Remove",
      tone: "rose" as const,
      run: () => { onUpdate({ status: "removed" }); toast.success(`${e.name} removed`); },
    },
  };
  const c = confirm ? confirmCopy[confirm] : null;

  return (
    <tr className={cn(status === "suspended" && "bg-amber-50/40", status === "banned" && "bg-rose-50/40", status === "removed" && "opacity-60")}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-xs font-bold text-white">
            {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <Link to="/tutor/students/$id" params={{ id: e.studentId }} className="font-semibold text-ink hover:underline">{e.name}</Link>
            {overdue && <div className="text-[11px] text-rose-600 font-semibold">Outstanding TTD {e.outstandingTtd ?? 0}</div>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border", sm.chip)}>{sm.label}</span></td>
      <td className="px-4 py-3"><Pill tone={e.paymentStatus === "paid" ? "emerald" : e.paymentStatus === "overdue" ? "rose" : "amber"} label={e.paymentStatus} /></td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{e.joinedAt ? new Date(e.joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}</td>
      <td className="px-4 py-3 text-right relative">
        <button onClick={() => setMenu(!menu)} className="size-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"><MoreVertical className="size-4" /></button>
        {menu && (
          <div className="absolute right-4 top-10 z-10 w-56 rounded-xl border border-border bg-background shadow-pop p-1 text-left">
            {status !== "suspended" && status !== "banned"
              ? <MenuItem icon={ShieldAlert} label="Suspend" onClick={() => { setMenu(false); setConfirm("suspend"); }} />
              : status === "suspended"
              ? <MenuItem icon={Check} label="Reactivate" onClick={() => { onUpdate({ status: "active" }); toast.success(`${e.name} reactivated`); setMenu(false); }} />
              : null}
            <MenuItem icon={AlertTriangle} label="Send warning" onClick={() => { toast.success("Warning sent"); setMenu(false); }} />
            {status !== "banned" && <MenuItem icon={Ban} destructive label="Ban from class" onClick={() => { setMenu(false); setConfirm("ban"); }} />}
            <MenuItem icon={Trash2} destructive label="Remove from class" onClick={() => { setMenu(false); setConfirm("remove"); }} />
          </div>
        )}
      </td>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          {c && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{c.title}</AlertDialogTitle>
                <AlertDialogDescription>{c.body}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { c.run(); setConfirm(null); }}
                  className={cn(
                    c.tone === "rose" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700",
                    "text-white",
                  )}
                >
                  {c.action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </tr>
  );
}

function MenuItem({ icon: Icon, label, onClick, destructive }: any) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted", destructive && "text-rose-600 hover:bg-rose-50")}>
      <Icon className="size-4" /> {label}
    </button>
  );
}

/* ---------------- Payments ---------------- */

function PaymentsTab({ lesson }: { lesson: TutorLesson }) {
  const grid = useMemo(() => generatePaymentGrid(lesson.enrollments.filter((e) => (e.status ?? "active") !== "removed")), [lesson.enrollments]);
  const collected = lesson.earningsTtd ?? 0;
  const outstanding = lesson.enrollments.reduce((s, e) => s + (e.paymentStatus === "overdue" ? (e.outstandingTtd ?? 0) : 0), 0);
  const members = lesson.enrollments.filter((e) => (e.status ?? "active") !== "removed");
  const cols = PAYMENT_PERIODS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Payments</h2>
          <p className="text-xs text-muted-foreground">Track every member × period in one grid.</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
          <span className="text-emerald-700 font-bold">Collected TTD {collected.toLocaleString()}</span>
          <span className="text-muted-foreground mx-2">vs</span>
          <span className={cn("font-bold", outstanding > 0 ? "text-rose-700" : "text-muted-foreground")}>Outstanding TTD {outstanding.toLocaleString()}</span>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState icon={DollarSign} title="No members to bill" body="Once members join, you'll see a status chip per period here." />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-bold px-4 py-2 sticky left-0 bg-muted/40">Member</th>
                {cols.map((c) => <th key={c} className="text-center font-bold px-3 py-2">{c}</th>)}
                <th className="text-right font-bold px-4 py-2">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.studentId}>
                  <td className="px-4 py-3 sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-[10px] font-bold text-white">
                        {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-semibold text-ink">{m.name}</span>
                    </div>
                  </td>
                  {cols.map((c) => <PaymentCell key={c} status={grid[m.studentId][c] as PaymentCellStatus} />)}
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {m.paymentStatus === "overdue" ? <span className="text-rose-600">TTD {(m.outstandingTtd ?? 0).toLocaleString()}</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
        {(["paid", "due", "overdue", "waived"] as PaymentCellStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={cn("size-3 rounded border", PAYMENT_STATUS_META[s].chip)} /> {PAYMENT_STATUS_META[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentCell({ status }: { status: PaymentCellStatus }) {
  const m = PAYMENT_STATUS_META[status];
  return (
    <td className="px-2 py-2 text-center">
      <span className={cn("inline-block px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider", m.chip)}>{m.label}</span>
    </td>
  );
}

/* ---------------- Settings ---------------- */

const SETTINGS_SECTIONS = [
  { id: "basics",   label: "Basics",             icon: Info },
  { id: "thumb",    label: "Thumbnail",          icon: ImageIcon },
  { id: "billing",  label: "Capacity & billing", icon: DollarSign },
  { id: "access",   label: "Access & policies",  icon: Lock },
  { id: "channels", label: "Communication",      icon: MessageSquare },
  { id: "feedback", label: "Parent feedback",    icon: Mail },
  { id: "danger",   label: "Danger zone",        icon: AlertTriangle },
] as const;

type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]["id"];

function SettingsTab({ lesson: originalLesson, setLesson, isOneOnOne }: { lesson: TutorLesson; setLesson: (l: TutorLesson) => void; isOneOnOne: boolean }) {
  const [draft, setDraft] = useState<TutorLesson>(originalLesson);
  const lastPublicJoinReq = useRef<boolean>(originalLesson.visibility === "public" ? !!originalLesson.joinRequests : false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(originalLesson), [draft, originalLesson]);
  useUnsavedGuard(dirty);
  const lesson = draft;
  const u = <K extends keyof TutorLesson>(k: K, v: TutorLesson[K]) => setDraft({ ...draft, [k]: v });
  const save = () => { setLesson(draft); toast.success("Class settings saved"); };
  const discard = () => { setDraft(originalLesson); toast("Changes discarded"); };
  const [section, setSection] = useState<SettingsSectionId>("basics");
  const tryChangeSection = (id: SettingsSectionId) => {
    if (dirty && !confirm("You have unsaved changes in this section. Discard them and switch?")) return;
    if (dirty) setDraft(originalLesson);
    setSection(id);
  };
  const gradients = [
    "from-orange-500 to-amber-400","from-fuchsia-500 to-purple-500","from-sky-500 to-cyan-400","from-emerald-500 to-teal-400",
    "from-rose-500 to-pink-400","from-indigo-500 to-blue-500","from-yellow-500 to-orange-500","from-slate-600 to-slate-400",
  ];

  return (
    <div className="max-w-5xl">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {SETTINGS_SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            const danger = s.id === "danger";
            return (
              <button key={s.id} onClick={() => tryChangeSection(s.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group",
                  active
                    ? danger
                      ? "bg-rose-50 border border-rose-200 text-rose-700"
                      : "bg-background border border-border text-ink"
                    : danger
                      ? "text-rose-600 hover:bg-rose-50/60"
                      : "text-muted-foreground hover:bg-background")}>
                <Icon className="size-4" />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight className={cn("size-3.5 transition", active && !danger && "text-brand-deep", active && danger && "text-rose-600")} />
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-background border border-border p-6 space-y-6">
          {section === "basics" && (
            <>
              <SettingsHead title="Basics" desc="Core details students see in your class listing." />
              <Field label="Class title">
                <input value={lesson.title} onChange={(e) => u("title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Subject"><input value={lesson.subject} onChange={(e) => u("subject", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
                <Field label="Level"><input value={lesson.level} onChange={(e) => u("level", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
              </div>
              <Field label="Class bio" hint="Long-form description shown on your public listing.">
                <textarea value={lesson.bio ?? ""} onChange={(e) => u("bio", e.target.value)} className="w-full min-h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </Field>
              <Field label="Description (short)" hint="One-liner shown in the marketplace card.">
                <input value={lesson.description} onChange={(e) => u("description", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              </Field>
            </>
          )}

          {section === "thumb" && (
            <>
              <SettingsHead title="Thumbnail" desc="Pick the gradient or upload artwork students will see on the card." />
              <div className={cn("h-24 rounded-xl bg-gradient-to-br grid place-items-center", lesson.thumbnailGradient ?? "from-brand to-emerald-400")}>
                <ImageIcon className="size-8 text-white/80" />
              </div>
              <div className="grid grid-cols-8 gap-2">
                {gradients.map((g) => (
                  <button key={g} onClick={() => u("thumbnailGradient", g)} className={cn("h-8 rounded-md bg-gradient-to-br", g, lesson.thumbnailGradient === g && "ring-2 ring-brand ring-offset-2")} />
                ))}
              </div>
              <button className="inline-flex items-center gap-2 text-xs font-semibold text-brand-deep hover:underline"><ImageIcon className="size-3.5" /> Upload custom image</button>
            </>
          )}

          {section === "billing" && (
            <>
              <SettingsHead title="Capacity & billing" desc="How members are charged and how many seats you offer." />
              {!isOneOnOne && (
                <Field label="Student limit" hint="Set to 1 to convert this into a recurring 1:1.">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => u("capacity", Math.max(1, lesson.capacity - 1))} className="size-9 grid place-items-center rounded-lg border border-border">−</button>
                    <input type="number" value={lesson.capacity} onChange={(e) => u("capacity", Math.max(1, Number(e.target.value)))} className="w-20 text-center px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                    <button onClick={() => u("capacity", lesson.capacity + 1)} className="size-9 grid place-items-center rounded-lg border border-border">+</button>
                  </div>
                </Field>
              )}
              <Field label="Billing model" infoTitle="Billing model" infoBlurb="Per-session: charged after each class. Per-month: a flat monthly fee. Prepaid: students pay upfront for a block of sessions.">
                <div className="grid grid-cols-3 gap-2">
                  {(["per-session", "per-month", "prepaid"] as const).map((b) => (
                    <button key={b} onClick={() => u("billingModel", b)}
                      className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize", lesson.billingModel === b ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                      {b.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (TTD)">
                  <input type="number" value={lesson.rateTtd} onChange={(e) => u("rateTtd", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </Field>
                <Field label="Per-member service fee (TTD)" infoTitle="Service fee" infoBlurb="A small flat fee added to each member's bill — useful to cover materials, platform costs, or admin overhead.">
                  <input type="number" value={lesson.memberServiceFee ?? 0} onChange={(e) => u("memberServiceFee", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </Field>
              </div>
            </>
          )}

          {section === "access" && (
            <>
              <SettingsHead title="Access & policies" desc="Who can join and what happens when payments fall behind." />
              <Field label="Visibility" hint="Public classes appear in the marketplace. Private classes don't, and require approval to join.">
                <div className="grid grid-cols-2 gap-2">
                  {(["public","private"] as const).map((v) => (
                    <button key={v} onClick={() => {
                      if (v === lesson.visibility) return;
                      if (v === "private") {
                        // Remember the last public joinRequests value, then force ON.
                        lastPublicJoinReq.current = !!lesson.joinRequests;
                        setDraft({ ...draft, visibility: "private", joinRequests: true });
                      } else {
                        // Restore last value from when class was public.
                        setDraft({ ...draft, visibility: "public", joinRequests: lastPublicJoinReq.current });
                      }
                    }} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize inline-flex items-center justify-center gap-1.5", lesson.visibility === v ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                      {v === "public" ? <Globe className="size-3.5" /> : <Lock className="size-3.5" />} {v}
                    </button>
                  ))}
                </div>
              </Field>
              <Toggle
                label="Enable join requests"
                hint={lesson.visibility === "private" ? "Private classes always require approval to join." : "Members must request approval before joining."}
                value={!!lesson.joinRequests}
                onChange={(v) => u("joinRequests", v)}
                disabled={lesson.visibility === "private"}
              />
              <Toggle label="Auto-suspend on overdue payment" hint="When a payment goes overdue past the grace window, the member is suspended until they pay." value={!!lesson.autoSuspend} onChange={(v) => u("autoSuspend", v)} />
              {lesson.autoSuspend && (
                <Field label="Grace window (days)" infoTitle="Grace window" infoBlurb="How many days after a missed payment before the member is auto-suspended. Set to 0 to suspend immediately.">
                  <input type="number" value={lesson.graceWindowDays ?? 7} onChange={(e) => u("graceWindowDays", Number(e.target.value))} className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </Field>
              )}
            </>
          )}

          {section === "channels" && (
            <>
              <SettingsHead title="Communication channels" desc="Where members go for class chatter outside of sessions." />
              <Field label="WhatsApp group link">
                <input value={lesson.whatsappLink ?? ""} onChange={(e) => u("whatsappLink", e.target.value)} placeholder="https://chat.whatsapp.com/…" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </Field>
              <Field label="Google Classroom link">
                <input value={lesson.classroomLink ?? ""} onChange={(e) => u("classroomLink", e.target.value)} placeholder="https://classroom.google.com/c/…" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </Field>
              <Field label="Primary channel" infoTitle="Primary channel" infoBlurb="Where members are pointed for class chatter. iTutor native keeps everything in-app; WhatsApp/Classroom hands chat off to your existing group.">
                <div className="grid grid-cols-3 gap-2">
                  {(["native", "whatsapp", "classroom"] as const).map((c) => {
                    const disabled = (c === "whatsapp" && !lesson.whatsappLink?.trim()) || (c === "classroom" && !lesson.classroomLink?.trim());
                    return (
                      <button key={c} disabled={disabled} title={disabled ? "Add a link above to use this channel." : undefined} onClick={() => !disabled && u("primaryChannel", c)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize inline-flex items-center justify-center gap-1.5", lesson.primaryChannel === c ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink", disabled && "opacity-50 cursor-not-allowed hover:text-muted-foreground")}>
                        {c === "whatsapp" ? <MessageSquare className="size-3.5" /> : c === "classroom" ? <Globe className="size-3.5" /> : <Sparkles className="size-3.5" />} {c === "native" ? "iTutor native" : c}
                      </button>
                    );
                  })}
                </div>
                {((lesson.primaryChannel === "whatsapp" && !lesson.whatsappLink?.trim()) || (lesson.primaryChannel === "classroom" && !lesson.classroomLink?.trim())) || (!lesson.whatsappLink?.trim() || !lesson.classroomLink?.trim()) ? (
                  <div className="text-[11px] text-muted-foreground mt-1.5">Add a link above to use that channel.</div>
                ) : null}
              </Field>
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground inline-flex items-start gap-2">
                <Video className="size-3.5 mt-0.5 shrink-0" />
                <span>Sessions use the video provider on your tutor account — meeting links are attached per-session in the <strong className="text-ink">Sessions</strong> tab.</span>
              </div>
            </>
          )}

          {section === "feedback" && (
            <>
              <SettingsHead title="Parent feedback" desc="Optional monthly reports you send to each student's parent." />
              <Field label="Mode" infoTitle="Parent feedback" infoBlurb="A short monthly report you write for each student's parent. AI can optionally polish your wording. Charge for it as a paid add-on or include it free.">
                <div className="grid grid-cols-3 gap-2">
                  {(["off", "included", "paid"] as const).map((m) => (
                    <button key={m} onClick={() => u("parentFeedbackMode", m)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize", lesson.parentFeedbackMode === m ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                      {m === "included" ? "Included free" : m === "paid" ? "Paid add-on" : "Off"}
                    </button>
                  ))}
                </div>
              </Field>
              {lesson.parentFeedbackMode === "paid" && (
                <Field label="Price per period (TTD)" hint="Required before save.">
                  <input type="number" min={0} required value={lesson.parentFeedbackPrice ?? 0} onChange={(e) => u("parentFeedbackPrice", Number(e.target.value))} className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </Field>
              )}
            </>
          )}

          {section === "danger" && (
            <>
              <SettingsHead title="Danger zone" desc="Irreversible actions. Double-check before confirming." tone="danger" />
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 space-y-3">
                <DangerRow icon={ArrowUpRight} label="Transfer ownership" hint="Move this class to another tutor on iTutor." />
                <DangerRow icon={Trash2} label="Delete class" hint="Permanently remove this class and its data." destructive />
              </div>
            </>
          )}
        </div>
      </div>

      <UnsavedBar dirty={dirty} onSave={save} onDiscard={discard} saveLabel="Save class settings" />
    </div>
  );
}

function SettingsHead({ title, desc, tone }: { title: string; desc?: string; tone?: "danger" }) {
  return (
    <div className="pb-4 border-b border-border">
      <div className={cn("text-base font-bold", tone === "danger" ? "text-rose-700" : "text-ink")}>{title}</div>
      {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
    </div>
  );
}

/* ---------------- Analytics ---------------- */

function AnalyticsTab({ lesson }: { lesson: TutorLesson }) {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const enroll = [2, 4, 5, 7, 8, lesson.enrollments.length || 9];
  const revenue = [180, 420, 600, 940, 1180, lesson.earningsTtd ?? 1440];
  const maxE = Math.max(...enroll);
  const maxR = Math.max(...revenue);
  const outstanding = lesson.enrollments.reduce((s, e) => s + (e.paymentStatus === "overdue" ? (e.outstandingTtd ?? 0) : 0), 0);

  const mom = (a: number[]) => {
    const prev = a[a.length - 2] || 1;
    const cur = a[a.length - 1] || 0;
    return Math.round(((cur - prev) / prev) * 100);
  };
  const momE = mom(enroll);
  const momR = mom(revenue);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MomCard label="Enrollment MoM" value={`${momE > 0 ? "+" : ""}${momE}%`} positive={momE >= 0} />
        <MomCard label="Revenue MoM" value={`${momR > 0 ? "+" : ""}${momR}%`} positive={momR >= 0} />
        <MomCard label="Active members" value={String(lesson.enrollments.filter((e) => (e.status ?? "active") === "active").length)} positive />
        <MomCard label="Outstanding (TTD)" value={outstanding.toLocaleString()} positive={outstanding === 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Enrollment by month" caption={`Peak: ${maxE} members`}>
          {enroll.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-brand to-emerald-300" style={{ height: `${(v / maxE) * 100}%` }} />
              <div className="text-[10px] text-muted-foreground">{months[i]}</div>
            </div>
          ))}
        </ChartCard>
        <ChartCard title="Revenue by month (TTD)" caption={`Peak: TTD ${maxR.toLocaleString()}`}>
          {revenue.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-amber-500 to-amber-300" style={{ height: `${(v / maxR) * 100}%` }} />
              <div className="text-[10px] text-muted-foreground">{months[i]}</div>
            </div>
          ))}
        </ChartCard>
      </div>
    </div>
  );
}

function MomCard({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
      <div className={cn("mt-2 text-2xl font-bold flex items-center gap-1", positive ? "text-emerald-700" : "text-rose-700")}>
        {value}
        {positive ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
      </div>
    </div>
  );
}

function ChartCard({ title, caption, children }: any) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink">{title}</h3>
        <span className="text-[11px] text-muted-foreground">{caption}</span>
      </div>
      <div className="mt-6 h-40 flex items-end gap-3">{children}</div>
    </div>
  );
}

/* ---------------- Atoms ---------------- */

function Pill({ tone, label }: { tone: "emerald" | "rose" | "amber" | "slate"; label: string }) {
  const cls = {
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-800",
    slate: "bg-slate-100 text-slate-600",
  }[tone];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", cls)}>{label}</span>;
}

function Banner({ tone, icon: Icon, title, body }: { tone: "rose" | "amber" | "sky"; icon: any; title: string; body: string }) {
  const cls = {
    rose: "border-rose-200 bg-rose-50 text-rose-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
  }[tone];
  return (
    <div className={cn("rounded-xl border px-4 py-3 flex items-start gap-3", cls)}>
      <Icon className="size-4 mt-0.5" />
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs opacity-90">{body}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto size-12 rounded-full bg-muted grid place-items-center text-muted-foreground"><Icon className="size-5" /></div>
      <div className="mt-3 font-semibold text-ink">{title}</div>
      <div className="text-sm text-muted-foreground">{body}</div>
    </div>
  );
}

function SideCard({ title, children }: any) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm py-1.5 border-b border-border last:border-b-0"><span className="text-muted-foreground">{label}</span><span className="text-ink font-semibold capitalize">{value}</span></div>;
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}
function Field({ label, hint, infoTitle, infoBlurb, children }: any) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink inline-flex items-center gap-1.5">
        {label}
        {infoTitle && <InfoPop title={infoTitle} blurb={infoBlurb} />}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5 mb-2">{hint}</div>}
      <div className={cn(!hint && "mt-2")}>{children}</div>
    </div>
  );
}
function InfoPop({ title, blurb }: { title: string; blurb: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button type="button" onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="size-4 grid place-items-center rounded-full text-muted-foreground hover:text-brand-deep" aria-label={`About ${title}`}>
        <Info className="size-3.5" />
      </button>
      {open && (
        <span className="absolute z-20 left-1/2 -translate-x-1/2 top-6 w-56 rounded-lg border border-border bg-background shadow-pop p-3 text-left">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">{title}</span>
          <span className="block text-xs text-muted-foreground mt-1 font-normal normal-case">{blurb}</span>
        </span>
      )}
    </span>
  );
}
function Toggle({ label, hint, value, onChange, disabled }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 rounded-xl border border-border p-4", disabled && "opacity-70")}>
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <button
        type="button"
        disabled={disabled}
        title={disabled ? hint : undefined}
        onClick={() => !disabled && onChange(!value)}
        className={cn("w-11 h-6 rounded-full p-0.5 transition shrink-0", value ? "bg-brand" : "bg-muted", disabled && "cursor-not-allowed")}
      >
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
