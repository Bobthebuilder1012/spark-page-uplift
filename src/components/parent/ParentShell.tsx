import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import {
  LayoutDashboard, Users, Receipt, Search, Settings, Bell, LogOut, ChevronUp,
  PanelLeftClose, PanelLeftOpen, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/Logo";
import { PARENT_NOTIFS } from "@/lib/parent-notifications";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }>; exact?: boolean; tint: string };

const nav: NavItem[] = [
  { to: "/parent", label: "Home", icon: LayoutDashboard, exact: true, tint: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30" },
  { to: "/parent/children", label: "Children", icon: Users, tint: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30" },
  { to: "/parent/classes", label: "Find Classes", icon: GraduationCap, tint: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30" },
  { to: "/parent/billing", label: "Billing", icon: Receipt, tint: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30" },
];

const COLLAPSE_KEY = "itutor.parentSidebar.collapsed";

function ProfileMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative p-3 border-t border-white/10">
      <button onClick={() => setOpen((o) => !o)} className={cn("w-full flex items-center gap-3 rounded-xl hover:bg-white/5 transition px-2 py-2", collapsed && "justify-center px-0")}>
        <div className="size-9 rounded-full bg-brand grid place-items-center text-white text-sm font-semibold">AM</div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-semibold truncate text-white">Anika Mohammed</div>
              <div className="text-xs text-white/60 truncate">Parent</div>
            </div>
            <ChevronUp className={cn("size-4 text-white/60 transition-transform", !open && "rotate-180")} />
          </>
        )}
      </button>
      {open && (
        <div className={cn("absolute bottom-full mb-2 rounded-xl bg-background border border-border shadow-pop p-1 z-30", collapsed ? "left-full ml-2 w-48" : "left-3 right-3")}>
          <Link to="/parent/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-ink">
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

export function ParentShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const unread = PARENT_NOTIFS.filter((n) => n.unread).length;

  useEffect(() => { try { const v = localStorage.getItem(COLLAPSE_KEY); if (v) setCollapsed(v === "1"); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch {} }, [collapsed]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/parent/classes", search: { q: query, subject: "All", state: "browse" } as any });
  };

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
              const active = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-colors group",
                    collapsed ? "justify-center p-2" : "gap-3 px-2 py-2",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}>
                  <span className={cn("size-8 rounded-lg grid place-items-center transition", item.tint, !active && "opacity-80 group-hover:opacity-100")}>
                    <Icon className="size-4" />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <ProfileMenu collapsed={collapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <Link to="/" className="lg:hidden"><Logo size={22} /></Link>
            <form onSubmit={onSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search classes, subjects, tutors…"
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-muted border border-transparent focus:bg-background focus:border-brand focus:outline-none text-sm" />
              </div>
            </form>
            <div className="flex items-center gap-1">
              <Link to="/parent/notifications" className="relative size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Notifications">
                <Bell className="size-4" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand text-[10px] font-bold text-white grid place-items-center">{unread}</span>}
              </Link>
              <Link to="/parent/settings" className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Settings">
                <Settings className="size-4" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="grid grid-cols-4">
            {nav.map((item) => {
              const active = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", active ? "text-brand-deep" : "text-muted-foreground")}>
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
    </div>
  );
}
