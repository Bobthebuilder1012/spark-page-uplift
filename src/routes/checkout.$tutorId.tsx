import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import {
  CreditCard,
  Apple,
  HelpCircle,
  Repeat,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  GraduationCap,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { cn } from "@/lib/utils";

const search = z.object({
  duration: fallback(z.coerce.number(), 60).default(60),
  slot: fallback(z.string(), "18:00").default("18:00"),
  date: fallback(z.string(), new Date().toISOString()).default(new Date().toISOString()),
});

export const Route = createFileRoute("/checkout/$tutorId")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Checkout — iTutor" }] }),
  component: CheckoutPage,
});

const TUTORS: Record<string, { name: string; subject: string; hue: number; rating: number; reviews: number; lessons: number; students: number; years: number; pricePerLesson: number }> = {
  ramdeen: { name: "Mr. Ramdeen", subject: "Mathematics", hue: 145, rating: 4.99, reviews: 128, lessons: 14207, students: 61, years: 10, pricePerLesson: 35 },
  singh: { name: "Ms. Singh", subject: "Physics", hue: 220, rating: 4.85, reviews: 94, lessons: 3120, students: 42, years: 6, pricePerLesson: 28 },
  joseph: { name: "Mr. Joseph", subject: "English Lit", hue: 20, rating: 4.95, reviews: 211, lessons: 8400, students: 88, years: 8, pricePerLesson: 30 },
  ali: { name: "Ms. Ali", subject: "Biology", hue: 280, rating: 4.7, reviews: 67, lessons: 1800, students: 32, years: 4, pricePerLesson: 30 },
  thomas: { name: "Mr. Thomas", subject: "Chemistry", hue: 165, rating: 4.9, reviews: 142, lessons: 5600, students: 51, years: 9, pricePerLesson: 32 },
  khan: { name: "Ms. Khan", subject: "SEA Prep", hue: 35, rating: 4.92, reviews: 178, lessons: 9100, students: 110, years: 7, pricePerLesson: 22 },
};

function Avatar({ name, hue, size = 56 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full grid place-items-center font-bold shrink-0"
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function PaymentTile({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl border-2 py-4 text-sm font-semibold transition",
        active ? "border-ink bg-background" : "border-border bg-background hover:border-ink/40",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function CheckoutPage() {
  const { tutorId } = Route.useParams();
  const { duration: durQ, slot, date } = Route.useSearch();
  const navigate = useNavigate();
  const tutor = TUTORS[tutorId] ?? TUTORS.ramdeen;

  const [duration, setDuration] = useState<30 | 60>((durQ === 30 ? 30 : 60) as 30 | 60);
  const [pay, setPay] = useState<"card" | "apple" | "google">("card");
  const [paid, setPaid] = useState(false);

  const lessonPrice = duration === 30 ? Math.round(tutor.pricePerLesson * 0.6) : tutor.pricePerLesson;
  const fee = 0.3;
  const total = (lessonPrice + fee).toFixed(2);

  const d = new Date(date);
  const dayLabel = d.toLocaleString("en-US", { weekday: "long" });
  const monthLabel = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const dayNum = d.getDate();
  const endTime = (() => {
    const [h, m] = slot.split(":").map(Number);
    const end = new Date();
    end.setHours(h, m + duration, 0, 0);
    return end.toTimeString().slice(0, 5);
  })();

  if (paid) {
    return (
      <div className="min-h-screen bg-mint grid place-items-center px-4">
        <div className="max-w-md w-full bg-background rounded-3xl border border-border p-8 text-center shadow-card">
          <div className="size-16 mx-auto rounded-full bg-brand-soft grid place-items-center mb-4">
            <CheckCircle2 className="size-9 text-brand-deep" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Lesson booked</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your trial lesson with {tutor.name} is confirmed for {dayLabel}, {slot} – {endTime}.
          </p>
          <Link to="/student/bookings" className="mt-6 inline-block w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-deep">
            View my bookings
          </Link>
          <Link to="/student/tutors" className="mt-2 inline-block w-full py-3 rounded-full border border-border font-semibold text-ink hover:bg-muted">
            Back to tutors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Brand band */}
      <div className="bg-trust-bg">
        <header className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" aria-label="iTutor"><Logo size={28} /></Link>
          <Link to="/student/tutors" className="text-sm font-semibold text-ink hover:underline">English, TTD ▾</Link>
        </header>
        <div className="max-w-6xl mx-auto px-5 pt-6 pb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink text-center">
            Master <span className="text-brand-deep">{tutor.subject}</span> in 1–3 months
          </h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 -mt-6 pb-16">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Your tutor */}
            <section className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <div className="text-sm font-semibold text-muted-foreground mb-3">Your tutor</div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-ink">{tutor.name}</div>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{tutor.rating}</span>
                    <span className="text-muted-foreground">({tutor.reviews} reviews)</span>
                  </div>
                </div>
                <Avatar name={tutor.name} hue={tutor.hue} size={64} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { icon: GraduationCap, value: tutor.students, label: "students" },
                  { icon: TrendingUp, value: tutor.lessons.toLocaleString(), label: "lessons" },
                  { icon: Clock3, value: tutor.years, label: "years teaching" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border p-3">
                    <s.icon className="size-4 text-muted-foreground mb-1" />
                    <div className="font-bold text-ink">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-border p-3">
                <div className="text-sm font-bold text-ink">Perfect for exam prep</div>
                <div className="text-xs text-muted-foreground">Highly rated by learners like you</div>
              </div>

            </section>

            {/* Trial details */}
            <section className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <div className="text-sm font-semibold text-muted-foreground mb-3">Trial lesson details</div>
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-border px-3 py-2 text-center">
                  <div className="text-[10px] font-bold text-brand-deep">{monthLabel}</div>
                  <div className="text-2xl font-bold text-ink leading-none">{dayNum}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{dayLabel}, {slot} – {endTime}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Time is based on your location</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-trust-bg text-trust-text text-xs font-semibold px-3 py-2.5">
                Cancel or reschedule for free until 24h before
              </div>
            </section>

            {/* Checkout info */}
            <section className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <div className="font-bold text-ink mb-3">Checkout info</div>
              <div className="grid grid-cols-2 rounded-xl bg-muted p-1 mb-4">
                {[30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d as 30 | 60)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-semibold transition",
                      duration === d ? "bg-background text-ink shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {d} mins · ${d === 30 ? Math.round(tutor.pricePerLesson * 0.6) : tutor.pricePerLesson}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{duration}-min lesson</span>
                  <span className="text-ink">${lessonPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    Processing fee <HelpCircle className="size-3" />
                  </span>
                  <span className="text-ink">${fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between text-base">
                  <span className="font-bold text-ink">Total</span>
                  <span className="font-bold text-ink">${total}</span>
                </div>
              </div>
              <button className="mt-3 text-sm font-semibold text-ink underline">Have a promo code?</button>

              <div className="mt-4 rounded-xl bg-trust-bg text-trust-text px-3 py-3 flex items-center gap-2 text-xs font-semibold">
                <Repeat className="size-4 shrink-0" />
                Free tutor replacement — if this tutor isn't a match, try 2 more for free.
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <section className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <div className="font-bold text-ink mb-3">Choose how to pay</div>
              <div className="grid grid-cols-2 gap-2">
                <PaymentTile icon={CreditCard} label="Card" active={pay === "card"} onClick={() => setPay("card")} />
                <PaymentTile icon={Apple} label="Apple Pay" active={pay === "apple"} onClick={() => setPay("apple")} />
                <PaymentTile icon={CreditCard} label="Google Pay" active={pay === "google"} onClick={() => setPay("google")} />
              </div>

              {pay === "card" && (
                <div className="mt-4 space-y-2">
                  <input
                    placeholder="1234 1234 1234 1234"
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="MM/YY" className="px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                    <input placeholder="CVC" className="px-3 py-3 rounded-xl border border-border bg-background outline-none focus:border-brand text-sm" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ink pt-2">
                    <input type="checkbox" defaultChecked className="accent-brand size-4" />
                    Save this card for future payments
                  </label>
                </div>
              )}

              <button
                onClick={() => setPaid(true)}
                className="mt-5 w-full py-3.5 rounded-full bg-brand text-white font-bold hover:bg-brand-deep transition"
              >
                Book lesson and pay · ${total}
              </button>

              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                By pressing the "Book lesson and pay · ${total}" button, you agree to iTutor's{" "}
                <span className="underline">Refund and Payment Policy</span>. All transactions are protected by SSL encryption.
              </p>
            </section>

            {/* Great choice */}
            <section className="rounded-3xl border border-border bg-background p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="font-bold text-ink">{tutor.name.split(" ").pop()} is a great choice</div>
                <div className="flex gap-1">
                  <button className="size-9 rounded-lg border border-border grid place-items-center hover:bg-muted">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button className="size-9 rounded-lg border border-border grid place-items-center hover:bg-muted">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-sm">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{tutor.rating}</span>
                <span className="text-muted-foreground">· {tutor.reviews} reviews</span>
              </div>
              <div className="mt-4 rounded-2xl border border-border p-4">
                <p className="text-sm text-ink leading-relaxed">
                  {tutor.name} is an excellent and kind teacher. Lessons are well structured and I always come away feeling more confident. Totally recommend.
                </p>
                <button className="mt-2 text-sm font-semibold text-ink underline">Read more</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
