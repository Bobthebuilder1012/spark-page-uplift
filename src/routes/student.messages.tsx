import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/messages")({
  head: () => ({ meta: [{ title: "Messages — iTutor Student" }] }),
  component: Messages,
});

const THREADS = [
  { id: "ramdeen", name: "Mr. Ramdeen", subject: "Maths", last: "Great work on yesterday's paper!", time: "2m", unread: 2, color: "from-coral to-peach" },
  { id: "singh", name: "Ms. Singh", subject: "Physics", last: "I've shared the notes for waves.", time: "1h", unread: 0, color: "from-sky to-lavender" },
  { id: "joseph", name: "Mr. Joseph", subject: "English", last: "Your essay draft was excellent.", time: "Yesterday", unread: 0, color: "from-lavender to-brand-soft" },
  { id: "ali", name: "Ms. Ali", subject: "Biology", last: "Quick question about the lab…", time: "Mon", unread: 1, color: "from-brand to-brand-deep" },
];

const SAMPLE_MSGS = [
  { from: "them", text: "Hi Aliyah! How did you find the practice questions?", time: "10:14" },
  { from: "me", text: "Q3 was tricky but I worked it out!", time: "10:18" },
  { from: "them", text: "Great work on yesterday's paper! Let's review Q5 in our next session.", time: "10:22" },
];

function Messages() {
  const [active, setActive] = useState(THREADS[0].id);
  const t = THREADS.find((x) => x.id === active)!;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-9rem)]">
        {/* List */}
        <div className="rounded-2xl bg-background border border-border flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input placeholder="Search messages…" className="w-full pl-9 pr-3 py-2 rounded-full bg-muted text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-brand" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {THREADS.map((th) => (
              <button
                key={th.id}
                onClick={() => setActive(th.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-3 hover:bg-muted/60 text-left border-b border-border", active === th.id && "bg-muted")}
              >
                <div className={`size-10 rounded-full bg-gradient-to-br ${th.color} grid place-items-center text-white font-semibold flex-shrink-0`}>
                  {th.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm text-ink truncate">{th.name}</div>
                    <div className="text-[10px] text-muted-foreground">{th.time}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{th.last}</div>
                </div>
                {th.unread > 0 && <span className="size-5 rounded-full bg-coral text-white text-[10px] font-bold grid place-items-center">{th.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="rounded-2xl bg-background border border-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className={`size-9 rounded-full bg-gradient-to-br ${t.color} grid place-items-center text-white font-semibold`}>
              {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.subject} tutor · Online</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-mint/30">
            {SAMPLE_MSGS.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm", m.from === "me" ? "bg-brand text-white" : "bg-background border border-border text-ink")}>
                  {m.text}
                  <div className={cn("text-[10px] mt-0.5", m.from === "me" ? "text-white/70" : "text-muted-foreground")}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="p-3 border-t border-border flex items-center gap-2">
            <input placeholder="Type a message…" className="flex-1 px-4 py-2.5 rounded-full bg-muted text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-brand" />
            <button className="size-10 rounded-full bg-brand text-white grid place-items-center hover:bg-brand-deep">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
