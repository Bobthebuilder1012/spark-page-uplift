import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — iTutor" },
      { name: "description", content: "Log in to your iTutor account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setTimeout(() => navigate({ to: "/student" }), 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-forest via-forest to-[oklch(0.18_0.04_155)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-stretch lg:p-8">
        {/* LEFT — brand panel */}
        <aside className="hidden flex-col justify-between rounded-3xl bg-[oklch(0.16_0.04_155)] p-10 lg:flex lg:w-[55%]">
          <Link to="/" className="flex items-center"><Logo size={32} /></Link>
          <div className="space-y-6">
            <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight">
              Welcome back.<br />Let's keep learning.
            </h1>
            <p className="max-w-md text-white/70">
              Pick up where you left off — your tutors, lessons and bookings are right here.
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              {[
                "Manage your 1:1 sessions and group lessons",
                "Message your iTutors directly",
                "Track progress across every subject",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20">
                    <Check className="h-3 w-3 text-brand" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">© iTutor 2026</p>
        </aside>

        {/* RIGHT — card */}
        <section className="flex-1 lg:w-[45%]">
          <div className="mx-auto flex h-full max-w-xl flex-col rounded-3xl bg-white text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
              <Link to="/" className="flex items-center"><Logo size={26} /></Link>
              <Link to="/" className="text-xs font-medium text-muted-foreground">Back to site</Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 px-6 pb-8 pt-10 sm:px-10"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Log in</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Welcome back to iTutor.</p>

              <Button type="button" variant="outline" size="lg" className="mt-6 w-full">
                <GoogleIcon /> Continue with Google
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Password</Label>
                    <a href="#" className="text-xs font-medium text-forest hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!valid || loading}
                  className="w-full bg-forest text-white hover:bg-forest/90"
                >
                  {loading ? "Logging in…" : "Log in"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to iTutor?{" "}
                <Link to="/signup" className="font-medium text-forest underline">Create an account</Link>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
