import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/landing/Logo";

export function ClassesShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#0A0A0A]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <Link to="/" className="flex items-center" aria-label="itutor home">
            <Logo size={28} />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
            <a href="/#how" className="hover:text-white">How it works</a>
            <Link to="/classes" className="text-white" activeProps={{ className: "text-[#32CC6F]" }}>
              Classes
            </Link>
            <a href="/#testimonials" className="hover:text-white">Reviews</a>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/signup" className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:text-white sm:inline-flex">
              Sign Up
            </Link>
            <Link to="/login" className="rounded-full bg-[#32CC6F] px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110">
              Log In
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
