import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/landing/Logo";

const links = [
  { label: "Find a Class", to: "/classes" },
  { label: "Explore Teachers", to: "/student/tutors" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "For Teachers", to: "/tutor/get-listed" },
] as const;

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:h-[72px] sm:px-8">
        <Link to="/" aria-label="iTutor home" className="flex items-center">
          <Logo size={26} />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="relative py-1 transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:scale-x-0 after:bg-brand after:transition-transform hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Log In
          </Link>
          <Link
            to="/classes"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-brand hover:text-primary-foreground"
          >
            Find Your iTutor
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto inline-flex size-10 items-center justify-center rounded-full border border-border text-ink sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-3 sm:hidden">
          <nav className="grid gap-1 text-base font-medium text-ink">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-3 transition-colors hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Link
              to="/classes"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-background"
            >
              Find Your iTutor
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-5 py-3 text-center text-sm font-semibold text-ink"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
