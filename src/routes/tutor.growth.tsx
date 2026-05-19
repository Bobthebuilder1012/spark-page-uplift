import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PLACEHOLDER_LESSONS, PLACEHOLDER_FEEDBACK_DRAFTS, LESSON_KIND_META,
  FEEDBACK_PROMPTS, PROMO_INFO,
  type TutorLesson, type FeedbackDraft, type ClassPromotion, type PromotionKind, type FeedbackPromptResponse,
} from "@/lib/tutor-store";
import {
  Briefcase, Tag, BarChart3, FileText, Plus, Check, X, Sparkles, ArrowUp, ArrowDown,
  Users, DollarSign, Star, Edit3, Send, Calendar as CalendarIcon, Search, ChevronRight, BookOpen,
  Info, Zap, Clock, Infinity as InfinityIcon, Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/growth")({
  head: () => ({ meta: [{ title: "My Business — iTutor Tutor" }] }),
  component: MyBusinessPage,
});

type Tab = "overview" | "classes" | "promotions" | "analytics" | "feedback";

function MyBusinessPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: Briefcase },
    { key: "classes", label: "Classes", icon: BookOpen, badge: PLACEHOLDER_LESSONS.filter((l) => !l.archived).length },
    { key: "promotions", label: "Promotions", icon: Tag },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "feedback", label: "Parent feedback", icon: FileText, badge: PLACEHOLDER_FEEDBACK_DRAFTS.filter((f) => f.status === "pending").length },
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-brand-deep"><Briefcase className="size-3.5" /> My Business</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">Your tutoring command centre</h1>
        <p className="text-sm text-muted-foreground mt-1">All your Classes, promotions, analytics, and parent feedback in one place.</p>
      </header>

      <div className="border-b border-border flex items-center gap-6 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("relative pb-3 text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2", tab === t.key ? "text-brand-deep" : "text-muted-foreground hover:text-ink")}>
              <Icon className="size-4" /> {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", tab === t.key ? "bg-brand-soft text-brand-deep" : "bg-muted text-muted-foreground")}>{t.badge}</span>
              )}
              {tab === t.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand" />}
            </button>
          );
        })}
      </div>

      {tab === "overview"   && <OverviewTab />}
      {tab === "classes"    && <ClassesTab />}
      {tab === "promotions" && <PromotionsTab />}
      {tab === "analytics"  && <BusinessAnalyticsTab />}
      {tab === "feedback"   && <FeedbackTab />}
      {/* TODO(cursor): persist promotions, business analytics ranges, and parent-feedback approvals. */}
    </div>
  );
}

/* ---------------- Overview ---------------- */

function OverviewTab() {
  const active = PLACEHOLDER_LESSONS.filter((l) => !l.archived);
  const totalRevenue = active.reduce((s, l) => s + (l.earningsTtd ?? 0), 0);
  const totalStudents = new Set(active.flatMap((l) => l.enrollments.map((e) => e.studentId))).size;
  const activePromos = active.filter((l) => !!l.promotion).length;
  const pendingFeedback = PLACEHOLDER_FEEDBACK_DRAFTS.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={DollarSign} label="Revenue (all classes)" value={`TTD ${totalRevenue.toLocaleString()}`} delta="+18% MoM" positive />
        <KpiCard icon={Users} label="Unique students" value={String(totalStudents)} delta="+2 this month" positive />
        <KpiCard icon={Tag} label="Active promotions" value={String(activePromos)} delta={activePromos > 0 ? "1 ending soon" : "None active"} positive={activePromos > 0} />
        <KpiCard icon={FileText} label="Feedback to review" value={String(pendingFeedback)} delta={pendingFeedback > 0 ? "Action needed" : "All caught up"} positive={pendingFeedback === 0} />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Your Classes</h2>
            <Link to="/tutor/lessons" className="text-xs font-semibold text-brand-deep hover:underline inline-flex items-center gap-1">View all <ChevronRight className="size-3" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {active.slice(0, 4).map((l) => <ClassRowMini key={l.id} l={l} />)}
          </ul>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5">
          <h2 className="font-bold text-ink">Quick actions</h2>
          <div className="mt-3 space-y-2">
            <QuickAction to="/tutor/lessons/new" icon={Plus} label="Create a Class" />
            <QuickAction to="/tutor/growth" icon={Tag} label="Launch a promotion" onClick={() => {}} />
            <QuickAction to="/tutor/growth" icon={FileText} label="Review parent feedback" />
            <QuickAction to="/tutor/wallet" icon={DollarSign} label="View wallet & payouts" />
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border hover:border-brand hover:bg-brand-soft/40">
      <div className="size-8 rounded-lg bg-brand-soft text-brand-deep grid place-items-center"><Icon className="size-4" /></div>
      <span className="text-sm font-semibold text-ink flex-1">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function ClassRowMini({ l }: { l: TutorLesson }) {
  const m = LESSON_KIND_META[l.kind];
  return (
    <li className="py-3 flex items-center gap-3">
      <div className={cn("size-10 rounded-xl bg-gradient-to-br grid place-items-center text-white", l.thumbnailGradient ?? "from-brand to-emerald-400")}>
        <BookOpen className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <Link to="/tutor/lessons/$id" params={{ id: l.id }} className="font-semibold text-ink hover:underline truncate block">{l.title}</Link>
        <div className="text-[11px] text-muted-foreground">{l.subject} · {m.label}</div>
      </div>
      <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-3">
        <span className="inline-flex items-center gap-1"><Users className="size-3" /> {l.enrollments.length}/{l.capacity}</span>
        <span className="inline-flex items-center gap-1 text-brand-deep font-semibold">TTD {(l.earningsTtd ?? 0).toLocaleString()}</span>
        {l.promotion && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-coral-soft text-coral">Promo</span>}
      </div>
    </li>
  );
}

/* ---------------- Classes ---------------- */

function ClassesTab() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => PLACEHOLDER_LESSONS.filter((l) => !l.archived && (q === "" || l.title.toLowerCase().includes(q.toLowerCase()))), [q]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your Classes…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <Link to="/tutor/lessons/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
          <Plus className="size-4" /> New Class
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-bold px-4 py-2">Class</th>
              <th className="text-left font-bold px-4 py-2">Type</th>
              <th className="text-right font-bold px-4 py-2">Members</th>
              <th className="text-right font-bold px-4 py-2">Earnings</th>
              <th className="text-right font-bold px-4 py-2">Rating</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((l) => {
              const m = LESSON_KIND_META[l.kind];
              return (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("size-9 rounded-lg bg-gradient-to-br grid place-items-center text-white", l.thumbnailGradient ?? "from-brand to-emerald-400")}><BookOpen className="size-3.5" /></div>
                      <div>
                        <Link to="/tutor/lessons/$id" params={{ id: l.id }} className="font-semibold text-ink hover:underline">{l.title}</Link>
                        <div className="text-[11px] text-muted-foreground">{l.subject} · {l.level}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m.chip)}>{m.short}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{l.enrollments.length}/{l.capacity}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-brand-deep font-semibold">TTD {(l.earningsTtd ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {l.rating ? <span className="inline-flex items-center gap-1 text-amber-600 font-semibold"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {l.rating.toFixed(1)}</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/tutor/lessons/$id" params={{ id: l.id }} className="text-xs font-semibold text-brand-deep hover:underline">Manage →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Promotions ---------------- */

function PromotionsTab() {
  const [overrides, setOverrides] = useState<Record<string, ClassPromotion | null>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const get = (l: TutorLesson) => (overrides[l.id] !== undefined ? overrides[l.id] : l.promotion ?? null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">One active promotion per Class. Students see the new price with the original struck through.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {PLACEHOLDER_LESSONS.filter((l) => !l.archived).map((l) => {
          const promo = get(l);
          return (
            <div key={l.id} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-start gap-3">
                <div className={cn("size-10 rounded-xl bg-gradient-to-br grid place-items-center text-white", l.thumbnailGradient ?? "from-brand to-emerald-400")}><BookOpen className="size-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.subject} · TTD {l.rateTtd}</div>
                </div>
                {promo && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-coral-soft text-coral">Active</span>}
              </div>

              {promo ? (
                <div className="mt-4 rounded-xl border border-coral/30 bg-coral-soft/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-coral capitalize">{promo.kind.replace("-", " ")}</div>
                    <button onClick={() => setOverrides({ ...overrides, [l.id]: null })} className="text-[11px] font-semibold text-rose-700 hover:underline">Remove</button>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-ink">TTD {promo.discountedPrice}</span>
                    <span className="text-sm line-through text-muted-foreground">TTD {promo.originalPrice}</span>
                  </div>
                  {promo.endsAt && <div className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1"><CalendarIcon className="size-3" /> Ends {new Date(promo.endsAt).toLocaleDateString()}</div>}
                  <button onClick={() => setEditing(l.id)} className="mt-3 text-xs font-semibold text-brand-deep hover:underline inline-flex items-center gap-1"><Edit3 className="size-3" /> Edit promotion</button>
                </div>
              ) : (
                <button onClick={() => setEditing(l.id)} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-brand hover:text-brand-deep">
                  <Plus className="size-4" /> Create promotion
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <PromoEditor
          lesson={PLACEHOLDER_LESSONS.find((l) => l.id === editing)!}
          initial={get(PLACEHOLDER_LESSONS.find((l) => l.id === editing)!)}
          onClose={() => setEditing(null)}
          onSave={(p) => { setOverrides({ ...overrides, [editing!]: p }); setEditing(null); }}
        />
      )}
    </div>
  );
}

function PromoEditor({ lesson, initial, onClose, onSave }: { lesson: TutorLesson; initial: ClassPromotion | null; onClose: () => void; onSave: (p: ClassPromotion) => void }) {
  const [kind, setKind] = useState<PromotionKind>(initial?.kind ?? "early-bird");
  const [discounted, setDiscounted] = useState(initial?.discountedPrice ?? Math.round(lesson.rateTtd * 0.8));
  const [endsAt, setEndsAt] = useState(initial?.endsAt ?? "");

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-ink/50 backdrop-blur-sm" />
      <aside className="w-full max-w-md bg-background h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Promotion</h2>
            <p className="text-xs text-muted-foreground truncate">{lesson.title}</p>
          </div>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </header>
        <div className="p-6 space-y-5">
          <div>
            <div className="text-sm font-semibold text-ink mb-2">Promotion type</div>
            <div className="grid sm:grid-cols-3 gap-2">
              {(["early-bird", "time-limited", "open-ended"] as PromotionKind[]).map((k) => {
                const Icon = k === "early-bird" ? Zap : k === "time-limited" ? Clock : InfinityIcon;
                const active = kind === k;
                return (
                  <button key={k} onClick={() => setKind(k)}
                    className={cn("relative text-left rounded-xl border p-3 transition", active ? "bg-brand-soft border-brand ring-2 ring-brand/30" : "border-border bg-background hover:border-brand")}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("size-4", active ? "text-brand-deep" : "text-muted-foreground")} />
                      <span className="text-sm font-bold text-ink capitalize">{k.replace("-", " ")}</span>
                      <InfoPop title={PROMO_INFO[k].title} blurb={PROMO_INFO[k].blurb} />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{PROMO_INFO[k].blurb}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink mb-2">Discounted price (TTD)</div>
            <input type="number" value={discounted} onChange={(e) => setDiscounted(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            <div className="text-xs text-muted-foreground mt-1">Original price: TTD {lesson.rateTtd} (struck through on the listing)</div>
          </div>
          {kind !== "open-ended" && (
            <div>
              <div className="text-sm font-semibold text-ink mb-2">Ends on</div>
              <input type="date" value={endsAt ? endsAt.slice(0, 10) : ""} onChange={(e) => setEndsAt(new Date(e.target.value).toISOString())} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          )}
          <div className="rounded-xl bg-mint p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-brand-deep">Preview</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">TTD {discounted}</span>
              <span className="text-sm line-through text-muted-foreground">TTD {lesson.rateTtd}</span>
            </div>
          </div>
        </div>
        <footer className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={() => onSave({ kind, originalPrice: lesson.rateTtd, discountedPrice: discounted, endsAt: kind === "open-ended" ? undefined : endsAt || undefined })} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
            Save promotion
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ---------------- Business Analytics ---------------- */

function BusinessAnalyticsTab() {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const totalsByMonth = [820, 1180, 1640, 2210, 2980, 3640];
  const maxRev = Math.max(...totalsByMonth);
  const byClass = PLACEHOLDER_LESSONS.filter((l) => !l.archived).slice(0, 5);
  const maxClassRev = Math.max(...byClass.map((l) => l.earningsTtd ?? 0));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={DollarSign} label="Revenue this month" value="TTD 3,640" delta="+22% MoM" positive />
        <KpiCard icon={Users} label="Active members" value="14" delta="+3 MoM" positive />
        <KpiCard icon={Star} label="Avg rating" value="4.85" delta="Stable" positive />
        <KpiCard icon={CalendarIcon} label="Sessions delivered" value="38" delta="+6 MoM" positive />
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">Revenue across all Classes (TTD)</h3>
          <span className="text-[11px] text-muted-foreground">Last 6 months</span>
        </div>
        <div className="mt-6 h-48 flex items-end gap-3">
          {totalsByMonth.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-brand to-emerald-300" style={{ height: `${(v / maxRev) * 100}%` }} />
              <div className="text-[10px] text-muted-foreground">{months[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="font-semibold text-ink">Top earning Classes</h3>
        <ul className="mt-4 space-y-3">
          {byClass.sort((a, b) => (b.earningsTtd ?? 0) - (a.earningsTtd ?? 0)).map((l) => {
            const pct = ((l.earningsTtd ?? 0) / Math.max(1, maxClassRev)) * 100;
            return (
              <li key={l.id}>
                <div className="flex items-center justify-between text-sm">
                  <Link to="/tutor/lessons/$id" params={{ id: l.id }} className="font-semibold text-ink hover:underline truncate">{l.title}</Link>
                  <span className="text-brand-deep font-bold tabular-nums">TTD {(l.earningsTtd ?? 0).toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand to-emerald-400" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Parent Feedback Queue ---------------- */

function FeedbackTab() {
  const [drafts, setDrafts] = useState<FeedbackDraft[]>(PLACEHOLDER_FEEDBACK_DRAFTS);
  const [open, setOpen] = useState<string | null>(null);
  const pending = drafts.filter((f) => f.status === "pending");
  const done = drafts.filter((f) => f.status !== "pending");

  const update = (id: string, patch: Partial<FeedbackDraft>) => setDrafts(drafts.map((d) => d.id === id ? { ...d, ...patch } : d));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
        <div className="size-9 rounded-xl bg-brand-soft text-brand-deep grid place-items-center shrink-0"><FileText className="size-4" /></div>
        <div className="text-sm">
          <div className="font-semibold text-ink">You write the monthly report. AI only polishes if you want.</div>
          <div className="text-muted-foreground">
            Each student gets a short set of prompts to fill in. Attendance and session counts are filled in automatically. Once you're happy, tap <span className="font-semibold text-ink">Refine with AI</span> on any field to polish the wording, then approve and send.
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-bold text-ink mb-3">Reports to write · {pending.length}</h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">All caught up — no reports to write.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {pending.map((f) => <FeedbackCard key={f.id} f={f} onOpen={() => setOpen(f.id)} />)}
          </div>
        )}
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="font-bold text-ink mb-3">Recently sent / approved</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {done.map((f) => <FeedbackCard key={f.id} f={f} onOpen={() => setOpen(f.id)} />)}
          </div>
        </section>
      )}

      {open && (
        <FeedbackEditor
          draft={drafts.find((d) => d.id === open)!}
          onClose={() => setOpen(null)}
          onSave={(patch) => update(open, patch)}
          onApprove={() => { update(open, { status: "approved" }); setOpen(null); }}
          onSend={() => { update(open, { status: "sent" }); setOpen(null); }}
        />
      )}
    </div>
  );
}

function FeedbackCard({ f, onOpen }: { f: FeedbackDraft; onOpen: () => void }) {
  const filled = f.prompts.filter((p) => p.tutorResponse.trim().length > 0).length;
  const total = f.prompts.length;
  const pct = Math.round((filled / total) * 100);
  return (
    <button onClick={onOpen} className="text-left rounded-2xl bg-card border border-border p-5 hover:border-brand transition w-full">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-xs font-bold text-white">{f.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink truncate">{f.studentName}</div>
          <div className="text-[11px] text-muted-foreground truncate">{f.lessonName} · {f.month}</div>
        </div>
        <StatusChip status={f.status} />
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Check className="size-3 text-brand-deep" /> Attendance {f.stats.attendance}</span>
        <span>·</span>
        <span>{f.stats.sessionsAttended}/{f.stats.sessionsScheduled} sessions</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted-foreground">Your prompts filled</span>
          <span className={cn(pct === 100 ? "text-emerald-700" : "text-ink")}>{filled}/{total}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full", pct === 100 ? "bg-emerald-500" : "bg-brand")} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="mt-3 text-xs font-semibold text-brand-deep inline-flex items-center gap-1">
        {f.status === "pending" ? <>Write report <ChevronRight className="size-3" /></> : <>View report <ChevronRight className="size-3" /></>}
      </div>
    </button>
  );
}

function StatusChip({ status }: { status: FeedbackDraft["status"] }) {
  const m = { pending: "bg-amber-100 text-amber-800", approved: "bg-sky-100 text-sky-700", sent: "bg-emerald-100 text-emerald-700" }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m)}>{status === "pending" ? "Draft" : status === "approved" ? "Approved" : "Sent"}</span>;
}

// Fake "AI polish": just dresses up the tutor's raw text. UI-only demo.
function fakeAiPolish(text: string): string {
  const t = text.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1).replace(/\s+/g, " ") + (t.endsWith(".") ? "" : ".");
}

function FeedbackEditor({ draft, onClose, onSave, onApprove, onSend }: { draft: FeedbackDraft; onClose: () => void; onSave: (p: Partial<FeedbackDraft>) => void; onApprove: () => void; onSend: () => void }) {
  const [prompts, setPrompts] = useState<FeedbackPromptResponse[]>(draft.prompts);
  const allFilled = prompts.every((p) => p.tutorResponse.trim().length > 0);

  const updatePrompt = (key: string, patch: Partial<FeedbackPromptResponse>) => {
    const next = prompts.map((p) => p.key === key ? { ...p, ...patch } : p);
    setPrompts(next);
    onSave({ prompts: next });
  };
  const refineOne = (key: string) => {
    const target = prompts.find((p) => p.key === key);
    if (!target) return;
    updatePrompt(key, { tutorResponse: fakeAiPolish(target.tutorResponse), refinedByAi: true });
  };
  const refineAll = () => {
    const next = prompts.map((p) => p.tutorResponse.trim() ? { ...p, tutorResponse: fakeAiPolish(p.tutorResponse), refinedByAi: true } : p);
    setPrompts(next);
    onSave({ prompts: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-ink/50 backdrop-blur-sm" />
      <aside className="w-full max-w-xl bg-background h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{draft.studentName} · {draft.month}</h2>
            <p className="text-xs text-muted-foreground">{draft.lessonName}</p>
          </div>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </header>
        <div className="p-6 space-y-5">
          {/* Auto-filled stats */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
              <Check className="size-3 text-brand-deep" /> Auto-filled facts
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-[11px] text-muted-foreground">Attendance</div><div className="font-bold text-ink">{draft.stats.attendance}</div></div>
              <div><div className="text-[11px] text-muted-foreground">Sessions</div><div className="font-bold text-ink">{draft.stats.sessionsAttended} of {draft.stats.sessionsScheduled}</div></div>
            </div>
          </div>

          {/* Tutor prompts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-ink">Your responses</div>
              <button onClick={refineAll} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline">
                <Wand2 className="size-3.5" /> Refine all with AI
              </button>
            </div>
            <div className="space-y-3">
              {prompts.map((p) => {
                const meta = FEEDBACK_PROMPTS.find((f) => f.key === p.key)!;
                return (
                  <div key={p.key} className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-start justify-between gap-2">
                      <label className="text-sm font-semibold text-ink">{p.question}</label>
                      {p.refinedByAi && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-soft text-brand-deep inline-flex items-center gap-1"><Sparkles className="size-3" /> Refined</span>}
                    </div>
                    <textarea
                      value={p.tutorResponse}
                      onChange={(e) => updatePrompt(p.key, { tutorResponse: e.target.value, refinedByAi: false })}
                      placeholder={meta.placeholder}
                      className="mt-2 w-full min-h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        disabled={!p.tutorResponse.trim()}
                        onClick={() => refineOne(p.key)}
                        className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md", p.tutorResponse.trim() ? "text-brand-deep hover:bg-brand-soft" : "text-muted-foreground cursor-not-allowed")}>
                        <Wand2 className="size-3" /> Refine with AI
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!allFilled && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs px-3 py-2">
              Fill in every prompt before you can approve and send.
            </div>
          )}
        </div>
        <footer className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-2">
          {draft.status === "pending" && (
            <button disabled={!allFilled} onClick={onApprove} className={cn("px-4 py-2 rounded-lg border text-sm font-semibold inline-flex items-center gap-1.5", allFilled ? "border-border hover:bg-muted text-ink" : "border-border text-muted-foreground cursor-not-allowed")}>
              <Check className="size-4" /> Approve
            </button>
          )}
          <button disabled={!allFilled} onClick={onSend} className={cn("px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5", allFilled ? "bg-brand text-white hover:bg-brand/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
            <Send className="size-4" /> Send to parent
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ---------------- Atoms ---------------- */

function KpiCard({ icon: Icon, label, value, delta, positive }: { icon: any; label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className="size-4" /><span className="text-[11px] uppercase tracking-wider font-bold">{label}</span></div>
      <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
      <div className={cn("text-[11px] font-semibold mt-0.5 inline-flex items-center gap-1", positive ? "text-emerald-600" : "text-rose-600")}>
        {positive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />} {delta}
      </div>
    </div>
  );
}
