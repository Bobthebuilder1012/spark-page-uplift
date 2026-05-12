import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, Fragment } from "react";
import { useTutor, SUBJECT_OPTIONS } from "@/lib/tutor-store";
import { Check, Circle, Camera, Plus, X, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/get-listed")({
  component: GetListedPage,
});

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8am-9pm

function GetListedPage() {
  const { completion } = useTutor();
  const pct = Math.round((completion.completed / completion.total) * 100);

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <Link to="/tutor" className="text-xs text-muted-foreground hover:text-ink">← Back to dashboard</Link>
        <h1 className="mt-2 text-2xl lg:text-3xl font-bold text-ink">Get listed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete all 5 requirements to appear in student search and start booking sessions.
        </p>
      </header>

      <div className="sticky top-14 z-20 -mx-4 lg:mx-0 px-4 lg:px-0 py-3 bg-mint/95 backdrop-blur">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">
              {completion.completed} of {completion.total} complete
            </span>
            <span className="text-muted-foreground">
              {completion.listed ? "Ready to be listed" : `${completion.total - completion.completed} more to go`}
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <AvatarCard done={completion.avatar} />
      <BioCard done={completion.bio} />
      <SubjectsCard done={completion.subjects} />
      <AvailabilityCard done={completion.availability} />
      <RateCard done={completion.rate} />
      <VideoProviderCard done={completion.videoProvider} />

      {completion.listed && (
        <div className="rounded-2xl border-2 border-brand bg-brand/5 p-6 text-center">
          <div className="text-2xl">🎉</div>
          <h3 className="mt-2 font-bold text-ink text-lg">You're ready to be listed!</h3>
          <p className="mt-1 text-sm text-muted-foreground">Submit your profile for review and start receiving bookings.</p>
          {/* TODO(cursor): wire submit-for-review vs auto-list decision in backend. */}
          <button className="mt-4 px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">
            Submit for review
          </button>
        </div>
      )}
    </div>
  );
}

function SectionShell({ done, title, subtitle, children }: { done: boolean; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      <header className="px-5 py-4 border-b border-border flex items-start gap-3">
        <span className={cn("size-7 rounded-full grid place-items-center shrink-0", done ? "bg-brand text-white" : "bg-muted text-muted-foreground")}>
          {done ? <Check className="size-4" /> : <Circle className="size-4" />}
        </span>
        <div className="flex-1">
          <h2 className="font-semibold text-ink">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", done ? "bg-brand/15 text-brand-deep" : "bg-muted text-muted-foreground")}>
          {done ? "Complete" : "Incomplete"}
        </span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function AvatarCard({ done }: { done: boolean }) {
  const { profile, setProfile } = useTutor();
  const fileRef = useRef<HTMLInputElement>(null);
  const onPick = (f?: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f); // TODO(cursor): upload to storage and persist URL.
    setProfile((p) => ({ ...p, avatarUrl: url }));
  };
  return (
    <SectionShell done={done} title="Profile picture" subtitle="A clear, friendly headshot helps students trust you.">
      <div className="flex items-center gap-5">
        <div className="size-24 rounded-full bg-muted grid place-items-center overflow-hidden border border-border">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <Camera className="size-7 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPick(e.target.files?.[0])} />
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onPick(e.dataTransfer.files?.[0]); }}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground hover:border-brand hover:bg-brand/5 cursor-pointer"
          >
            Drag & drop, or <span className="font-semibold text-brand-deep">click to upload</span>
          </div>
          {profile.avatarUrl && (
            <button onClick={() => setProfile((p) => ({ ...p, avatarUrl: null }))} className="mt-2 text-xs text-coral hover:underline">
              Remove photo
            </button>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function BioCard({ done }: { done: boolean }) {
  const { profile, setProfile } = useTutor();
  const len = profile.bio.length;
  return (
    <SectionShell done={done} title="Bio / About you" subtitle="Tell students about your experience, teaching style and personality.">
      <textarea
        value={profile.bio}
        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
        rows={5}
        maxLength={500}
        placeholder="e.g. I'm a UWI Maths graduate with 6 years of CSEC tutoring experience. My students average a Grade 1 pass…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand"
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={cn(len < 150 ? "text-coral" : "text-muted-foreground")}>
          {len < 150 ? `${150 - len} more characters needed` : "Looks great"}
        </span>
        <span className="text-muted-foreground tabular-nums">{len} / 500</span>
      </div>
    </SectionShell>
  );
}

function SubjectsCard({ done }: { done: boolean }) {
  const { profile, setProfile } = useTutor();
  const [open, setOpen] = useState(false);
  const [pickName, setPickName] = useState(SUBJECT_OPTIONS[0].name);
  const [pickLevel, setPickLevel] = useState(SUBJECT_OPTIONS[0].levels[0]);

  const add = () => {
    setProfile((p) => ({
      ...p,
      subjects: [...p.subjects, { id: crypto.randomUUID(), name: pickName, level: pickLevel }],
    }));
    setOpen(false);
  };

  return (
    <SectionShell done={done} title="Subjects you teach" subtitle="Add at least one subject and level.">
      <div className="flex flex-wrap gap-2">
        {profile.subjects.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-brand/10 text-brand-deep text-sm font-medium">
            {s.name} · <span className="text-xs opacity-80">{s.level}</span>
            <button onClick={() => setProfile((p) => ({ ...p, subjects: p.subjects.filter((x) => x.id !== s.id) }))} className="size-5 grid place-items-center rounded-full hover:bg-brand/20">
              <X className="size-3" />
            </button>
          </span>
        ))}
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">
          <Plus className="size-3.5" /> Add subject
        </button>
      </div>

      {open && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 flex flex-col sm:flex-row gap-2">
          <select
            value={pickName}
            onChange={(e) => { setPickName(e.target.value); setPickLevel(SUBJECT_OPTIONS.find((o) => o.name === e.target.value)!.levels[0]); }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {SUBJECT_OPTIONS.map((o) => <option key={o.name}>{o.name}</option>)}
          </select>
          <select value={pickLevel} onChange={(e) => setPickLevel(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {SUBJECT_OPTIONS.find((o) => o.name === pickName)!.levels.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button onClick={add} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90">Add</button>
          <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-muted">Cancel</button>
        </div>
      )}
    </SectionShell>
  );
}

function AvailabilityCard({ done }: { done: boolean }) {
  const { profile, setProfile } = useTutor();
  const has = (d: number, h: number) => profile.availability.some((s) => s.day === d && s.hour === h);
  const toggle = (d: number, h: number) => {
    setProfile((p) => ({
      ...p,
      availability: has(d, h) ? p.availability.filter((s) => !(s.day === d && s.hour === h)) : [...p.availability, { day: d, hour: h }],
    }));
  };
  const copyMonToWeekdays = () => {
    const monSlots = profile.availability.filter((s) => s.day === 1).map((s) => s.hour);
    setProfile((p) => {
      const cleaned = p.availability.filter((s) => s.day === 0 || s.day === 6 || s.day === 1);
      const added = [2, 3, 4, 5].flatMap((d) => monSlots.map((h) => ({ day: d, hour: h })));
      return { ...p, availability: [...cleaned, ...added] };
    });
  };

  return (
    <SectionShell done={done} title="Weekly availability" subtitle="Click slots to mark when you're available. Timezone: AST (Trinidad).">
      <div className="flex justify-end mb-2">
        <button onClick={copyMonToWeekdays} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:bg-brand/10 px-2 py-1 rounded">
          <Copy className="size-3" /> Copy Monday to all weekdays
        </button>
      </div>
      <div className="overflow-x-auto -mx-2">
        <div className="min-w-[560px] px-2">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1">
            <div />
            {DAYS.map((d) => <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">{d}</div>)}
            {HOURS.map((h) => (
              <Fragment key={`row-${h}`}>
                <div className="text-[10px] text-muted-foreground tabular-nums text-right pr-2 py-1">
                  {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}
                </div>
                {DAYS.map((_, d) => {
                  const on = has(d, h);
                  return (
                    <button
                      key={`${d}-${h}`}
                      onClick={() => toggle(d, h)}
                      className={cn("h-7 rounded transition", on ? "bg-brand hover:bg-brand/90" : "bg-muted hover:bg-brand/20")}
                      aria-label={`${DAYS[d]} ${h}:00`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{profile.availability.length} slot{profile.availability.length === 1 ? "" : "s"} selected</div>
    </SectionShell>
  );
}

function RateCard({ done }: { done: boolean }) {
  const { profile, setProfile } = useTutor();
  return (
    <SectionShell done={done} title="Hourly rate" subtitle="Set your standard 1-on-1 rate. You can override per lesson later.">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">TTD</span>
          <input
            type="number"
            min={0}
            value={profile.hourlyRateTtd ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, hourlyRateTtd: e.target.value ? Number(e.target.value) : null }))}
            placeholder="150"
            className="w-40 rounded-lg border border-border bg-background pl-12 pr-3 py-2 text-sm focus:outline-none focus:border-brand"
          />
        </div>
        <span className="text-sm text-muted-foreground">/ hour</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {/* TODO(cursor): replace placeholder average with real subject-level analytics. */}
        Average for CSEC Maths tutors in Trinidad: <span className="font-semibold text-ink">TTD 140 / hr</span>
      </p>
    </SectionShell>
  );
}
