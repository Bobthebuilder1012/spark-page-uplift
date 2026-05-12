import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, QrCode, Share2, Tag, Gift, Megaphone, Rocket, TrendingUp, Plus, Eye, Lightbulb, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/growth")({
  head: () => ({ meta: [{ title: "Growth — iTutor Tutor" }] }),
  component: GrowthPage,
});

// TODO(cursor): wire share intents, code redemption, referral tracking, image generation, monetization.

type View = "home" | "profile" | "promo" | "referral" | "social" | "boost" | "insights";

function GrowthPage() {
  const [view, setView] = useState<View>("home");
  if (view !== "home") return <DetailWrapper view={view} onBack={() => setView("home")} />;

  const cards = [
    { id: "profile" as View, icon: Share2, title: "My profile link", desc: "Share your tutor page anywhere", color: "from-brand to-brand-deep" },
    { id: "promo" as View, icon: Tag, title: "Promo codes", desc: "Discounts for your lessons", color: "from-amber-400 to-amber-600" },
    { id: "referral" as View, icon: Gift, title: "Referral program", desc: "Earn when others sign up", color: "from-purple-400 to-purple-600" },
    { id: "social" as View, icon: Megaphone, title: "Social templates", desc: "Pre-designed share posts", color: "from-sky-400 to-sky-600" },
    { id: "boost" as View, icon: Rocket, title: "Profile boost", desc: "Appear higher in search", color: "from-coral to-rose-600" },
    { id: "insights" as View, icon: TrendingUp, title: "Growth insights", desc: "Stats and tips to grow", color: "from-emerald-400 to-emerald-600" },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Growth</h1>
        <p className="text-sm text-muted-foreground mt-1">Tools to grow your tutoring business.</p>
      </header>

      {/* Quick stats strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Profile views (7d)", value: "284", trend: "+12%" },
          { label: "Booking conversion", value: "18%", trend: "+3%" },
          { label: "Search ranking", value: "#7", trend: "↑ 2" },
          { label: "Referrals", value: "3", trend: "+1" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-background border border-border p-4">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-ink mt-1 tabular-nums">{s.value}</div>
            <div className="text-xs text-brand-deep font-semibold mt-0.5">{s.trend}</div>
          </div>
        ))}
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => setView(c.id)}
              className="group text-left rounded-2xl bg-background border border-border p-5 hover:border-brand hover:shadow-pop transition">
              <div className={cn("size-12 rounded-xl bg-gradient-to-br grid place-items-center text-white mb-3", c.color)}>
                <Icon className="size-6" />
              </div>
              <div className="font-bold text-ink">{c.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.desc}</div>
              <div className="text-xs font-semibold text-brand-deep mt-3 group-hover:underline">Open →</div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function DetailWrapper({ view, onBack }: { view: View; onBack: () => void }) {
  return (
    <div className="max-w-5xl space-y-5">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-ink font-medium">← Back to Growth</button>
      {view === "profile" && <ProfileLink />}
      {view === "promo" && <PromoCodes />}
      {view === "referral" && <Referral />}
      {view === "social" && <SocialTemplates />}
      {view === "boost" && <Boost />}
      {view === "insights" && <Insights />}
    </div>
  );
}

function ProfileLink() {
  const url = "itutor.tt/anil-ramdeen";
  return (
    <>
      <header><h2 className="text-2xl font-bold text-ink">My profile link</h2><p className="text-sm text-muted-foreground mt-1">Your shareable tutor page.</p></header>
      <div className="rounded-2xl bg-background border border-border p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 px-4 py-3 rounded-xl bg-mint font-mono text-sm text-ink truncate">{url}</div>
          <button className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Copy className="size-4" /> Copy</button>
        </div>
        <div className="grid sm:grid-cols-[180px_1fr] gap-4">
          <div className="aspect-square rounded-xl bg-mint border border-border grid place-items-center"><QrCode className="size-24 text-ink" /></div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-ink">Share to…</div>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "Facebook", "Instagram", "Email", "Copy link"].map((p) => (
                <button key={p} className="px-3 py-2 rounded-lg border border-border hover:border-brand hover:bg-brand-soft text-sm font-semibold">{p}</button>
              ))}
            </div>
            <button className="mt-2 px-3 py-2 rounded-lg bg-ink text-white text-sm font-semibold hover:bg-ink/90">Download QR (PNG)</button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-background border border-border p-5">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Profile preview</div>
        <div className="rounded-xl bg-gradient-to-br from-brand-soft to-mint p-6 flex items-center gap-4">
          <div className="size-16 rounded-full bg-brand text-white grid place-items-center text-xl font-bold">AR</div>
          <div>
            <div className="font-bold text-ink">Anil Ramdeen</div>
            <div className="text-sm text-muted-foreground">CSEC & CAPE Maths · Physics · Trinidad</div>
            <div className="text-xs text-brand-deep mt-1">★ 4.8 · 14 reviews</div>
          </div>
        </div>
      </div>
    </>
  );
}

function PromoCodes() {
  const codes = [
    { code: "FIRST10", desc: "10% off first session", uses: 12, revenue: 1620, status: "active" },
    { code: "GROUP5", desc: "5% off group classes", uses: 8, revenue: 720, status: "active" },
    { code: "EXAM2024", desc: "TTD 50 off · Exam prep", uses: 23, revenue: 3450, status: "expired" },
  ];
  return (
    <>
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-bold text-ink">Promo codes</h2><p className="text-sm text-muted-foreground mt-1">Create discounts to win and retain students.</p></div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Plus className="size-4" /> Create code</button>
      </header>
      <div className="rounded-2xl bg-background border border-border divide-y divide-border">
        {codes.map((c) => (
          <div key={c.code} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2"><div className="font-mono font-bold text-ink">{c.code}</div>{c.status === "expired" ? <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Expired</span> : <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep">Active</span>}</div>
              <div className="text-sm text-muted-foreground">{c.desc}</div>
            </div>
            <div className="text-sm grid grid-cols-2 gap-6">
              <div><div className="text-[10px] uppercase text-muted-foreground font-bold">Used</div><div className="font-semibold text-ink tabular-nums">{c.uses}×</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground font-bold">Revenue</div><div className="font-semibold text-ink tabular-nums">TTD {c.revenue}</div></div>
            </div>
            <button className="text-sm font-semibold text-brand-deep hover:underline">Manage</button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-mint border border-brand-soft p-4">
        <div className="text-sm font-semibold text-ink mb-2">💡 Suggested codes</div>
        <div className="flex flex-wrap gap-2">
          <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-background border border-border hover:border-brand">+ FIRST10 (10% off first session)</button>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-background border border-border hover:border-brand">+ REFER15 (15% off via referral)</button>
        </div>
      </div>
    </>
  );
}

function Referral() {
  return (
    <>
      <header><h2 className="text-2xl font-bold text-ink">Referral program</h2><p className="text-sm text-muted-foreground mt-1">Invite tutors and students. Earn when they join.</p></header>
      <div className="rounded-2xl bg-background border border-border p-5">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Your referral link</div>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl bg-mint font-mono text-sm truncate">itutor.tt/r/anil-ar99</div>
          <button className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Copy className="size-4" /> Copy</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {[{ label: "Sign-ups", value: "11", icon: Users },{ label: "Conversions", value: "6", icon: TrendingUp },{ label: "Earnings", value: "TTD 420", icon: Gift }].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl bg-background border border-border p-4">
              <Icon className="size-5 text-brand-deep mb-2" />
              <div className="text-2xl font-bold text-ink tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SocialTemplates() {
  const templates = [
    { id: "t1", title: "Now offering CSEC Math!", color: "from-brand to-emerald-700" },
    { id: "t2", title: "Spaces open in my group class", color: "from-amber-400 to-orange-600" },
    { id: "t3", title: "Just got a 5-star review ⭐", color: "from-purple-400 to-purple-700" },
    { id: "t4", title: "Limited-time discount", color: "from-coral to-rose-600" },
  ];
  return (
    <>
      <header><h2 className="text-2xl font-bold text-ink">Social share templates</h2><p className="text-sm text-muted-foreground mt-1">Customize and share to your channels.</p></header>
      <div className="grid sm:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl bg-background border border-border overflow-hidden">
            <div className={cn("aspect-square bg-gradient-to-br grid place-items-center text-white p-6", t.color)}>
              <div className="text-2xl font-extrabold text-center">{t.title}</div>
            </div>
            <div className="p-4 space-y-2">
              <input defaultValue={t.title} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-brand" />
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">Share</button>
                <button className="px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted">Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Boost() {
  return (
    <>
      <header><h2 className="text-2xl font-bold text-ink">Profile boost</h2><p className="text-sm text-muted-foreground mt-1">Appear higher in student search results.</p></header>
      <div className="rounded-2xl bg-gradient-to-br from-coral to-rose-600 text-white p-8">
        <Rocket className="size-10 mb-3" />
        <div className="text-2xl font-extrabold">Boost your profile for 7 days</div>
        <div className="text-white/90 mt-1">Get up to 3× more profile views and bookings.</div>
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <div className="text-3xl font-extrabold tabular-nums">TTD $50</div>
          <button className="px-5 py-2.5 rounded-xl bg-white text-coral text-sm font-bold hover:bg-white/90">Boost now</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {[{ d: "Avg. bookings", v: "+170%" }, { d: "Search appearances", v: "+240%" }, { d: "Profile views", v: "+310%" }].map((x) => (
          <div key={x.d} className="rounded-2xl bg-background border border-border p-4">
            <div className="text-2xl font-bold text-brand-deep tabular-nums">{x.v}</div>
            <div className="text-xs text-muted-foreground">{x.d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Insights() {
  const tips = [
    "Add 2 more subjects to reach 30% more students.",
    "Reply to 3 unanswered reviews to improve response rate.",
    "Upload an avatar — profiles with photos get 5× more clicks.",
  ];
  return (
    <>
      <header><h2 className="text-2xl font-bold text-ink">Growth insights</h2><p className="text-sm text-muted-foreground mt-1">Where to focus next.</p></header>
      <div className="grid sm:grid-cols-3 gap-3">
        {[{ l: "Profile views", v: "284", t: "+12% wk" }, { l: "Booking conv.", v: "18%", t: "+3% wk" }, { l: "Search rank", v: "#7", t: "↑ 2" }].map((s) => (
          <div key={s.l} className="rounded-2xl bg-background border border-border p-5">
            <Eye className="size-5 text-brand-deep mb-2" />
            <div className="text-2xl font-bold text-ink tabular-nums">{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-xs text-brand-deep font-semibold mt-1">{s.t}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-mint border border-brand-soft p-5">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="size-5 text-brand-deep" /><div className="font-bold text-ink">Tips to grow</div></div>
        <ul className="space-y-2">
          {tips.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm">
              <div className="size-5 rounded-full bg-brand text-white text-xs grid place-items-center shrink-0 mt-0.5">→</div>
              <div className="text-ink/80">{t}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
