import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/landing/Logo";

export function ClassesShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="sticky top-0 z-40 border-b border-border bg-ink/95 sm:bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <Link to="/" className="flex items-center" aria-label="itutor home">
            <Logo size={28} />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="/#how" className="text-muted-foreground hover:text-ink">How it works</a>
            <Link to="/classes" className="text-ink font-semibold" activeProps={{ className: "text-brand-deep" }}>
              Explore
            </Link>
            <a href="/#testimonials" className="text-muted-foreground hover:text-ink">Reviews</a>
            <Link to="/faq" className="text-muted-foreground hover:text-ink">FAQ</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/signup" className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/80 sm:text-muted-foreground hover:text-ink sm:inline-flex">
              Sign Up
            </Link>
            <Link to="/login" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep">
              Log In
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
