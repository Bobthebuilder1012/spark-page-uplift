import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Calendar, MessageCircle, CreditCard, Star, CheckCheck, Info, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PLACEHOLDER_NOTIFS, type TutorNotif } from "@/lib/tutor-store";

export const Route = createFileRoute("/tutor/notifications")({
  head: () => ({ meta: [{ title: "Notifications — iTutor Tutor" }] }),
  component: Notifications,
});

const META: Record<TutorNotif["type"], { icon: any; bg: string; color: string; label: string }> = {
  booking:  { icon: Calendar, bg: "bg-brand-soft", color: "text-brand-deep", label: "Bookings" },
  reminder: { icon: Bell, bg: "bg-sky", color: "text-ink", label: "Reminders" },
  payment:  { icon: CreditCard, bg: "bg-peach", color: "text-ink", label: "Payments" },
  message:  { icon: MessageCircle, bg: "bg-lavender", color: "text-ink", label: "Messages" },
  review:   { icon: Star, bg: "bg-coral-soft", color: "text-coral", label: "Reviews" },
  system:   { icon: Info, bg: "bg-muted", color: "text-muted-foreground", label: "System" },
};

const FILTERS = ["All", "Unread", "Bookings", "Payments", "Messages", "Reviews"] as const;

function Notifications() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [items, setItems] = useState<TutorNotif[]>(PLACEHOLDER_NOTIFS);
  const [tab, setTab] = useState<"inbox" | "preferences">("inbox");
  const [prefs, setPrefs] = useState({ bookings: true, reminders: true, payments: true, messages: true, reviews: true, platform: false });

  const filtered = items.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    if (filter === "Bookings") return n.type === "booking";
    if (filter === "Payments") return n.type === "payment";
    if (filter === "Messages") return n.type === "message";
    if (filter === "Reviews") return n.type === "review";
    return true;
  });

  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unread > 0 ? `${unread} unread` : "All caught up"}</p>
        </div>
        {tab === "inbox" && unread > 0 && (
          <button onClick={() => setItems((p) => p.map((n) => ({ ...n, unread: false })))}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">
            <CheckCheck className="size-4" /> Mark all read
          </button>
        )}
      </header>

      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {(["inbox", "preferences"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold capitalize",
              tab === t ? "bg-brand text-white" : "text-muted-foreground hover:text-ink")}>
            {t === "preferences" && <SettingsIcon className="size-3.5" />} {t}
          </button>
        ))}
      </div>

      {tab === "inbox" && (
        <>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border",
                  filter === f ? "bg-ink text-white border-ink" : "bg-card text-muted-foreground border-border hover:border-ink/30")}>{f}</button>
            ))}
          </div>

          <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {filtered.length === 0 && (
              <li className="p-10 text-center text-sm text-muted-foreground">No notifications match this filter.</li>
            )}
            {filtered.map((n) => {
              const m = META[n.type];
              const Icon = m.icon;
              return (
                <li key={n.id} className={cn("p-4 flex gap-3 hover:bg-muted/40 cursor-pointer transition", n.unread && "bg-brand-soft/30")}
                  onClick={() => setItems((p) => p.map((x) => x.id === n.id ? { ...x, unread: !x.unread } : x))}>
                  <div className={cn("size-9 rounded-full grid place-items-center shrink-0", m.bg)}>
                    <Icon className={cn("size-4", m.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink text-sm truncate">{n.title}</span>
                      {n.unread && <span className="size-1.5 rounded-full bg-brand shrink-0" />}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5 truncate">{n.body}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">{n.time} · {m.label}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {tab === "preferences" && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div>
            <div className="text-sm font-semibold text-ink mb-1">Notification categories</div>
            <div className="text-xs text-muted-foreground">Toggle which events should reach you. Manage channels (email / SMS / push) under Settings → Notifications.</div>
          </div>
          {[
            { key: "bookings", label: "New bookings & cancellations" },
            { key: "reminders", label: "Session reminders" },
            { key: "payments", label: "Payments & payouts" },
            { key: "messages", label: "Student messages" },
            { key: "reviews", label: "New reviews" },
            { key: "platform", label: "Platform updates" },
          ].map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-3 py-1">
              <div className="text-sm font-medium text-ink">{p.label}</div>
              <Switch checked={prefs[p.key as keyof typeof prefs]} onCheckedChange={(v) => setPrefs({ ...prefs, [p.key]: v })} />
            </div>
          ))}
          {/* TODO(cursor): persist preferences to backend per-user. */}
        </div>
      )}
    </div>
  );
}
