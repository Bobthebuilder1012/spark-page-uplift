import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import {
  Plus, ChevronRight, FileText, AlertCircle, Check, Clock, X, GraduationCap, Receipt, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CHILDREN, paymentStatusForChild, type Child } from "@/lib/parent-store";

const searchSchema = z.object({
  state: fallback(z.enum(["live", "empty"]), "live").default("live"),
});

export const Route = createFileRoute("/parent/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Parent dashboard — iTutor" }] }),
  component: ParentHome,
});

function ParentHome() {
  const { state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const children = state === "empty" ? [] : CHILDREN;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Parent dashboard</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">Welcome back, Anika</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your children's classes, feedback and billing.</p>
        </div>

        {/* Demo state switcher */}
        <div className="inline-flex p-1 rounded-xl bg-muted text-xs">
          {(["live", "empty"] as const).map((s) => (
            <button key={s} onClick={() => navigate({ search: { state: s } })}
              className={cn("px-2.5 py-1 rounded-lg font-semibold capitalize", state === s ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Top-line stats */}
      {children.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Children" value={String(children.length)} />
          <Stat label="Active classes" value={String(children.reduce((n, c) => n + c.enrollments.filter((e) => e.status === "active").length, 0))} />
          <Stat label="Pending consents" value={String(children.reduce((n, c) => n + c.enrollments.filter((e) => e.status === "awaiting-consent" || e.status === "awaiting-approval").length, 0))} />
        </div>
      )}

      {/* Children list */}
      {children.length === 0 ? (
        <EmptyChildrenState onAdd={() => setAddOpen(true)} />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">My children</h2>
            <button onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
              <Plus className="size-4" /> Add a child
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {children.map((c) => <ChildCard key={c.id} c={c} />)}
          </div>
        </section>
      )}

      {addOpen && <AddChildModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background border border-border p-4">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-ink mt-1">{value}</div>
    </div>
  );
}

function ChildCard({ c }: { c: Child }) {
  const pay = paymentStatusForChild(c);
  const active = c.enrollments.filter((e) => e.status === "active");
  const pending = c.enrollments.filter((e) => e.status === "awaiting-consent" || e.status === "awaiting-approval");
  const reports = c.feedback.length;

  return (
    <Link to="/parent/children/$childId" params={{ childId: c.id }}
      className="group rounded-2xl bg-background border border-border p-5 hover:border-brand-deep/40 hover:shadow-card transition">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-full grid place-items-center font-bold text-ink shrink-0"
          style={{ background: `oklch(0.85 0.1 ${c.hue})` }}>
          {c.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-ink truncate">{c.name}</h3>
            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
          </div>
          <div className="text-xs text-muted-foreground truncate">{c.ageLabel}{c.school ? ` · ${c.school}` : ""}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {c.enrollments.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">Not enrolled in any classes yet.</div>
        ) : (
          c.enrollments.slice(0, 3).map((e) => (
            <div key={e.classId} className="flex items-center gap-2.5 text-sm">
              <span className="text-base">{e.classEmoji}</span>
              <span className="flex-1 min-w-0 truncate text-ink">{e.classTitle}</span>
              <EnrollmentBadge status={e.status} />
            </div>
          ))
        )}
        {c.enrollments.length > 3 && (
          <div className="text-[11px] text-muted-foreground">+ {c.enrollments.length - 3} more</div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <PaymentChip status={pay} />
          {reports > 0 && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <FileText className="size-3.5" /> {reports} report{reports === 1 ? "" : "s"}
            </span>
          )}
          {pending.length > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-700">
              <AlertCircle className="size-3.5" /> {pending.length} pending
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function EnrollmentBadge({ status }: { status: Child["enrollments"][number]["status"] }) {
  const m = {
    "active":             { label: "Active",   cls: "bg-brand-soft text-brand-deep" },
    "awaiting-consent":   { label: "Consent",  cls: "bg-amber-100 text-amber-800" },
    "awaiting-approval":  { label: "Approval", cls: "bg-sky-100 text-sky-800" },
    "cancelled":          { label: "Ended",    cls: "bg-muted text-muted-foreground" },
  }[status];
  return <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap", m.cls)}>{m.label}</span>;
}

function PaymentChip({ status }: { status: "all-paid" | "overdue" | "pending" }) {
  if (status === "overdue") return <span className="inline-flex items-center gap-1 text-rose-700 font-semibold"><AlertCircle className="size-3.5" /> Payment overdue</span>;
  if (status === "pending") return <span className="inline-flex items-center gap-1 text-amber-700 font-semibold"><Clock className="size-3.5" /> Awaiting action</span>;
  return <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><Check className="size-3.5" /> All paid up</span>;
}

function EmptyChildrenState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
        <GraduationCap className="size-5" />
      </div>
      <h2 className="font-bold text-ink">No children added yet</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        Add your child to create their student account. You'll manage their classes and payments from here, and they'll get their own student login.
      </p>
      <button onClick={onAdd} className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
        <Plus className="size-4" /> Add a child
      </button>

      {/* Quick links — feedback / billing still navigable */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs">
        <Link to="/parent/billing" className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink">
          <Receipt className="size-3.5" /> View billing
        </Link>
        <Link to="/parent" className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink">
          <MessageSquare className="size-3.5" /> Help & support
        </Link>
      </div>
    </div>
  );
}

function AddChildModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "done">("form");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="font-bold text-ink">{step === "form" ? "Add a child" : "Account created"}</div>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
        </header>

        {step === "form" ? (
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">We'll create a student account linked to your parent profile. You stay in control of consents and payments — your child gets their own login for classes and homework.</p>

            <Field label="Child's full name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aliyah Mohammed"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </Field>
            <Field label="Year level / age">
              <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. Form 5 · 16 yrs"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </Field>
            <Field label="School (optional)">
              <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Bishop Anstey High"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </Field>

            <div className="rounded-xl bg-mint p-3 text-xs text-ink/80">
              Your child won't be charged anything until you consent to a class. You'll review every charge before it's made.
            </div>

            <button disabled={!name.trim()} onClick={() => setStep("done")}
              className={cn("w-full px-4 py-3 rounded-2xl font-semibold text-sm",
                name.trim() ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground cursor-not-allowed")}>
              Create student account
            </button>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto size-12 rounded-2xl bg-brand grid place-items-center text-white">
              <Check className="size-6" />
            </div>
            <h3 className="font-bold text-ink">{name || "Your child"}'s account is ready</h3>
            <p className="text-sm text-muted-foreground">We've emailed you a login link to share with them. You can now browse classes and approve enrollments on their behalf.</p>
            <button onClick={onClose} className="w-full px-4 py-3 rounded-2xl bg-ink text-white font-semibold text-sm">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
