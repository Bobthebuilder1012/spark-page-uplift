import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Flag, MessageSquare, TrendingUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/reviews")({
  head: () => ({ meta: [{ title: "Reviews — iTutor Tutor" }] }),
  component: ReviewsPage,
});

// TODO(cursor): submission, reply persistence, flag workflow, request triggers.

type Review = {
  id: string; student: string; initials: string; date: string; rating: number;
  comment: string; lesson: string; reply?: string;
};

const REVIEWS: Review[] = [
  { id: "r1", student: "Aliyah Mohammed", initials: "AM", date: "2 days ago", rating: 5, comment: "Anil sir is very patient and explains every step clearly. My confidence in algebra has gone up so much. Highly recommend for CSEC Maths!", lesson: "CSEC Maths Crash Course", reply: "Thanks Aliyah! Keep up the great work — you're going to crush the exam." },
  { id: "r2", student: "Devon Charles", initials: "DC", date: "1 week ago", rating: 5, comment: "Best Physics tutor in T&T. Helped me pass my SBA easily.", lesson: "Physics 1:1" },
  { id: "r3", student: "Keshawn Boodoo", initials: "KB", date: "2 weeks ago", rating: 4, comment: "Strong on calculus, would love more past paper drills.", lesson: "CAPE Pure Maths" },
  { id: "r4", student: "Sade Williams", initials: "SW", date: "3 weeks ago", rating: 5, comment: "Sade looks forward to her sessions every week. Thank you!", lesson: "CSEC Add. Maths" },
  { id: "r5", student: "Renée Phillip", initials: "RP", date: "1 month ago", rating: 4, comment: "Great diagnostic session, gave me a clear plan.", lesson: "English A · Diagnostic" },
];

const ELIGIBLE = [
  { id: "e1", name: "Trinity Hosein", lastSession: "5 days ago", sessions: 3 },
  { id: "e2", name: "Marcus Ali", lastSession: "1 week ago", sessions: 2 },
  { id: "e3", name: "Jada Singh", lastSession: "2 weeks ago", sessions: 6 },
];

function ReviewsPage() {
  const [filter, setFilter] = useState<"all" | "replied" | "unreplied" | 1 | 2 | 3 | 4 | 5>("all");
  const [search, setSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const total = REVIEWS.length;
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: REVIEWS.filter((r) => r.rating === s).length }));
  const responseRate = Math.round((REVIEWS.filter((r) => r.reply).length / total) * 100);

  const visible = REVIEWS.filter((r) => {
    if (filter === "replied" && !r.reply) return false;
    if (filter === "unreplied" && r.reply) return false;
    if (typeof filter === "number" && r.rating !== filter) return false;
    if (search && !r.comment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Reviews & Reputation</h1>
        <p className="text-sm text-muted-foreground mt-1">What students are saying about your teaching.</p>
      </header>

      {/* Overview */}
      <section className="grid lg:grid-cols-[300px_1fr] gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white p-6">
          <div className="text-6xl font-extrabold tabular-nums">{avg}</div>
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map((i) => <Star key={i} className={cn("size-5", i <= Math.round(+avg) ? "fill-white" : "fill-white/30")} />)}
          </div>
          <div className="text-sm text-white/80 mt-2">{total} reviews · {responseRate}% response rate</div>
        </div>
        <div className="rounded-2xl bg-background border border-border p-5 grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Distribution</div>
            <div className="space-y-1.5">
              {dist.map((d) => (
                <div key={d.stars} className="flex items-center gap-2 text-xs">
                  <div className="w-8 text-muted-foreground tabular-nums">{d.stars} ★</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: `${(d.count / total) * 100}%` }} />
                  </div>
                  <div className="w-6 text-right text-ink font-semibold tabular-nums">{d.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp className="size-3" /> Trend (6mo)</div>
            <div className="h-32 flex items-end gap-1.5">
              {[4.6, 4.7, 4.5, 4.8, 4.9, 4.8].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-brand to-brand-soft rounded-t" style={{ height: `${(v / 5) * 100}%` }} />
                  <div className="text-[9px] text-muted-foreground">{["Dec","Jan","Feb","Mar","Apr","May"][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request panel */}
      <section className="rounded-2xl bg-mint border border-brand-soft p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-bold text-ink">Request reviews</div>
            <div className="text-xs text-muted-foreground">{ELIGIBLE.length} students haven't reviewed you yet.</div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-semibold hover:bg-ink/90">Request from all</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {ELIGIBLE.map((s) => (
            <div key={s.id} className="rounded-xl bg-background border border-border p-3 flex items-center gap-2">
              <div className="size-8 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-xs font-semibold">{s.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground">{s.sessions} sessions · {s.lastSession}</div>
              </div>
              <button className="text-xs font-semibold text-brand-deep hover:underline">Request</button>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground mt-3"><input type="checkbox" defaultChecked className="rounded" /> Auto-request reviews 3 days after each session</label>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search comments…" className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-brand" />
        {(["all", "unreplied", "replied"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold capitalize", filter === f ? "bg-ink text-white" : "bg-background border border-border text-muted-foreground hover:text-ink")}>{f}</button>
        ))}
        {[5,4,3,2,1].map((s) => (
          <button key={s} onClick={() => setFilter(filter === s ? "all" : s as 1)} className={cn("px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-0.5", filter === s ? "bg-amber-500 text-white" : "bg-background border border-border text-muted-foreground")}>{s}<Star className="size-3 fill-current" /></button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No reviews match these filters.</div>}
        {visible.map((r) => (
          <article key={r.id} className="rounded-2xl bg-background border border-border p-5">
            <header className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-semibold">{r.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-semibold text-ink">{r.student}</div>
                  <div className="text-xs text-muted-foreground">· {r.date}</div>
                  <div className="text-xs text-brand-deep font-medium">· {r.lesson}</div>
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className={cn("size-3.5", i <= r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />)}
                </div>
              </div>
              <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Flag review"><Flag className="size-4" /></button>
            </header>
            <p className="text-sm text-ink/90 mt-3 leading-relaxed">{r.comment}</p>

            {r.reply && (
              <div className="mt-4 ml-12 rounded-xl bg-mint border-l-2 border-brand p-3">
                <div className="text-[11px] font-bold text-brand-deep uppercase tracking-wider mb-1">Your reply</div>
                <p className="text-sm italic text-ink/80">{r.reply}</p>
                <button className="text-xs font-semibold text-brand-deep hover:underline mt-1">Edit reply</button>
              </div>
            )}

            {!r.reply && replyingTo !== r.id && (
              <button onClick={() => setReplyingTo(r.id)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline"><MessageSquare className="size-4" /> Reply publicly</button>
            )}

            {replyingTo === r.id && (
              <div className="mt-3 ml-12 space-y-2">
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} maxLength={500} rows={3} placeholder="Write a public reply…" className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{replyText.length}/500</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="px-3 py-1.5 text-muted-foreground hover:text-ink font-semibold">Cancel</button>
                    <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90"><Send className="size-3.5" /> Post reply</button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
