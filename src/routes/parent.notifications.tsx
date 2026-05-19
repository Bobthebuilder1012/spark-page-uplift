import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ShieldCheck, CreditCard, RefreshCcw, FileText, AlertCircle, CheckCheck, Settings as SettingsIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { PARENT_NOTIFS, type ParentNotifType } from "@/lib/parent-notifications";

export const Route = createFileRoute("/parent/notifications")({
  head: () => ({ meta: [{ title: "Notifications — iTutor Parent" }] }),
  component: Notifications,
});

const META: Record<ParentNotifType, { icon: any; bg: string; color: string; label: string }> = {
  "consent-request":    { icon: ShieldCheck, bg: "bg-amber-100",   color: "text-amber-700",   label: "Consent" },
  "payment":            { icon: CreditCard,  bg: "bg-brand-soft",  color: "text-brand-deep",  label: "Payment" },
  "renewal-reminder":   { icon: RefreshCcw,  bg: "bg-sky-100",     color: "text-sky-700",     label: "Renewal" },
  "feedback":           { icon: FileText,    bg: "bg-lavender",    color: "text-ink",         label: "Feedback" },
  "suspended":          { icon: AlertCircle, bg: "bg-rose-100",    color: "text-rose-700",    label: "Alert" },
};

const FILTERS = ["All", "Unread", "Consent", "Payments", "Feedback", "Alerts"] as const;

function Notifications() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [items, setItems] = useState(PARENT_NOTIFS);
  const [emptyDemo, setEmptyDemo] = useState(false);

  const list = emptyDemo ? [] : items;
  const filtered = list.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    if (filter === "Consent") return n.type === "consent-request";
    if (filter === "Payments") return n.type === "payment" || n.type === "renewal-reminder";
    if (filter === "Feedback") return n.type === "feedback";
    if (filter === "Alerts") return n.type === "suspended";
    return true;
  });

  const unreadCount = list.filter((n) => n.unread).length;
  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, unread: false })));
  const toggleRead = (id: string) => setItems((p) => p.map((n) => n.id === id ? { ...n, unread: !n.unread } : n));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-2xl bg-brand-soft grid place-items-center">
          <Bell className="size-5 text-brand-deep" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-coral text-white text-[10px] font-bold grid place-items-center">{unreadCount}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
        </div>
        <button onClick={() => setEmptyDemo((e) => !e)} className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground hover:text-ink font-semibold">
          {emptyDemo ? "Show notifs" : "Empty demo"}
        </button>
        <button onClick={markAllRead} disabled={unreadCount === 0}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-brand-deep hover:bg-brand-soft disabled:opacity-40">
          <CheckCheck className="size-4" /> Mark all read
        </button>
        <Link to="/parent/settings" className="size-9 grid place-items-center rounded-xl border border-border hover:bg-muted text-muted-foreground" title="Notification settings">
          <SettingsIcon className="size-4" />
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="size-4 text-muted-foreground shrink-0" />
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition",
              filter === f ? "bg-ink text-white border-ink" : "bg-background border-border text-muted-foreground hover:border-brand")}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-background border border-border overflow-hidden">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="size-14 mx-auto rounded-2xl bg-muted grid place-items-center mb-3">
              <Bell className="size-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-ink">{emptyDemo ? "No notifications" : "Nothing here"}</p>
            <p className="text-sm text-muted-foreground mt-1">{emptyDemo ? "You'll be notified about consents, payments and feedback." : "Try a different filter."}</p>
          </div>
        )}
        {filtered.map((n) => {
          const meta = META[n.type];
          const Icon = meta.icon;
          const inner = (
            <>
              {n.unread && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 size-2 rounded-full bg-coral" />}
              <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", meta.bg)}>
                <Icon className={cn("size-4", meta.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("text-sm", n.unread ? "font-semibold text-ink" : "font-medium text-ink/80")}>{n.title}</div>
                  <div className="text-[11px] text-muted-foreground shrink-0">{n.time}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1.5">{meta.label}</div>
              </div>
            </>
          );
          const cls = cn("w-full text-left flex gap-3 p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition relative", n.unread && "bg-brand-soft/30");
          return n.href ? (
            <Link key={n.id} to={n.href as string} onClick={() => toggleRead(n.id)} className={cls}>{inner}</Link>
          ) : (
            <button key={n.id} onClick={() => toggleRead(n.id)} className={cls}>{inner}</button>
          );
        })}
      </div>
    </div>
  );
}
