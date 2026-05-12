import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, TrendingUp, Users, Star, Repeat } from "lucide-react";
import { useTutor } from "@/lib/tutor-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/analytics")({
  head: () => ({ meta: [{ title: "Analytics — iTutor Tutor" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { completion } = useTutor();

  if (!completion.listed) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground"><Lock className="size-6" /></div>
        <h1 className="mt-4 text-xl font-bold text-ink">Analytics is locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete your profile and run a few sessions to start seeing analytics.</p>
        <Link to="/tutor/get-listed" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">Complete profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Operational performance · last 90 days.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Session volume" hint="Sessions delivered per week">
          <BarChart data={[6, 8, 5, 9, 12, 10, 11, 14, 12, 15, 16, 18]} labels={["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"]} />
        </Card>
        <Card title="New vs returning students" hint="Per month">
          <StackedBars />
        </Card>
        <Card title="Average rating" hint="Trend over time" icon={Star}>
          <LineChart data={[4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9]} labels={["Nov","Dec","Jan","Feb","Mar","Apr","May"]} />
        </Card>
        <Card title="Profile → booking conversion" hint="Funnel" icon={TrendingUp}>
          <Funnel />
        </Card>
        <Card title="Subject distribution" hint="Revenue split">
          <PieList items={[
            { label: "CSEC Maths", value: 42, color: "bg-brand" },
            { label: "CAPE Pure", value: 24, color: "bg-brand-deep" },
            { label: "CSEC Physics", value: 18, color: "bg-coral" },
            { label: "Add. Maths", value: 10, color: "bg-amber-500" },
            { label: "English A", value: 6, color: "bg-purple-500" },
          ]} />
        </Card>
        <Card title="Most profitable lessons" hint="Last 90 days">
          <ol className="space-y-2.5">
            {[
              { name: "CSEC Maths Crash Course", rev: 2880, sessions: 24 },
              { name: "CAPE Pure Maths Unit 1", rev: 1620, sessions: 9 },
              { name: "Physics 1:1 · Devon", rev: 1400, sessions: 7 },
              { name: "SBA Trial Run · Group", rev: 540, sessions: 6 },
            ].map((l, i) => (
              <li key={l.name} className="flex items-center gap-3">
                <span className="size-6 grid place-items-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
                <span className="flex-1 truncate text-sm text-ink font-semibold">{l.name}</span>
                <span className="text-xs text-muted-foreground">{l.sessions} sessions</span>
                <span className="text-sm font-bold tabular-nums">TTD {l.rev.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Student retention" hint="Returning month-over-month" icon={Repeat}>
          <div className="flex items-end gap-2 h-32">
            {[78, 82, 80, 85, 88, 90].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-bold tabular-nums text-ink">{v}%</div>
                <div className="w-full rounded-t bg-brand" style={{ height: `${v}%` }} />
                <div className="text-[10px] text-muted-foreground">M{i + 1}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Peak booking hours" hint="Day of week × hour" icon={Users}>
          <Heatmap />
        </Card>
      </div>
      {/* TODO(cursor): wire all charts to real backend metrics; consider Recharts/visx if needed. */}
    </div>
  );
}

function Card({ title, hint, icon: Icon, children }: any) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-brand-deep" />}
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-36">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t bg-brand/80 hover:bg-brand transition" style={{ height: `${(v / max) * 100}%` }} />
          <div className="text-[9px] text-muted-foreground">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const w = 600, h = 140, pad = 24;
  const max = Math.max(...data) + 0.1, min = Math.min(...data) - 0.1;
  const xs = (i: number) => pad + (i * (w - 2 * pad)) / (data.length - 1);
  const ys = (v: number) => h - pad - ((v - min) / (max - min)) * (h - 2 * pad);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(d)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
      <path d={path} fill="none" stroke="oklch(0.55 0.16 150)" strokeWidth="2" />
      {data.map((d, i) => <g key={i}><circle cx={xs(i)} cy={ys(d)} r="3" fill="oklch(0.55 0.16 150)" /><text x={xs(i)} y={h - 4} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">{labels[i]}</text></g>)}
    </svg>
  );
}
function StackedBars() {
  const data = [{n: 4, r: 8}, {n: 3, r: 9}, {n: 5, r: 10}, {n: 4, r: 12}, {n: 6, r: 13}, {n: 5, r: 15}];
  const max = Math.max(...data.map((d) => d.n + d.r));
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col rounded overflow-hidden" style={{ height: `${((d.n + d.r) / max) * 100}%` }}>
            <div className="bg-brand/40" style={{ flex: d.n }} />
            <div className="bg-brand" style={{ flex: d.r }} />
          </div>
          <div className="text-[9px] text-muted-foreground">M{i + 1}</div>
        </div>
      ))}
      <div className="ml-3 text-[10px] space-y-1">
        <div className="flex items-center gap-1.5"><span className="size-2 rounded bg-brand" /> Returning</div>
        <div className="flex items-center gap-1.5"><span className="size-2 rounded bg-brand/40" /> New</div>
      </div>
    </div>
  );
}
function Funnel() {
  const steps = [{l: "Profile views", v: 480}, {l: "Inquiries", v: 92}, {l: "Bookings", v: 38}, {l: "Completed", v: 34}];
  const max = steps[0].v;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s.l}>
          <div className="flex items-center justify-between text-xs"><span className="text-ink font-semibold">{s.l}</span><span className="tabular-nums text-muted-foreground">{s.v}{i > 0 && ` · ${Math.round((s.v/steps[i-1].v)*100)}%`}</span></div>
          <div className="h-3 bg-muted rounded-full mt-1 overflow-hidden"><div className="h-full bg-brand rounded-full" style={{ width: `${(s.v/max)*100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
function PieList({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex items-center justify-between text-xs"><span className="text-ink font-semibold">{it.label}</span><span className="tabular-nums text-muted-foreground">{it.value}%</span></div>
          <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden"><div className={cn("h-full", it.color)} style={{ width: `${it.value}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["3p", "4p", "5p", "6p", "7p", "8p"];
  const seed = (d: number, h: number) => ((d * 7 + h * 3) % 10) / 10;
  return (
    <div>
      <div className="grid grid-cols-[40px_repeat(6,1fr)] gap-1">
        <div />
        {hours.map((h) => <div key={h} className="text-[10px] text-center text-muted-foreground">{h}</div>)}
        {days.map((day, di) => (
          <>
            <div key={day} className="text-[10px] text-muted-foreground self-center">{day}</div>
            {hours.map((_, hi) => {
              const v = seed(di, hi);
              return <div key={hi} className="aspect-square rounded" style={{ background: `oklch(0.74 ${0.05 + v * 0.18} 145 / ${0.15 + v * 0.85})` }} />;
            })}
          </>
        ))}
      </div>
    </div>
  );
}
