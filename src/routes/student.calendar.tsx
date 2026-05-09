import { createFileRoute } from "@tanstack/react-router";
import { CalendarGrid } from "@/components/student/CalendarPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/student/calendar")({
  head: () => ({ meta: [{ title: "Calendar — iTutor Student" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const monthLabel = new Date().toLocaleString("en", { month: "long", year: "numeric" });
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-ink">Calendar</h1>
        <div className="ml-2 flex items-center gap-1">
          <button className="size-8 grid place-items-center rounded-full hover:bg-muted"><ChevronLeft className="size-4" /></button>
          <button className="size-8 grid place-items-center rounded-full hover:bg-muted"><ChevronRight className="size-4" /></button>
        </div>
        <div className="font-semibold text-ink">{monthLabel}</div>
        <div className="ml-auto inline-flex rounded-full bg-muted p-0.5 text-sm font-medium">
          <button className="px-3 py-1 rounded-full bg-background shadow-sm">Week</button>
          <button className="px-3 py-1 text-muted-foreground">Month</button>
        </div>
      </div>
      <div className="flex-1 rounded-2xl bg-background border border-border overflow-hidden">
        <CalendarGrid />
      </div>
    </div>
  );
}
