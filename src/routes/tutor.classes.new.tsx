import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Check, Sparkles, Plus, X, Upload, Globe, Lock, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/classes/new")({
  head: () => ({ meta: [{ title: "Create a class — iTutor" }] }),
  component: NewClassBuilder,
});

const LEVELS = ["SEA", "CSEC", "CAPE", "A-Level", "Other"];
const HUES = [
  { label: "Forest", hue: 145 }, { label: "Coral", hue: 20 }, { label: "Violet", hue: 280 },
  { label: "Teal", hue: 165 }, { label: "Indigo", hue: 220 }, { label: "Amber", hue: 35 },
];

function NewClassBuilder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("CSEC");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [hue, setHue] = useState(145);
  const [emoji, setEmoji] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [includes, setIncludes] = useState<string[]>([""]);
  const [price, setPrice] = useState(350);
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [promoLabel, setPromoLabel] = useState("");
  const [schedule, setSchedule] = useState("Tuesdays · 4:00–5:30 PM AST");
  const [duration, setDuration] = useState("90 min");
  const [cadence, setCadence] = useState("Weekly");
  const [seats, setSeats] = useState(20);
  const [requestToJoin, setRequestToJoin] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [saved, setSaved] = useState(false);

  const onPickBanner = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerUrl(url);
  };

  const updateList = (set: typeof setOutcomes, idx: number, value: string) =>
    set((list) => list.map((v, i) => (i === idx ? value : v)));
  const addItem = (set: typeof setOutcomes) => set((list) => [...list, ""]);
  const removeItem = (set: typeof setOutcomes, idx: number) =>
    set((list) => list.filter((_, i) => i !== idx));

  const onSave = () => {
    setSaved(true);
    setTimeout(() => navigate({ to: "/tutor/lessons" }), 1100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/tutor/lessons" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to my classes
      </Link>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Create a group class</h1>
          <p className="text-sm text-muted-foreground mt-1">Every field below is what students see on your class listing. Make it count.</p>
        </div>
        <button onClick={onSave} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-deep shrink-0">
          {saved ? "Saved ✓" : "Publish class"}
        </button>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-5">
          {/* Branding */}
          <Section title="Class branding" hint="Banner, name and the elevator pitch students see first.">
            <div className="grid sm:grid-cols-[1fr_180px] gap-4">
              <div className="space-y-3">
                <Field label="Class title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CSEC Mathematics — Algebra & Functions" className={inputCls} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Subject"><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" className={inputCls} /></Field>
                  <Field label="Level">
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
                  </Field>
                </div>
                <Field label="Tagline (1 line)"><input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Live weekly class covering algebra and functions" className={inputCls} /></Field>
              </div>
              <div>
                <Field label="Banner colour">
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {HUES.map((h) => (
                      <button key={h.hue} onClick={() => setHue(h.hue)} className={cn("h-10 rounded-lg border-2 transition", hue === h.hue ? "border-ink" : "border-transparent")} style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${h.hue}), oklch(0.55 0.16 ${h.hue}))` }} title={h.label} />
                    ))}
                  </div>
                </Field>
                <Field label="Banner mark (optional)">
                  <input value={emoji} onChange={(e) => setEmoji(e.target.value.slice(0, 2))} placeholder="∑" className={inputCls} maxLength={2} />
                </Field>
              </div>
            </div>

            {/* Banner image upload */}
            <div className="mt-4">
              <Field label="Banner image (optional — overrides colour)">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
                  >
                    <Upload className="size-4" /> {bannerUrl ? "Replace image" : "Upload image"}
                  </button>
                  {bannerUrl && (
                    <button type="button" onClick={() => setBannerUrl(null)} className="text-xs text-muted-foreground hover:text-coral inline-flex items-center gap-1">
                      <X className="size-3.5" /> Remove
                    </button>
                  )}
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><ImageIcon className="size-3.5" /> 1600×600 recommended</span>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickBanner(e.target.files?.[0])} />
                </div>
              </Field>
            </div>

            {/* Live preview */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-border">
              <div
                className="relative h-32 grid place-items-center text-white bg-cover bg-center"
                style={bannerUrl
                  ? { backgroundImage: `url(${bannerUrl})` }
                  : { background: `linear-gradient(135deg, oklch(0.85 0.1 ${hue}), oklch(0.55 0.16 ${hue}))` }}
              >
                {!bannerUrl && (
                  <span className="absolute right-3 bottom-1 text-[5rem] leading-none opacity-30 font-black">{emoji || subject[0] || "?"}</span>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase rounded-full bg-white/25 backdrop-blur px-2.5 py-0.5">{level}</span>
                  <span className="text-[10px] font-bold uppercase rounded-full bg-white/25 backdrop-blur px-2.5 py-0.5 inline-flex items-center gap-1">
                    {visibility === "public" ? <Globe className="size-3" /> : <Lock className="size-3" />} {visibility}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-background">
                <div className="text-sm font-bold text-ink">{title || "Class title goes here"}</div>
                <div className="text-xs text-muted-foreground">{tagline || "Tagline preview"}</div>
              </div>
            </div>
          </Section>

          <Section title="About the class" hint="Long-form description shown on the class page.">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Tell students what to expect, your teaching style, and who this class is for." className={cn(inputCls, "resize-y")} />
          </Section>

          <Section title="What students will learn" hint="3–8 outcomes. These appear as a checklist on the class page.">
            <RepeaterList values={outcomes} onChange={(i, v) => updateList(setOutcomes, i, v)} onAdd={() => addItem(setOutcomes)} onRemove={(i) => removeItem(setOutcomes, i)} placeholder="e.g. Linear, quadratic and rational functions" />
          </Section>

          <Section title="What's included" hint="Recordings, materials, parent reports — be specific.">
            <RepeaterList values={includes} onChange={(i, v) => updateList(setIncludes, i, v)} onAdd={() => addItem(setIncludes)} onRemove={(i) => removeItem(setIncludes, i)} placeholder="e.g. Weekly past-paper worksheet + mark scheme" />
          </Section>

          <Section title="Schedule & seats">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Schedule"><input value={schedule} onChange={(e) => setSchedule(e.target.value)} className={inputCls} /></Field>
              <Field label="Cadence"><input value={cadence} onChange={(e) => setCadence(e.target.value)} className={inputCls} /></Field>
              <Field label="Session length"><input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputCls} /></Field>
              <Field label="Total seats"><input type="number" value={seats} onChange={(e) => setSeats(+e.target.value)} className={inputCls} /></Field>
            </div>
          </Section>

          <Section title="Pricing & promotions" hint="Set a fair monthly price. Add a promo to mark it as early-bird.">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Monthly price (TTD)"><input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className={inputCls} /></Field>
              <Field label="Original price (optional)"><input type="number" value={originalPrice as any} onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : +e.target.value)} placeholder="—" className={inputCls} /></Field>
              <Field label="Promo label"><input value={promoLabel} onChange={(e) => setPromoLabel(e.target.value)} placeholder="EARLY-BIRD 20% OFF" className={inputCls} /></Field>
            </div>
            <p className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-brand-deep" />
              The "Popular" badge is awarded automatically once your class has 4.7+ rating, 20+ ratings and 15+ active students.
            </p>
          </Section>

          <Section title="Access">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/40">
              <input type="checkbox" checked={requestToJoin} onChange={(e) => setRequestToJoin(e.target.checked)} className="mt-0.5 accent-brand size-4" />
              <div>
                <div className="text-sm font-semibold text-ink">Require approval to join</div>
                <div className="text-xs text-muted-foreground">Students send a join request first. You approve or decline from the Join requests inbox.</div>
              </div>
            </label>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="rounded-2xl border border-border bg-background p-5 shadow-card text-sm">
            <div className="font-bold text-ink">Publishing checklist</div>
            <ul className="mt-3 space-y-2 text-xs">
              <CheckItem ok={!!title}>Class title</CheckItem>
              <CheckItem ok={!!subject}>Subject</CheckItem>
              <CheckItem ok={description.length > 60}>Description (60+ chars)</CheckItem>
              <CheckItem ok={outcomes.filter(Boolean).length >= 3}>3+ learning outcomes</CheckItem>
              <CheckItem ok={includes.filter(Boolean).length >= 2}>2+ "what's included" items</CheckItem>
              <CheckItem ok={price > 0}>Monthly price</CheckItem>
            </ul>
            <button onClick={onSave} className="mt-4 w-full rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-deep">
              {saved ? "Saved ✓" : "Publish class"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-brand";

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function RepeaterList({ values, onChange, onAdd, onRemove, placeholder }: {
  values: string[]; onChange: (i: number, v: string) => void; onAdd: () => void; onRemove: (i: number) => void; placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={v} onChange={(e) => onChange(i, e.target.value)} placeholder={placeholder} className={inputCls} />
          <button onClick={() => onRemove(i)} disabled={values.length === 1} className="size-10 grid place-items-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-30">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button onClick={onAdd} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline">
        <Plus className="size-4" /> Add another
      </button>
    </div>
  );
}

function CheckItem({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn("grid size-4 place-items-center rounded-full", ok ? "bg-brand text-white" : "border border-border")}>
        {ok && <Check className="size-3" />}
      </span>
      <span className={ok ? "text-ink" : "text-muted-foreground"}>{children}</span>
    </li>
  );
}
