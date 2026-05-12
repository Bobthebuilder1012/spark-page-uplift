import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PLACEHOLDER_SESSIONS } from "@/lib/tutor-store";
import { Video, MessageSquare, CheckCircle2, XCircle, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/sessions")({
  head: () => ({ meta: [{ title: "Sessions — iTutor Tutor" }] }),
  component: SessionsPage,
});

function SessionsPage() {
  const [tab, setTab] = useState<"upcoming" | "past" | "pending">("upcoming");
  const now = Date.now();

  const sessions = useMemo(() => {
    return PLACEHOLDER_SESSIONS.filter((s) => {
      const t = new Date(s.date).getTime();
      if (tab === "upcoming") return s.status === "upcoming" && t >= now;
      if (tab === "past") return s.status === "past" || (s.status !== "pending" && t < now);
      if (tab === "pending") return s.status === "pending";
      return true;
    }).sort((a, b) => tab === "past" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tab, now]);

  const counts = {
    upcoming: PLACEHOLDER_SESSIONS.filter((s) => s.status === "upcoming" && new Date(s.date).getTime() >= now).length,
    past: PLACEHOLDER_SESSIONS.filter((s) => s.status === "past").length,
    pending: PLACEHOLDER_SESSIONS.filter((s) => s.status === "pending").length,
  };

  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">Upcoming, past and pending tutoring sessions.</p>
      </header>

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {(["upcoming", "past", "pending"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold capitalize",
              tab === t ? "bg-brand text-white" : "text-muted-foreground hover:text-ink")}>
            {t}
            <span className={cn("text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full", tab === t ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {sessions.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {tab === "upcoming" ? "No upcoming sessions." : tab === "past" ? "No past sessions yet." : "No pending requests."}
          </div>
        )}
        {sessions.map((s) => {
          const d = new Date(s.date);
          return (
            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-12 rounded-xl bg-brand/10 text-brand-deep grid place-items-center text-center shrink-0">
                  <div className="leading-tight">
                    <div className="text-[10px] uppercase font-bold">{d.toLocaleString(undefined, { month: "short" })}</div>
                    <div className="text-base font-bold tabular-nums">{d.getDate()}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate flex items-center gap-2">
                    {s.subject}
                    {s.attendance === "no-show" && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-coral-soft text-coral">No-show</span>}
                    {s.attendance === "attended" && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep">Attended</span>}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {s.student} · {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {s.durationMin}m · {s.type}
                    {s.paymentStatus && <> · <PayPill status={s.paymentStatus} /></>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tab === "upcoming" && (
                  <>
                    <button className="size-9 grid place-items-center rounded-lg border border-border hover:bg-muted text-muted-foreground"><MessageSquare className="size-4" /></button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Video className="size-4" /> Join</button>
                  </>
                )}
                {tab === "past" && (
                  <>
                    {!s.reviewed && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3.5" /> Awaiting review</span>}
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">View notes</button>
                  </>
                )}
                {tab === "pending" && (
                  <>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-coral-soft text-coral text-sm font-semibold hover:bg-coral-soft"><XCircle className="size-4" /> Decline</button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><CheckCircle2 className="size-4" /> Accept</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PayPill({ status }: { status: "paid" | "pending" | "overdue" }) {
  const m = { paid: "text-brand-deep", pending: "text-amber-600", overdue: "text-coral" }[status];
  return <span className={cn("font-semibold capitalize", m)}>{status}</span>;
}
