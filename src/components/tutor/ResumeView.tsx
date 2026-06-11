import { useState } from "react";
import { ChevronDown, BadgeCheck } from "lucide-react";
import type { TutorResume } from "@/lib/tutor-resume-store";
import { cn } from "@/lib/utils";

type Tab = "education" | "certifications" | "experience";

const TAB_LABELS: Record<Tab, string> = {
  education: "Education",
  certifications: "Certifications",
  experience: "Experience",
};

export function ResumeView({ resume }: { resume: TutorResume }) {
  const availableTabs: Tab[] = (["education", "certifications", "experience"] as Tab[]).filter(
    (t) => resume[t].length > 0,
  );
  const [tab, setTab] = useState<Tab>(availableTabs[0] ?? "education");
  const hasAny =
    resume.education.length + resume.certifications.length + resume.experience.length > 0;
  const hasSpecialties = resume.specialties.length > 0;

  if (!hasAny && !hasSpecialties) return null;

  const entries = resume[tab] ?? [];

  return (
    <div className="space-y-10">
      {hasAny && (
        <section>
          <h2 className="text-2xl font-bold text-ink">Resume</h2>
          <div className="mt-4 border-b border-border flex gap-6">
            {availableTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "pb-3 text-sm font-semibold border-b-2 -mb-px transition",
                  tab === t ? "border-coral text-ink" : "border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-5">
            {entries.map((e) => (
              <div key={e.id} className="grid grid-cols-[110px_1fr] gap-4 sm:gap-6">
                <div className="text-sm text-muted-foreground tabular-nums pt-0.5">
                  {e.startYear}{e.endYear ? ` — ${e.endYear}` : ""}
                </div>
                <div>
                  <div className="font-bold text-ink">{e.title}</div>
                  {e.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{e.description}</p>}
                  {e.verified && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-brand-deep">
                      <BadgeCheck className="size-4 fill-brand text-white" /> Certificate verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasSpecialties && (
        <section>
          <h2 className="text-2xl font-bold text-ink">My specialties</h2>
          <div className="mt-4 divide-y divide-border border-t border-b border-border">
            {resume.specialties.map((s) => (
              <SpecialtyRow key={s.id} name={s.name} description={s.description} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecialtyRow({ name, description }: { name: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left hover:bg-muted/40 px-1 transition"
      >
        <span className="font-bold text-ink">{name}</span>
        <ChevronDown className={cn("size-5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && description && (
        <p className="text-sm text-muted-foreground leading-relaxed pb-4 px-1">{description}</p>
      )}
    </div>
  );
}
