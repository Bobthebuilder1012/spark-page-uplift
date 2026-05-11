import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PLACEHOLDER_SESSIONS } from "@/lib/tutor-store";
import { Video, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/sessions")({
  component: SessionsPage,
});

function SessionsPage() {
  const [tab, setTab] = useState<"upcoming" | "past" | "pending">("upcoming");
  const sessions = PLACEHOLDER_SESSIONS; // TODO(cursor): filter by status from backend.

  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">Your scheduled and past tutoring sessions.</p>
      </header>

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {(["upcoming", "past", "pending"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("px-3 py-1.5 rounded-md text-sm font-semibold capitalize", tab === t ? "bg-brand text-white" : "text-muted-foreground hover:text-ink")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {sessions.map((s) => {
          const d = new Date(s.date);
          return (
            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-12 rounded-xl bg-brand/10 text-brand-deep grid place-items-center text-center">
                  <div className="leading-tight">
                    <div className="text-[10px] uppercase font-bold">{d.toLocaleString(undefined, { month: "short" })}</div>
                    <div className="text-base font-bold tabular-nums">{d.getDate()}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{s.subject}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {s.student} · {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {s.durationMin}m · {s.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="size-9 grid place-items-center rounded-lg border border-border hover:bg-muted text-muted-foreground"><MessageSquare className="size-4" /></button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
                  <Video className="size-4" /> Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
