import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Send } from "lucide-react";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { StarRating } from "@/components/classes/StarRating";
import { ClassEnrollmentCard } from "@/components/classes/ClassEnrollmentCard";

export const Route = createFileRoute("/classes/$id")({
  head: () => ({ meta: [{ title: "Class — iTutor" }] }),
  component: ClassDetailPage,
});

const TABS = ["About", "Stream", "Ratings"] as const;
type Tab = (typeof TABS)[number];

const CLASS = {
  id: "c1",
  name: "CSEC Mathematics — Algebra & Functions",
  subject: "Mathematics",
  tutorName: "Asha Persad",
  verified: true,
  rating: 4.8,
  ratingCount: 24,
  priceTTD: 350,
  nextBilling: "Aug 1, 2026",
  enrolled: false,
  highlights: [
    "Live weekly group session (90 minutes)",
    "All recordings and notes included",
    "Monthly progress check-in",
  ],
  description: [
    "This is a recurring monthly group class focused on the algebra and functions strand of the CSEC Mathematics syllabus. Sessions are designed to balance concept teaching with regular past-paper practice.",
    "Students get access to a shared class stream where assignments, announcements and discussions live between sessions.",
  ],
  cover: [
    "Linear and quadratic functions",
    "Indices and surds",
    "Inequalities and absolute value",
    "Sequences and series",
    "Past-paper question walkthroughs",
  ],
  schedule: "Every Tuesday, 4:00 PM – 5:30 PM",
};

const POSTS = [
  {
    id: "p1",
    author: "Asha Persad",
    role: "Tutor" as const,
    time: "2h ago",
    type: "Announcement" as const,
    body: "Reminder: tomorrow's session will focus on solving simultaneous equations. Please review the warm-up sheet I posted last week.",
    replies: 2,
  },
  {
    id: "p2",
    author: "Asha Persad",
    role: "Tutor" as const,
    time: "1d ago",
    type: "Assignment" as const,
    body: "Assignment 4: Complete questions 1–8 on page 42. Submit through the class stream by Friday.",
    replies: 5,
  },
  {
    id: "p3",
    author: "Jordan Williams",
    role: "Student" as const,
    time: "3d ago",
    type: "Discussion" as const,
    body: "Anyone else found the indices revision sheet helpful? Question 6 was tricky for me.",
    replies: 3,
  },
];

const POST_COLORS: Record<string, string> = {
  Announcement: "bg-blue-500/15 text-blue-300",
  Assignment: "bg-orange-500/15 text-orange-300",
  Discussion: "bg-purple-500/15 text-purple-300",
  Content: "bg-white/10 text-white/70",
};

const RATINGS = [
  { id: "r1", name: "Maya Khan", stars: 5, date: "Jun 12, 2026", comment: "Asha explains everything so clearly — the past-paper walkthroughs are gold.", reply: "Thanks Maya! Glad you're finding the walkthroughs helpful." },
  { id: "r2", name: "Tariq Bharath", stars: 5, date: "Jun 8, 2026", comment: "Best Maths class I've taken. The pace is just right.", reply: null },
  { id: "r3", name: "Ella Joseph", stars: 4, date: "May 30, 2026", comment: "Strong content. Would love a few more practice quizzes between sessions.", reply: "Noted — adding more quizzes from next month!" },
];

const BREAKDOWN = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

function ClassDetailPage() {
  const [tab, setTab] = useState<Tab>("About");

  return (
    <ClassesShell>
      <Link to="/classes" className="inline-flex items-center gap-1.5 text-sm text-[#A0A0A0] hover:text-white">
        <ArrowLeft className="size-4" /> Classes
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{CLASS.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#1F1F1F] px-3 py-1 text-xs font-medium text-[#A0A0A0]">{CLASS.subject}</span>
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-full bg-[#1F1F1F] text-[10px] font-bold text-white/70">
                {CLASS.tutorName.split(" ").map((s) => s[0]).join("")}
              </div>
              <span className="text-sm font-medium text-white">{CLASS.tutorName}</span>
              {CLASS.verified && <BadgeCheck className="size-4 text-[#32CC6F]" />}
            </div>
          </div>
          <div className="mt-4">
            <StarRating value={CLASS.rating} count={CLASS.ratingCount} size={18} />
          </div>

          <div className="mt-8 border-b border-[#1F1F1F]">
            <div className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-3 text-sm font-semibold transition ${
                    tab === t ? "text-white" : "text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  {t}
                  {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#32CC6F]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            {tab === "About" && <AboutTab />}
            {tab === "Stream" && <StreamTab />}
            {tab === "Ratings" && <RatingsTab />}
          </div>
        </div>

        <ClassEnrollmentCard
          c={{
            name: CLASS.name,
            priceTTD: CLASS.priceTTD,
            nextBilling: CLASS.nextBilling,
            enrolled: CLASS.enrolled,
            highlights: CLASS.highlights,
            tutor: { name: CLASS.tutorName, verified: CLASS.verified, rating: CLASS.rating, students: 24 },
          }}
        />
      </div>
    </ClassesShell>
  );
}

function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-sm leading-relaxed text-white/85">
        {CLASS.description.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A0A0A0]">What you'll cover</h3>
        <ul className="mt-3 space-y-2">
          {CLASS.cover.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-white/85">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#32CC6F]" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4">
        <div className="text-xs uppercase tracking-wider text-[#A0A0A0]">Schedule</div>
        <div className="mt-1 text-sm font-medium text-white">{CLASS.schedule}</div>
      </div>
    </div>
  );
}

function StreamTab() {
  return (
    <div className="space-y-4">
      {POSTS.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

function PostCard({ post }: { post: typeof POSTS[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#1F1F1F] text-xs font-bold text-white/70">
            {post.author.split(" ").map((s) => s[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{post.author}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                {post.role}
              </span>
            </div>
            <div className="text-xs text-[#A0A0A0]">{post.time}</div>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${POST_COLORS[post.type]}`}>
          {post.type}
        </span>
      </div>
      <p className="mt-4 text-sm text-white/85 leading-relaxed">{post.body}</p>
      <button onClick={() => setExpanded((e) => !e)} className="mt-4 text-xs font-medium text-[#A0A0A0] hover:text-white">
        {post.replies} replies
      </button>
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-[#1F1F1F] pt-4">
          <div className="rounded-lg bg-black/30 p-3 text-sm text-white/80">
            <span className="font-medium text-white">Sample reply</span> — this is a placeholder threaded reply.
          </div>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-[#1F1F1F]" />
            <input
              type="text"
              placeholder="Write a reply…"
              className="flex-1 rounded-full border border-[#1F1F1F] bg-black/40 px-4 py-2 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#32CC6F]/60"
            />
            <button className="grid size-9 place-items-center rounded-full bg-[#32CC6F] text-black">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function RatingsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#1F1F1F] bg-[#111111] p-6 sm:grid-cols-[180px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-white">{CLASS.rating.toFixed(1)}</div>
          <StarRating value={CLASS.rating} size={18} showNumber={false} />
          <div className="mt-1 text-xs text-[#A0A0A0]">{CLASS.ratingCount} ratings</div>
        </div>
        <div className="space-y-2">
          {BREAKDOWN.map((b) => (
            <div key={b.stars} className="flex items-center gap-3 text-xs">
              <span className="w-6 text-[#A0A0A0]">{b.stars}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1F1F1F]">
                <div className="h-full rounded-full bg-[#32CC6F]" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="w-10 text-right tabular-nums text-[#A0A0A0]">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {RATINGS.map((r) => (
          <div key={r.id} className="rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-[#1F1F1F] text-xs font-bold text-white/70">
                  {r.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                  <StarRating value={r.stars} size={12} showNumber={false} />
                </div>
              </div>
              <span className="text-xs text-[#A0A0A0]">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-white/85">{r.comment}</p>
            {r.reply && (
              <div className="mt-4 ml-8 rounded-xl border border-[#1F1F1F] bg-black/40 p-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-[#1F1F1F]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#32CC6F]">Tutor response</span>
                </div>
                <p className="mt-2 text-sm text-white/80">{r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="rounded-full border border-[#1F1F1F] bg-[#111111] px-5 py-2.5 text-sm font-medium text-white hover:border-[#32CC6F]/40">
          Load more
        </button>
      </div>
    </div>
  );
}
