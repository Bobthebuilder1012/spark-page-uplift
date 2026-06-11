import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X, BadgeCheck } from "lucide-react";
import { newId, type ResumeEntry, type Specialty, type TutorResume } from "@/lib/tutor-resume-store";

type Section = "education" | "certifications" | "experience";

const SECTION_LABELS: Record<Section, { title: string; subtitle: string; itemLabel: string }> = {
  education: { title: "Education", subtitle: "Degrees and programmes you've completed.", itemLabel: "qualification" },
  certifications: { title: "Certifications", subtitle: "Teaching certifications, training, examiner credentials.", itemLabel: "certification" },
  experience: { title: "Experience", subtitle: "Teaching or tutoring roles students should know about.", itemLabel: "role" },
};

export function ResumeEditor({ resume, onChange }: { resume: TutorResume; onChange: (next: TutorResume) => void }) {
  return (
    <div className="space-y-8">
      {(Object.keys(SECTION_LABELS) as Section[]).map((section) => (
        <ResumeSection
          key={section}
          section={section}
          entries={resume[section]}
          onChange={(next) => onChange({ ...resume, [section]: next })}
        />
      ))}
      <SpecialtiesSection
        items={resume.specialties}
        onChange={(next) => onChange({ ...resume, specialties: next })}
      />
    </div>
  );
}

function ResumeSection({ section, entries, onChange }: { section: Section; entries: ResumeEntry[]; onChange: (next: ResumeEntry[]) => void }) {
  const meta = SECTION_LABELS[section];
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNew = () => {
    const id = newId();
    onChange([...entries, { id, startYear: "", endYear: "", title: "", description: "" }]);
    setEditingId(id);
  };

  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink">{meta.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{meta.subtitle}</p>
        </div>
        <button onClick={addNew} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-deep">
          <Plus className="size-3.5" /> Add
        </button>
      </header>

      <div className="mt-4 space-y-3">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No {meta.itemLabel}s added yet.</p>
        )}
        {entries.map((e) => (
          <EntryRow
            key={e.id}
            entry={e}
            editing={editingId === e.id}
            onEdit={() => setEditingId(e.id)}
            onCancel={() => setEditingId(null)}
            onSave={(next) => {
              onChange(entries.map((x) => (x.id === e.id ? next : x)));
              setEditingId(null);
            }}
            onDelete={() => onChange(entries.filter((x) => x.id !== e.id))}
          />
        ))}
      </div>
    </section>
  );
}

function EntryRow({ entry, editing, onEdit, onCancel, onSave, onDelete }: {
  entry: ResumeEntry; editing: boolean; onEdit: () => void; onCancel: () => void; onSave: (e: ResumeEntry) => void; onDelete: () => void;
}) {
  const [draft, setDraft] = useState<ResumeEntry>(entry);

  if (!editing) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30">
        <div className="text-xs text-muted-foreground tabular-nums pt-1 w-24 shrink-0">
          {entry.startYear || "—"}{entry.endYear ? ` — ${entry.endYear}` : ""}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink text-sm truncate">{entry.title || "(untitled)"}</div>
          {entry.description && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{entry.description}</div>}
          {entry.verified && (
            <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-brand-deep">
              <BadgeCheck className="size-3 fill-brand text-white" /> Verified
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="size-7 grid place-items-center rounded-md hover:bg-background text-muted-foreground"><Pencil className="size-3.5" /></button>
          <button onClick={onDelete} className="size-7 grid place-items-center rounded-md hover:bg-coral-soft text-coral"><Trash2 className="size-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl border border-brand bg-background space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={draft.startYear} onChange={(e) => setDraft({ ...draft, startYear: e.target.value })} placeholder="Start year" className="px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand" />
        <input value={draft.endYear} onChange={(e) => setDraft({ ...draft, endYear: e.target.value })} placeholder="End year or Present" className="px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand" />
      </div>
      <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. BSc Mathematics — UWI" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand" />
      <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} placeholder="Add a short description students will see." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand resize-none" />
      <label className="inline-flex items-center gap-2 text-xs text-ink">
        <input type="checkbox" checked={!!draft.verified} onChange={(e) => setDraft({ ...draft, verified: e.target.checked })} />
        Mark as verified (we'll review before showing the badge to students)
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"><X className="size-3.5" /> Cancel</button>
        <button onClick={() => onSave(draft)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-deep"><Check className="size-3.5" /> Save</button>
      </div>
    </div>
  );
}

function SpecialtiesSection({ items, onChange }: { items: Specialty[]; onChange: (next: Specialty[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const addNew = () => {
    const id = newId();
    onChange([...items, { id, name: "", description: "" }]);
    setEditingId(id);
  };
  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink">My specialties</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Highlight the specific exams, levels or topics you're known for.</p>
        </div>
        <button onClick={addNew} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-deep">
          <Plus className="size-3.5" /> Add specialty
        </button>
      </header>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground italic">No specialties added yet.</p>}
        {items.map((s) => (
          <SpecialtyRow key={s.id}
            item={s}
            editing={editingId === s.id}
            onEdit={() => setEditingId(s.id)}
            onCancel={() => setEditingId(null)}
            onSave={(next) => { onChange(items.map((x) => x.id === s.id ? next : x)); setEditingId(null); }}
            onDelete={() => onChange(items.filter((x) => x.id !== s.id))}
          />
        ))}
      </div>
    </section>
  );
}

function SpecialtyRow({ item, editing, onEdit, onCancel, onSave, onDelete }: {
  item: Specialty; editing: boolean; onEdit: () => void; onCancel: () => void; onSave: (s: Specialty) => void; onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Specialty>(item);
  if (!editing) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink text-sm truncate">{item.name || "(unnamed)"}</div>
          {item.description && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</div>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="size-7 grid place-items-center rounded-md hover:bg-background text-muted-foreground"><Pencil className="size-3.5" /></button>
          <button onClick={onDelete} className="size-7 grid place-items-center rounded-md hover:bg-coral-soft text-coral"><Trash2 className="size-3.5" /></button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-xl border border-brand bg-background space-y-2">
      <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. CSEC Mathematics" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand" />
      <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} placeholder="What students learn / how you teach this." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-brand resize-none" />
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"><X className="size-3.5" /> Cancel</button>
        <button onClick={() => onSave(draft)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-deep"><Check className="size-3.5" /> Save</button>
      </div>
    </div>
  );
}
