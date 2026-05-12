import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTutor, PLACEHOLDER_LESSONS, LESSON_KIND_META, type LessonKind, type LessonStatus, type TutorLesson } from "@/lib/tutor-store";
import { Plus, Lock, Users, Repeat, Pencil, Trash2, X, Search, Calendar, FileText, DollarSign, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/lessons")({
  head: () => ({ meta: [{ title: "Lessons — iTutor Tutor" }] }),
  component: LessonsPage,
});

const KINDS: ("all" | LessonKind)[] = ["all", "1on1-oneoff", "1on1-recurring", "group-oneoff", "group-recurring"];
const STATUSES: ("all" | LessonStatus)[] = ["all", "draft", "published", "full", "completed", "cancelled"];

function LessonsPage() {
  const { completion } = useTutor();
  const [kind, setKind] = useState<typeof KINDS[number]>("all");
  const [status, setStatus] = useState<typeof STATUSES[number]>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<TutorLesson | null>(null);

  const filtered = useMemo(() => PLACEHOLDER_LESSONS.filter((l) =>
    (kind === "all" || l.kind === kind) &&
    (status === "all" || l.status === status) &&
    (search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase()))
  ), [kind, status, search]);

  if (!completion.listed) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground"><Lock className="size-6" /></div>
        <h1 className="mt-4 text-xl font-bold text-ink">Lessons are locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete your tutor profile to create and manage lessons.</p>
        <Link to="/tutor/get-listed" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">Complete profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Lessons</h1>
          <p className="text-sm text-muted-foreground mt-1">All lessons you offer · 1:1, group, one-off and recurring.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
          <Plus className="size-4" /> New lesson
        </button>
      </header>

      {/* Type counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["1on1-oneoff", "1on1-recurring", "group-oneoff", "group-recurring"] as LessonKind[]).map((k) => {
          const count = PLACEHOLDER_LESSONS.filter((l) => l.kind === k).length;
          const m = LESSON_KIND_META[k];
          return (
            <button key={k} onClick={() => setKind(k)}
              className={cn("text-left rounded-2xl border p-4 hover:border-brand transition", kind === k ? "border-brand bg-brand-soft/40" : "border-border bg-card")}>
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", m.dot)} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-ink tabular-nums">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or subject"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          <option value="all">All types</option>
          {(["1on1-oneoff", "1on1-recurring", "group-oneoff", "group-recurring"] as LessonKind[]).map((k) => (<option key={k} value={k}>{LESSON_KIND_META[k].label}</option>))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          {STATUSES.map((s) => (<option key={s} value={s}>{s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
        </select>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Lesson</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Schedule</th>
              <th className="text-left px-4 py-3 font-semibold">Enrolment</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Rate</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((l) => {
              const m = LESSON_KIND_META[l.kind];
              return (
                <tr key={l.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setOpen(l)}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{l.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l.subject} · {l.level}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m.chip)}>
                      {l.kind.startsWith("group") ? <Users className="size-3" /> : null}
                      {l.kind.includes("recurring") && <Repeat className="size-3" />}
                      {m.short}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {l.recurrenceRule || new Date(l.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}<br/>
                    <span className="text-[11px]">{l.durationMin} min</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-ink"><Users className="size-3.5 text-muted-foreground" /> {l.enrollments.length} / {l.capacity}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-semibold text-ink">TTD {l.rateTtd}<span className="text-xs text-muted-foreground font-normal"> /{l.pricingMode === "per-student" ? "student" : l.pricingMode === "per-block" ? "block" : "session"}</span></td>
                  <td className="px-4 py-3"><StatusChip status={l.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground inline-flex"><Pencil className="size-4" /></button>
                    <button className="size-8 grid place-items-center rounded-lg hover:bg-coral-soft text-coral inline-flex"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No lessons match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && <LessonDetailDrawer lesson={open} onClose={() => setOpen(null)} />}
      {/* TODO(cursor): wire CRUD + recurrence (RRULE) + materials uploads + per-student payment ops to backend. */}
    </div>
  );
}

function StatusChip({ status }: { status: LessonStatus }) {
  const cls: Record<LessonStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-brand-soft text-brand-deep",
    full: "bg-peach text-ink",
    completed: "bg-sky text-ink",
    cancelled: "bg-coral-soft text-coral",
  };
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", cls[status])}>{status}</span>;
}

function LessonDetailDrawer({ lesson, onClose }: { lesson: TutorLesson; onClose: () => void }) {
  const m = LESSON_KIND_META[lesson.kind];
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-ink/40 backdrop-blur-sm" />
      <aside className="w-full max-w-xl bg-background h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m.chip)}>{m.label}</span>
            <h2 className="mt-2 text-xl font-bold text-ink">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{lesson.subject} · {lesson.level}</p>
          </div>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Calendar} label="Schedule" value={lesson.recurrenceRule || new Date(lesson.startDate).toLocaleString()} />
            <Stat icon={Users} label="Enrolment" value={`${lesson.enrollments.length} / ${lesson.capacity}`} />
            <Stat icon={DollarSign} label="Pricing" value={`TTD ${lesson.rateTtd} · ${lesson.pricingMode}`} />
            <Stat icon={FileText} label="Materials" value={`${lesson.materialsCount} files`} />
          </div>

          <section>
            <h3 className="text-sm font-semibold text-ink mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{lesson.description}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-ink mb-2">Enrolled students ({lesson.enrollments.length})</h3>
            <ul className="rounded-xl border border-border divide-y divide-border">
              {lesson.enrollments.length === 0 && <li className="p-4 text-sm text-muted-foreground text-center">No students yet.</li>}
              {lesson.enrollments.map((e) => (
                <li key={e.studentId} className="px-3 py-2.5 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-coral-soft text-coral grid place-items-center text-xs font-bold">{e.name.split(" ").map((n) => n[0]).join("")}</div>
                  <Link to="/tutor/students/$id" params={{ id: e.studentId }} className="flex-1 text-sm font-semibold text-ink hover:underline">{e.name}</Link>
                  <PaymentChip status={e.paymentStatus} />
                  <ChevronRight className="size-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-ink mb-2">Lesson notes</h3>
            <textarea defaultValue={lesson.notes} placeholder="Private notes for this lesson…"
              className="w-full min-h-24 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
          </section>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 px-4 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Save changes</button>
            <button className="px-4 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Duplicate</button>
            <button className="px-4 py-2.5 rounded-lg text-coral border border-coral-soft hover:bg-coral-soft text-sm font-semibold">Cancel lesson</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="size-3.5" /> {label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function PaymentChip({ status }: { status: "paid" | "pending" | "overdue" }) {
  const cls = { paid: "bg-brand-soft text-brand-deep", pending: "bg-peach text-ink", overdue: "bg-coral-soft text-coral" }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", cls)}>{status}</span>;
}
