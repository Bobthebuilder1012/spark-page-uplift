import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ALL_LESSONS } from "@/lib/student-store";
import { ArrowLeft, FileText, Video, MessageCircle, Paperclip } from "lucide-react";

export const Route = createFileRoute("/student/lessons/$id")({
  head: ({ params }) => ({ meta: [{ title: `Lesson — iTutor Student` }] }),
  component: LessonDetail,
});

const POSTS = [
  { id: 1, type: "announcement", title: "Welcome to this term!", body: "Looking forward to working with you all. Please bring your textbooks to every session.", time: "2 days ago" },
  { id: 2, type: "assignment", title: "Homework: Past Paper 2023 Q1-5", body: "Complete and submit by Friday 6pm.", time: "Yesterday", attachments: 1 },
  { id: 3, type: "material", title: "Class notes — Functions", body: "Review notes from today's lesson.", time: "3 hours ago", attachments: 2 },
];

const ICONS: Record<string, any> = {
  announcement: { icon: MessageCircle, color: "bg-sky text-ink" },
  assignment: { icon: FileText, color: "bg-coral-soft text-coral" },
  material: { icon: Paperclip, color: "bg-lavender text-ink" },
};

function LessonDetail() {
  const { id } = Route.useParams();
  const lesson = ALL_LESSONS.find((l) => l.id === id);
  if (!lesson) throw notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/student/lessons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All lessons
      </Link>

      {/* Banner */}
      <div
        className="rounded-3xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, color-mix(in oklab, var(--${lesson.color}) 50%, white), color-mix(in oklab, var(--${lesson.color}) 20%, white))` }}
      >
        <div className="text-5xl mb-3">{lesson.emoji}</div>
        <div className="text-xs uppercase tracking-wider text-ink/70 font-bold">{lesson.subject}</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink mt-1">{lesson.title}</h1>
        <div className="text-sm text-ink/80 mt-1">with {lesson.tutor}</div>
        <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-forest">
          <Video className="size-4" /> Join next session
        </button>
      </div>

      {/* Stream */}
      <div className="space-y-3">
        <h2 className="font-semibold text-ink px-1">Class stream</h2>
        {POSTS.map((p) => {
          const meta = ICONS[p.type];
          const Icon = meta.icon;
          return (
            <div key={p.id} className="rounded-2xl bg-background border border-border p-4 flex gap-3">
              <div className={`size-10 rounded-xl grid place-items-center flex-shrink-0 ${meta.color}`}>
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-ink">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.time}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{p.body}</p>
                {p.attachments && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-deep font-medium">
                    <Paperclip className="size-3.5" /> {p.attachments} attachment{p.attachments > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
