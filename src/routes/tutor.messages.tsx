import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Paperclip, Smile, Send, MoreHorizontal, Pin, Archive, BellOff, CalendarPlus, FileText, ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/messages")({
  head: () => ({ meta: [{ title: "Messages — iTutor Tutor" }] }),
  component: MessagesPage,
});

// TODO(cursor): wire to real-time backend, file storage, browser notifications.

type Conversation = {
  id: string; name: string; parent?: string; initials: string; preview: string; time: string;
  unread: number; tags: string[]; archived?: boolean; muted?: boolean;
};

const CONVOS: Conversation[] = [
  { id: "c1", name: "Aliyah Mohammed", parent: "Ramona Mohammed", initials: "AM", preview: "Thanks miss! See you Saturday 🙌", time: "10m", unread: 2, tags: ["Exam prep"] },
  { id: "c2", name: "Devon Charles", initials: "DC", preview: "Can we move Wednesday to 5pm?", time: "1h", unread: 1, tags: [] },
  { id: "c3", name: "Sade Williams", parent: "Pat Williams", initials: "SW", preview: "Pat: Will send payment by Friday", time: "Yesterday", unread: 0, tags: ["Parent involved"] },
  { id: "c4", name: "Keshawn Boodoo", initials: "KB", preview: "I finished the past paper", time: "2d", unread: 0, tags: ["Advanced"] },
  { id: "c5", name: "Renée Phillip", initials: "RP", preview: "Booked the diagnostic for Sat", time: "5d", unread: 0, tags: [] },
];

type Msg = { id: string; from: "me" | "them"; text: string; at: string; attachment?: { type: "file" | "image"; name: string } };
const THREAD: Record<string, Msg[]> = {
  c1: [
    { id: "m1", from: "them", text: "Hi miss, just to confirm Saturday 10am for the crash course?", at: "10:14 AM" },
    { id: "m2", from: "me", text: "Yes Aliyah, see you then. I've shared the trig worksheet.", at: "10:18 AM", attachment: { type: "file", name: "Trig identities · Wk5.pdf" } },
    { id: "m3", from: "them", text: "Thanks miss! See you Saturday 🙌", at: "10:22 AM" },
  ],
  c2: [{ id: "m1", from: "them", text: "Can we move Wednesday to 5pm?", at: "1:02 PM" }],
};

const TEMPLATES = [
  { id: "t1", name: "Lesson reminder", body: "Hi! Just a reminder we have our session tomorrow. See you then!" },
  { id: "t2", name: "Payment overdue", body: "Hi, gentle reminder that payment for last week's session is still outstanding." },
  { id: "t3", name: "Welcome message", body: "Welcome to iTutor! Looking forward to working with you. Let me know any topics you'd like to focus on." },
];

function MessagesPage() {
  const [activeId, setActiveId] = useState<string>("c1");
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [search, setSearch] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [composer, setComposer] = useState("");
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");

  const filtered = CONVOS.filter((c) => {
    if (filter === "unread" && c.unread === 0) return false;
    if (filter === "archived" && !c.archived) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const active = CONVOS.find((c) => c.id === activeId);
  const messages = THREAD[activeId] || [];

  return (
    <div className="-mx-4 lg:-mx-8 -my-6 lg:-my-8 h-[calc(100vh-3.5rem)] grid lg:grid-cols-[340px_1fr] bg-background">
      {/* List */}
      <aside className={cn("border-r border-border flex flex-col min-h-0", mobilePane === "thread" && "hidden lg:flex")}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-ink">Messages</h1>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSettings(true)} className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Templates & settings"><SettingsIcon className="size-4" /></button>
              <button className="size-8 grid place-items-center rounded-lg bg-brand text-white hover:bg-brand/90" title="New message"><Plus className="size-4" /></button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…" className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-brand focus:outline-none text-sm" />
          </div>
          <div className="flex gap-1 text-xs">
            {(["all", "unread", "archived"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-2.5 py-1 rounded-md font-semibold capitalize", filter === f ? "bg-ink text-white" : "text-muted-foreground hover:bg-muted")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No conversations.</div>}
          {filtered.map((c) => (
            <button key={c.id} onClick={() => { setActiveId(c.id); setMobilePane("thread"); }}
              className={cn("w-full text-left px-4 py-3 border-b border-border hover:bg-muted flex gap-3", activeId === c.id && "bg-brand-soft/40")}>
              <div className="size-10 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-semibold text-sm shrink-0">{c.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-ink truncate text-sm">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground shrink-0">{c.time}</div>
                </div>
                {c.parent && <div className="text-[10px] text-muted-foreground truncate">Parent: {c.parent}</div>}
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={cn("text-xs truncate flex-1", c.unread > 0 ? "font-semibold text-ink" : "text-muted-foreground")}>{c.preview}</div>
                  {c.unread > 0 && <span className="size-5 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">{c.unread}</span>}
                </div>
                {c.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {c.tags.map((t) => <span key={t} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-peach text-ink">{t}</span>)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Thread */}
      <section className={cn("flex flex-col min-h-0", mobilePane === "list" && "hidden lg:flex")}>
        {!active ? (
          <div className="flex-1 grid place-items-center text-sm text-muted-foreground">Pick a conversation</div>
        ) : (
          <>
            <header className="px-4 lg:px-6 py-3 border-b border-border flex items-center gap-3">
              <button onClick={() => setMobilePane("list")} className="lg:hidden size-8 grid place-items-center rounded-lg hover:bg-muted"><ArrowLeft className="size-4" /></button>
              <div className="size-9 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white font-semibold text-sm">{active.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink truncate">{active.name}</div>
                <div className="text-xs text-muted-foreground">Active 5m ago</div>
              </div>
              <div className="flex items-center gap-1">
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Schedule"><CalendarPlus className="size-4" /></button>
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Mute"><BellOff className="size-4" /></button>
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Archive"><Archive className="size-4" /></button>
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><MoreHorizontal className="size-4" /></button>
              </div>
            </header>

            {/* Pinned */}
            <div className="px-4 lg:px-6 py-2 border-b border-border bg-mint flex items-center gap-2 text-xs text-muted-foreground">
              <Pin className="size-3.5" /> <span className="truncate">Saturday 10am · CSEC Maths Crash Course</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "me" ? "bg-brand text-white rounded-br-md" : "bg-muted text-ink rounded-bl-md")}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    {m.attachment && (
                      <div className={cn("mt-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs", m.from === "me" ? "bg-white/15" : "bg-background border border-border")}>
                        <FileText className="size-3.5" /> {m.attachment.name}
                      </div>
                    )}
                    <div className={cn("text-[10px] mt-1", m.from === "me" ? "text-white/70" : "text-muted-foreground")}>{m.at} {m.from === "me" && "· Read"}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-1.5 mb-2">
                <button onClick={() => setShowTemplates(true)} className="text-[11px] px-2 py-1 rounded-md bg-mint text-brand-deep font-semibold hover:bg-brand-soft">📋 Templates</button>
                <button className="text-[11px] px-2 py-1 rounded-md bg-mint text-brand-deep font-semibold hover:bg-brand-soft">🔔 Lesson reminder</button>
                <button className="text-[11px] px-2 py-1 rounded-md bg-mint text-brand-deep font-semibold hover:bg-brand-soft">📎 Share resource</button>
              </div>
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-brand">
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><Paperclip className="size-4" /></button>
                <button className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"><Smile className="size-4" /></button>
                <textarea value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="Write a message…" rows={1} className="flex-1 resize-none bg-transparent text-sm focus:outline-none py-1.5 max-h-32" />
                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 disabled:opacity-50" disabled={!composer.trim()}><Send className="size-4" /></button>
              </div>
            </div>
          </>
        )}
      </section>

      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} onPick={(t) => { setComposer(t); setShowTemplates(false); }} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function TemplatesModal({ onClose, onPick }: { onClose: () => void; onPick: (body: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-pop w-full max-w-md p-5 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="font-bold text-ink mb-3">Insert template</div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => onPick(t.body)} className="w-full text-left p-3 rounded-xl border border-border hover:border-brand hover:bg-brand-soft">
              <div className="font-semibold text-ink text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{t.body}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-ink">Close</button>
      </div>
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-pop w-full max-w-lg p-5 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="font-bold text-ink mb-1">Manage templates</div>
        <div className="text-xs text-muted-foreground mb-4">Saved replies you can quick-insert from the composer.</div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="p-3 rounded-xl border border-border">
              <div className="flex items-center justify-between"><div className="font-semibold text-ink text-sm">{t.name}</div><button className="text-xs text-brand-deep hover:underline">Edit</button></div>
              <div className="text-xs text-muted-foreground mt-1">{t.body}</div>
            </div>
          ))}
          <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add new template</button>
        </div>
        <button onClick={onClose} className="mt-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-ink">Close</button>
      </div>
    </div>
  );
}
