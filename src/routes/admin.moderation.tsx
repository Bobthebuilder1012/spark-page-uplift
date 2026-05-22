import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ADMIN_REPORTS, REPORT_REASONS, type Report } from "@/lib/ratings-store";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Trash2, AlertTriangle, Check } from "lucide-react";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({ meta: [{ title: "Moderation queue — iTutor Admin" }] }),
  component: ModerationPage,
});

type Filter = "all" | "pending" | "resolved" | "dismissed";

function ModerationPage() {
  const [reports, setReports] = useState<Report[]>(ADMIN_REPORTS);
  const [filter, setFilter] = useState<Filter>("pending");

  const visible = reports.filter((r) => filter === "all" || r.status === filter);
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const act = (id: string, kind: "hide" | "delete" | "warn" | "dismiss") => {
    setReports((rs) => rs.map((r) => r.id === id ? { ...r, status: kind === "dismiss" ? "dismissed" : "resolved" } : r));
    toast.success(
      kind === "hide" ? "Comment hidden" :
      kind === "delete" ? "Comment deleted" :
      kind === "warn" ? "User warned" : "Report dismissed",
    );
  };

  return (
    <div className="min-h-screen bg-mint p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">Moderation queue</h1>
            <span className="px-2 py-0.5 rounded-full bg-coral text-white text-xs font-bold">({pendingCount}) pending</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Internal review of reported comments.</p>
        </header>

        <div className="flex gap-2 mb-4">
          {(["all", "pending", "resolved", "dismissed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold capitalize",
                filter === f ? "bg-ink text-white" : "bg-background border border-border text-muted-foreground hover:text-ink",
              )}
            >{f}</button>
          ))}
        </div>

        <div className="rounded-2xl bg-background border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Comment</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Reporter</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Target</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{r.date}</td>
                  <td className="px-3 py-3 max-w-[280px] truncate" title={r.commentPreview}>{r.commentPreview}</td>
                  <td className="px-3 py-3 text-muted-foreground">{REPORT_REASONS.find((x) => x.value === r.reason)?.label}</td>
                  <td className="px-3 py-3">{r.reporter}</td>
                  <td className="px-3 py-3">{r.reportedUser}</td>
                  <td className="px-3 py-3 text-brand-deep">{r.target}</td>
                  <td className="px-3 py-3 text-right">
                    {r.status === "pending" ? (
                      <div className="inline-flex gap-1">
                        <button onClick={() => act(r.id, "hide")} title="View / hide" className="size-7 grid place-items-center rounded hover:bg-muted"><Eye className="size-3.5" /></button>
                        <button onClick={() => act(r.id, "hide")} title="Hide comment" className="size-7 grid place-items-center rounded hover:bg-muted"><EyeOff className="size-3.5" /></button>
                        <button onClick={() => act(r.id, "delete")} title="Delete" className="size-7 grid place-items-center rounded hover:bg-destructive/10 text-destructive"><Trash2 className="size-3.5" /></button>
                        <button onClick={() => act(r.id, "warn")} title="Warn user" className="size-7 grid place-items-center rounded hover:bg-coral-soft text-coral"><AlertTriangle className="size-3.5" /></button>
                        <button onClick={() => act(r.id, "dismiss")} title="Dismiss" className="size-7 grid place-items-center rounded hover:bg-muted text-muted-foreground"><Check className="size-3.5" /></button>
                      </div>
                    ) : (
                      <span className="text-xs uppercase font-semibold text-muted-foreground">{r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-muted-foreground">Nothing to review.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
