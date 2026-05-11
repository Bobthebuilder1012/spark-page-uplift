import { createFileRoute, Link } from "@tanstack/react-router";
import { useTutor } from "@/lib/tutor-store";
import { Star, MapPin, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/tutor/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, completion } = useTutor();

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit your public profile and preview how students see it.</p>
        </div>
        <Link to="/tutor/get-listed" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:underline">
          Get listed checklist <ExternalLink className="size-3.5" />
        </Link>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-ink">Editor</h2>
          <p className="text-xs text-muted-foreground">
            Profile fields are managed on the <Link to="/tutor/get-listed" className="text-brand-deep font-semibold hover:underline">Get listed</Link> page so completion stays in sync.
          </p>

          <div className="space-y-3 text-sm">
            <Field label="Display name" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Hourly rate" value={profile.hourlyRateTtd ? `TTD ${profile.hourlyRateTtd} / hr` : "Not set"} />
            <Field label="Subjects" value={profile.subjects.length ? profile.subjects.map((s) => `${s.name} (${s.level})`).join(", ") : "None added"} />
            <Field label="Availability" value={`${profile.availability.length} weekly slot${profile.availability.length === 1 ? "" : "s"}`} />
          </div>

          <div className="rounded-xl bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
            {/* TODO(cursor): turn each Field into an inline-editable input with autosave to backend. */}
            Inline editing coming next — the current source of truth lives in the Get-listed checklist.
          </div>
        </section>

        {/* Live preview */}
        <section>
          <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2">Student-facing preview</div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="p-5 flex items-start gap-4">
              <div className="size-16 rounded-full bg-muted overflow-hidden grid place-items-center text-xl font-bold text-muted-foreground">
                {profile.avatarUrl ? <img src={profile.avatarUrl} className="size-full object-cover" alt="" /> : profile.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-ink truncate">{profile.name}</h3>
                  {completion.listed && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/15 text-brand-deep">Listed</span>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-3" /> Trinidad & Tobago
                  <span>·</span>
                  <Star className="size-3 fill-current text-amber-500" /> 4.9 (32)
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {profile.hourlyRateTtd ? `TTD ${profile.hourlyRateTtd} / hr` : "—"}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-sm text-muted-foreground italic">
                {profile.bio || "Add a bio on the Get-listed page so students can learn about your style."}
              </p>
              {profile.subjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.subjects.map((s) => (
                    <span key={s.id} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-ink">
                      {s.name} · {s.level}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</span>
      <span className="text-ink text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
