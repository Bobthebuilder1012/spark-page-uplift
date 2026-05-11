import { createFileRoute, Link } from "@tanstack/react-router";
import { useTutor, PLACEHOLDER_LESSONS } from "@/lib/tutor-store";
import { Plus, Lock, Users, Repeat, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/tutor/lessons")({
  component: LessonsPage,
});

function LessonsPage() {
  const { completion } = useTutor();
  const listed = completion.listed;

  if (!listed) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground">
          <Lock className="size-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-ink">Lessons are locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete your tutor profile to create and manage lessons.</p>
        <Link to="/tutor/get-listed" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">
          Complete profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Lessons</h1>
          <p className="text-sm text-muted-foreground mt-1">Group lessons & courses you offer.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">
          <Plus className="size-4" /> New lesson
        </button>
      </header>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Lesson</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Level</th>
              <th className="text-left px-4 py-3 font-semibold">Enrolment</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Rate</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PLACEHOLDER_LESSONS.map((l) => (
              <tr key={l.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink">{l.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    {l.subject} {l.recurring && <><Repeat className="size-3" /> Weekly</>}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{l.level}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-ink">
                    <Users className="size-3.5 text-muted-foreground" /> {l.students} / {l.capacity}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell font-semibold text-ink">TTD {l.rateTtd}</td>
                <td className="px-4 py-3 text-right">
                  <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground inline-flex"><Pencil className="size-4" /></button>
                  <button className="size-8 grid place-items-center rounded-lg hover:bg-coral-soft text-coral inline-flex"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO(cursor): wire CRUD for lessons to backend. */}
    </div>
  );
}
