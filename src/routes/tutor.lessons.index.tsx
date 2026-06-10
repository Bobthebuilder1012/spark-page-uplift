import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTutor, PLACEHOLDER_LESSONS, LESSON_KIND_META, type TutorLesson } from "@/lib/tutor-store";
import {
  Plus, Lock, Users, BookOpen, Search, MoreVertical, Settings as SettingsIcon,
  Globe, Trash2, Calendar as CalendarIcon, TrendingUp, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/tutor/lessons/")({
  head: () => ({ meta: [{ title: "My Classes — iTutor Tutor" }] }),
  component: LessonsPage,
});

type KindFilter = "all" | "group" | "1on1";

function LessonsPage() {
  const { completion } = useTutor();
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [lessons, setLessons] = useState<TutorLesson[]>(PLACEHOLDER_LESSONS);
  const [pendingDelete, setPendingDelete] = useState<TutorLesson | null>(null);

  const visibleLessons = useMemo(() => lessons.filter((l) => {
    if (l.archived) return false;
    if (kind === "group" && !l.kind.startsWith("group")) return false;
    if (kind === "1on1" && !l.kind.startsWith("1on1")) return false;
    if (search) {
      const t = search.toLowerCase();
      if (!l.title.toLowerCase().includes(t) && !l.subject.toLowerCase().includes(t)) return false;
    }
    return true;
  }), [lessons, search, kind]);

  const totals = useMemo(() => {
    const active = lessons.filter((l) => !l.archived);
    return {
      classes: active.length,
      students: active.reduce((sum, l) => sum + l.enrollments.length, 0),
      earnings: active.reduce((sum, l) => sum + (l.earningsTtd ?? 0), 0),
    };
  }, [lessons]);

  const toggleVisibility = (id: string) => {
    setLessons((prev) => prev.map((l) => {
      if (l.id !== id) return l;
      const next = l.visibility === "public" ? "private" : "public";
      toast.success(`"${l.title}" is now ${next}`);
      return { ...l, visibility: next };
    }));
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setLessons((prev) => prev.filter((l) => l.id !== pendingDelete.id));
    toast.success(`Deleted "${pendingDelete.title}"`);
    setPendingDelete(null);
  };

  if (!completion.listed) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground"><Lock className="size-6" /></div>
        <h1 className="mt-4 text-xl font-bold text-ink">My Classes is locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete your tutor profile to create and manage your classes.</p>
        <Link to="/tutor/get-listed" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">Complete profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Workspace</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-ink mt-1 tracking-tight">My Classes</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Create, manage and grow every class you run on iTutor.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link to="/tutor/classes/requests" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-ink hover:bg-muted">
            Join requests
          </Link>
          <Link to="/tutor/classes/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-ink/90 shadow-sm">
            <Plus className="size-4" /> Create a class
          </Link>
        </div>
      </header>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatTile icon={<BookOpen className="size-4" />} label="Active classes" value={totals.classes.toString()} tint="brand" />
        <StatTile icon={<Users className="size-4" />} label="Total members" value={totals.students.toString()} tint="ink" />
        <StatTile icon={<TrendingUp className="size-4" />} label="Lifetime earnings" value={`TTD ${totals.earnings.toLocaleString()}`} tint="coral" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 pb-4 border-b border-border">
        <div className="inline-flex p-1 rounded-xl bg-muted text-xs font-semibold">
          {([
            { id: "all", label: "All" },
            { id: "group", label: "Group" },
            { id: "1on1", label: "1-on-1" },
          ] as { id: KindFilter; label: string }[]).map((f) => (
            <button key={f.id} onClick={() => setKind(f.id)}
              className={cn("px-3 py-1.5 rounded-lg capitalize transition", kind === f.id ? "bg-background text-ink shadow-sm" : "text-muted-foreground hover:text-ink")}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or subject"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      {/* Grid */}
      {visibleLessons.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto size-12 rounded-2xl bg-brand-soft text-brand-deep grid place-items-center mb-4">
            <BookOpen className="size-5" />
          </div>
          <h2 className="font-bold text-ink">No classes match</h2>
          <p className="text-sm text-muted-foreground mt-1">Try a different filter — or create a new class.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleLessons.map((l) => (
            <LessonCard key={l.id} l={l}
              onToggleVisibility={() => toggleVisibility(l.id)}
              onDelete={() => setPendingDelete(l)}
            />
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this class?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.title}" and all of its stream posts, sessions and roster history will be permanently removed. Enrolled students will be notified. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-coral text-white hover:bg-coral/90">
              Delete class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatTile({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: "brand" | "ink" | "coral" }) {
  const tints = {
    brand: "bg-brand-soft text-brand-deep",
    ink: "bg-ink/5 text-ink",
    coral: "bg-coral/10 text-coral",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={cn("size-9 rounded-xl grid place-items-center shrink-0", tints[tint])}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground truncate">{label}</div>
        <div className="text-base sm:text-lg font-bold text-ink truncate tabular-nums">{value}</div>
      </div>
    </div>
  );
}

function LessonCard({
  l, onToggleVisibility, onDelete,
}: {
  l: TutorLesson;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const m = LESSON_KIND_META[l.kind];
  const navigate = useNavigate();
  const next = new Date(l.startDate);
  const upcoming = next > new Date();
  const isPublic = l.visibility !== "private";
  const goToLesson = () => navigate({ to: "/tutor/lessons/$id", params: { id: l.id } });
  // Derive a deterministic hue from the title so the card feels branded.
  const hue = (Array.from(l.subject + l.title).reduce((a, c) => a + c.charCodeAt(0), 0) * 7) % 360;
  const mark = (l.subject?.[0] ?? "?").toUpperCase();
  const enrolled = l.enrollments.length;
  const seatPct = Math.min(100, Math.round((enrolled / Math.max(1, l.capacity)) * 100));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToLesson}
      onKeyDown={(e) => { if (e.key === "Enter") goToLesson(); }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-deep/30 transition-all cursor-pointer flex flex-col"
    >
      {/* Coursera-style branded banner */}
      <div
        className="relative h-32 overflow-hidden"
        style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${hue}), oklch(0.55 0.16 ${hue}))` }}
      >
        <span className="absolute right-2 -bottom-3 text-[7rem] leading-none opacity-25 font-black text-white select-none">{mark}</span>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/85 text-ink px-2 py-0.5">{l.level}</span>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", m.chip)}>{m.short}</span>
        </div>
        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur",
            isPublic ? "bg-white/85 text-ink" : "bg-ink/80 text-white",
          )}>
            {isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
            {isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>

      {/* Body — mirrors student-side class card */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] uppercase tracking-wider font-bold text-brand-deep">{l.subject}</div>
        <h3 className="mt-1 font-bold text-ink leading-snug line-clamp-2">{l.title}</h3>

        {/* Capacity progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Users className="size-3" /> {enrolled}/{l.capacity} enrolled</span>
            <span className="tabular-nums">{seatPct}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-brand-deep" style={{ width: `${seatPct}%` }} />
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarIcon className="size-3" /> {upcoming ? next.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "No upcoming"}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><TrendingUp className="size-3" /> TTD {(l.earningsTtd ?? 0).toLocaleString()}</span>
        </div>

        {/* Footer — price (what students see) + tutor actions */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="text-base font-bold text-ink">TTD ${l.rateTtd}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">per session</div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to="/tutor/lessons/$id" params={{ id: l.id }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition"
            >
              <Eye className="size-3.5" /> Open
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="More options"
                  className="inline-flex items-center justify-center size-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-ink hover:border-ink transition"
                >
                  <MoreVertical className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate({ to: "/tutor/lessons/$id", params: { id: l.id } })}>
                  <SettingsIcon className="size-4 mr-2" /> Open settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/tutor/lessons/$id", params: { id: l.id } })}>
                  <CalendarIcon className="size-4 mr-2" /> View sessions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleVisibility}>
                  {isPublic ? <Lock className="size-4 mr-2" /> : <Globe className="size-4 mr-2" />}
                  Switch to {isPublic ? "private" : "public"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-coral focus:text-coral">
                  <Trash2 className="size-4 mr-2" /> Delete class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
