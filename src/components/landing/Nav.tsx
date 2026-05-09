import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 px-4 py-2.5 transition-all sm:px-6 sm:py-3 ${
          scrolled ? "bg-ink/90 backdrop-blur-xl shadow-card" : "bg-ink"
        }`}
      >
        <Logo light />
        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:text-white sm:inline-flex">
            Sign Up
          </button>
          <button className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-pop transition-transform hover:scale-[1.04] active:scale-95">
            Log In
          </button>
        </div>
      </div>
    </motion.header>
  );
}
