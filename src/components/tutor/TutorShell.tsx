import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import {
  LayoutDashboard, BookOpen, CalendarDays, Users, Wallet, BarChart3,
  Sparkles, Settings, Bell, Search, LogOut, ChevronUp, PanelLeftClose, PanelLeftOpen, Lock,
  Calendar as CalendarIcon, MessageSquare, FolderOpen, Star, Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/Logo";
import { TutorStoreProvider, useTutor, PLACEHOLDER_NOTIFS } from "@/lib/tutor-store";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }>; exact?: boolean; gated?: boolean };

const nav: NavItem[] = [
  { to: "/tutor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tutor/lessons", label: "My Classes", icon: BookOpen, gated: true },
  { to: "/tutor/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/tutor/students", label: "My Students", icon: Users },
  { to: "/tutor/messages", label: "Messages", icon: MessageSquare },
  { to: "/tutor/wallet", label: "My Wallet", icon: Wallet },
  { to: "/tutor/analytics", label: "Analytics", icon: BarChart3, gated: true },
  { to: "/tutor/resources", label: "Resources", icon: FolderOpen },
  { to: "/tutor/reviews", label: "Reviews", icon: Star },
  { to: "/tutor/growth", label: "My Business", icon: Rocket, gated: true },
  { to: "/tutor/tools", label: "iTutor AI", icon: Sparkles },
];

const COLLAPSE_KEY = "itutor.tutorSidebar.collapsed";

function ListingBanner() {
  const { completion } = useTutor();
  if (completion.listed) return null;
  const pct = Math.round((completion.completed / completion.total) * 100);
  return (
    <div className="border-b border-border bg-gradient-to-r from-[oklch(0.97_0.05_150)] to-[oklch(0.96_0.04_165)]">
      <div className="px-4 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="size-9 rounded-xl bg-brand text-white grid place-items-center shrink-0">
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink">Complete your profile to get listed and start teaching.</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 max-w-xs bg-white rounded-full overflow-hidden border border-border">
              <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-medium tabular-nums">
              {completion.completed} of {completion.total} steps complete
            </span>
          </div>
        </div>
        <Link to="/tutor/get-listed" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-ink text-white text-sm font-semibold hover:bg-ink/90 shrink-0">
          Complete profile
        </Link>
      </div>
    </div>
  );
}

function ProfileMenu({ collapsed }: { collapsed: boolean }) {
  const { profile } = useTutor();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative p-3 border-t border-white/10">
      <button onClick={() => setOpen((o) => !o)} className={cn("w-full flex items-center gap-3 rounded-xl hover:bg-white/5 transition px-2 py-2", collapsed && "justify-center px-0")}>
        <div className="size-9 rounded-full bg-brand grid place-items-center text-white text-sm font-semibold">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-9 rounded-full object-cover" /> : profile.initials}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-semibold truncate text-white">{profile.name}</div>
              <div className="text-xs text-white/60 truncate">Tutor</div>
            </div>
            <ChevronUp className={cn("size-4 text-white/60 transition-transform", !open && "rotate-180")} />
          </>
        )}
      </button>
      {open && (
        <div className={cn("absolute bottom-full mb-2 rounded-xl bg-background border border-border shadow-pop p-1 z-30", collapsed ? "left-full ml-2 w-48" : "left-3 right-3")}>
          <Link to="/tutor/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-ink">
            <Settings className="size-4 text-muted-foreground" /> Account settings
          </Link>
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-coral-soft text-sm text-coral font-medium">
            <LogOut className="size-4" /> Log out
          </Link>
        </div>
      )}
    </div>
  );
}

function ShellInner() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { completion } = useTutor();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const unreadNotifs = PLACEHOLDER_NOTIFS.filter((n) => n.unread).length;

  useEffect(() => {
    try { const v = localStorage.getItem(COLLAPSE_KEY); if (v) setCollapsed(v === "1"); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-mint flex">
      <aside className={cn("dark hidden lg:flex shrink-0 flex-col border-r border-border bg-ink text-foreground transition-all duration-200 sticky top-0 h-screen", collapsed ? "w-16" : "w-60")}>
        <div className={cn("px-3 py-4 border-b border-white/10 flex items-center gap-2", collapsed && "justify-center")}>
          {!collapsed ? <Link to="/" className="flex-1"><Logo size={24} /></Link> : <Link to="/" className="size-8 grid place-items-center rounded-lg bg-brand text-white font-bold text-sm">i</Link>}
          <button onClick={() => setCollapsed((c) => !c)} className="size-8 grid place-items-center rounded-lg hover:bg-white/10 text-white/60">
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <div className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
            {nav.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              const locked = item.gated && !completion.listed;
              return (
                <Link key={item.to} to={item.to}
                  title={collapsed ? item.label : (locked ? "Available once your profile is complete." : undefined)}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                    locked && "opacity-60",
                  )}>
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && (<><span className="flex-1">{item.label}</span>{locked && <Lock className="size-3 text-white/40" />}</>)}
                </Link>
              );
            })}
          </div>

          {!completion.listed && !collapsed && (
            <div className="mx-3 mt-4 p-3 rounded-xl bg-brand/15 border border-brand/30">
              <div className="text-xs font-semibold text-white">Get listed</div>
              <div className="mt-1 text-[11px] text-white/70 leading-snug">
                Finish {completion.total - completion.completed} more step{completion.total - completion.completed === 1 ? "" : "s"} to start teaching.
              </div>
              <Link to="/tutor/get-listed" className="mt-2 block text-center text-xs font-semibold px-2 py-1.5 rounded-md bg-brand text-white hover:bg-brand/90">
                Continue
              </Link>
            </div>
          )}
        </nav>

        <ProfileMenu collapsed={collapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <Link to="/" className="lg:hidden"><Logo size={22} /></Link>
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/tutor/students" }); }} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students, classes, sessions…"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-brand focus:outline-none text-sm" />
              </div>
            </form>
            <div className="flex items-center gap-1">
              <Link to="/tutor/calendar" className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Calendar">
                <CalendarIcon className="size-4" />
              </Link>
              <Link to="/tutor/notifications" className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Notifications">
                <Bell className="size-4" />
                {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand text-[10px] font-bold text-white grid place-items-center">{unreadNotifs}</span>}
              </Link>
              <Link to="/tutor/settings" className="size-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground" title="Settings">
                <Settings className="size-4" />
              </Link>
            </div>
          </div>
          <ListingBanner />
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
              const locked = item.gated && !completion.listed;
              return (
                <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium relative", active ? "text-brand-deep" : "text-muted-foreground")}>
                  <Icon className="size-4" />
                  {item.label}
                  {locked && <Lock className="absolute top-1.5 right-[28%] size-2.5 text-muted-foreground" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function TutorShell() {
  return (<TutorStoreProvider><ShellInner /></TutorStoreProvider>);
}
