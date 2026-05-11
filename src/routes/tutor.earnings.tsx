import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, Clock } from "lucide-react";

export const Route = createFileRoute("/tutor/earnings")({
  component: EarningsPage,
});

const PAYOUTS = [
  { id: "p1", date: "May 2, 2026", amount: 1840, status: "Paid" },
  { id: "p2", date: "Apr 18, 2026", amount: 2120, status: "Paid" },
  { id: "p3", date: "Apr 4, 2026", amount: 1560, status: "Paid" },
  { id: "p4", date: "Mar 21, 2026", amount: 1980, status: "Paid" },
];

function EarningsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Earnings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track payouts and lifetime revenue.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Wallet} label="Lifetime earnings" value="TTD 18,420" />
        <Stat icon={Clock} label="Pending payout" value="TTD 740" sub="Releases May 16" />
        <Stat icon={TrendingUp} label="This month" value="TTD 3,640" sub="+12% vs April" />
      </div>

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-ink">Payout history</h2>
        </header>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Date</th>
              <th className="text-left px-5 py-3 font-semibold">Amount</th>
              <th className="text-right px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PAYOUTS.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <td className="px-5 py-3 text-muted-foreground">{p.date}</td>
                <td className="px-5 py-3 font-semibold text-ink tabular-nums">TTD {p.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-brand/15 text-brand-deep">{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* TODO(cursor): connect Stripe Connect / payouts API and live data. */}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="size-9 rounded-lg bg-brand/10 text-brand-deep grid place-items-center"><Icon className="size-4" /></div>
      <div className="mt-3 text-2xl font-bold text-ink tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-brand-deep mt-1 font-semibold">{sub}</div>}
    </div>
  );
}
