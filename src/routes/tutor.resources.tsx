import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Upload, Folder, FolderPlus, Grid3x3, List, FileText, Image as ImageIcon, Video, Music, Link as LinkIcon, StickyNote, MoreHorizontal, Eye, Download, Link2, Paperclip, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/resources")({
  head: () => ({ meta: [{ title: "Resources — iTutor Tutor" }] }),
  component: ResourcesPage,
});

// TODO(cursor): file storage, sharing logic, link generation.

type ResourceType = "pdf" | "slides" | "worksheet" | "video" | "audio" | "image" | "link" | "note";
type Resource = {
  id: string; title: string; type: ResourceType; subject: string; level: string;
  size?: string; addedAt: string; lastUsed?: string;
  usedIn: string[]; folder: string; sharing: "private" | "link" | "lesson";
};

const FOLDERS = [
  { id: "all", name: "All resources", count: 24 },
  { id: "csec-math", name: "CSEC Mathematics", count: 12 },
  { id: "cape-pure", name: "CAPE Pure Maths", count: 7 },
  { id: "csec-physics", name: "CSEC Physics", count: 4 },
  { id: "templates", name: "Templates", count: 1 },
];

const RESOURCES: Resource[] = [
  { id: "r1", title: "Trigonometric Identities · Wk 5", type: "worksheet", subject: "Mathematics", level: "CSEC", size: "284 KB", addedAt: "3 days ago", lastUsed: "Yesterday", usedIn: ["CSEC Maths Crash Course"], folder: "csec-math", sharing: "lesson" },
  { id: "r2", title: "Past Paper · 2023 Jan Maths", type: "pdf", subject: "Mathematics", level: "CSEC", size: "1.2 MB", addedAt: "1 week ago", lastUsed: "3 days ago", usedIn: ["CSEC Maths Crash Course"], folder: "csec-math", sharing: "lesson" },
  { id: "r3", title: "Calculus Intro Slides", type: "slides", subject: "Pure Mathematics", level: "CAPE", size: "3.4 MB", addedAt: "2 weeks ago", lastUsed: "1 week ago", usedIn: ["CAPE Pure Maths"], folder: "cape-pure", sharing: "private" },
  { id: "r4", title: "Khan Academy · Vectors playlist", type: "link", subject: "Pure Mathematics", level: "CAPE", addedAt: "1 month ago", lastUsed: "2 weeks ago", usedIn: ["CAPE Pure Maths"], folder: "cape-pure", sharing: "link" },
  { id: "r5", title: "Newton's Laws explainer (YouTube)", type: "video", subject: "Physics", level: "CSEC", addedAt: "2 weeks ago", lastUsed: "1 week ago", usedIn: ["Physics 1:1 · Devon"], folder: "csec-physics", sharing: "lesson" },
  { id: "r6", title: "Lesson notes template", type: "note", subject: "All", level: "All", addedAt: "1 month ago", usedIn: [], folder: "templates", sharing: "private" },
  { id: "r7", title: "Lab safety diagram", type: "image", subject: "Physics", level: "CSEC", size: "612 KB", addedAt: "3 weeks ago", usedIn: [], folder: "csec-physics", sharing: "private" },
  { id: "r8", title: "Mental math drill (audio)", type: "audio", subject: "Mathematics", level: "SEA", size: "4.1 MB", addedAt: "2 months ago", usedIn: [], folder: "csec-math", sharing: "private" },
];

const TYPE_META: Record<ResourceType, { icon: typeof FileText; color: string; label: string }> = {
  pdf:       { icon: FileText, color: "bg-coral-soft text-coral", label: "PDF" },
  slides:    { icon: FileText, color: "bg-peach text-amber-700", label: "Slides" },
  worksheet: { icon: FileText, color: "bg-brand-soft text-brand-deep", label: "Worksheet" },
  video:     { icon: Video, color: "bg-lavender text-purple-700", label: "Video" },
  audio:     { icon: Music, color: "bg-sky text-sky-700", label: "Audio" },
  image:     { icon: ImageIcon, color: "bg-mint text-brand-deep", label: "Image" },
  link:      { icon: LinkIcon, color: "bg-muted text-ink", label: "Link" },
  note:      { icon: StickyNote, color: "bg-yellow-100 text-yellow-800", label: "Note" },
};

function ResourcesPage() {
  const [folder, setFolder] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ResourceType | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visible = RESOURCES.filter((r) => {
    if (folder !== "all" && r.folder !== folder) return false;
    if (filterType !== "all" && r.type !== filterType) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const recent = [...RESOURCES].filter((r) => r.lastUsed).slice(0, 4);

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="max-w-[1400px]">
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">Your teaching materials, in one place.</p>
      </header>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Folders */}
        <aside className="space-y-1">
          {FOLDERS.map((f) => (
            <button key={f.id} onClick={() => setFolder(f.id)}
              className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition",
                folder === f.id ? "bg-background border border-border text-ink" : "text-muted-foreground hover:bg-background")}>
              <Folder className="size-4" />
              <span className="flex-1 text-left truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.count}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-background border border-dashed border-border mt-2">
            <FolderPlus className="size-4" /> New folder
          </button>
        </aside>

        <div className="space-y-5">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-background border border-border p-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources…" className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-brand focus:outline-none text-sm" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as ResourceType | "all")} className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
              <option value="all">All types</option>
              {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div className="inline-flex rounded-lg border border-border p-0.5">
              <button onClick={() => setView("grid")} className={cn("size-8 grid place-items-center rounded", view === "grid" ? "bg-brand text-white" : "text-muted-foreground")}><Grid3x3 className="size-4" /></button>
              <button onClick={() => setView("list")} className={cn("size-8 grid place-items-center rounded", view === "list" ? "bg-brand text-white" : "text-muted-foreground")}><List className="size-4" /></button>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90"><Upload className="size-4" /> Upload</button>
          </div>

          {selected.size > 0 && (
            <div className="rounded-xl bg-ink text-white p-3 flex items-center gap-3 text-sm">
              <span className="font-semibold">{selected.size} selected</span>
              <button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20">Move</button>
              <button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20">Tag</button>
              <button className="px-3 py-1 rounded-md bg-coral hover:bg-coral/90 ml-auto">Delete</button>
              <button onClick={() => setSelected(new Set())} className="text-white/70 hover:text-white">Clear</button>
            </div>
          )}

          {/* Recently used */}
          {folder === "all" && search === "" && (
            <section>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Recently used</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {recent.map((r) => <ResourceTile key={r.id} r={r} compact />)}
              </div>
            </section>
          )}

          {/* Library */}
          <section>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{visible.length} {visible.length === 1 ? "resource" : "resources"}</div>
            {visible.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                <Upload className="size-10 mx-auto text-muted-foreground mb-3" />
                <div className="font-semibold text-ink">No resources here yet</div>
                <div className="text-sm text-muted-foreground mt-1">Drop files to upload, or click the button above.</div>
              </div>
            )}
            {view === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {visible.map((r) => <ResourceTile key={r.id} r={r} selected={selected.has(r.id)} onToggle={() => toggle(r.id)} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-background divide-y divide-border">
                {visible.map((r) => <ResourceRow key={r.id} r={r} selected={selected.has(r.id)} onToggle={() => toggle(r.id)} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ResourceTile({ r, compact, selected, onToggle }: { r: Resource; compact?: boolean; selected?: boolean; onToggle?: () => void }) {
  const meta = TYPE_META[r.type];
  const Icon = meta.icon;
  return (
    <div className={cn("group rounded-2xl border bg-background p-3 hover:border-brand hover:shadow-pop transition relative", selected ? "border-brand" : "border-border")}>
      {onToggle && <input type="checkbox" checked={selected} onChange={onToggle} className="absolute top-2 left-2 rounded opacity-0 group-hover:opacity-100 checked:opacity-100" />}
      <div className={cn("aspect-video rounded-xl grid place-items-center mb-2", meta.color)}>
        <Icon className="size-8" />
      </div>
      <div className="font-semibold text-ink text-sm truncate">{r.title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{meta.label} · {r.subject}{r.size ? ` · ${r.size}` : ""}</div>
      {!compact && r.usedIn.length > 0 && <div className="text-[10px] text-brand-deep font-medium mt-1 flex items-center gap-1"><Paperclip className="size-3" /> {r.usedIn[0]}</div>}
    </div>
  );
}

function ResourceRow({ r, selected, onToggle }: { r: Resource; selected: boolean; onToggle: () => void }) {
  const meta = TYPE_META[r.type];
  const Icon = meta.icon;
  return (
    <div className="px-4 py-3 flex items-center gap-3 hover:bg-muted">
      <input type="checkbox" checked={selected} onChange={onToggle} className="rounded" />
      <div className={cn("size-10 rounded-lg grid place-items-center shrink-0", meta.color)}><Icon className="size-4" /></div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink text-sm truncate">{r.title}</div>
        <div className="text-xs text-muted-foreground truncate">{meta.label} · {r.subject} · {r.level}{r.size ? ` · ${r.size}` : ""}</div>
      </div>
      <div className="text-xs text-muted-foreground hidden md:block w-24 truncate">{r.lastUsed ?? "—"}</div>
      <div className="text-xs text-muted-foreground hidden md:block w-32 truncate">{r.usedIn[0] ?? <span className="italic">Not attached</span>}</div>
      <div className="flex items-center gap-1">
        <button className="size-8 grid place-items-center rounded-lg hover:bg-background text-muted-foreground" title="Preview"><Eye className="size-4" /></button>
        <button className="size-8 grid place-items-center rounded-lg hover:bg-background text-muted-foreground" title="Download"><Download className="size-4" /></button>
        <button className="size-8 grid place-items-center rounded-lg hover:bg-background text-muted-foreground" title="Copy link"><Link2 className="size-4" /></button>
        <button className="size-8 grid place-items-center rounded-lg hover:bg-background text-muted-foreground" title="Attach to lesson"><Paperclip className="size-4" /></button>
        <button className="size-8 grid place-items-center rounded-lg hover:bg-background text-muted-foreground"><MoreHorizontal className="size-4" /></button>
      </div>
    </div>
  );
}
