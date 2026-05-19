import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/landing/Logo";
import { Home, Users, Receipt, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/parent", label: "Home", icon: Home, exact: true },
  { to: "/parent/children", label: "Children", icon: Users },
  { to: "/parent/billing", label: "Billing", icon: Receipt },
] as const;

export function ParentShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) => (exact ? path === to : path === to || path.startsWith(to + "/"));

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/parent" className="inline-flex items-center gap-2">
            <Logo className="size-7" />
            <span className="hidden sm:inline font-bold text-ink">iTutor <span className="text-muted-foreground font-medium">· Parent</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = isActive(n.to, "exact" in n ? n.exact : false);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition",
                    active ? "bg-brand-soft text-brand-deep" : "text-muted-foreground hover:bg-muted hover:text-ink",
                  )}
                >
                  <n.icon className="size-4" /> {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Notifications">
              <Bell className="size-4" />
            </button>
            <Link to="/parent" className="size-9 grid place-items-center rounded-full hover:bg-muted text-muted-foreground" title="Account">
              <Settings className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background border-t border-border">
        <div className="grid grid-cols-3">
          {nav.map((n) => {
            const active = isActive(n.to, "exact" in n ? n.exact : false);
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium",
                active ? "text-brand-deep" : "text-muted-foreground",
              )}>
                <n.icon className="size-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-10">
        <Outlet />
      </main>
    </div>
  );
}
