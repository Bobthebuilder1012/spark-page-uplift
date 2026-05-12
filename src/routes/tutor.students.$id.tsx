import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PLACEHOLDER_STUDENTS, PLACEHOLDER_LESSONS, PLACEHOLDER_SESSIONS, PLACEHOLDER_TRANSACTIONS, TAG_LIBRARY } from "@/lib/tutor-store";
import { ArrowLeft, MessageSquare, Calendar, Plus, Pin, Star, Phone, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/students/$id")({
  head: () => ({ meta: [{ title: "Student profile — iTutor Tutor" }] }),
  component: StudentDetail,
});

const SECTIONS = ["lessons", "performance", "communication", "payments", "notes"] as const;

function StudentDetail() {
  const { id } = Route.useParams();
  const s = PLACEHOLDER_STUDENTS.find((x) => x.id === id);
  const [section, setSection] = useState<typeof SECTIONS[number]>("lessons");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(s?.notes || []);

  if (!s) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="text-lg font-bold text-ink">Student not found</div>
        <Link to="/tutor/students" className="mt-3 inline-flex text-sm font-semibold text-brand-deep hover:underline">← Back to students</Link>
      </div>
    );
  }

  const enrollments = PLACEHOLDER_LESSONS.filter((l) => s.enrollmentLessonIds.includes(l.id));
  const history = PLACEHOLDER_SESSIONS.filter((x) => x.studentId === s.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const txns = PLACEHOLDER_TRANSACTIONS.filter((t) => t.studentId === s.id);

  return (
    <div className="max-w-6xl space-y-6">
      <Link to="/tutor/students" className="text-sm text-muted-foreground hover:text-ink inline-flex items-center gap-1"><ArrowLeft className="size-4" /> Back to students</Link>

      {/* Header */}
      <header className="rounded-2xl border border-border bg-card p-6 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="size-16 lg:size-20 rounded-full bg-coral-soft text-coral grid place-items-center text-2xl font-bold shrink-0">{s.initials}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-ink">{s.name}</h1>
          <div className="text-sm text-muted-foreground mt-0.5">{s.level} · {s.primarySubjects.join(" · ")}</div>
          {s.parentName && <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5"><Phone className="size-3" /> Parent: {s.parentName} ({s.parentPhone})</div>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.tagIds.map((tid) => { const t = TAG_LIBRARY.find((x) => x.id === tid); return t && <span key={tid} className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", t.color)}>{t.label}</span>; })}
            <button className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-ink hover:text-white">+ Tag</button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><MessageSquare className="size-4" /> Message</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><Calendar className="size-4" /> Schedule</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Plus className="size-4" /> Add note</button>
        </div>
      </header>

      {/* Outstanding banner */}
      {s.outstandingTtd > 0 && (
        <div className="rounded-xl bg-coral-soft border border-coral/30 p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-coral" />
          <div className="flex-1">
            <div className="font-semibold text-ink">Outstanding balance: <span className="text-coral">TTD {s.outstandingTtd}</span></div>
            <div className="text-xs text-muted-foreground">Send a payment reminder.</div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-coral text-white text-sm font-semibold hover:opacity-90">Send reminder</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Sessions w/ you" value={s.totalSessions} />
        <KPI label="Revenue" value={`TTD ${s.revenueTtd.toLocaleString()}`} />
        <KPI label="Pay reliability" value={`${s.paymentReliability}%`} />
        <KPI label="Last session" value={new Date(s.lastSessionAt).toLocaleDateString()} />
      </div>

      {/* Section tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map((t) => (
            <button key={t} onClick={() => setSection(t)}
              className={cn("px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition", section === t ? "border-brand text-ink" : "border-transparent text-muted-foreground hover:text-ink")}>{t}</button>
          ))}
        </div>
      </div>

      {section === "lessons" && (
        <div className="space-y-5">
          <Section title="Active enrollments">
            {enrollments.length === 0 ? <Empty msg="No active enrollments." /> : (
              <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                {enrollments.map((l) => (
                  <div key={l.id} className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink truncate">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.subject} · {l.recurrenceRule || "One-off"}</div>
                    </div>
                    <span className="text-xs font-semibold text-brand-deep">Next: {new Date(l.startDate).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
          <Section title="Lesson history">
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {history.length === 0 && <Empty msg="No past sessions yet." />}
              {history.map((h) => (
                <div key={h.id} className="p-4 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-brand/10 text-brand-deep grid place-items-center text-center text-xs font-bold tabular-nums leading-tight">
                    <div>{new Date(h.date).toLocaleString(undefined, { month: "short" })}<br/>{new Date(h.date).getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink text-sm truncate">{h.subject}</div>
                    <div className="text-xs text-muted-foreground">{h.durationMin} min · {h.type} · {h.attendance ?? "—"}</div>
                  </div>
                  {h.paymentStatus && <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", h.paymentStatus === "paid" ? "bg-brand-soft text-brand-deep" : h.paymentStatus === "overdue" ? "bg-coral-soft text-coral" : "bg-peach text-ink")}>{h.paymentStatus}</span>}
                </div>
              ))}
            </div>
          </Section>
          <Section title="Most recent review">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-1 text-amber-500"><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /></div>
              <p className="mt-2 text-sm text-ink italic">"Patient and explains everything clearly. My grades have improved a lot."</p>
              <div className="mt-2 text-xs text-muted-foreground">{s.name} · {new Date(s.lastSessionAt).toLocaleDateString()}</div>
            </div>
          </Section>
        </div>
      )}

      {section === "performance" && (
        <div className="space-y-5">
          <Section title="Custom metrics">
            <div className="grid sm:grid-cols-2 gap-3">
              {s.performance.map((p, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{p.metric}</div>
                  <div className="mt-2 flex items-end justify-between"><div className="text-2xl font-bold text-ink tabular-nums">{p.value}<span className="text-base text-muted-foreground">/{p.max}</span></div></div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-brand" style={{ width: `${(p.value / p.max) * 100}%` }} /></div>
                </div>
              ))}
              <button className="rounded-2xl border-2 border-dashed border-border bg-card p-4 text-sm font-semibold text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add metric</button>
            </div>
          </Section>
          <Section title="Progress over time">
            <div className="rounded-2xl border border-border bg-card p-5">
              {s.performanceHistory.length === 0 ? <Empty msg="No data yet — add a score from a past session." /> : (
                <MiniChart data={s.performanceHistory} />
              )}
            </div>
          </Section>
        </div>
      )}

      {section === "communication" && (
        <Section title="Communication log">
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {[
              { type: "Message", at: "Today, 2:14 PM", text: "Sent practice problems for Friday's session." },
              { type: "WhatsApp", at: "Yesterday", text: "Confirmed mum's preferred contact channel." },
              { type: "Email", at: "Last week", text: "Forwarded past paper PDF." },
            ].map((c, i) => (
              <div key={i} className="p-4 flex gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky text-ink h-fit">{c.type}</span>
                <div className="flex-1"><div className="text-sm text-ink">{c.text}</div><div className="text-xs text-muted-foreground mt-0.5">{c.at}</div></div>
              </div>
            ))}
          </div>
          <button className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><Plus className="size-4" /> Log contact</button>
        </Section>
      )}

      {section === "payments" && (
        <Section title="Transactions">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
                <tr><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Lesson</th><th className="text-right px-4 py-3">Amount</th><th className="text-right px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {txns.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-ink">{t.lessonName}{t.sessionNumber ? ` · #${t.sessionNumber}` : ""}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">TTD {t.grossTtd}</td>
                    <td className="px-4 py-3 text-right"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", t.status === "paid" ? "bg-brand-soft text-brand-deep" : t.status === "refunded" ? "bg-sky text-ink" : "bg-coral-soft text-coral")}>{t.status}</span></td>
                  </tr>
                ))}
                {txns.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No transactions yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {section === "notes" && (
        <Section title="Private notes">
          <div className="rounded-2xl border border-border bg-card p-4">
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a private note about this student…"
              className="w-full min-h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <div className="mt-2 flex justify-end">
              <button onClick={() => { if (newNote) { setNotes([{ id: String(Date.now()), at: new Date().toISOString(), text: newNote }, ...notes]); setNewNote(""); } }}
                className="px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Save note</button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {notes.length === 0 && <Empty msg="No notes yet." />}
            {notes.map((n) => (
              <div key={n.id} className={cn("rounded-2xl border p-4", n.pinned ? "border-brand bg-brand-soft/30" : "border-border bg-card")}>
                <div className="flex items-center gap-2 mb-1">
                  {n.pinned && <Pin className="size-3.5 text-brand-deep" />}
                  <span className="text-xs text-muted-foreground">{new Date(n.at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-ink">{n.text}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: any }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 text-xl font-bold text-ink tabular-nums">{value}</div></div>;
}
function Section({ title, children }: { title: string; children: any }) {
  return <section><h2 className="text-sm font-semibold text-ink mb-3">{title}</h2>{children}</section>;
}
function Empty({ msg }: { msg: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{msg}</div>; }

function MiniChart({ data }: { data: { date: string; score: number }[] }) {
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));
  const w = 600, h = 120, pad = 20;
  const xs = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(1, data.length - 1);
  const ys = (v: number) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - 2 * pad);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(d.score)}`).join(" ");
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="size-3.5 text-brand-deep" /> Score trend</div>
        <div className="text-xs text-muted-foreground">{data[0].date} → {data[data.length - 1].date}</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
        <path d={path} fill="none" stroke="oklch(0.55 0.16 150)" strokeWidth="2" />
        {data.map((d, i) => <circle key={i} cx={xs(i)} cy={ys(d.score)} r="3" fill="oklch(0.55 0.16 150)" />)}
      </svg>
    </div>
  );
}
