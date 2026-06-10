import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, Star, Users, CalendarDays, Clock } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { getClassById, getClassBadges } from "@/lib/classes-catalog";
import { useEnrolledClasses } from "@/lib/social-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/class/$id")({
  head: () => ({ meta: [{ title: "Checkout — iTutor" }] }),
  component: ClassCheckoutPage,
});

function LunipayMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-bold tracking-tight", className)}>
      <span className="grid size-5 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-[10px] font-black">L</span>
      Lunipay
    </span>
  );
}

function ClassCheckoutPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const c = getClassById(id);
  const enrolled = useEnrolledClasses();
  const [pay, setPay] = useState<"card" | "wallet" | "bank">("card");
  const [paid, setPaid] = useState(false);

  if (!c) {
    return (
      <div className="min-h-screen bg-mint grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Class not found</h1>
          <Link to="/classes" className="mt-4 inline-flex items-center gap-1.5 text-brand-deep hover:underline">
            <ArrowLeft className="size-4" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const fee = 4.5;
  const total = (c.priceTTD + fee).toFixed(2);
  const badges = getClassBadges(c);

  const confirm = () => {
    enrolled.add(c.id);
    setPaid(true);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-mint grid place-items-center px-4">
        <div className="max-w-md w-full bg-background rounded-3xl border border-border p-8 text-center shadow-card">
          <div className="size-16 mx-auto rounded-full bg-brand-soft grid place-items-center mb-4">
            <CheckCircle2 className="size-9 text-brand-deep" />
          </div>
          <h1 className="text-2xl font-bold text-ink">You're enrolled</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome to <span className="font-semibold text-ink">{c.title}</span>. Your first session is {c.schedule}.
          </p>
          <p className="text-xs text-muted-foreground mt-3">Payment processed by <LunipayMark className="text-[11px]" /></p>
          <Link
            to="/classes/$id" params={{ id: c.id }}
            className="mt-6 inline-block w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-deep"
          >
            Go to class home
          </Link>
          <button onClick={() => navigate({ to: "/classes" })} className="mt-2 inline-block w-full py-3 rounded-full border border-border font-semibold text-ink hover:bg-muted">
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" aria-label="iTutor"><Logo size={28} /></Link>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
            <Lock className="size-3.5" /> Secure checkout · <LunipayMark className="text-xs" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <Link to="/classes/$id" params={{ id: c.id }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
          <ArrowLeft className="size-4" /> Back to class
        </Link>

        <div className="mt-5 grid lg:grid-cols-[1fr_400px] gap-6">
          {/* LEFT — payment */}
          <div className="space-y-4">
            <section className="rounded-3xl border border-border bg-background p-6 shadow-card">
              <h1 className="text-xl font-bold text-ink">Choose how to pay</h1>
              <p className="text-xs text-muted-foreground mt-1">Securely processed by Lunipay. You can cancel anytime before your next billing cycle.</p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["card", "wallet", "bank"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPay(opt)}
                    className={cn(
                      "rounded-2xl border-2 py-3 text-sm font-semibold capitalize transition",
                      pay === opt ? "border-ink bg-background" : "border-border bg-background hover:border-ink/40",
                    )}
                  >
                    {opt === "card" ? "Card" : opt === "wallet" ? "Lunipay Wallet" : "Bank transfer"}
                  </button>
                ))}
              </div>

              {pay === "card" && (
                <div className="mt-5 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-ink">Cardholder name</label>
                    <input placeholder="Name on card" className="mt-1 w-full px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink">Card number</label>
                    <input placeholder="1234 1234 1234 1234" className="mt-1 w-full px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="MM / YY" className="px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                    <input placeholder="CVC" className="px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ink pt-1">
                    <input type="checkbox" defaultChecked className="accent-brand size-4" />
                    Save card to my Lunipay wallet for next month
                  </label>
                </div>
              )}

              {pay === "wallet" && (
                <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-ink">
                  Pay using your Lunipay wallet balance. You'll be redirected to confirm.
                </div>
              )}

              {pay === "bank" && (
                <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-ink">
                  Pay directly from your bank via Lunipay's instant transfer rails. Funds usually clear in under 60 seconds.
                </div>
              )}

              <button onClick={confirm} className="mt-6 w-full py-3.5 rounded-full bg-brand text-white font-bold hover:bg-brand-deep transition">
                Pay TTD ${total} & enrol
              </button>

              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed text-center">
                By continuing you agree to iTutor's <span className="underline">Refund Policy</span> and Lunipay's <span className="underline">Terms</span>.
                Your card is encrypted and never touches our servers.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-trust-bg p-4 flex items-start gap-3">
              <ShieldCheck className="size-5 text-trust-text mt-0.5 shrink-0" />
              <div className="text-sm text-trust-text">
                <div className="font-bold">Money-back guarantee</div>
                Drop within the first week and Lunipay refunds you in full — no questions asked.
              </div>
            </section>
          </div>

          {/* RIGHT — order summary */}
          <aside className="lg:sticky lg:top-24 self-start space-y-3">
            <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-card">
              <div
                className="relative h-28 grid place-items-center text-white"
                style={{ background: `linear-gradient(135deg, oklch(0.85 0.1 ${c.hue}), oklch(0.55 0.16 ${c.hue}))` }}
              >
                <span className="absolute right-3 bottom-1 text-[5rem] leading-none opacity-30 font-black">{c.emoji ?? c.subject[0]}</span>
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/25 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold">{c.level}</span>
                  {badges.slice(0, 1).map((b) => (
                    <span key={b.key} className="rounded-full bg-ink text-white px-2.5 py-0.5 text-[10px] font-bold">{b.label}</span>
                  ))}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-base font-bold text-ink leading-snug">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">Taught by {c.tutorName}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded-xl border border-border p-2">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <div className="font-bold text-ink mt-1">{c.rating.toFixed(1)}</div>
                    <div className="text-muted-foreground">{c.ratingCount} ratings</div>
                  </div>
                  <div className="rounded-xl border border-border p-2">
                    <Users className="size-3.5 text-ink/60" />
                    <div className="font-bold text-ink mt-1">{c.seatsTaken}</div>
                    <div className="text-muted-foreground">enrolled</div>
                  </div>
                  <div className="rounded-xl border border-border p-2">
                    <Clock className="size-3.5 text-ink/60" />
                    <div className="font-bold text-ink mt-1">{c.duration}</div>
                    <div className="text-muted-foreground">per session</div>
                  </div>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-xs text-ink flex items-start gap-2">
                  <CalendarDays className="size-4 text-ink/60 mt-0.5 shrink-0" />
                  <div>{c.schedule}<br /><span className="text-muted-foreground">{c.startsLabel}</span></div>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-ink">
                    <span>Monthly subscription</span>
                    <span>TTD ${c.priceTTD.toFixed(2)}</span>
                  </div>
                  {c.originalPriceTTD && (
                    <div className="flex justify-between text-brand-deep text-xs">
                      <span>Promo discount</span>
                      <span>−TTD ${(c.originalPriceTTD - c.priceTTD).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Lunipay processing fee</span>
                    <span>TTD ${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-border">
                    <span>Total today</span>
                    <span>TTD ${total}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Next bill {c.nextBilling}. Cancel anytime.</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
