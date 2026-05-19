import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Star, Users, Calendar, Check, FileText, ShieldCheck, X, CreditCard, ChevronRight, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKET_CLASSES, classState, LOW_STOCK_THRESHOLD, type MarketClass } from "@/lib/marketplace-data";
import { CHILDREN, type Child } from "@/lib/parent-store";

export const Route = createFileRoute("/parent/classes/$id")({
  head: () => ({ meta: [{ title: "Class details — iTutor Parent" }] }),
  component: ParentClassDetail,
  notFoundComponent: () => (
    <div className="text-center py-16">
      <h1 className="text-xl font-bold text-ink">Class not found</h1>
      <Link to="/parent/classes" className="mt-3 inline-block text-brand-deep font-semibold">← Browse classes</Link>
    </div>
  ),
});

function ParentClassDetail() {
  const { id } = Route.useParams();
  const c = MARKET_CLASSES.find((x) => x.id === id);
  if (!c) throw notFound();
  const [enrollOpen, setEnrollOpen] = useState(false);

  const st = classState(c);
  const remaining = c.seatsTotal - c.seatsTaken;
  const showScarcity = c.kind === "group" && remaining > 0 && remaining <= LOW_STOCK_THRESHOLD;
  const cta = st === "full" ? "Join waitlist" : st === "approval-required" ? "Request to join" : st === "recurring-1on1" ? "Confirm terms" : "Enroll my child";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/parent/classes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All classes
      </Link>

      <div className={cn("relative rounded-3xl overflow-hidden bg-gradient-to-br p-8 text-white", c.bannerFrom, c.bannerTo)}>
        <div className="text-5xl mb-3">{c.emoji}</div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold opacity-90 mb-1">
          <span>{c.subject}</span><span>·</span><span>{c.level}</span>
        </div>
        <h1 className="text-3xl font-bold">{c.title}</h1>
        <p className="text-sm opacity-90 mt-2 max-w-xl">{c.shortBlurb}</p>

        <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
          {c.discountLabel && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white text-coral">{c.discountLabel}</span>}
          {st === "full" && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-ink/70 text-white">Class full</span>}
          {showScarcity && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white text-coral">Only {remaining} left</span>}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <section className="rounded-2xl bg-background border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full grid place-items-center font-bold text-ink shrink-0" style={{ background: `oklch(0.85 0.1 ${c.tutorHue})` }}>
                {c.tutorName.split(" ").map((x) => x[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-ink">{c.tutorName}</div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> {c.tutorRating} · {c.tutorReviews} reviews
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-background border border-border p-5 space-y-3">
            <h2 className="font-bold text-ink">About this class</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.longDescription}</p>
          </section>

          <section className="rounded-2xl bg-background border border-border p-5">
            <h2 className="font-bold text-ink mb-3">What's included</h2>
            <ul className="space-y-2">
              {c.whatsIncluded.map((w) => (
                <li key={w} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="size-4 text-brand-deep mt-0.5 shrink-0" /> {w}
                </li>
              ))}
              {c.includesParentFeedback && (
                <li className="flex items-start gap-2 text-sm text-brand-deep font-semibold">
                  <FileText className="size-4 mt-0.5 shrink-0" /> Monthly parent feedback report
                </li>
              )}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 self-start rounded-2xl bg-background border border-border p-5 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Price</div>
            <div className="flex items-baseline gap-2 mt-1">
              {c.originalPrice && <span className="text-sm text-muted-foreground line-through">TT${c.originalPrice}</span>}
              <span className="text-2xl font-bold text-ink">TT${c.price}</span>
              <span className="text-xs text-muted-foreground">/{c.billing === "per-month" ? "month" : c.billing === "per-session" ? "session" : "term"}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{c.billingDescription}</div>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="size-3.5" /> {c.schedule}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Users className="size-3.5" /> {c.kind === "recurring-1on1" ? "Private 1:1" : `${c.seatsTaken}/${c.seatsTotal} seats taken`}</div>
            <div className="text-xs text-muted-foreground">{c.startDate}</div>
          </div>

          <button onClick={() => setEnrollOpen(true)}
            className={cn("w-full px-4 py-3 rounded-2xl text-sm font-semibold transition",
              st === "full" ? "bg-ink text-white hover:bg-forest" : "bg-brand text-white hover:bg-brand-deep")}>
            {cta}
          </button>

          <div className="rounded-xl bg-mint p-3 text-[11px] text-ink/80 leading-relaxed flex gap-2">
            <ShieldCheck className="size-4 text-brand-deep shrink-0 mt-0.5" />
            <span>You're enrolling on behalf of your child — this is your consent. No separate approval step required.</span>
          </div>
        </aside>
      </div>

      {enrollOpen && <EnrollFlow c={c} onClose={() => setEnrollOpen(false)} />}
    </div>
  );
}

function EnrollFlow({ c, onClose }: { c: MarketClass; onClose: () => void }) {
  const st = classState(c);
  const [step, setStep] = useState<"child" | "review" | "done">("child");
  const [childId, setChildId] = useState<string>(CHILDREN[0]?.id ?? "");
  const child = CHILDREN.find((x) => x.id === childId);

  const isWaitlist = st === "full";
  const isApproval = st === "approval-required";
  const primaryLabel = isWaitlist ? "Join waitlist" : isApproval ? "Request to join" : st === "recurring-1on1" ? "Confirm & enroll" : "Approve & pay";
  const doneTitle = isWaitlist ? "Added to the waitlist" : isApproval ? "Request sent" : "Enrollment confirmed";
  const doneBody = isWaitlist
    ? `We'll email you the moment a seat opens for ${child?.name}.`
    : isApproval
      ? `${c.tutorName} will review and approve ${child?.name}'s seat. We'll only charge you once accepted.`
      : `${child?.name} is enrolled in ${c.title}. A receipt has been emailed to you.`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 bg-background border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="font-bold text-ink">
            {step === "child" ? "Who is this for?" : step === "review" ? "Review & confirm" : doneTitle}
          </div>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
        </header>

        {step === "child" && (
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">Select which child you're enrolling in <span className="font-semibold text-ink">{c.title}</span>.</p>
            <div className="space-y-2">
              {CHILDREN.map((ch) => (
                <ChildOption key={ch.id} ch={ch} selected={childId === ch.id} onSelect={() => setChildId(ch.id)} />
              ))}
              <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add a new child</button>
            </div>
            <button disabled={!childId} onClick={() => setStep("review")}
              className={cn("w-full px-4 py-3 rounded-2xl font-semibold text-sm",
                childId ? "bg-brand text-white hover:bg-brand-deep" : "bg-muted text-muted-foreground cursor-not-allowed")}>
              Continue
            </button>
          </div>
        )}

        {step === "review" && child && (
          <div className="p-5 space-y-4">
            <div className="rounded-xl border border-border p-3 flex items-center gap-3">
              <div className="size-10 rounded-full grid place-items-center font-bold text-ink text-sm" style={{ background: `oklch(0.85 0.1 ${child.hue})` }}>{child.initials}</div>
              <div className="flex-1 text-sm">
                <div className="font-semibold text-ink">{child.name}</div>
                <div className="text-xs text-muted-foreground">{child.ageLabel}</div>
              </div>
              <button onClick={() => setStep("child")} className="text-xs font-semibold text-brand-deep">Change</button>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Class</span><span className="font-semibold text-ink text-right">{c.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tutor</span><span className="text-ink">{c.tutorName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Schedule</span><span className="text-ink text-right">{c.schedule}</span></div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">{isWaitlist || isApproval ? "Price (charged on confirmation)" : "Charged today"}</span>
                <span className="font-bold text-ink">TT${c.price}<span className="text-xs font-normal text-muted-foreground">/{c.billing === "per-month" ? "mo" : c.billing === "per-session" ? "session" : "term"}</span></span>
              </div>
              <div className="text-[11px] text-muted-foreground pt-1">{c.billingDescription}</div>
            </div>

            <div className="rounded-xl border border-border p-3 flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-ink to-forest grid place-items-center text-white text-[10px] font-bold">VISA</div>
              <div className="flex-1 text-sm">Visa •••• 4242 <span className="text-muted-foreground">· default</span></div>
              <Link to="/parent/settings" className="text-xs font-semibold text-brand-deep">Change</Link>
            </div>

            <div className="rounded-xl bg-mint p-3 text-[11px] text-ink/80 leading-relaxed flex gap-2">
              <Lock className="size-4 text-brand-deep shrink-0 mt-0.5" />
              <span>By {primaryLabel.toLowerCase()}, you consent to the terms above. Renewals will auto-bill to your default card and you can cancel anytime from Billing.</span>
            </div>

            <button onClick={() => setStep("done")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand text-white font-semibold text-sm hover:bg-brand-deep">
              <CreditCard className="size-4" /> {primaryLabel}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto size-12 rounded-2xl bg-brand grid place-items-center text-white"><Check className="size-6" /></div>
            <h3 className="font-bold text-ink">{doneTitle}</h3>
            <p className="text-sm text-muted-foreground">{doneBody}</p>
            <Link to="/parent" onClick={onClose} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-ink text-white font-semibold text-sm">
              Back to dashboard <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ChildOption({ ch, selected, onSelect }: { ch: Child; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect}
      className={cn("w-full text-left flex items-center gap-3 p-3 rounded-xl border transition",
        selected ? "border-brand bg-brand-soft/40" : "border-border hover:border-brand-deep/40")}>
      <div className="size-10 rounded-full grid place-items-center font-bold text-ink text-sm shrink-0" style={{ background: `oklch(0.85 0.1 ${ch.hue})` }}>{ch.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink truncate">{ch.name}</div>
        <div className="text-xs text-muted-foreground truncate">{ch.ageLabel}</div>
      </div>
      <div className={cn("size-5 rounded-full border-2 grid place-items-center shrink-0", selected ? "border-brand bg-brand" : "border-border")}>
        {selected && <Check className="size-3 text-white" />}
      </div>
    </button>
  );
}
