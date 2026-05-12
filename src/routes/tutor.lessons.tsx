import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTutor, PLACEHOLDER_LESSONS, LESSON_KIND_META, type TutorLesson } from "@/lib/tutor-store";
import { Plus, Lock, Users, BookOpen, Search, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/lessons")({
  head: () => ({ meta: [{ title: "Lessons — iTutor Tutor" }] }),
  component: LessonsPage,
});

function LessonsPage() {
  const { completion } = useTutor();
  const [tab, setTab] = useState<"mine" | "archived">("mine");
  const [search, setSearch] = useState("");

  const lessons = useMemo(() => PLACEHOLDER_LESSONS.filter((l) => {
    const archMatch = tab === "archived" ? !!l.archived : !l.archived;
    const sMatch = search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase());
    return archMatch && sMatch;
  }), [tab, search]);

  const counts = {
    mine: PLACEHOLDER_LESSONS.filter((l) => !l.archived).length,
    archived: PLACEHOLDER_LESSONS.filter((l) => !!l.archived).length,
  };

  if (!completion.listed) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground"><Lock className="size-6" /></div>
        <h1 className="mt-4 text-xl font-bold text-ink">Lessons are locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete your tutor profile to create and manage lessons.</p>
        <Link to="/tutor/get-listed" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">Complete profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Lesson Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, manage, and discover lesson sessions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90 shadow-sm">
          <Plus className="size-4" /> Create a Class
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        {([["mine", "My Lessons", counts.mine], ["archived", "Archived", counts.archived]] as const).map(([k, label, c]) => (
          <button key={k} onClick={() => setTab(k)} className={cn("relative pb-3 text-sm font-semibold flex items-center gap-2 transition", tab === k ? "text-brand-deep" : "text-muted-foreground hover:text-ink")}>
            {label}
            <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full", tab === k ? "bg-brand-soft text-brand-deep" : "bg-muted text-muted-foreground")}>{c}</span>
            {tab === k && <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand" />}
          </button>
        ))}
        <div className="ml-auto relative w-72 max-w-full hidden md:block pb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((l) => <LessonCard key={l.id} l={l} />)}
        {lessons.length === 0 && (
          <div className="col-span-full text-center py-20 text-sm text-muted-foreground">
            <Archive className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3">{tab === "archived" ? "No archived lessons." : "No lessons yet — create your first class."}</p>
          </div>
        )}
      </div>
      {/* TODO(cursor): wire CRUD + recurrence + materials uploads + per-student payment ops to backend. */}
    </div>
  );
}

function LessonCard({ l }: { l: TutorLesson }) {
  const m = LESSON_KIND_META[l.kind];
  const next = new Date(l.startDate);
  return (
    <Link to="/tutor/lessons/$id" params={{ id: l.id }}
      className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className={cn("h-32 bg-gradient-to-br grid place-items-center relative", l.thumbnailGradient ?? "from-brand to-emerald-400")}>
        <BookOpen className="size-10 text-white/80" />
        {l.visibility && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-white/90 text-ink">{l.visibility}</span>
        )}
        {l.archived && <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-ink/80 text-white">Archived</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-ink truncate">{l.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{l.subject} · {l.level}</p>
          </div>
          <span className={cn("shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", m.chip)}>{m.short}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border overflow-hidden text-center">
          <div className="py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Members</div>
            <div className="text-base font-bold text-ink tabular-nums">{l.enrollments.length}</div>
          </div>
          <div className="py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</div>
            <div className="text-base font-bold text-ink tabular-nums">{l.totalSessionsRun ?? 0}</div>
          </div>
          <div className="py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Next</div>
            <div className="text-base font-bold text-purple-600">{next > new Date() ? next.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}</div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-brand-soft/50 px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-brand-deep font-bold">Earnings</span>
          <span className="text-sm font-bold text-brand-deep">TTD {(l.earningsTtd ?? 0).toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Users className="size-3" /> {l.enrollments.length}/{l.capacity} enrolled · {l.pricingMode === "per-student" ? `TTD ${l.rateTtd}/student` : `TTD ${l.rateTtd}/${l.pricingMode === "per-block" ? "block" : "session"}`}
        </div>
      </div>
    </Link>
  );
}
