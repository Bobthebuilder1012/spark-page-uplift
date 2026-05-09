import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, Calculator, Sparkles, Clock, GraduationCap, Brain, Wrench } from "lucide-react";

export const Route = createFileRoute("/student/tools")({
  head: () => ({
    meta: [{ title: "Tools — iTutor Student" }],
  }),
  component: Tools,
});

const TOOLS = [
  { name: "Past papers", desc: "10+ years of CSEC & CAPE papers, searchable by topic", icon: FileText, tint: "bg-sky", iconColor: "text-ink" },
  { name: "Practice quiz", desc: "Adaptive questions with instant feedback and progress tracking", icon: Sparkles, tint: "bg-coral-soft", iconColor: "text-coral" },
  { name: "Scientific calculator", desc: "Full scientific & graphing calculator built in", icon: Calculator, tint: "bg-lavender", iconColor: "text-ink" },
  { name: "Formula sheet", desc: "Quick reference cards for every subject", icon: BookOpen, tint: "bg-brand-soft", iconColor: "text-brand-deep" },
  { name: "Pomodoro timer", desc: "25-minute focused study sessions with breaks", icon: Clock, tint: "bg-peach", iconColor: "text-ink" },
  { name: "Flashcards", desc: "Make and study flashcards with spaced repetition", icon: Brain, tint: "bg-coral-soft", iconColor: "text-coral" },
];

function Tools() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-lavender grid place-items-center">
          <Wrench className="size-5 text-ink" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Tools</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Everything you need to study smarter</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <button
            key={t.name}
            className="text-left rounded-3xl bg-background border border-border p-5 hover:shadow-card hover:-translate-y-0.5 transition group"
          >
            <div className={`size-12 rounded-2xl ${t.tint} grid place-items-center mb-3 group-hover:scale-105 transition`}>
              <t.icon className={`size-5 ${t.iconColor}`} />
            </div>
            <div className="font-semibold text-ink">{t.name}</div>
            <div className="text-sm text-muted-foreground mt-1">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-brand-soft via-background to-coral-soft border border-border p-6 flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-background grid place-items-center shadow-sm">
          <GraduationCap className="size-5 text-brand-deep" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-ink">Need help with a specific topic?</div>
          <p className="text-sm text-muted-foreground mt-0.5">Find a tutor who specialises in what you're studying.</p>
        </div>
        <a href="/student/tutors" className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-forest">Browse</a>
      </div>
    </div>
  );
}
