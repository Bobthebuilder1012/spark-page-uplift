import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, MoreHorizontal, RotateCcw, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/bookings")({
  head: () => ({
    meta: [{ title: "My bookings — iTutor Student" }],
  }),
  component: Bookings,
});

const UPCOMING = [
  { id: "1", subject: "CSEC Maths — Functions", tutor: "Mr. Ramdeen", initials: "MR", date: "Today", time: "4:00 – 5:00 PM", status: "soon" },
  { id: "2", subject: "Physics — Waves", tutor: "Ms. Singh", initials: "MS", date: "Tue 12 May", time: "5:30 – 6:30 PM", status: "scheduled" },
  { id: "3", subject: "English Lit — Essays", tutor: "Mr. Joseph", initials: "MJ", date: "Wed 13 May", time: "4:00 – 5:00 PM", status: "scheduled" },
];

const PAST = [
  { id: "4", subject: "CSEC Maths — Algebra", tutor: "Mr. Ramdeen", initials: "MR", date: "Last Friday", time: "4:00 PM", status: "completed", rated: false },
  { id: "5", subject: "Physics — Mechanics", tutor: "Ms. Singh", initials: "MS", date: "May 5", time: "5:30 PM", status: "completed", rated: true },
  { id: "6", subject: "Biology — Cells", tutor: "Ms. Ali", initials: "MA", date: "May 2", time: "6:00 PM", status: "cancelled", rated: false },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    soon: "bg-coral-soft text-coral",
    scheduled: "bg-sky/40 text-forest",
    completed: "bg-brand-soft text-forest",
    cancelled: "bg-muted text-muted-foreground",
  };
  const labels: Record<string, string> = {
    soon: "Starts soon",
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider", map[status])}>{labels[status]}</span>;
}

function BookingCard({ b, past = false }: { b: (typeof UPCOMING)[number] & { rated?: boolean }; past?: boolean }) {
  return (
    <div className="rounded-2xl bg-background border border-border p-4 hover:shadow-card transition">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-semibold flex-shrink-0">
          {b.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-ink truncate">{b.subject}</h3>
            <StatusPill status={b.status} />
          </div>
          <div className="text-sm text-muted-foreground mt-1">{b.tutor}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Calendar className="size-3.5" /> {b.date} · {b.time}
          </div>
        </div>
        <button className="size-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        {!past && b.status === "soon" && (
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-deep">
            <Video className="size-4" /> Join now
          </button>
        )}
        {!past && b.status === "scheduled" && (
          <>
            <button className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">Reschedule</button>
            <button className="px-4 py-2.5 rounded-xl text-muted-foreground font-semibold text-sm hover:bg-muted">Cancel</button>
          </>
        )}
        {past && b.status === "completed" && !b.rated && (
          <>
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-coral-soft text-coral font-semibold text-sm hover:bg-coral hover:text-white">
              <Star className="size-4" /> Rate session
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">
              <RotateCcw className="size-4" /> Rebook
            </button>
          </>
        )}
        {past && b.status === "completed" && b.rated && (
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">
            <RotateCcw className="size-4" /> Book again
          </button>
        )}
        {past && b.status === "cancelled" && (
          <button className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted">Book again</button>
        )}
      </div>
    </div>
  );
}

function Bookings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">My bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">All your lessons in one place</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-background border border-border p-1 h-11 rounded-2xl">
          <TabsTrigger value="upcoming" className="rounded-xl px-5 data-[state=active]:bg-brand-soft data-[state=active]:text-forest">
            Upcoming · {UPCOMING.length}
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-xl px-5 data-[state=active]:bg-brand-soft data-[state=active]:text-forest">
            Past · {PAST.length}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-3">
          {UPCOMING.map((b) => <BookingCard key={b.id} b={b} />)}
        </TabsContent>
        <TabsContent value="past" className="mt-6 space-y-3">
          {PAST.map((b) => <BookingCard key={b.id} b={b} past />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
