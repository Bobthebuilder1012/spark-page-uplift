import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Receipt, Filter, Download, ArrowDownRight, ArrowUpRight, ShieldCheck, RefreshCcw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_HISTORY, CHILDREN, type PaymentEntry } from "@/lib/parent-store";

export const Route = createFileRoute("/parent/billing")({
  head: () => ({ meta: [{ title: "Billing & consent — iTutor Parent" }] }),
  component: BillingPage,
});

function BillingPage() {
  const [child, setChild] = useState<string>("all");
  const [kind, setKind] = useState<"all" | PaymentEntry["kind"]>("all");

  const rows = useMemo(() => PAYMENT_HISTORY.filter((p) => {
    if (child !== "all" && p.childName !== child) return false;
    if (kind !== "all" && p.kind !== kind) return false;
    return true;
  }), [child, kind]);

  const totalPaid = rows.filter((r) => r.amount > 0 && r.status === "paid").reduce((n, r) => n + r.amount, 0);
  const totalRefunded = rows.filter((r) => r.amount < 0).reduce((n, r) => n + r.amount, 0);

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Billing</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">Consent & payment history</h1>
        <p className="text-sm text-muted-foreground mt-1">A complete log of every class you've consented to, every renewal charged, and any refunds.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Paid this period" value={`TT$${totalPaid.toFixed(0)}`} tone="brand" />
        <Stat label="Refunded" value={`TT$${Math.abs(totalRefunded).toFixed(0)}`} tone="muted" />
        <Stat label="Active subscriptions" value={String(CHILDREN.reduce((n, c) => n + c.enrollments.filter((e) => e.status === "active").length, 0))} tone="brand" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Filter className="size-3.5" /> Filter:</div>
        <Select value={child} onChange={setChild} options={[{ v: "all", l: "All children" }, ...CHILDREN.map((c) => ({ v: c.name, l: c.name }))]} />
        <Select value={kind} onChange={(v) => setKind(v as "all" | PaymentEntry["kind"])}
          options={[
            { v: "all", l: "All activity" },
            { v: "consent", l: "Consents" },
            { v: "renewal", l: "Renewals" },
            { v: "refund", l: "Refunds" },
            { v: "one-off", l: "One-off" },
          ]} />
        <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-ink hover:bg-muted">
          <Download className="size-3.5" /> Export
        </button>
      </div>

      {/* Table / list */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
          <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
            <Receipt className="size-5" />
          </div>
          <h2 className="font-bold text-ink">No activity to show</h2>
          <p className="text-sm text-muted-foreground mt-1">Try a different filter.</p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-border bg-background divide-y divide-border overflow-hidden">
          {rows.map((p) => <Row key={p.id} p={p} />)}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "brand" | "muted" }) {
  return (
    <div className={cn("rounded-2xl border p-4", tone === "brand" ? "bg-brand-soft border-brand/20" : "bg-background border-border")}>
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-bold mt-1", tone === "brand" ? "text-brand-deep" : "text-ink")}>{value}</div>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand">
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function Row({ p }: { p: PaymentEntry }) {
  const meta = kindMeta(p.kind);
  return (
    <li className="p-4 flex items-start gap-3">
      <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", meta.iconBg)}>
        <meta.icon className={cn("size-4", meta.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-ink truncate">{p.classTitle}</div>
          <div className={cn("font-bold text-sm shrink-0", p.amount < 0 ? "text-rose-700" : p.status === "pending-consent" ? "text-muted-foreground" : "text-ink")}>
            {p.amount === 0 ? "—" : `${p.amount < 0 ? "-" : ""}TT$${Math.abs(p.amount).toFixed(0)}`}
          </div>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {p.childName} · {p.date} · {p.method}
        </div>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full", meta.pillCls)}>{meta.label}</span>
          <StatusChip status={p.status} />
          {p.note && <span className="text-[11px] text-muted-foreground italic">{p.note}</span>}
        </div>
      </div>
    </li>
  );
}

function StatusChip({ status }: { status: PaymentEntry["status"] }) {
  const m = {
    "paid":             { label: "Paid",            cls: "bg-emerald-100 text-emerald-700" },
    "pending-consent":  { label: "Pending",         cls: "bg-amber-100 text-amber-800" },
    "overdue":          { label: "Overdue",         cls: "bg-rose-100 text-rose-700" },
    "refunded":         { label: "Refunded",        cls: "bg-muted text-muted-foreground" },
  }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full", m.cls)}>{m.label}</span>;
}

function kindMeta(k: PaymentEntry["kind"]) {
  switch (k) {
    case "consent":  return { icon: ShieldCheck, iconBg: "bg-sky-100",    iconColor: "text-sky-700",    label: "Consent", pillCls: "bg-sky-100 text-sky-700" };
    case "renewal":  return { icon: RefreshCcw,  iconBg: "bg-brand-soft", iconColor: "text-brand-deep", label: "Renewal", pillCls: "bg-brand-soft text-brand-deep" };
    case "refund":   return { icon: ArrowDownRight, iconBg: "bg-rose-100", iconColor: "text-rose-700",  label: "Refund",  pillCls: "bg-rose-100 text-rose-700" };
    case "one-off":  return { icon: ArrowUpRight, iconBg: "bg-muted",      iconColor: "text-ink",       label: "One-off", pillCls: "bg-muted text-ink/70" };
    default:         return { icon: AlertCircle, iconBg: "bg-muted",      iconColor: "text-ink",       label: "Other",   pillCls: "bg-muted text-ink/70" };
  }
}
