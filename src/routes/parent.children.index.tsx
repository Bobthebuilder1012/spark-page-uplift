import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ChevronRight, FileText, AlertCircle, GraduationCap } from "lucide-react";
import { CHILDREN, type Child } from "@/lib/parent-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/parent/children/")({
  head: () => ({ meta: [{ title: "Children — iTutor Parent" }] }),
  component: ChildrenIndex,
});

function ChildrenIndex() {
  const children = CHILDREN;
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Household</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">My children</h1>
          <p className="text-sm text-muted-foreground mt-1">Each child has their own student account. You stay in control of consents and payments.</p>
        </div>
        <Link to="/parent" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
          <Plus className="size-4" /> Add a child
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {children.map((c) => <ChildCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}

function ChildCard({ c }: { c: Child }) {
  const pending = c.enrollments.filter((e) => e.status === "awaiting-consent" || e.status === "awaiting-approval");
  const reports = c.feedback.length;
  return (
    <Link to="/parent/children/$childId" params={{ childId: c.id }}
      className="group rounded-2xl bg-background border border-border p-5 hover:border-brand-deep/40 hover:shadow-card transition">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-full grid place-items-center font-bold text-ink shrink-0" style={{ background: `oklch(0.85 0.1 ${c.hue})` }}>{c.initials}</div>
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
          <div className="text-xs text-muted-foreground italic flex items-center gap-1.5"><GraduationCap className="size-3.5" /> Not enrolled in any classes yet.</div>
        ) : c.enrollments.slice(0, 3).map((e) => (
          <div key={e.classId} className="flex items-center gap-2 text-sm">
            <span className="text-base">{e.classEmoji}</span>
            <span className="flex-1 min-w-0 truncate text-ink">{e.classTitle}</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              e.status === "active" ? "bg-brand-soft text-brand-deep"
              : e.status === "awaiting-approval" ? "bg-sky-100 text-sky-800"
              : e.status === "awaiting-consent" ? "bg-amber-100 text-amber-800"
              : "bg-muted text-muted-foreground")}>
              {e.status === "active" ? "Active" : e.status === "awaiting-approval" ? "Approval" : e.status === "awaiting-consent" ? "Consent" : "Ended"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center gap-3 text-xs">
        {reports > 0 && <span className="inline-flex items-center gap-1 text-muted-foreground"><FileText className="size-3.5" /> {reports} report{reports === 1 ? "" : "s"}</span>}
        {pending.length > 0 && <span className="inline-flex items-center gap-1 text-amber-700"><AlertCircle className="size-3.5" /> {pending.length} pending</span>}
      </div>
    </Link>
  );
}
