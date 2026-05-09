import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { Logo } from "@/components/landing/Logo";
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  BookOpen,
  Settings,
  Bell,
  MessageSquare,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  LogOut,
  ChevronUp,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentStoreProvider, useStudentStore, ALL_LESSONS } from "@/lib/student-store";
import { CalendarPopup } from "./CalendarPanel";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }>; exact?: boolean; tint: string };

const nav: NavItem[] = [
  { to: "/student", label: "Home", icon: LayoutDashboard, exact: true, tint: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30" },
  { to: "/student/tutors", label: "Find tutors", icon: Search, tint: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30" },
  { to: "/student/lessons", label: "My Lessons", icon: GraduationCap, tint: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30" },
  { to: "/student/bookings", label: "My Bookings", icon: CalendarDays, tint: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30" },
  { to: "/student/tools", label: "Tools", icon: BookOpen, tint: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30" },
  { to: "/student/messages", label: "Messages", icon: MessageSquare, tint: "bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30" },
];

const COLLAPSE_KEY = "itutor.sidebarCollapsed";

function MyLessonsSection({ collapsed }: { collapsed: boolean }) {
  const { pinnedLessons, togglePin } = useStudentStore();
  const [showAdd, setShowAdd] = useState(false);
  const visible = ALL_LESSONS.filter((l) => pinnedLessons.includes(l.id));
  const hidden = ALL_LESSONS.filter((l) => !pinnedLessons.includes(l.id));

  if (collapsed) {
    return (
      <div className="px-2 mt-3 space-y-1">
        {visible.slice(0, 4).map((l) => (
          <Link
            key={l.id}
            to="/student/lessons/$id"
            params={{ id: l.id }}
            title={l.title}
            className="size-9 mx-auto rounded-xl grid place-items-center text-base hover:scale-105 transition"
            style={{ background: `color-mix(in oklab, var(--${l.color}) 25%, white)` }}
          >
            {l.emoji}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <div className="h-px bg-border mx-2 mb-3" />
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">My Lessons</div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-deep hover:bg-brand-soft px-2 py-1 rounded-md"
          title="Add lesson"
        >
          <Plus className="size-3.5" /> Add
        </button>
      </div>
      <div className="space-y-0.5">
        {visible.length === 0 && (
          <div className="text-[11px] text-muted-foreground px-2 py-2 italic">No lessons pinned. Click Add to pin one.</div>
        )}
        {visible.map((l) => (
          <div key={l.id} className="group flex items-center gap-2 pr-1 rounded-lg hover:bg-muted">
            <Link
              to="/student/lessons/$id"
              params={{ id: l.id }}
              className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm min-w-0"
            >
              <span
                className="size-6 rounded-md grid place-items-center text-xs flex-shrink-0"
                style={{ background: `color-mix(in oklab, var(--${l.color}) 30%, white)` }}
              >
                {l.emoji}
              </span>
              <span className="truncate text-foreground">{l.title}</span>
            </Link>
            <button
              onClick={() => togglePin(l.id)}
              className="opacity-0 group-hover:opacity-100 size-5 grid place-items-center rounded hover:bg-background text-muted-foreground"
              title="Hide from sidebar"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
      {showAdd && hidden.length > 0 && (
        <div className="mt-2 p-2 rounded-xl bg-muted/60 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Add back</div>
          {hidden.map((l) => (
            <button
              key={l.id}
              onClick={() => togglePin(l.id)}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-background"
            >
              <span>{l.emoji}</span>
              <span className="truncate flex-1 text-left">{l.title}</span>
              <Plus className="size-3" />
            </button>
          ))}
        </div>
      )}
      {showAdd && hidden.length === 0 && (
        <div className="text-[11px] text-muted-foreground px-2 py-1">All lessons shown</div>
      )}
    </div>
  );
}

function ProfileMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  return (
    <div className="relative p-3 border-t border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn("w-full flex items-center gap-3 rounded-xl hover:bg-muted transition px-2 py-2", collapsed && "justify-center px-0")}
      >
        <div className="size-9 rounded-full bg-gradient-to-br from-coral to-peach grid place-items-center text-white text-sm font-semibold shadow-sm">AM</div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-semibold truncate text-foreground">Aliyah M.</div>
              <div className="text-xs text-muted-foreground truncate">Form 5 · CSEC</div>
            </div>
            <ChevronUp className={cn("size-4 text-muted-foreground transition-transform", !open && "rotate-180")} />
          </>
        )}
      </button>
      {open && (
        <div className={cn("absolute bottom-full mb-2 rounded-xl bg-background border border-border shadow-pop p-1 z-30", collapsed ? "left-full ml-2 w-48" : "left-3 right-3")}>
          <Link to="/student/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm">
            <Settings className="size-4 text-muted-foreground" /> Account settings
          </Link>
          <button
            onClick={() => { setConfirmLogout(true); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-coral-soft text-sm text-coral font-medium"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      )}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirmLogout(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-ink">Log out?</h3>
            <p className="text-sm text-muted-foreground mt-1">You'll need to sign in again to access your lessons.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setConfirmLogout(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted">Cancel</button>
              <Link to="/" className="flex-1 px-4 py-2 rounded-xl bg-coral text-white text-sm font-semibold text-center hover:bg-coral/90">Log out</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShellInner() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem(COLLAPSE_KEY);
      if (v) setCollapsed(v === "1");
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/student/tutors", search: { q: query } as any });
  };

  return (
    <div className="min-h-screen bg-mint flex">
      {/* Desktop sidebar */}
      <aside className={cn("dark hidden lg:flex shrink-0 flex-col border-r border-border bg-ink text-foreground transition-all duration-200", collapsed ? "w-16" : "w-64")}>
        <div className={cn("px-3 py-4 border-b border-border flex items-center gap-2", collapsed && "justify-center")}>
          {!collapsed ? (
            <Link to="/" className="flex-1" title="Back to home"><Logo size={26} /></Link>
          ) : (
            <Link to="/" title="Back to home" className="size-8 grid place-items-center rounded-lg bg-brand text-white font-bold text-sm">i</Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <div className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
            {nav.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-colors group",
                    collapsed ? "justify-center p-2" : "gap-3 px-2 py-2",
                    active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className={cn("size-8 rounded-lg grid place-items-center transition", item.tint, !active && "opacity-80 group-hover:opacity-100")}>
                    <Icon className="size-4" />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <MyLessonsSection collapsed={collapsed} />
        </nav>

        <ProfileMenu collapsed={collapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
            <Link to="/" className="lg:hidden"><Logo size={24} /></Link>

            <form onSubmit={onSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tutors, subjects, topics…"
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-muted border border-transparent focus:bg-background focus:border-brand focus:outline-none text-sm"
                />
              </div>
            </form>

            <div className="flex items-center gap-1">
              <button onClick={() => setCalOpen(true)} className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Calendar">
                <CalendarDays className="size-4" />
              </button>
              <Link to="/student/messages" className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Messages">
                <MessageSquare className="size-4" />
              </Link>
              <Link to="/student/notifications" className="relative size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Notifications">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-coral" />
              </Link>
              <Link to="/student/settings" className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Settings">
                <Settings className="size-4" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="grid grid-cols-5">
            {nav.slice(0, 5).map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", active ? "text-brand-deep" : "text-muted-foreground")}
                >
                  <span className={cn("size-8 rounded-lg grid place-items-center", active ? item.tint : "")}>
                    <Icon className="size-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <CalendarPopup open={calOpen} onClose={() => setCalOpen(false)} />
    </div>
  );
}

export function StudentShell() {
  return (
    <StudentStoreProvider>
      <ShellInner />
    </StudentStoreProvider>
  );
}
