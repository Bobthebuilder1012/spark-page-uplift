import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import {
  ArrowLeft, Calendar, Clock, FileText, AlertCircle, Check, X, ChevronRight,
  GraduationCap, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { findChild, type ChildEnrollment, type FeedbackReport } from "@/lib/parent-store";

const searchSchema = z.object({
  tab: fallback(z.enum(["classes", "feedback"]), "classes").default("classes"),
  report: fallback(z.string(), "").default(""),
  state: fallback(z.enum(["live", "empty-feedback"]), "live").default("live"),
});

export const Route = createFileRoute("/parent/children/$childId")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Child details — iTutor Parent" }] }),
  component: ChildPage,
  notFoundComponent: () => (
    <div className="text-center py-16">
      <h1 className="text-xl font-bold text-ink">Child not found</h1>
      <Link to="/parent" className="mt-3 inline-block text-brand-deep font-semibold">← Back to dashboard</Link>
    </div>
  ),
});

function ChildPage() {
  const { childId } = Route.useParams();
  const { tab, report, state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const child = findChild(childId);
  if (!child) throw notFound();

  const [confirmUnenroll, setConfirmUnenroll] = useState<ChildEnrollment | null>(null);
  const feedback = state === "empty-feedback" ? [] : child.feedback;
  const openReport = report ? feedback.find((r) => r.id === report) : undefined;

  return (
    <div className="space-y-6">
      <Link to="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All children
      </Link>

      {/* Child header */}
      <header className="rounded-2xl bg-background border border-border p-5 flex items-center gap-4">
        <div className="size-16 rounded-full grid place-items-center font-bold text-ink shrink-0 text-lg"
          style={{ background: `oklch(0.85 0.1 ${child.hue})` }}>
          {child.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-ink">{child.name}</h1>
          <div className="text-sm text-muted-foreground">{child.ageLabel}{child.school ? ` · ${child.school}` : ""}</div>
        </div>
      </header>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-muted">
        {(["classes", "feedback"] as const).map((t) => (
          <button key={t} onClick={() => navigate({ search: (p) => ({ ...p, tab: t, report: "" }) })}
            className={cn("inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold capitalize transition",
              tab === t ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
            {t === "classes" ? <GraduationCap className="size-4" /> : <FileText className="size-4" />}
            {t === "classes" ? "Classes" : "Feedback"}
          </button>
        ))}
      </div>

      {tab === "classes" ? (
        <ClassesTab enrollments={child.enrollments} onUnenroll={setConfirmUnenroll} />
      ) : (
        <FeedbackTab feedback={feedback} state={state} onSwitchState={(s) => navigate({ search: (p) => ({ ...p, state: s }) })}
          onOpenReport={(id) => navigate({ search: (p) => ({ ...p, report: id }) })} />
      )}

      {/* Report viewer modal */}
      {openReport && <ReportViewer report={openReport} onClose={() => navigate({ search: (p) => ({ ...p, report: "" }) })} />}

      {/* Unenroll confirm */}
      {confirmUnenroll && (
        <UnenrollConfirm e={confirmUnenroll} onCancel={() => setConfirmUnenroll(null)} onConfirm={() => setConfirmUnenroll(null)} />
      )}
    </div>
  );
}

/* ---------------- Classes tab ---------------- */

function ClassesTab({ enrollments, onUnenroll }: { enrollments: ChildEnrollment[]; onUnenroll: (e: ChildEnrollment) => void }) {
  if (enrollments.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
        <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
          <BookOpen className="size-5" />
        </div>
        <h2 className="font-bold text-ink">No classes enrolled yet</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Browse classes and enroll your child to get started.</p>
        <Link to="/student/classes" className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
          Browse classes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {enrollments.map((e) => <EnrollmentCard key={e.classId} e={e} onUnenroll={() => onUnenroll(e)} />)}
    </div>
  );
}

function EnrollmentCard({ e, onUnenroll }: { e: ChildEnrollment; onUnenroll: () => void }) {
  return (
    <article className="rounded-2xl bg-background border border-border p-5">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl bg-muted grid place-items-center text-2xl shrink-0">{e.classEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-ink truncate">{e.classTitle}</h3>
            <StatusPill status={e.status} />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">{e.subject} · {e.level} · by {e.tutorName}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Field icon={<Calendar className="size-3.5" />} label="Schedule" value={e.schedule} />
        <Field icon={<Clock className="size-3.5" />} label="Next session" value={e.nextSession || "—"} />
        <Field icon={<Check className="size-3.5" />} label="Enrolled" value={e.enrolledSince} />
        <Field icon={<FileText className="size-3.5" />} label="Paid through" value={e.paidThrough || "—"} />
      </div>

      <footer className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-sm">
          <span className="font-bold text-ink">TT${e.price}</span>
          <span className="text-xs text-muted-foreground"> /{e.billing === "per-month" ? "month" : e.billing === "per-session" ? "session" : "term"}</span>
        </div>
        {e.status === "active" ? (
          <button onClick={onUnenroll} className="text-xs font-semibold text-rose-700 hover:underline">Unenroll</button>
        ) : e.status === "awaiting-approval" ? (
          <span className="text-xs text-muted-foreground italic">Waiting on tutor</span>
        ) : (
          <span className="text-xs text-muted-foreground italic">No action available</span>
        )}
      </footer>
    </article>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground inline-flex items-center gap-1">{icon} {label}</div>
      <div className="text-sm text-ink mt-0.5">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: ChildEnrollment["status"] }) {
  const m = {
    "active":             { label: "Active",            cls: "bg-brand-soft text-brand-deep" },
    "awaiting-consent":   { label: "Awaiting consent",  cls: "bg-amber-100 text-amber-800" },
    "awaiting-approval":  { label: "Awaiting approval", cls: "bg-sky-100 text-sky-800" },
    "cancelled":          { label: "Ended",             cls: "bg-muted text-muted-foreground" },
  }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap", m.cls)}>{m.label}</span>;
}

/* ---------------- Feedback tab ---------------- */

function FeedbackTab({ feedback, state, onSwitchState, onOpenReport }:
  { feedback: FeedbackReport[]; state: "live" | "empty-feedback"; onSwitchState: (s: "live" | "empty-feedback") => void; onOpenReport: (id: string) => void }) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Monthly reports written by each tutor, newest first.</p>
        <div className="inline-flex p-1 rounded-xl bg-muted text-xs">
          {(["live", "empty-feedback"] as const).map((s) => (
            <button key={s} onClick={() => onSwitchState(s)}
              className={cn("px-2.5 py-1 rounded-lg font-semibold", state === s ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
              {s === "live" ? "Live" : "Empty"}
            </button>
          ))}
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
          <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
            <FileText className="size-5" />
          </div>
          <h2 className="font-bold text-ink">No reports yet</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Tutors send a monthly report after each full month of enrollment. The next report will appear here.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {feedback.map((r) => (
            <li key={r.id}>
              <button onClick={() => onOpenReport(r.id)}
                className="w-full text-left rounded-2xl bg-background border border-border p-4 hover:border-brand-deep/40 transition flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand-soft text-brand-deep grid place-items-center shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-ink truncate">{r.month} report · {r.classTitle}</h3>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">by {r.tutorName} · Attendance {r.stats.attendance} · {r.stats.sessionsAttended}/{r.stats.sessionsScheduled} sessions</div>
                </div>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ReportViewer({ report, onClose }: { report: FeedbackReport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Monthly report</div>
            <div className="font-bold text-ink">{report.month} · {report.classTitle}</div>
          </div>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
        </header>

        <div className="p-6 space-y-5">
          <div className="text-sm text-muted-foreground">From <span className="font-semibold text-ink">{report.tutorName}</span></div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Attendance" value={report.stats.attendance} />
            <StatBox label="Sessions" value={`${report.stats.sessionsAttended}/${report.stats.sessionsScheduled}`} />
            <StatBox label="Enrolled" value={report.stats.enrollmentLength} />
          </div>

          {/* Body */}
          <article className="prose prose-sm max-w-none">
            <p className="text-[15px] leading-relaxed text-ink whitespace-pre-wrap">{report.body}</p>
          </article>

          <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
            Delivered {new Date(report.deliveredAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 border border-border p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
      <div className="text-base font-bold text-ink mt-1">{value}</div>
    </div>
  );
}

/* ---------------- Unenroll confirm ---------------- */

function UnenrollConfirm({ e, onCancel, onConfirm }: { e: ChildEnrollment; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-700 grid place-items-center shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-ink">Unenroll from {e.classTitle}?</h2>
              <p className="text-sm text-muted-foreground mt-1">We'll stop the auto-renewal at the end of your paid period.</p>
            </div>
          </div>

          <div className="rounded-xl bg-mint p-4 text-sm text-ink/80 space-y-2">
            <div className="flex items-start gap-2">
              <Check className="size-4 text-brand-deep mt-0.5 shrink-0" />
              <span>Your child keeps full access until <span className="font-bold">{e.paidThrough || "the end of the current period"}</span>.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="size-4 text-brand-deep mt-0.5 shrink-0" />
              <span>No further charges will be made. We never charge for cancellation.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="size-4 text-brand-deep mt-0.5 shrink-0" />
              <span>You can rejoin at any time, subject to availability.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onCancel} className="px-4 py-3 rounded-2xl border border-border bg-background text-ink font-semibold text-sm">Keep enrolled</button>
            <button onClick={onConfirm} className="px-4 py-3 rounded-2xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700">Confirm unenroll</button>
          </div>
        </div>
      </div>
    </div>
  );
}
