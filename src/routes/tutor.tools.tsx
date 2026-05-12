import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Plus, Search, FileText, Upload, X, ChevronRight, ClipboardList, Wand2, BookOpen, CheckCircle2, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/tools")({
  head: () => ({ meta: [{ title: "iTutor AI — Tutor Tools" }] }),
  component: ToolsPage,
});

type Session = {
  id: string;
  name: string;
  subject: string;
  total: number;
  studentsCount: number;
  graded: boolean;
  avgScore?: number;
  passRate?: number;
  createdAt: string;
};

const SESSIONS: Session[] = [
  { id: "g1", name: "CSEC Maths · Trial Test 2", subject: "Mathematics", total: 50, studentsCount: 12, graded: true, avgScore: 38, passRate: 75, createdAt: "May 8, 2026" },
  { id: "g2", name: "Spanish · Chapter 3 Quiz", subject: "Spanish", total: 30, studentsCount: 8, graded: true, avgScore: 22, passRate: 88, createdAt: "May 4, 2026" },
  { id: "g3", name: "Physics · Mock SBA", subject: "Physics", total: 100, studentsCount: 6, graded: false, createdAt: "Today" },
];

const TOOLS = [
  { id: "marking", name: "Paper marking", desc: "Upload an answer key + student papers, get auto-graded scores.", icon: ClipboardList, primary: true, badge: "Most used" },
  { id: "lesson", name: "Lesson plan generator", desc: "Build structured lesson outlines from a topic.", icon: BookOpen },
  { id: "questions", name: "Question generator", desc: "Generate practice questions by syllabus topic.", icon: Wand2 },
  { id: "insights", name: "Student progress insights", desc: "Summarise a student's progress from past sessions.", icon: Sparkles },
];

function ToolsPage() {
  const [view, setView] = useState<"home" | "marking" | "new-session">("home");

  if (view === "marking") return <MarkingHome onBack={() => setView("home")} onNew={() => setView("new-session")} />;
  if (view === "new-session") return <NewGradingSession onBack={() => setView("marking")} />;
  return <ToolsHome onOpen={(id) => id === "marking" && setView("marking")} />;
}

function CreditMeter() {
  const used = 142;
  const total = 500;
  const pct = (used / total) * 100;
  const [showTopup, setShowTopup] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Coins className="size-4 text-brand-deep" />
        <span className="text-sm font-semibold text-ink">iTutor AI credits</span>
        <span className="ml-auto text-xs font-bold tabular-nums text-ink">{total - used} <span className="text-muted-foreground font-normal">of {total} left</span></span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Resets June 1</span>
        <button onClick={() => setShowTopup(true)} className="font-semibold text-brand-deep hover:underline">Top up</button>
      </div>
      {showTopup && <TopupModal onClose={() => setShowTopup(false)} />}
      {/* TODO(cursor): wire to real usage/billing system. */}
    </div>
  );
}

function TopupModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState("500");
  const PACKS = [
    { id: "250", credits: 250, price: 50, label: "Starter" },
    { id: "500", credits: 500, price: 90, label: "Standard", badge: "Most popular" },
    { id: "1500", credits: 1500, price: 240, label: "Pro" },
    { id: "5000", credits: 5000, price: 700, label: "School" },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-background border border-border shadow-pop p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><Coins className="size-5 text-brand-deep" /><h2 className="text-lg font-bold text-ink">Top up credits</h2></div>
            <p className="text-xs text-muted-foreground mt-1">Credits are used to grade papers and run AI tools. They don't expire.</p>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {PACKS.map((p) => {
            const active = selected === p.id;
            return (
              <button key={p.id} onClick={() => setSelected(p.id)}
                className={cn("relative text-left rounded-xl border-2 p-3 transition", active ? "border-brand bg-brand-soft/40" : "border-border bg-card hover:border-brand/40")}>
                {p.badge && <span className="absolute -top-2 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand text-white">{p.badge}</span>}
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{p.label}</div>
                <div className="mt-1 font-bold text-ink text-xl tabular-nums">{p.credits.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">credits</span></div>
                <div className="mt-1 text-sm font-semibold text-brand-deep">TTD ${p.price}</div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">Charged to your default payment method.</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep">Confirm purchase</button>
          </div>
        </div>
        {/* TODO(cursor): wire to billing/Stripe. */}
      </div>
    </div>
  );
}

function ToolsHome({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-brand-deep" />
            <h1 className="text-2xl lg:text-3xl font-bold text-ink">iTutor AI</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">AI tools built for tutors — paper marking, lesson plans and more.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => onOpen(t.id)}
              className={cn("text-left rounded-2xl border bg-card p-5 hover:border-brand hover:shadow-card transition relative",
                t.primary ? "border-brand" : "border-border")}>
              {t.badge && <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand text-white">{t.badge}</span>}
              <div className={cn("size-10 rounded-xl grid place-items-center", t.primary ? "bg-brand text-white" : "bg-brand/10 text-brand-deep")}><t.icon className="size-5" /></div>
              <h2 className="mt-3 font-semibold text-ink">{t.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep">Open <ChevronRight className="size-3" /></div>
            </button>
          ))}
        </div>
        <CreditMeter />
      </div>
    </div>
  );
}

function MarkingHome({ onBack, onNew }: { onBack: () => void; onNew: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = SESSIONS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const totalGraded = SESSIONS.reduce((a, s) => a + (s.graded ? s.studentsCount : 0), 0);
  const avgScore = Math.round(SESSIONS.filter((s) => s.graded).reduce((a, s) => a + (s.avgScore! / s.total) * 100, 0) / Math.max(1, SESSIONS.filter((s) => s.graded).length));
  const avgPass = Math.round(SESSIONS.filter((s) => s.graded).reduce((a, s) => a + s.passRate!, 0) / Math.max(1, SESSIONS.filter((s) => s.graded).length));

  return (
    <div className="max-w-6xl space-y-6">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-ink inline-flex items-center gap-1">← Back to iTutor AI</button>
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><Sparkles className="size-5 text-brand-deep" /><h1 className="text-2xl lg:text-3xl font-bold text-ink">Paper marking</h1></div>
          <p className="text-sm text-muted-foreground mt-1">AI-powered test paper marking</p>
        </div>
        <button onClick={onNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
          <Plus className="size-4" /> New grading session
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Total sessions" value={SESSIONS.length} />
        <Stat label="Papers graded" value={totalGraded} />
        <Stat label="Avg class score" value={`${avgScore}%`} />
        <Stat label="Avg pass rate" value={`${avgPass}%`} />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sessions…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <select className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          <option>All sessions</option><option>Graded</option><option>Pending</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground"><FileText className="size-6 mx-auto text-muted-foreground/50" /><div className="mt-2">No grading sessions yet</div></div>}
        {filtered.map((s) => (
          <div key={s.id} className="p-4 flex items-center gap-4 hover:bg-muted/40 cursor-pointer">
            <div className="size-10 rounded-xl bg-brand/10 text-brand-deep grid place-items-center"><FileText className="size-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.subject} · {s.studentsCount} students · {s.createdAt}</div>
            </div>
            {s.graded ? (
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Avg</div>
                  <div className="font-bold text-ink tabular-nums">{Math.round((s.avgScore! / s.total) * 100)}%</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-muted-foreground">Pass</div>
                  <div className="font-bold text-brand-deep tabular-nums">{s.passRate}%</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand-soft text-brand-deep"><CheckCircle2 className="size-3" /> Graded</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-peach text-ink">In progress</span>
            )}
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewGradingSession({ onBack }: { onBack: () => void }) {
  const [marks, setMarks] = useState(30);
  const [students, setStudents] = useState([{ name: "" }, { name: "" }, { name: "" }]);

  return (
    <div className="max-w-6xl space-y-6">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-ink inline-flex items-center gap-1">← Back to sessions</button>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <input placeholder="Session name e.g. Spanish — Chapter 3 Quiz"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-base focus:outline-none focus:ring-2 focus:ring-brand" />

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2"><FileText className="size-4 text-brand-deep" /><div><div className="font-semibold text-ink">Marks available</div><div className="text-xs text-muted-foreground">How many marks is this test out of?</div></div></div>
            <div className="mt-4 flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl border-2 border-brand bg-brand-soft text-brand-deep text-2xl font-bold tabular-nums min-w-[120px] text-center">— / {marks}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[20, 30, 50, 100].map((m) => (
                <button key={m} onClick={() => setMarks(m)}
                  className={cn("px-3 py-1.5 rounded-full text-sm font-semibold border", m === marks ? "bg-brand text-white border-brand" : "bg-card text-ink border-border hover:border-brand")}>{m}</button>
              ))}
              <div className="inline-flex items-center gap-2 ml-2 text-sm">
                <span className="text-muted-foreground">Custom:</span>
                <input type="number" placeholder="Enter total" onChange={(e) => setMarks(Number(e.target.value) || marks)}
                  className="w-28 px-2 py-1 rounded-lg border border-border bg-background text-sm" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><Upload className="size-4 text-brand-deep" /><div className="font-semibold text-ink">Answer key</div></div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-coral-soft text-coral">Required</span>
            </div>
            <div className="mt-4 rounded-xl border-2 border-dashed border-coral/40 bg-coral-soft/30 p-8 text-center cursor-pointer hover:border-coral transition">
              <Upload className="size-6 mx-auto text-coral" />
              <div className="mt-2 font-semibold text-ink">Click to upload your answer key</div>
              <div className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF · Your completed version with correct answers marked</div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><FileText className="size-4 text-brand-deep" /><div className="font-semibold text-ink">Students</div></div>
              <span className="text-xs font-semibold text-brand-deep">{students.length} / 25</span>
            </div>
            <div className="mt-4 space-y-2">
              {students.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-muted text-muted-foreground grid place-items-center text-xs">?</div>
                  <input placeholder="Student name" value={s.name} onChange={(e) => { const c = [...students]; c[i].name = e.target.value; setStudents(c); }}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                  <button className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted inline-flex items-center gap-1.5"><Upload className="size-3.5" /> Upload</button>
                  <div className="text-sm font-semibold text-muted-foreground tabular-nums w-16 text-right">— /{marks}</div>
                  <button onClick={() => setStudents(students.filter((_, j) => j !== i))} className="size-8 grid place-items-center rounded-lg hover:bg-coral-soft text-coral"><X className="size-4" /></button>
                </div>
              ))}
              <button onClick={() => setStudents([...students, { name: "" }])} className="w-full p-3 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add student</button>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 sticky top-20">
            <div className="flex items-center gap-2"><FileText className="size-4 text-brand-deep" /><div className="font-semibold text-ink">Session summary</div></div>
            <div className="mt-4 space-y-3 text-sm">
              <SumRow label="Marks available" value={`— / ${marks}`} />
              <SumRow label="Answer key" value={<span className="text-coral font-semibold">Not uploaded</span>} />
              <SumRow label="Students added" value={`0 of ${students.length}`} />
              <SumRow label="Papers uploaded" value="0 / 0 ready" />
            </div>
            <div className="mt-4 p-3 rounded-xl bg-mint">
              <div className="text-xs font-semibold text-ink">Once graded, you'll see:</div>
              <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-1"><CheckCircle2 className="size-3 text-brand-deep" /> Score per student</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="size-3 text-brand-deep" /> Question-by-question breakdown</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="size-3 text-brand-deep" /> Class average and insights</li>
              </ul>
            </div>
            <button disabled className="mt-4 w-full px-4 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-bold cursor-not-allowed inline-flex items-center justify-center gap-1.5">
              <Sparkles className="size-4" /> Grade exams
            </button>
            <div className="text-xs text-muted-foreground text-center mt-2">Upload an answer key to enable grading</div>
            <div className="mt-3"><CreditMeter /></div>
          </div>
        </aside>
      </div>
      {/* TODO(cursor): wire OCR + Lovable AI marking pipeline; persist sessions; deduct credits per paper. */}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold text-brand-deep tabular-nums">{value}</div>
    </div>
  );
}
function SumRow({ label, value }: { label: string; value: any }) {
  return <div className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"><span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</span><span className="text-ink font-semibold text-right">{value}</span></div>;
}
