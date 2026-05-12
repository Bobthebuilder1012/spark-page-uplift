import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wallet, TrendingUp, Clock, Download, AlertCircle, Send, FileText } from "lucide-react";
import { PLACEHOLDER_TRANSACTIONS, PLACEHOLDER_PAYOUTS, PLACEHOLDER_LESSONS, PLACEHOLDER_STUDENTS, LESSON_KIND_META, type Transaction } from "@/lib/tutor-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/wallet")({
  head: () => ({ meta: [{ title: "My Wallet — iTutor Tutor" }] }),
  component: WalletPage,
});

const TABS = ["overview", "transactions", "group-tracker", "payouts", "statements"] as const;

function WalletPage() {
  const [tab, setTab] = useState<typeof TABS[number]>("overview");

  return (
    <div className="max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">My Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">Earnings, transactions, group payments and payouts.</p>
      </header>

      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-2.5 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition", tab === t ? "border-brand text-ink" : "border-transparent text-muted-foreground hover:text-ink")}>
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && <Overview />}
      {tab === "transactions" && <TransactionsTab />}
      {tab === "group-tracker" && <GroupTracker />}
      {tab === "payouts" && <PayoutsTab />}
      {tab === "statements" && <StatementsTab />}
    </div>
  );
}

function Overview() {
  const paid = PLACEHOLDER_TRANSACTIONS.filter((t) => t.status === "paid");
  const lifetime = paid.reduce((a, t) => a + t.netTtd, 0);
  const monthMs = 30 * 86_400_000;
  const now = Date.now();
  const thisMonth = paid.filter((t) => now - new Date(t.date).getTime() < monthMs).reduce((a, t) => a + t.netTtd, 0);
  const lastMonth = paid.filter((t) => { const d = now - new Date(t.date).getTime(); return d >= monthMs && d < monthMs * 2; }).reduce((a, t) => a + t.netTtd, 0);
  const next = PLACEHOLDER_PAYOUTS.find((p) => p.status === "Scheduled");
  const avg = Math.round(paid.reduce((a, t) => a + t.netTtd, 0) / Math.max(1, paid.length));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-ink to-forest text-white p-6">
          <div className="text-xs uppercase tracking-wider font-bold text-white/60">Total balance</div>
          <div className="mt-2 text-4xl lg:text-5xl font-bold tabular-nums">TTD {(lifetime + (next?.amount ?? 0)).toLocaleString()}</div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div><span className="text-white/60">Available · </span><span className="font-semibold">TTD {lifetime.toLocaleString()}</span></div>
            <div><span className="text-white/60">Pending · </span><span className="font-semibold">TTD {(next?.amount ?? 0).toLocaleString()}</span></div>
          </div>
          {next && <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold"><Clock className="size-3.5" /> Next payout {new Date(next.date).toLocaleDateString()} · TTD {next.amount.toLocaleString()}</div>}
        </div>
        <div className="space-y-3">
          <SmallStat label="This month" value={`TTD ${thisMonth.toLocaleString()}`} hint={lastMonth > 0 ? `${Math.round(((thisMonth - lastMonth) / lastMonth) * 100)}% vs last month` : undefined} />
          <SmallStat label="Last month" value={`TTD ${lastMonth.toLocaleString()}`} />
          <SmallStat label="All time" value={`TTD ${lifetime.toLocaleString()}`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <SmallStat label="Avg per session" value={`TTD ${avg}`} icon={TrendingUp} />
        <SmallStat label="Top-earning lesson" value="CSEC Maths Crash" icon={Wallet} />
        <SmallStat label="Top-paying student" value="Aliyah Mohammed" icon={Wallet} />
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Earnings trend</h2>
          <div className="inline-flex rounded-lg border border-border p-1 text-xs">
            {["Day", "Week", "Month"].map((p, i) => <button key={p} className={cn("px-2 py-0.5 rounded font-semibold", i === 1 ? "bg-brand text-white" : "text-muted-foreground")}>{p}</button>)}
          </div>
        </div>
        <BarChart />
      </section>
    </div>
  );
}

function BarChart() {
  const data = [320, 410, 280, 540, 480, 620, 740, 690, 520, 880, 720, 940];
  const max = Math.max(...data);
  return (
    <div className="mt-4 flex items-end gap-1.5 h-40">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-t bg-brand/70 hover:bg-brand transition" style={{ height: `${(v / max) * 100}%` }} title={`TTD ${v}`} />
          <div className="text-[10px] text-muted-foreground">W{i + 1}</div>
        </div>
      ))}
    </div>
  );
}

function TransactionsTab() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = PLACEHOLDER_TRANSACTIONS.filter((t) =>
    (status === "all" || t.status === status) &&
    (search === "" || t.studentName.toLowerCase().includes(search.toLowerCase()) || t.lessonName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or lesson…"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          <option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
        </select>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><Download className="size-4" /> Export CSV</button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr>
              <th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Student</th><th className="text-left px-4 py-3">Lesson</th>
              <th className="text-left px-4 py-3">Type</th><th className="text-right px-4 py-3">Gross</th><th className="text-right px-4 py-3">Fee</th>
              <th className="text-right px-4 py-3">Net</th><th className="text-right px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((t) => {
              const m = LESSON_KIND_META[t.type];
              return (
                <tr key={t.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-ink">{t.studentName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.lessonName}{t.sessionNumber ? ` · #${t.sessionNumber}` : ""}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m.chip)}>{m.short}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">TTD {t.grossTtd}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">−{t.feeTtd}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">TTD {t.netTtd}</td>
                  <td className="px-4 py-3 text-right"><StatusPill status={t.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupTracker() {
  const groups = PLACEHOLDER_LESSONS.filter((l) => l.kind === "group-recurring");
  // Build a fake 4-session matrix
  const sessions = ["S1", "S2", "S3", "S4"];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-coral-soft border border-coral/30 p-4 flex items-center gap-3">
        <AlertCircle className="size-5 text-coral" />
        <div className="flex-1 text-sm"><span className="font-semibold text-ink">2 students overdue · TTD 540 outstanding.</span> <span className="text-muted-foreground">Send bulk reminder?</span></div>
        <button className="px-3 py-1.5 rounded-lg bg-coral text-white text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5"><Send className="size-3.5" /> Bulk reminder</button>
      </div>

      {groups.map((g) => (
        <section key={g.id} className="rounded-2xl border border-border bg-card overflow-hidden">
          <header className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-bold text-ink">{g.title}</h2>
              <div className="text-xs text-muted-foreground mt-0.5">{g.recurrenceRule} · {g.enrollments.length}/{g.capacity} enrolled</div>
            </div>
            <button className="text-xs font-semibold text-brand-deep hover:underline">View lesson →</button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-2.5 sticky left-0 bg-muted/30">Student</th>
                  {sessions.map((s) => <th key={s} className="text-center px-3 py-2.5">{s}</th>)}
                  <th className="text-right px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {g.enrollments.map((e, idx) => {
                  // Generate per-student per-session statuses
                  const cells: ("paid" | "pending" | "overdue" | "future")[] = ["paid", e.paymentStatus === "overdue" ? "overdue" : "paid", "paid", "future"];
                  if (e.paymentStatus === "overdue") cells[2] = "overdue";
                  const isOverdue = cells.some((c) => c === "overdue");
                  return (
                    <tr key={e.studentId} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-semibold text-ink sticky left-0 bg-card">{e.name}</td>
                      {cells.map((c, i) => (
                        <td key={i} className="px-3 py-2.5 text-center">
                          {c === "paid" && <span className="size-6 inline-grid place-items-center rounded-full bg-brand-soft text-brand-deep text-[10px] font-bold">✓</span>}
                          {c === "pending" && <span className="size-6 inline-grid place-items-center rounded-full bg-peach text-ink text-[10px] font-bold">…</span>}
                          {c === "overdue" && <span className="size-6 inline-grid place-items-center rounded-full bg-coral-soft text-coral text-[10px] font-bold">!</span>}
                          {c === "future" && <span className="size-6 inline-grid place-items-center rounded-full bg-muted text-muted-foreground text-[10px]">—</span>}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-right">
                        {isOverdue && <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-ink text-white text-xs font-semibold hover:opacity-90"><Send className="size-3" /> Remind</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground flex gap-4">
            <span>✓ Paid</span><span>… Pending</span><span>! Overdue</span><span>— Not yet due</span>
          </div>
        </section>
      ))}
    </div>
  );
}

function PayoutsTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Connected method</div>
          <div className="mt-1 font-bold text-ink">WiPay · ending ••42</div>
          <div className="text-xs text-muted-foreground mt-1">Bi-weekly · minimum TTD 200</div>
        </div>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Manage</button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-ink">Payout history</h2></header>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr><th className="text-left px-5 py-3">Date</th><th className="text-left px-5 py-3">Method</th><th className="text-right px-5 py-3">Amount</th><th className="text-right px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PLACEHOLDER_PAYOUTS.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-ink">{p.method}</td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums">TTD {p.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-right"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", p.status === "Paid" ? "bg-brand-soft text-brand-deep" : "bg-peach text-ink")}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatementsTab() {
  const months = ["April 2026", "March 2026", "February 2026", "January 2026"];
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-ink">2026 year-to-date</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <SmallStat label="Gross" value="TTD 8,420" />
          <SmallStat label="Platform fees" value="TTD 1,260" />
          <SmallStat label="Net earnings" value="TTD 7,160" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-ink">Monthly statements</h2>
          <button className="text-xs font-semibold text-brand-deep hover:underline">Annual tax summary</button>
        </header>
        <ul className="divide-y divide-border">
          {months.map((m) => (
            <li key={m} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3"><FileText className="size-4 text-muted-foreground" /><span className="text-ink font-semibold">{m}</span></div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"><Download className="size-3.5" /> PDF</button>
            </li>
          ))}
        </ul>
        {/* TODO(cursor): generate downloadable PDF statements server-side. */}
      </section>
    </div>
  );
}

function SmallStat({ label, value, hint, icon: Icon }: { label: string; value: any; hint?: string; icon?: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-3.5 text-brand-deep" />}
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-2 text-xl font-bold text-ink tabular-nums">{value}</div>
      {hint && <div className="text-[11px] font-semibold text-brand-deep mt-1">{hint}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: Transaction["status"] }) {
  const cls = { paid: "bg-brand-soft text-brand-deep", pending: "bg-peach text-ink", failed: "bg-coral-soft text-coral", refunded: "bg-sky text-ink" }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", cls)}>{status}</span>;
}
