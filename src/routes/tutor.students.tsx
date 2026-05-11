import { createFileRoute } from "@tanstack/react-router";
import { PLACEHOLDER_STUDENTS } from "@/lib/tutor-store";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/tutor/students")({
  component: StudentsPage,
});

function StudentsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Students</h1>
        <p className="text-sm text-muted-foreground mt-1">Active and past students you've worked with.</p>
      </header>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Student</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Year</th>
              <th className="text-left px-4 py-3 font-semibold">Subject</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Sessions</th>
              <th className="text-right px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PLACEHOLDER_STUDENTS.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-coral-soft text-coral grid place-items-center text-xs font-bold">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-semibold text-ink">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.level}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.subject}</td>
                <td className="px-4 py-3 text-ink hidden md:table-cell tabular-nums">{s.sessions}</td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted">
                    <MessageSquare className="size-3.5" /> Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
