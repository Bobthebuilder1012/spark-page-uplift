import { createFileRoute, Link } from "@tanstack/react-router";
import { ALL_LESSONS } from "@/lib/student-store";
import { ArrowRight, Users } from "lucide-react";

export const Route = createFileRoute("/student/lessons/")({
  head: () => ({ meta: [{ title: "My lessons — iTutor Student" }] }),
  component: LessonsList,
});

function LessonsList() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">My lessons</h1>
        <p className="text-sm text-muted-foreground mt-1">All your enrolled lessons in one place</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_LESSONS.map((l) => (
          <Link
            key={l.id}
            to="/student/lessons/$id"
            params={{ id: l.id }}
            className="group rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            <div
              className="h-24 flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, color-mix(in oklab, var(--${l.color}) 35%, white), color-mix(in oklab, var(--${l.color}) 15%, white))` }}
            >
              {l.emoji}
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{l.subject}</div>
              <div className="font-semibold text-ink mt-1">{l.title}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" /> {l.tutor}
                </div>
                <ArrowRight className="size-4 text-brand-deep group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
