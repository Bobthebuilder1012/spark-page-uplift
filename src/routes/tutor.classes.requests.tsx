import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, X, MessageSquare, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/classes/requests")({
  head: () => ({ meta: [{ title: "Join requests — iTutor" }] }),
  component: JoinRequestsInbox,
});

type Req = {
  id: string;
  studentName: string;
  initials: string;
  hue: number;
  className: string;
  classId: string;
  level: string;
  message: string;
  receivedAt: string;
  status: "pending" | "approved" | "declined";
};

const SEED: Req[] = [
  { id: "r1", studentName: "Aliyah Mohammed", initials: "AM", hue: 145, className: "English A — Paper 2 Essay Workshop", classId: "c2", level: "CSEC", message: "Hi! I'm currently in Form 5 and aiming for a Grade I. I'd love to join this workshop.", receivedAt: "2h ago", status: "pending" },
  { id: "r2", studentName: "Tariq Bharath", initials: "TB", hue: 220, className: "CAPE Pure Maths — Calculus Sprint", classId: "c8", level: "Lower 6", message: "I struggled with limits last term — hoping this sprint helps me catch up before exams.", receivedAt: "Yesterday", status: "pending" },
  { id: "r3", studentName: "Maya Khan", initials: "MK", hue: 35, className: "English A — Paper 2 Essay Workshop", classId: "c2", level: "CSEC", message: "Free on Thursdays after 5. Is the workshop suitable for someone aiming for Grade II?", receivedAt: "2 days ago", status: "pending" },
  { id: "r4", studentName: "Ella Joseph", initials: "EJ", hue: 280, className: "CAPE Pure Maths — Calculus Sprint", classId: "c8", level: "Upper 6", message: "Looking for past-paper drills weekly.", receivedAt: "3 days ago", status: "approved" },
];

function JoinRequestsInbox() {
  const [requests, setRequests] = useState<Req[]>(SEED);
  const [filter, setFilter] = useState<"pending" | "approved" | "declined" | "all">("pending");

  const setStatus = (id: string, status: Req["status"]) =>
    setRequests((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    declined: requests.filter((r) => r.status === "declined").length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Link to="/tutor/lessons" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to my classes
      </Link>
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Join requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Students asking to join the classes you've marked as approval-only.</p>
      </header>

      <div className="inline-flex p-1 rounded-2xl bg-muted">
        {([
          { k: "pending", label: `Pending (${counts.pending})` },
          { k: "approved", label: `Approved (${counts.approved})` },
          { k: "declined", label: `Declined (${counts.declined})` },
          { k: "all", label: "All" },
        ] as const).map((t) => (
          <button key={t.k} onClick={() => setFilter(t.k as any)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition", filter === t.k ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <Inbox className="size-10 text-muted-foreground mx-auto" />
          <div className="mt-3 text-sm text-muted-foreground">No requests in this view.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <div className="flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-full font-bold shrink-0 text-base" style={{ background: `oklch(0.88 0.09 ${r.hue})`, color: `oklch(0.3 0.08 ${r.hue})` }}>
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <div className="text-sm font-bold text-ink">{r.studentName} <span className="text-muted-foreground font-normal">· {r.level}</span></div>
                      <Link to="/classes/$id" params={{ id: r.classId }} className="text-xs text-brand-deep hover:underline">{r.className}</Link>
                    </div>
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      r.status === "pending" && "bg-peach text-ink",
                      r.status === "approved" && "bg-brand-soft text-brand-deep",
                      r.status === "declined" && "bg-muted text-muted-foreground",
                    )}>{r.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink leading-relaxed">"{r.message}"</p>
                  <div className="mt-1 text-[11px] text-muted-foreground">{r.receivedAt}</div>

                  {r.status === "pending" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => setStatus(r.id, "approved")} className="inline-flex items-center gap-1.5 rounded-full bg-brand text-white px-4 py-2 text-sm font-bold hover:bg-brand-deep">
                        <Check className="size-4" /> Approve
                      </button>
                      <button onClick={() => setStatus(r.id, "declined")} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-muted">
                        <X className="size-4" /> Decline
                      </button>
                      <Link to="/tutor/messages" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-ink hover:bg-muted">
                        <MessageSquare className="size-4" /> Message
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
