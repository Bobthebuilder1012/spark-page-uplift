import { createFileRoute } from "@tanstack/react-router";
import { FileText, ClipboardList, Sparkles, Calculator, Timer, Layers } from "lucide-react";

export const Route = createFileRoute("/tutor/tools")({
  component: ToolsPage,
});

const TOOLS = [
  { name: "Lesson planner", desc: "Build structured lesson outlines.", icon: ClipboardList },
  { name: "Past papers", desc: "CXC / CAPE archive search.", icon: FileText },
  { name: "Quiz builder", desc: "Auto-grade student quizzes.", icon: Sparkles },
  { name: "Calculator", desc: "Scientific & graphing.", icon: Calculator },
  { name: "Pomodoro timer", desc: "Focus during prep.", icon: Timer },
  { name: "Flashcards", desc: "Build review decks.", icon: Layers },
];

function ToolsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">Available to all tutors, even before being listed.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <button key={t.name} className="text-left rounded-2xl border border-border bg-card p-5 hover:border-brand hover:shadow-card transition">
            <div className="size-10 rounded-xl bg-brand/10 text-brand-deep grid place-items-center"><t.icon className="size-5" /></div>
            <h2 className="mt-3 font-semibold text-ink">{t.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
          </button>
        ))}
      </div>
      {/* TODO(cursor): wire individual tool routes/components. */}
    </div>
  );
}
