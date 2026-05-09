import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Clock,
  Video,
  Flame,
  Trophy,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [{ title: "Home — iTutor Student" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Hey Aliyah 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">You're on a 6-day streak. Keep going!</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral-soft text-coral text-sm font-semibold">
          <Flame className="size-4" /> 6 day streak
        </div>
      </div>

      {/* Today hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-6 lg:p-8 text-white shadow-pop"
      >
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-white/70 font-semibold">Next lesson · in 23 min</div>
            <h2 className="text-2xl lg:text-3xl font-bold mt-1">CSEC Mathematics — Functions</h2>
            <div className="flex items-center gap-3 text-sm text-white/85 mt-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-white/20 grid place-items-center text-xs font-semibold">MR</div>
                Mr. Ramdeen
              </div>
              <span className="text-white/40">•</span>
              <Clock className="size-3.5" /> 4:00 – 5:00 PM
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-forest font-semibold hover:bg-white/90 transition">
              <Video className="size-4" /> Join lesson
            </button>
            <button className="px-4 py-3 rounded-2xl bg-white/15 text-white font-semibold hover:bg-white/25 transition">
              Reschedule
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Lessons this week", value: "4", icon: Calendar, tint: "bg-sky/40" },
          { label: "Hours studied", value: "12.5", icon: Clock, tint: "bg-lavender/60" },
          { label: "Avg. score", value: "87%", icon: Trophy, tint: "bg-peach/60" },
          { label: "Topics mastered", value: "23", icon: CheckCircle2, tint: "bg-brand-soft" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-background border border-border p-4">
            <div className={`size-9 rounded-xl ${s.tint} grid place-items-center mb-2`}>
              <s.icon className="size-4 text-forest" />
            </div>
            <div className="text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming */}
        <div className="lg:col-span-2 rounded-3xl bg-background border border-border p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Upcoming lessons</h3>
            <Link to="/student/bookings" className="text-sm text-brand-deep font-medium inline-flex items-center gap-1 hover:underline">
              See all <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { day: "TUE", date: "12", subject: "Physics — Waves", tutor: "Ms. Singh", time: "5:30 PM", color: "bg-sky/50" },
              { day: "WED", date: "13", subject: "English Lit — Essays", tutor: "Mr. Joseph", time: "4:00 PM", color: "bg-lavender/60" },
              { day: "FRI", date: "15", subject: "Maths — Calculus", tutor: "Mr. Ramdeen", time: "4:00 PM", color: "bg-brand-soft" },
            ].map((l) => (
              <div key={l.subject} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition cursor-pointer">
                <div className={`size-12 rounded-xl ${l.color} grid place-items-center flex-shrink-0`}>
                  <div className="text-center leading-none">
                    <div className="text-[10px] font-semibold text-forest/70">{l.day}</div>
                    <div className="text-base font-bold text-forest">{l.date}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ink truncate">{l.subject}</div>
                  <div className="text-xs text-muted-foreground">{l.tutor} · {l.time}</div>
                </div>
                <button className="text-xs font-semibold text-brand-deep px-3 py-1.5 rounded-full hover:bg-brand-soft">Details</button>
              </div>
            ))}
          </div>
        </div>

        {/* Continue learning */}
        <div className="rounded-3xl bg-background border border-border p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 text-coral" />
            <h3 className="font-semibold text-ink">Continue learning</h3>
          </div>
          <div className="space-y-3">
            {[
              { topic: "Quadratic equations", progress: 65, subject: "Maths" },
              { topic: "Newton's 2nd law", progress: 40, subject: "Physics" },
              { topic: "Persuasive writing", progress: 80, subject: "English" },
            ].map((t) => (
              <div key={t.topic} className="p-3 rounded-2xl bg-muted/40 hover:bg-muted transition cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-muted-foreground">{t.subject}</div>
                    <div className="text-sm font-semibold text-ink">{t.topic}</div>
                  </div>
                  <PlayCircle className="size-7 text-brand" />
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand to-brand-deep rounded-full" style={{ width: `${t.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
