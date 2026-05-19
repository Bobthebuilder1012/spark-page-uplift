import { createFileRoute, Link } from "@tanstack/react-router";
import { useTutor, PLACEHOLDER_SESSIONS, PLACEHOLDER_ACTIVITY } from "@/lib/tutor-store";
import {
  Users, CalendarDays, DollarSign, Eye, Lock, Plus, Clock, BookOpen,
  UserCircle, ArrowRight, Video, MessageSquare, Star, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/")({
  component: TutorDashboard,
});

function StatCard({ icon: Icon, label, value, locked }: any) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 relative", locked && "opacity-60")}>
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-brand/10 text-brand-deep grid place-items-center">
          <Icon className="size-4" />
        </div>
        {locked && (
          <span title="Available once your profile is complete." className="text-muted-foreground">
            <Lock className="size-3.5" />
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-ink tabular-nums">{locked ? "—" : value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function TutorDashboard() {
  const { profile, completion } = useTutor();
  const listed = completion.listed;
  const upcoming = PLACEHOLDER_SESSIONS.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Welcome back, {profile.name.split(" ")[0]}.</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {listed ? "Here's what's happening with your students today." : "Finish setting up your profile to unlock teaching tools."}
        </p>
      </header>

      {listed && PLACEHOLDER_RECURRING_REQUESTS.length > 0 && (
        <Link to="/tutor/lessons/new"
          className="group flex items-center gap-4 rounded-2xl border-2 border-brand bg-gradient-to-r from-brand-soft to-mint p-4 lg:p-5 hover:shadow-md transition">
          <div className="size-11 rounded-xl bg-brand text-white grid place-items-center shrink-0">
            <UserPlus className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-ink">{PLACEHOLDER_RECURRING_REQUESTS.length} new recurring 1:1 request{PLACEHOLDER_RECURRING_REQUESTS.length === 1 ? "" : "s"}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-coral text-white">Action needed</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              From {PLACEHOLDER_RECURRING_REQUESTS.slice(0, 2).map((r) => r.studentName.split(" ")[0]).join(", ")}{PLACEHOLDER_RECURRING_REQUESTS.length > 2 ? ` +${PLACEHOLDER_RECURRING_REQUESTS.length - 2} more` : ""} — accept to start a Class.
            </p>
          </div>
          <ChevronRight className="size-5 text-brand-deep group-hover:translate-x-0.5 transition" />
        </Link>
      )}

      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard icon={Users} label="Active students" value="14" locked={!listed} />
          <StatCard icon={CalendarDays} label="Upcoming sessions" value="5" locked={!listed} />
          <StatCard icon={DollarSign} label="This month (TTD)" value="3,640" locked={!listed} />
          <StatCard icon={Eye} label="Profile views" value="128" locked={!listed} />
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-ink">Upcoming sessions</h2>
              <p className="text-xs text-muted-foreground">Next 5 confirmed bookings</p>
            </div>
            <Link to="/tutor/sessions" className="text-xs font-semibold text-brand-deep hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {upcoming.map((s) => {
              const d = new Date(s.date);
              return (
                <li key={s.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/40 transition">
                  <div className="size-9 rounded-lg bg-brand/10 text-brand-deep grid place-items-center text-xs font-bold tabular-nums">
                    {d.getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{s.subject}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {s.student} · {d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {s.durationMin}m
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.type}</span>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">
                    <Video className="size-3" /> Join
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold text-ink">Quick actions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Jump into common tasks</p>
          <div className="mt-4 space-y-2">
            <QuickAction to="/tutor/lessons/new" icon={Plus} label="Create a Class" gated={!listed} />
            <QuickAction to="/tutor/availability" icon={Clock} label="Manage availability" />
            <QuickAction to="/tutor/wallet" icon={Wallet} label="My Wallet" />
            <QuickAction to="/tutor/students" icon={UserCircle} label="My Students" />
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold text-ink">Recent activity</h2>
          <ul className="mt-3 space-y-3">
            {PLACEHOLDER_ACTIVITY.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="size-7 rounded-full bg-muted text-muted-foreground grid place-items-center mt-0.5">
                  {a.kind === "inquiry" && <MessageSquare className="size-3.5" />}
                  {a.kind === "review" && <Star className="size-3.5" />}
                  {a.kind === "payout" && <Wallet className="size-3.5" />}
                  {a.kind === "booking" && <CalendarDays className="size-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-ink">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.at}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold text-ink">Tools</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Always available</p>
          <Link to="/tutor/tools" className="mt-4 block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 text-ink">
            Open tools
          </Link>
        </div>
      </section>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, gated }: { to: string; icon: any; label: string; gated?: boolean }) {
  if (gated) {
    return (
      <button
        title="Available once your profile is complete."
        disabled
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground cursor-not-allowed"
      >
        <Icon className="size-4" />
        <span className="flex-1 text-left">{label}</span>
        <Lock className="size-3.5" />
      </button>
    );
  }
  return (
    <Link to={to as any} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border text-sm font-medium text-ink hover:bg-muted transition">
      <Icon className="size-4 text-brand-deep" />
      <span className="flex-1 text-left">{label}</span>
      <ArrowRight className="size-3.5 text-muted-foreground" />
    </Link>
  );
}
