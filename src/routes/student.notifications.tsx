import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Calendar, MessageCircle, FileText, Star, CheckCheck, Settings as SettingsIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassRatingModal } from "@/components/classes/ClassRatingModal";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({ meta: [{ title: "Notifications — iTutor Student" }] }),
  component: Notifications,
});

type NotifType = "lesson" | "message" | "assignment" | "review" | "system" | "class_rating";

type Notif = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  className?: string;
  tutorName?: string;
};

const NOTIFS: Notif[] = [
  { id: "0", type: "class_rating", title: "How is your CSEC Mathematics class going?", body: "Your monthly payment was confirmed. Take 30 seconds to rate the class.", time: "Just now", unread: true, className: "CSEC Mathematics — Algebra & Functions", tutorName: "Asha Persad" },
  { id: "1", type: "lesson", title: "Lesson starting in 15 minutes", body: "CSEC Maths with Mr. Ramdeen — meeting link is open.", time: "Just now", unread: true },
  { id: "2", type: "message", title: "Mr. Ramdeen sent a message", body: "Great work today! Here are the practice problems for next session.", time: "2h ago", unread: true },
  { id: "3", type: "assignment", title: "New assignment posted", body: "Past Paper 2023 Q1–5 due Friday 6 PM in CSEC Maths.", time: "Yesterday", unread: true },
  { id: "4", type: "review", title: "Rate your last lesson", body: "How was Physics with Ms. Singh? Your feedback helps other students.", time: "Yesterday", unread: false },
  { id: "5", type: "lesson", title: "Lesson rescheduled", body: "English Lit moved to Thursday 5:00 PM.", time: "2d ago", unread: false },
  { id: "6", type: "system", title: "Weekly summary ready", body: "You completed 4 lessons and submitted 2 assignments this week. ", time: "3d ago", unread: false },
];

const META: Record<NotifType, { icon: any; bg: string; color: string; label: string }> = {
  lesson: { icon: Calendar, bg: "bg-coral-soft", color: "text-coral", label: "Lessons" },
  message: { icon: MessageCircle, bg: "bg-sky", color: "text-ink", label: "Messages" },
  assignment: { icon: FileText, bg: "bg-lavender", color: "text-ink", label: "Assignments" },
  review: { icon: Star, bg: "bg-peach", color: "text-ink", label: "Reviews" },
  system: { icon: Bell, bg: "bg-brand-soft", color: "text-brand-deep", label: "System" },
  class_rating: { icon: Star, bg: "bg-brand-soft", color: "text-brand-deep", label: "Class Rating" },
};

const FILTERS = ["All", "Unread", "Lessons", "Messages", "Assignments"] as const;

function Notifications() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [items, setItems] = useState(NOTIFS);
  const [ratingTarget, setRatingTarget] = useState<Notif | null>(null);

  const filtered = items.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    if (filter === "Lessons") return n.type === "lesson";
    if (filter === "Messages") return n.type === "message";
    if (filter === "Assignments") return n.type === "assignment";
    return true;
  });

  const unreadCount = items.filter((n) => n.unread).length;
  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, unread: false })));
  const toggleRead = (id: string) => setItems((p) => p.map((n) => n.id === id ? { ...n, unread: !n.unread } : n));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-2xl bg-coral-soft grid place-items-center">
          <Bell className="size-5 text-coral" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-coral text-white text-[10px] font-bold grid place-items-center">{unreadCount}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-brand-deep hover:bg-brand-soft disabled:opacity-40"
        >
          <CheckCheck className="size-4" /> Mark all read
        </button>
        <Link to="/student/settings" className="size-9 grid place-items-center rounded-xl border border-border hover:bg-muted text-muted-foreground" title="Notification settings">
          <SettingsIcon className="size-4" />
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="size-4 text-muted-foreground shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition",
              filter === f
                ? "bg-ink text-white border-ink"
                : "bg-background border-border text-muted-foreground hover:border-brand"
            )}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className={cn("ml-1.5 inline-grid place-items-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold", filter === f ? "bg-white text-ink" : "bg-coral text-white")}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-3xl bg-background border border-border overflow-hidden">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="size-14 mx-auto rounded-2xl bg-muted grid place-items-center mb-3">
              <Bell className="size-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-ink">Nothing here</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different filter.</p>
          </div>
        )}
        {filtered.map((n) => {
          const meta = META[n.type];
          const Icon = meta.icon;
          return (
            <button
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={cn(
                "w-full text-left flex gap-3 p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition relative",
                n.unread && "bg-brand-soft/30"
              )}
            >
              {n.unread && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 size-2 rounded-full bg-coral" />}
              <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", meta.bg)}>
                <Icon className={cn("size-4", meta.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("text-sm", n.unread ? "font-semibold text-ink" : "font-medium text-ink/80")}>{n.title}</div>
                  <div className="text-[11px] text-muted-foreground shrink-0">{n.time}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1.5">{meta.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
