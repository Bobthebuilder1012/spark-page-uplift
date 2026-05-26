import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import {
  ArrowLeft, Star, Calendar, Clock, Users, FileText, BadgeCheck,
  Check, Lock, ShieldCheck, CreditCard, X, Loader2, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKET_CLASSES, classState, type MarketClass } from "@/lib/marketplace-data";
import { RatingBreakdown } from "@/components/ratings/RatingBreakdown";
import { CommentSection } from "@/components/ratings/CommentSection";
import { getSummary } from "@/lib/ratings-store";

type FlowStep = "detail" | "join" | "confirm-terms" | "joined" | "awaiting-approval" | "awaiting-consent" | "parent-consent";

const searchSchema = z.object({
  step: fallback(
    z.enum(["detail", "join", "confirm-terms", "joined", "awaiting-approval", "awaiting-consent", "parent-consent"]),
    "detail",
  ).default("detail"),
});

export const Route = createFileRoute("/student/classes/$id")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Class details — iTutor" }] }),
  component: ClassDetailPage,
  notFoundComponent: () => (
    <div className="max-w-md mx-auto text-center py-20">
      <h1 className="text-2xl font-bold text-ink">Class not found</h1>
      <Link to="/student/classes" className="mt-4 inline-block text-brand-deep font-semibold">← Back to browse</Link>
    </div>
  ),
});

function ClassDetailPage() {
  const { id } = Route.useParams();
  const { step } = Route.useSearch();
  const c = MARKET_CLASSES.find((x) => x.id === id);
  if (!c) throw notFound();

  if (step === "parent-consent") return <ParentConsentScreen c={c} />;
  if (step === "join") return <JoinFlow c={c} />;
  if (step === "confirm-terms") return <ConfirmTermsScreen c={c} />;
  if (step === "joined") return <JoinedScreen c={c} kind="enrolled" />;
  if (step === "awaiting-approval") return <JoinedScreen c={c} kind="awaiting-approval" />;
  if (step === "awaiting-consent") return <JoinedScreen c={c} kind="awaiting-consent" />;
  return <Detail c={c} />;
}

/* ---------------- Detail screen ---------------- */

function Detail({ c }: { c: MarketClass }) {
  const state = classState(c);
  const remaining = c.seatsTotal - c.seatsTaken;
  const isFull = state === "full";
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const summary = getSummary("class", c.id);

  const cta = (() => {
    if (state === "full") return { label: "Join waitlist", to: "join" as const, tone: "ink" as const };
    if (state === "recurring-1on1") return { label: "Review terms & confirm", to: "confirm-terms" as const, tone: "brand" as const };
    if (state === "approval-required") return { label: "Request to join", to: "join" as const, tone: "brand" as const };
    return { label: "Join class", to: "join" as const, tone: "brand" as const };
  })();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/student/classes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All classes
      </Link>

      {/* Hero */}
      <section className={`relative rounded-3xl bg-gradient-to-br ${c.bannerFrom} ${c.bannerTo} p-6 sm:p-8 text-white overflow-hidden`}>
        <div className="flex items-start gap-4">
          <div className="size-16 rounded-2xl bg-white grid place-items-center text-4xl shadow-md shrink-0">{c.emoji}</div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider font-bold opacity-90">{c.subject} · {c.level}</div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1 leading-tight">{c.title}</h1>
            <p className="text-sm opacity-95 mt-2">{c.shortBlurb}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {c.includesParentFeedback && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand text-white shadow-sm">
              <Sparkles className="size-3.5" /> Free parent feedback included
            </span>
          )}
          {c.kind === "recurring-1on1" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/95 text-ink">Recurring 1:1</span>
          )}
          {c.approvalRequired && c.kind === "group" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/95 text-ink">Approval required</span>
          )}
        </div>
      </section>

      {/* Tutor */}
      <Link to="/student/tutors/$id" params={{ id: c.tutorId }} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:bg-muted/40 transition">
        <div className="size-12 rounded-full grid place-items-center font-bold text-ink shrink-0" style={{ background: `oklch(0.85 0.1 ${c.tutorHue})` }}>
          {c.tutorName.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-ink truncate">{c.tutorName}</span>
            <BadgeCheck className="size-4 text-brand-deep shrink-0" />
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Star className="size-3 fill-coral text-coral" />
            <span className="font-semibold text-ink">{c.tutorRating}</span>
            <span>({c.tutorReviews} reviews)</span>
          </div>
        </div>
        <span className="text-xs text-brand-deep font-semibold">View profile →</span>
      </Link>

      {/* Schedule & seats */}
      <section className="rounded-2xl border border-border bg-background p-5 space-y-3">
        <h2 className="font-bold text-ink">Schedule</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Row icon={<Calendar className="size-4 text-brand-deep" />} label="When" value={c.schedule} />
          <Row icon={<Clock className="size-4 text-brand-deep" />} label="Cadence" value={c.cadence} />
          <Row icon={<Users className="size-4 text-brand-deep" />} label={c.kind === "recurring-1on1" ? "Format" : "Seats"}
               value={c.kind === "recurring-1on1" ? "Private 1:1" : `${c.seatsTaken}/${c.seatsTotal} enrolled${remaining > 0 && remaining <= 4 ? ` · only ${remaining} left` : ""}`} />
          <Row icon={<Calendar className="size-4 text-brand-deep" />} label="Starts" value={c.startDate} />
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-border bg-background p-5 space-y-2">
        <h2 className="font-bold text-ink">About this class</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{c.longDescription}</p>
      </section>

      {/* Included */}
      <section className="rounded-2xl border border-border bg-background p-5">
        <h2 className="font-bold text-ink">What's included</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          {c.whatsIncluded.map((x) => (
            <li key={x} className="flex items-start gap-2">
              <Check className="size-4 text-brand-deep mt-0.5 shrink-0" /> <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 sm:rounded-2xl bg-background border-t sm:border border-border p-4 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-ink">TT${c.price}</span>
            {c.originalPrice && <span className="text-sm text-muted-foreground line-through">TT${c.originalPrice}</span>}
            <span className="text-xs text-muted-foreground">/{c.billing === "per-month" ? "mo" : c.billing === "per-session" ? "session" : "term"}</span>
          </div>
          <div className="text-[11px] text-muted-foreground truncate">{c.billingDescription}</div>
        </div>
        <Link
          to="/student/classes/$id"
          params={{ id: c.id }}
          search={{ step: cta.to }}
          className={cn(
            "px-5 py-3 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 transition shrink-0",
            cta.tone === "brand" ? "bg-brand text-white hover:bg-brand-deep" : "bg-ink text-white hover:bg-ink/90",
          )}
        >
          {isFull && <Lock className="size-4" />}
          {cta.label}
        </Link>
      </div>

      {/* Ratings + comments */}
      <RatingBreakdown summary={summary} activeFilter={ratingFilter} onFilterChange={setRatingFilter} />
      <CommentSection
        targetKind="class"
        targetId={c.id}
        targetName={c.title}
        activeRatingFilter={ratingFilter}
        onClearFilter={() => setRatingFilter(null)}
      />

      {/* Demo: jump to other states */}
      <DemoStateSwitcher c={c} />
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <div>
        <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
        <div className="text-sm text-ink font-medium">{value}</div>
      </div>
    </div>
  );
}

/* ---------------- Join flow (group) ---------------- */

function JoinFlow({ c }: { c: MarketClass }) {
  const state = classState(c);
  const heading =
    state === "full" ? "Join the waitlist"
    : state === "approval-required" ? "Request to join"
    : "Confirm your enrollment";

  const nextStep: FlowStep =
    state === "full" ? "awaiting-approval"
    : state === "approval-required" ? "awaiting-approval"
    : "awaiting-consent"; // assumes student is parent-created; can be "joined" otherwise

  return (
    <div className="max-w-md mx-auto py-6 space-y-5">
      <Header backTo="detail" c={c} title={heading} />

      <SummaryCard c={c} />

      <section className="rounded-2xl border border-border bg-background p-5 space-y-3">
        <h2 className="font-bold text-ink text-sm">Billing</h2>
        <Row icon={<CreditCard className="size-4 text-brand-deep" />} label="Model"
             value={c.billing === "per-month" ? "Monthly subscription" : c.billing === "per-session" ? "Per-session billing" : "Prepaid term"} />
        <p className="text-xs text-muted-foreground leading-relaxed">{c.billingDescription}</p>
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 space-y-2">
        <h2 className="font-bold text-ink text-sm">Terms</h2>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2"><Check className="size-3.5 text-brand-deep mt-0.5" /> First class is a free preview — cancel before week 2 with no charge.</li>
          <li className="flex items-start gap-2"><Check className="size-3.5 text-brand-deep mt-0.5" /> Recordings available within 24 hours of each session.</li>
          <li className="flex items-start gap-2"><Check className="size-3.5 text-brand-deep mt-0.5" /> You can cancel any time from your account — no fees.</li>
          {state === "approval-required" && <li className="flex items-start gap-2"><Check className="size-3.5 text-brand-deep mt-0.5" /> The tutor will review your request within 48 hours.</li>}
          {state === "full" && <li className="flex items-start gap-2"><Check className="size-3.5 text-brand-deep mt-0.5" /> You'll be notified the moment a seat opens — no obligation to take it.</li>}
        </ul>
      </section>

      <Link
        to="/student/classes/$id"
        params={{ id: c.id }}
        search={{ step: nextStep }}
        className="block w-full text-center px-5 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep"
      >
        {state === "full" ? "Add me to the waitlist"
          : state === "approval-required" ? "Send request to tutor"
          : "Confirm & continue to consent"}
      </Link>
      <p className="text-[11px] text-muted-foreground text-center">By continuing you agree to iTutor's Terms of Service.</p>
    </div>
  );
}

/* ---------------- Recurring 1:1 confirm terms ---------------- */

function ConfirmTermsScreen({ c }: { c: MarketClass }) {
  return (
    <div className="max-w-md mx-auto py-6 space-y-5">
      <Header backTo="detail" c={c} title="Confirm your 1:1 terms" />

      <div className="rounded-2xl border border-border bg-background p-5 space-y-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-ink">{c.tutorName}</span> has set the following terms for your recurring 1:1. Review carefully — this becomes your weekly slot.
        </p>
        <div className="grid grid-cols-1 gap-3 text-sm pt-2">
          <Row icon={<Calendar className="size-4 text-brand-deep" />} label="Weekly slot" value={c.schedule} />
          <Row icon={<Clock className="size-4 text-brand-deep" />} label="Duration" value={c.cadence} />
          <Row icon={<CreditCard className="size-4 text-brand-deep" />} label="Price" value={`TT$${c.price} / session`} />
          <Row icon={<ShieldCheck className="size-4 text-brand-deep" />} label="Cancellation" value="24-hour notice · no fee" />
        </div>
      </div>

      <div className="rounded-2xl bg-mint p-4 text-xs text-ink/80 leading-relaxed">
        Both you and your tutor must agree to these terms before the slot is locked in. Either side can change the schedule later by mutual agreement.
      </div>

      <Link
        to="/student/classes/$id"
        params={{ id: c.id }}
        search={{ step: "awaiting-consent" }}
        className="block w-full text-center px-5 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep"
      >
        I agree — request this slot
      </Link>
    </div>
  );
}

/* ---------------- Confirmation / status screens ---------------- */

function JoinedScreen({ c, kind }: { c: MarketClass; kind: "enrolled" | "awaiting-approval" | "awaiting-consent" }) {
  const copy = {
    enrolled: {
      icon: <Check className="size-6 text-white" />, tone: "bg-brand",
      title: "You're enrolled!",
      body: "Your first session is on " + c.schedule + ". We've added it to your calendar and you'll get reminders.",
      next: "Go to my classes",
    },
    "awaiting-approval": {
      icon: <Loader2 className="size-6 text-white animate-spin" />, tone: "bg-amber-500",
      title: "Request sent to the tutor",
      body: c.tutorName + " typically responds within 48 hours. You'll get a notification the moment they approve.",
      next: "Back to browse",
    },
    "awaiting-consent": {
      icon: <ShieldCheck className="size-6 text-white" />, tone: "bg-sky-500",
      title: "Waiting for parent consent",
      body: "Since this account was set up by a parent, your parent needs to approve and pay before you're fully enrolled. We've emailed them a link.",
      next: "Preview parent's consent screen",
    },
  }[kind];

  return (
    <div className="max-w-md mx-auto py-12 space-y-6 text-center">
      <div className={cn("mx-auto size-14 rounded-2xl grid place-items-center", copy.tone)}>{copy.icon}</div>
      <div>
        <h1 className="text-2xl font-bold text-ink">{copy.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{copy.body}</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4 text-left">
        <SummaryCardInner c={c} />
      </div>

      {kind === "awaiting-consent" ? (
        <Link to="/student/classes/$id" params={{ id: c.id }} search={{ step: "parent-consent" }}
          className="inline-block px-5 py-3 rounded-2xl bg-ink text-white font-semibold">
          {copy.next} →
        </Link>
      ) : (
        <Link to="/student/classes" className="inline-block px-5 py-3 rounded-2xl bg-ink text-white font-semibold">{copy.next}</Link>
      )}
    </div>
  );
}

/* ---------------- Parent consent screen ---------------- */

function ParentConsentScreen({ c }: { c: MarketClass }) {
  // Mock child identity — in a real flow this would come from the parent account.
  const child = { name: "Aliyah Mohammed", initials: "AM" };

  return (
    <div className="max-w-md mx-auto py-6 space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
          <ShieldCheck className="size-3" /> Parent consent
        </div>
        <h1 className="mt-3 text-2xl font-bold text-ink">Approve {child.name}'s class</h1>
        <p className="text-sm text-muted-foreground mt-1">Your child requested to join this class. Review the details and approve to enroll.</p>
      </div>

      {/* Child */}
      <section className="rounded-2xl border border-border bg-background p-4 flex items-center gap-3">
        <div className="size-12 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-white font-bold">{child.initials}</div>
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Child</div>
          <div className="font-semibold text-ink">{child.name}</div>
        </div>
      </section>

      {/* Class summary */}
      <SummaryCard c={c} />

      {/* Billing terms — emphasise auto-renewal */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm space-y-2">
        <div className="font-bold text-amber-900 flex items-center gap-1.5">
          <CreditCard className="size-4" /> One-time consent · renewals auto-bill
        </div>
        <p className="text-amber-900/90 text-xs leading-relaxed">
          By approving today, you authorise iTutor to charge <span className="font-bold">TT${c.price}</span>
          {c.billing === "per-month" ? " every month" : c.billing === "per-session" ? " per session attended" : " for this term"}
          {" "}to your card on file. You can pause or cancel from your parent dashboard at any time — no fees, no questions asked.
        </p>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/student/classes" className="text-center px-4 py-3 rounded-2xl border border-border bg-background text-ink font-semibold hover:bg-muted">
          Decline
        </Link>
        <Link to="/student/classes/$id" params={{ id: c.id }} search={{ step: "joined" }}
          className="text-center px-4 py-3 rounded-2xl bg-brand text-white font-semibold hover:bg-brand-deep inline-flex items-center justify-center gap-1.5">
          <Check className="size-4" /> Approve & pay
        </Link>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">Secure payment · powered by iTutor</p>
    </div>
  );
}

/* ---------------- Shared bits ---------------- */

function Header({ backTo, c, title }: { backTo: FlowStep; c: MarketClass; title: string }) {
  return (
    <div className="flex items-center justify-between">
      <Link to="/student/classes/$id" params={{ id: c.id }} search={{ step: backTo }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back
      </Link>
      <h1 className="font-bold text-ink">{title}</h1>
      <Link to="/student/classes" className="size-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground"><X className="size-4" /></Link>
    </div>
  );
}

function SummaryCard({ c }: { c: MarketClass }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <SummaryCardInner c={c} />
    </section>
  );
}

function SummaryCardInner({ c }: { c: MarketClass }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-12 rounded-2xl bg-gradient-to-br ${c.bannerFrom} ${c.bannerTo} grid place-items-center text-2xl shrink-0`}>{c.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink truncate">{c.title}</div>
        <div className="text-xs text-muted-foreground truncate">by {c.tutorName} · {c.schedule}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-ink">TT${c.price}</div>
        {c.originalPrice && <div className="text-[11px] text-muted-foreground line-through">TT${c.originalPrice}</div>}
      </div>
    </div>
  );
}

function DemoStateSwitcher({ c }: { c: MarketClass }) {
  const states: { step: FlowStep; label: string }[] = [
    { step: "join", label: "Join flow" },
    { step: "confirm-terms", label: "1:1 confirm terms" },
    { step: "awaiting-approval", label: "Awaiting tutor approval" },
    { step: "awaiting-consent", label: "Awaiting parent consent" },
    { step: "parent-consent", label: "Parent consent screen" },
    { step: "joined", label: "Enrolled confirmation" },
  ];
  return (
    <details className="mt-8 rounded-xl border border-dashed border-border bg-card/50 p-3 text-xs">
      <summary className="cursor-pointer text-muted-foreground font-semibold">Preview other states</summary>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <Link key={s.step} to="/student/classes/$id" params={{ id: c.id }} search={{ step: s.step }}
            className="px-2.5 py-1 rounded-full bg-background border border-border hover:border-ink/30 text-ink/80">
            {s.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
