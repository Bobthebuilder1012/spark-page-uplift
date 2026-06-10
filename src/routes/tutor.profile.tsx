import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTutor } from "@/lib/tutor-store";
import { MapPin, ExternalLink, Video, CalendarDays, Star, Pencil, Check, X } from "lucide-react";
import { RatingBreakdown } from "@/components/ratings/RatingBreakdown";
import { CommentSection } from "@/components/ratings/CommentSection";
import { getSummary, useTutoringPreference } from "@/lib/ratings-store";

export const Route = createFileRoute("/tutor/profile")({
  component: ProfilePage,
});

const MY_CLASSES = [
  { id: "csec-maths-crash", name: "CSEC Maths Crash Course", level: "Form 4–5", price: 350, schedule: "Mon & Wed · 5–6:30 PM", rating: 4.8, ratings: 20 },
  { id: "cape-physics-u1", name: "CAPE Physics Unit 1", level: "Form 6", price: 480, schedule: "Tue & Thu · 6–7:30 PM", rating: 4.6, ratings: 18 },
];

function ProfilePage() {
  const { profile, completion } = useTutor();
  const [pref] = useTutoringPreference();
  const [filter, setFilter] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftBio, setDraftBio] = useState(profile.bio);
  const [draftQuals, setDraftQuals] = useState("UWI BSc Mathematics · 8 years teaching");
  const summary = getSummary("tutor", "ramdeen");

  const showClasses = pref !== "one-on-one-only";
  const show1on1 = pref !== "classes-only";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">This is exactly what students see on your public profile.</p>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-ink/90">
              <Pencil className="size-4" /> Edit profile
            </button>
          ) : (
            <>
              <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-semibold text-ink hover:bg-muted">
                <X className="size-4" /> Cancel
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
                <Check className="size-4" /> Save changes
              </button>
            </>
          )}
          <Link to="/tutor/get-listed" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:underline">
            Get listed <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero card */}
      <section className="rounded-2xl border border-border bg-background overflow-hidden">
        <div className="p-5 sm:p-6 flex items-start gap-4">
          <div className="size-20 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-2xl font-bold text-white shrink-0">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-ink">{profile.name}</h2>
              {completion.listed && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/15 text-brand-deep">Listed</span>}
            </div>
            <div className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-2">
              <MapPin className="size-3" /> Trinidad & Tobago
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.subjects.map((s) => (
                <span key={s.id} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-soft text-forest">
                  {s.name} · {s.level}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic mt-3">
              {profile.bio || "Add a bio on the Get-listed page so students can learn about your style."}
            </p>
          </div>
        </div>
      </section>

      {/* Shared rating breakdown */}
      <RatingBreakdown summary={summary} activeFilter={filter} onFilterChange={setFilter} />

      {/* Classes by this tutor */}
      {showClasses && (
        <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h3 className="font-bold text-ink mb-3">Classes by this tutor</h3>
          <div className="space-y-3">
            {MY_CLASSES.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40">
                <div className="size-10 rounded-xl bg-brand-soft grid place-items-center text-brand-deep"><CalendarDays className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.level} · {c.schedule}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" /> {c.rating} · {c.ratings} ratings</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-ink">TT${c.price}/mo</div>
                  <button className="text-xs font-semibold text-brand-deep hover:underline">View class</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1-on-1 */}
      {show1on1 && (
        <section className="rounded-2xl border border-border bg-background p-5 sm:p-6 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-brand-soft text-brand-deep grid place-items-center"><Video className="size-5" /></div>
          <div className="flex-1">
            <div className="font-bold text-ink">1-on-1 sessions</div>
            <div className="text-sm text-muted-foreground">{profile.hourlyRateTtd ? `TT$${profile.hourlyRateTtd} / hr` : "Hourly rate not set"}</div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">Book a 1-on-1</button>
        </section>
      )}

      {/* Comments — tutor is owner */}
      <CommentSection
        targetKind="tutor"
        targetId="ramdeen"
        targetName={profile.name}
        viewerIsOwnerTutor
        activeRatingFilter={filter}
        onClearFilter={() => setFilter(null)}
      />
    </div>
  );
}
