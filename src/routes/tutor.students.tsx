import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PLACEHOLDER_STUDENTS, TAG_LIBRARY, type StudentRecord } from "@/lib/tutor-store";
import { MessageSquare, Search, LayoutGrid, List as ListIcon, SlidersHorizontal, Tag, Archive, X, ChevronRight, AlertCircle, Mail, Phone, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/students")({
  head: () => ({ meta: [{ title: "My Students — iTutor Tutor" }] }),
  component: StudentsPage,
});

const COLUMNS = [
  { id: "name", label: "Name", required: true },
  { id: "level", label: "Level" },
  { id: "subjects", label: "Subjects" },
  { id: "contact", label: "Contact" },
  { id: "parent", label: "Parent" },
  { id: "tags", label: "Tags" },
  { id: "lastSession", label: "Last session" },
  { id: "sessions", label: "Sessions" },
  { id: "revenue", label: "Revenue" },
  { id: "reliability", label: "Pay reliability" },
  { id: "outstanding", label: "Outstanding" },
];

const SORTS = [
  { id: "recent", label: "Most recent session" },
  { id: "alpha", label: "Alphabetical" },
  { id: "longest", label: "Longest standing" },
  { id: "revenue", label: "Highest revenue" },
];

function StudentsPage() {
  const [view, setView] = useState<"row" | "card">("row");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<"all" | "active" | "inactive">("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("recent");
  const [showCols, setShowCols] = useState(false);
  const [visibleCols, setVisibleCols] = useState<string[]>(["name", "level", "contact", "parent", "tags", "lastSession", "outstanding"]);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const list = PLACEHOLDER_STUDENTS.filter((s) =>
      (search === "" || s.name.toLowerCase().includes(search.toLowerCase())) &&
      (active === "all" || (active === "active" ? s.active : !s.active)) &&
      (tagFilter.length === 0 || tagFilter.every((t) => s.tagIds.includes(t)))
    );
    const sorted = [...list].sort((a, b) => {
      if (sort === "alpha") return a.name.localeCompare(b.name);
      if (sort === "longest") return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      if (sort === "revenue") return b.revenueTtd - a.revenueTtd;
      return new Date(b.lastSessionAt).getTime() - new Date(a.lastSessionAt).getTime();
    });
    return sorted;
  }, [search, active, tagFilter, sort]);

  return (
    <div className="max-w-7xl space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">My Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} of {PLACEHOLDER_STUDENTS.length} students</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            <button onClick={() => setView("row")} className={cn("size-8 grid place-items-center rounded-md", view === "row" ? "bg-ink text-white" : "text-muted-foreground hover:text-ink")}><ListIcon className="size-4" /></button>
            <button onClick={() => setView("card")} className={cn("size-8 grid place-items-center rounded-md", view === "card" ? "bg-ink text-white" : "text-muted-foreground hover:text-ink")}><LayoutGrid className="size-4" /></button>
          </div>
          <button onClick={() => setShowCols(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">
            <SlidersHorizontal className="size-4" /> Customize
          </button>
        </div>
      </header>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <select value={active} onChange={(e) => setActive(e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          <option value="all">All students</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
        </select>
        <div className="flex flex-wrap gap-1.5 items-center">
          {TAG_LIBRARY.map((t) => {
            const on = tagFilter.includes(t.id);
            return (
              <button key={t.id} onClick={() => setTagFilter(on ? tagFilter.filter((x) => x !== t.id) : [...tagFilter, t.id])}
                className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold border", on ? "bg-ink text-white border-ink" : `${t.color} border-transparent hover:opacity-80`)}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved view presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider">Presets:</span>
        {["Active 1:1", "Behind on payments", "CAPE group", "Exam prep"].map((p) => (
          <button key={p} className="px-2.5 py-1 rounded-md border border-border bg-card text-ink hover:bg-muted font-semibold">{p}</button>
        ))}
        <button className="text-brand-deep font-semibold hover:underline">+ Save current view</button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-white text-sm">
          <span className="font-semibold">{selected.length} selected</span>
          <button className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10"><Tag className="size-3.5" /> Tag</button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10"><MessageSquare className="size-3.5" /> Message</button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/10"><Archive className="size-3.5" /> Archive</button>
          <button onClick={() => setSelected([])} className="size-7 grid place-items-center rounded-md hover:bg-white/10"><X className="size-4" /></button>
        </div>
      )}

      {/* List */}
      {view === "row" ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
              <tr>
                <th className="w-10 px-3 py-3"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((s) => s.id) : [])} /></th>
                {COLUMNS.filter((c) => visibleCols.includes(c.id)).map((c) => (
                  <th key={c.id} className="text-left px-3 py-3 font-semibold">{c.label}</th>
                ))}
                <th className="text-right px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <StudentRow key={s.id} s={s} cols={visibleCols} selected={selected.includes(s.id)} onToggle={() => setSelected((p) => p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id])} />
              ))}
              {filtered.length === 0 && <tr><td colSpan={COLUMNS.length + 2} className="p-10 text-center text-muted-foreground">No students match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => <StudentCard key={s.id} s={s} />)}
        </div>
      )}

      {showCols && <ColumnsDrawer visible={visibleCols} setVisible={setVisibleCols} onClose={() => setShowCols(false)} />}
      {/* TODO(cursor): persist saved views, custom fields and per-tutor tag library to backend. */}
    </div>
  );
}

function StudentRow({ s, cols, selected, onToggle }: { s: StudentRecord; cols: string[]; selected: boolean; onToggle: () => void }) {
  return (
    <tr className="hover:bg-muted/40">
      <td className="px-3 py-3"><input type="checkbox" checked={selected} onChange={onToggle} /></td>
      {cols.includes("name") && (
        <td className="px-3 py-3">
          <Link to="/tutor/students/$id" params={{ id: s.id }} className="flex items-center gap-2.5 hover:underline">
            <div className="size-9 rounded-full bg-coral-soft text-coral grid place-items-center text-xs font-bold">{s.initials}</div>
            <div>
              <div className="font-semibold text-ink">{s.name}</div>
              {!s.active && <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Inactive</div>}
            </div>
          </Link>
        </td>
      )}
      {cols.includes("level") && <td className="px-3 py-3 text-muted-foreground">{s.level}</td>}
      {cols.includes("subjects") && <td className="px-3 py-3 text-muted-foreground text-xs">{s.primarySubjects.join(", ")}</td>}
      {cols.includes("contact") && (
        <td className="px-3 py-3 text-xs">
          <div className="space-y-0.5">
            {s.email ? (
              <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1 text-ink hover:text-brand-deep hover:underline"><Mail className="size-3 text-muted-foreground" /> {s.email}</a>
            ) : <span className="text-muted-foreground">No email</span>}
            {s.phone ? (
              <a href={`tel:${s.phone}`} className="block inline-flex items-center gap-1 text-muted-foreground hover:text-ink"><Phone className="size-3" /> {s.phone}</a>
            ) : null}
          </div>
        </td>
      )}
      {cols.includes("parent") && (
        <td className="px-3 py-3 text-xs">
          {s.parentName ? (
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 font-semibold text-ink">
                {s.parentLinked
                  ? <span title="Parent has linked iTutor account" className="inline-flex items-center gap-0.5 text-brand-deep"><UserCheck className="size-3" /></span>
                  : <span title="No linked parent account" className="inline-flex items-center gap-0.5 text-muted-foreground"><UserX className="size-3" /></span>}
                {s.parentName}
              </div>
              {s.parentPhone && <a href={`tel:${s.parentPhone}`} className="block text-muted-foreground hover:text-ink">{s.parentPhone}</a>}
              {s.parentEmail && <a href={`mailto:${s.parentEmail}`} className="block text-muted-foreground hover:text-ink">{s.parentEmail}</a>}
            </div>
          ) : <span className="text-muted-foreground">—</span>}
        </td>
      )}
      {cols.includes("tags") && (
        <td className="px-3 py-3">
          <div className="flex flex-wrap gap-1">
            {s.tagIds.map((tid) => { const t = TAG_LIBRARY.find((x) => x.id === tid); return t && <span key={tid} className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", t.color)}>{t.label}</span>; })}
          </div>
        </td>
      )}
      {cols.includes("lastSession") && <td className="px-3 py-3 text-xs text-muted-foreground">{relTime(s.lastSessionAt)}</td>}
      {cols.includes("sessions") && <td className="px-3 py-3 tabular-nums text-ink">{s.totalSessions}</td>}
      {cols.includes("revenue") && <td className="px-3 py-3 tabular-nums font-semibold text-ink">TTD {s.revenueTtd.toLocaleString()}</td>}
      {cols.includes("reliability") && <td className="px-3 py-3"><div className="flex items-center gap-1.5"><div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden"><div className={cn("h-full", s.paymentReliability >= 90 ? "bg-brand" : s.paymentReliability >= 70 ? "bg-amber-500" : "bg-coral")} style={{ width: `${s.paymentReliability}%` }} /></div><span className="text-xs tabular-nums">{s.paymentReliability}%</span></div></td>}
      {cols.includes("outstanding") && <td className="px-3 py-3 tabular-nums">{s.outstandingTtd > 0 ? <span className="text-coral font-bold">TTD {s.outstandingTtd}</span> : <span className="text-muted-foreground">—</span>}</td>}
      <td className="px-3 py-3 text-right">
        <Link to="/tutor/students/$id" params={{ id: s.id }} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline">View <ChevronRight className="size-3" /></Link>
      </td>
    </tr>
  );
}

function StudentCard({ s }: { s: StudentRecord }) {
  return (
    <Link to="/tutor/students/$id" params={{ id: s.id }} className="block rounded-2xl border border-border bg-card p-4 hover:border-brand transition">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-full bg-coral-soft text-coral grid place-items-center font-bold">{s.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink truncate">{s.name}</div>
          <div className="text-xs text-muted-foreground">{s.level} · {s.primarySubjects[0] ?? "—"}</div>
        </div>
        {s.outstandingTtd > 0 && <span title="Outstanding balance" className="text-coral"><AlertCircle className="size-4" /></span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {s.tagIds.map((tid) => { const t = TAG_LIBRARY.find((x) => x.id === tid); return t && <span key={tid} className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", t.color)}>{t.label}</span>; })}
      </div>
      <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 text-center text-xs">
        <div><div className="font-bold text-ink tabular-nums">{s.totalSessions}</div><div className="text-muted-foreground">Sessions</div></div>
        <div><div className="font-bold text-ink tabular-nums">{s.paymentReliability}%</div><div className="text-muted-foreground">On-time</div></div>
        <div><div className="font-bold text-ink tabular-nums">TTD {(s.revenueTtd / 1000).toFixed(1)}k</div><div className="text-muted-foreground">Revenue</div></div>
      </div>
    </Link>
  );
}

function ColumnsDrawer({ visible, setVisible, onClose }: { visible: string[]; setVisible: (v: string[]) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-ink/40" />
      <aside className="w-full max-w-sm bg-background h-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-ink text-lg">Customize columns</h2>
          <button onClick={onClose}><X className="size-4" /></button>
        </div>
        <div className="space-y-2">
          {COLUMNS.map((c) => {
            const on = visible.includes(c.id);
            return (
              <label key={c.id} className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer", on ? "border-brand bg-brand-soft/30" : "border-border")}>
                <input type="checkbox" checked={on} disabled={c.required} onChange={() => setVisible(on ? visible.filter((x) => x !== c.id) : [...visible, c.id])} />
                <span className="text-sm font-medium text-ink">{c.label}</span>
                {c.required && <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">Required</span>}
              </label>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}
