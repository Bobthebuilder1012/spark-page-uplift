import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/landing/Logo";
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  BookOpen,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/student", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/student/tutors", label: "Find tutors", icon: Search, exact: false },
  { to: "/student/bookings", label: "Bookings", icon: CalendarDays, exact: false },
  { to: "/student/curriculum", label: "Curriculum", icon: BookOpen, exact: false },
  { to: "/student/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function StudentShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-mint flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <div className="px-5 py-5 border-b border-border">
          <Link to="/"><Logo size={28} /></Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-soft text-forest"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-9 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-sm font-semibold">AM</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Aliyah M.</div>
              <div className="text-xs text-muted-foreground truncate">Form 5 · CSEC</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <Link to="/" className="lg:hidden"><Logo size={24} /></Link>
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <button className="relative size-9 grid place-items-center rounded-full hover:bg-muted">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-coral" />
              </button>
              <button className="size-9 grid place-items-center rounded-full hover:bg-muted">
                <MessageSquare className="size-4" />
              </button>
            </div>
            <div className="ml-auto md:hidden size-9 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-sm font-semibold">AM</div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="grid grid-cols-5">
            {nav.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                    active ? "text-brand-deep" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("size-5", active && "stroke-[2.5]")} />
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
