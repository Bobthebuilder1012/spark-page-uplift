import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, YEAR_LEVELS, TUTOR_LEVELS, TUTOR_SUBJECTS } from "@/lib/countries";
import { Lightbulb, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — iTutor" },
      { name: "description", content: "Create your iTutor account in minutes." },
    ],
  }),
  component: SignupPage,
});

type Role = "student" | "tutor" | "parent";
type Step = "details" | "role" | "verify" | "confirmed" | "profile";

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "role", label: "Role" },
  { id: "verify", label: "Verify" },
  { id: "confirmed", label: "Confirmed" },
  { id: "profile", label: "Profile" },
];

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");

  // Step 1
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);

  // Step 2
  const [role, setRole] = useState<Role | "">("");

  // Step 3
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendIn, setResendIn] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Step 5 (student profile)
  const [school, setSchool] = useState<"attend" | "teach" | "no" | "">("");
  const [schoolName, setSchoolName] = useState("");
  const [year, setYear] = useState("");

  // Step 5 (tutor profile)
  const [tLevels, setTLevels] = useState<string[]>([]);
  const [tSubjects, setTSubjects] = useState<string[]>([]);
  const [tQuery, setTQuery] = useState("");
  const [videoProvider, setVideoProvider] = useState<"" | "zoom" | "google_meet" | "itutor">("");

  // Sync hash with step
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${step}`) {
      history.replaceState(null, "", `#${step}`);
    }
    const onPop = () => {
      const h = window.location.hash.replace("#", "") as Step;
      if (STEPS.some((s) => s.id === h)) setStep(h);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [step]);

  // Resend cooldown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const goto = (s: Step) => {
    setStep(s);
    if (typeof window !== "undefined") history.pushState(null, "", `#${s}`);
  };

  // ---- validation ----
  const usernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(username);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const detailsValid = usernameValid && emailValid && country && passwordValid && agree;

  // ---- handlers ----
  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsValid) return;
    goto("role");
  };

  const sendCode = () => {
    setResendIn(60);
    setCode(["", "", "", "", "", ""]);
    // mock: real flow would POST /api/auth/send-verification
  };

  const continueRole = () => {
    if (!role) return;
    sendCode();
    goto("verify");
  };

  const verifyAndCreate = () => {
    setVerifyError("");
    const joined = code.join("");
    if (joined.length !== 6) {
      setVerifyError("Enter all 6 digits");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      goto("confirmed");
      // auto-advance to secondary signup after a beat
      setTimeout(() => {
        if (role === "student" || role === "tutor") goto("profile");
        else navigate({ to: "/student" }); // parents skip secondary
      }, 1400);
    }, 600);
  };

  const completeProfile = () => {
    if (role === "tutor") {
      if (tLevels.length === 0) return;
      const needsSubjects = tLevels.some((l) => l !== "sea");
      if (needsSubjects && tSubjects.length === 0) return;
      if (!videoProvider) return;
      navigate({ to: "/student" });
      return;
    }
    if (!year) return;
    if (school !== "no" && school !== "" && !schoolName.trim()) return;
    navigate({ to: "/student" });
  };

  const toggleLevel = (v: string) =>
    setTLevels((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const addSubject = (s: string) => {
    if (!tSubjects.includes(s)) setTSubjects((cur) => [...cur, s]);
    setTQuery("");
  };
  const removeSubject = (s: string) => setTSubjects((cur) => cur.filter((x) => x !== s));

  return (
    <main className="min-h-screen bg-gradient-to-br from-forest via-forest to-[oklch(0.18_0.04_155)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-stretch lg:p-8">
        {/* LEFT — brand panel */}
        <aside className="hidden flex-col justify-between rounded-3xl bg-[oklch(0.16_0.04_155)] p-10 lg:flex lg:w-[55%]">
          <div className="flex items-center gap-3">
            <Logo size={32} />
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight">
                Learn with the<br />
                Caribbean's best tutors.
              </h1>
              <p className="mt-4 max-w-md text-white/70">
                Join thousands of students mastering SEA, CSEC and CAPE with verified iTutors.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "12k+", l: "Students" },
                { n: "850+", l: "Verified iTutors" },
                { n: "4.9★", l: "Avg rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="font-display text-2xl font-bold text-brand">{s.n}</div>
                  <div className="mt-1 text-xs text-white/60">{s.l}</div>
                </div>
              ))}
            </div>

            <ul className="space-y-3 text-sm text-white/80">
              {[
                "Book 1:1s by the hour, or join recurring lessons",
                "Verified subject qualifications on every iTutor",
                "Cancel or reschedule with one tap",
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
            {/* mobile header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
              <Link to="/" className="flex items-center">
                <Logo size={26} />
              </Link>
              <Link to="/" className="text-xs font-medium text-muted-foreground">
                Back to site
              </Link>
            </div>

            {/* progress */}
            <div className="px-6 pt-6 sm:px-8">
              <Progress current={step} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6 sm:px-8" style={{ maxHeight: "calc(100vh - 48px)" }}>
              <AnimatePresence mode="wait">
                {step === "details" && (
                  <StepWrap key="details">
                    <Header
                      title="Create your account"
                      sub="A few details to get started — you can change them later."
                    />
                    <form onSubmit={submitDetails} className="mt-6 space-y-4">
                      <Field label="Username" hint={username && !usernameValid ? "3–30 chars, letters/numbers/_ only" : undefined}>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. ramdeen_phys"
                          autoComplete="username"
                        />
                      </Field>
                      <Field label="Email">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field label="Country">
                        <CountryPicker value={country} onChange={setCountry} />
                      </Field>
                      <Field label="Password" hint={password && !passwordValid ? "At least 8 characters" : undefined}>
                        <div className="relative">
                          <Input
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
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
                      </Field>

                      <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm text-muted-foreground">
                        <Checkbox
                          checked={agree}
                          onCheckedChange={(v) => setAgree(Boolean(v))}
                          className="mt-0.5"
                        />
                        <span>
                          I agree to the{" "}
                          <a href="#" className="font-medium text-foreground underline">Terms</a>{" "}
                          and{" "}
                          <a href="#" className="font-medium text-foreground underline">Privacy Policy</a>.
                        </span>
                      </label>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={!detailsValid}
                        className="w-full bg-forest text-white hover:bg-forest/90"
                      >
                        Continue
                      </Button>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">or</span>
                        </div>
                      </div>

                      <Button type="button" variant="outline" size="lg" className="w-full">
                        <GoogleIcon /> Continue with Google
                      </Button>

                      <p className="pt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-forest underline">Log in</Link>
                      </p>
                    </form>
                  </StepWrap>
                )}

                {step === "role" && (
                  <StepWrap key="role">
                    <BackBtn onClick={() => goto("details")} />
                    <Header
                      title="What brings you here?"
                      sub="Pick what fits — you can adjust this later."
                    />
                    <div className="mt-6 space-y-3">
                      <RoleCard
                        active={role === "student"}
                        onClick={() => setRole("student")}
                        icon={<GraduationCap className="h-5 w-5" />}
                        title="I'm a student"
                        desc="Find tutors and join lessons"
                      />
                      <RoleCard
                        active={role === "tutor"}
                        onClick={() => setRole("tutor")}
                        icon={<UserRound className="h-5 w-5" />}
                        title="I'm an iTutor"
                        desc="Teach 1:1s and run lessons"
                      />
                      <RoleCard
                        active={role === "parent"}
                        onClick={() => setRole("parent")}
                        icon={<Users className="h-5 w-5" />}
                        title="I'm a parent / guardian"
                        desc="Manage my child's learning"
                      />
                    </div>
                    <Button
                      size="lg"
                      disabled={!role}
                      onClick={continueRole}
                      className="mt-6 w-full bg-forest text-white hover:bg-forest/90"
                    >
                      Continue
                    </Button>
                  </StepWrap>
                )}

                {step === "verify" && (
                  <StepWrap key="verify">
                    <BackBtn onClick={() => goto("role")} />
                    <Header
                      title="Check your email"
                      sub={
                        <>
                          We sent a 6-digit code to{" "}
                          <span className="font-medium text-foreground">{email}</span>.
                        </>
                      }
                    />
                    <div className="mt-6 space-y-4">
                      <OTPInputs value={code} onChange={setCode} onComplete={verifyAndCreate} />
                      {verifyError && (
                        <p className="text-center text-sm text-destructive">{verifyError}</p>
                      )}
                      <Button
                        size="lg"
                        onClick={verifyAndCreate}
                        disabled={code.join("").length !== 6 || verifying}
                        className="w-full bg-forest text-white hover:bg-forest/90"
                      >
                        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & create account"}
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                        Didn't get it?{" "}
                        <button
                          type="button"
                          disabled={resendIn > 0}
                          onClick={sendCode}
                          className="font-medium text-forest underline disabled:no-underline disabled:opacity-50"
                        >
                          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                        </button>
                      </div>
                      <p className="text-center text-xs text-muted-foreground">
                        Emails can take up to a minute. Check spam if you don't see it.
                      </p>
                    </div>
                  </StepWrap>
                )}

                {step === "confirmed" && (
                  <StepWrap key="confirmed">
                    <div className="flex flex-col items-center pt-6 text-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 14 }}
                        className="grid h-20 w-20 place-items-center rounded-full bg-brand/15 text-brand"
                      >
                        <Check className="h-10 w-10" strokeWidth={3} />
                      </motion.div>
                      <h2 className="mt-5 font-display text-2xl font-bold">You're verified!</h2>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        {role === "student"
                          ? "One last step — tell us about your studies."
                          : role === "tutor"
                            ? "One last step — set up your tutor profile."
                            : "Taking you to your dashboard…"}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Redirecting…
                      </div>
                    </div>
                  </StepWrap>
                )}

                {step === "profile" && role === "tutor" && (
                  <StepWrap key="profile-tutor">
                    <div className="flex flex-col items-center text-center">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-forest text-white shadow-pop">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Set up your tutor profile
                      </h2>
                      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                        Add the levels you teach and your subjects so students can find you.
                      </p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="rounded-2xl bg-brand/5 p-4 ring-1 ring-brand/10">
                        <Label className="text-sm font-semibold">
                          Teaching Levels <span className="text-destructive">*</span>
                        </Label>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Select all levels you can teach, including SEA if applicable.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {TUTOR_LEVELS.map((l) => {
                            const active = tLevels.includes(l.value);
                            return (
                              <button
                                key={l.value}
                                type="button"
                                onClick={() => toggleLevel(l.value)}
                                className={cn(
                                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                                  active
                                    ? "border-brand bg-brand text-white"
                                    : "border-border bg-white text-foreground hover:border-brand/40",
                                )}
                              >
                                {l.label}
                              </button>
                            );
                          })}
                        </div>
                        {tLevels.length > 0 && (
                          <p className="mt-3 text-xs font-medium text-brand">
                            ✓ Selected: {tLevels.length} level{tLevels.length === 1 ? "" : "s"}
                          </p>
                        )}
                      </div>

                      {tLevels.some((l) => l !== "sea") && (
                        <div className="rounded-2xl border border-border bg-white p-4">
                          <Label className="text-sm font-semibold">
                            Subjects you can teach (CSEC / CAPE) <span className="text-destructive">*</span>
                          </Label>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Search and add subjects for the secondary / CAPE levels you selected above.
                          </p>
                          <div className="relative mt-3">
                            <Input
                              value={tQuery}
                              onChange={(e) => setTQuery(e.target.value)}
                              placeholder="Type subject name (e.g. CSEC Math, CAPE Physics)…"
                            />
                            {tQuery.trim() && (
                              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                                {TUTOR_SUBJECTS.filter(
                                  (s) =>
                                    s.toLowerCase().includes(tQuery.toLowerCase()) &&
                                    !tSubjects.includes(s),
                                )
                                  .slice(0, 8)
                                  .map((s) => (
                                    <li key={s}>
                                      <button
                                        type="button"
                                        onClick={() => addSubject(s)}
                                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
                                      >
                                        {s}
                                        <span className="text-xs text-muted-foreground">Add</span>
                                      </button>
                                    </li>
                                  ))}
                                {TUTOR_SUBJECTS.filter(
                                  (s) =>
                                    s.toLowerCase().includes(tQuery.toLowerCase()) &&
                                    !tSubjects.includes(s),
                                ).length === 0 && (
                                  <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
                                )}
                              </ul>
                            )}
                          </div>
                          {tSubjects.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {tSubjects.map((s) => (
                                <span
                                  key={s}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium"
                                >
                                  {s}
                                  <button
                                    type="button"
                                    onClick={() => removeSubject(s)}
                                    className="text-muted-foreground hover:text-foreground"
                                    aria-label={`Remove ${s}`}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">
                            {tSubjects.length} subject{tSubjects.length === 1 ? "" : "s"} selected
                          </p>
                        </div>
                      )}

                      <div className="rounded-2xl border border-border bg-white p-4">
                        <Label className="text-sm font-semibold">
                          Video lesson provider <span className="text-destructive">*</span>
                        </Label>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Choose how you'll host live lessons. You can change this later in Settings.
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {[
                            { v: "zoom", l: "Zoom", d: "Connect your Zoom account" },
                            { v: "google_meet", l: "Google Meet", d: "Sign in with Google" },
                            { v: "itutor", l: "iTutor video", d: "Built-in video room" },
                          ].map((o) => {
                            const active = videoProvider === o.v;
                            return (
                              <button
                                key={o.v}
                                type="button"
                                onClick={() => setVideoProvider(o.v as typeof videoProvider)}
                                className={cn(
                                  "rounded-xl border-2 p-3 text-left transition",
                                  active
                                    ? "border-brand bg-brand/5"
                                    : "border-border bg-white hover:border-brand/40",
                                )}
                              >
                                <div className="text-sm font-semibold text-foreground">{o.l}</div>
                                <div className="mt-0.5 text-xs text-muted-foreground">{o.d}</div>
                              </button>
                            );
                          })}
                        </div>
                        {videoProvider && videoProvider !== "itutor" && (
                          <button type="button" className="mt-3 w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                            Connect {videoProvider === "zoom" ? "Zoom" : "Google Meet"} →
                          </button>
                        )}
                      </div>

                      <Button
                        size="lg"
                        onClick={completeProfile}
                        disabled={
                          tLevels.length === 0 ||
                          (tLevels.some((l) => l !== "sea") && tSubjects.length === 0) ||
                          !videoProvider
                        }
                        className="w-full bg-gradient-to-r from-brand to-forest text-white hover:opacity-95"
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </StepWrap>
                )}

                {step === "profile" && role !== "tutor" && (
                  <StepWrap key="profile">
                    <Header
                      title="Tell us about your studies"
                      sub="This helps us match you with the right tutors and lessons."
                    />
                    <div className="mt-6 space-y-5">
                      <Field label="Are you affiliated with a school?">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { v: "attend", l: "Yes, attend" },
                            { v: "teach", l: "Yes, teach" },
                            { v: "no", l: "No" },
                          ].map((o) => (
                            <button
                              key={o.v}
                              type="button"
                              onClick={() => setSchool(o.v as typeof school)}
                              className={cn(
                                "rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                                school === o.v
                                  ? "border-forest bg-forest text-white"
                                  : "border-border bg-white hover:border-forest/40",
                              )}
                            >
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </Field>

                      {(school === "attend" || school === "teach") && (
                        <Field label="School name">
                          <Input
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="Start typing your school…"
                          />
                        </Field>
                      )}

                      <Field label="Year">
                        <Select value={year} onValueChange={setYear}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEAR_LEVELS.map((y) => (
                              <SelectItem key={y.value} value={y.value}>
                                {y.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Button
                        size="lg"
                        onClick={completeProfile}
                        disabled={!year || ((school === "attend" || school === "teach") && !schoolName.trim())}
                        className="w-full bg-forest text-white hover:bg-forest/90"
                      >
                        Complete profile
                      </Button>
                    </div>
                  </StepWrap>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ───────────────── pieces ───────────────── */

function Progress({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= idx ? "bg-forest" : "bg-muted",
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {STEPS.map((s, i) => (
          <span key={s.id} className={cn(i === idx && "text-forest")}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

function Header({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-destructive">{hint}</p>}
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition",
        active
          ? "border-brand bg-brand-soft text-trust-text"
          : "border-border bg-background text-ink hover:border-brand/40",
      )}
    >
      <div
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
          active ? "bg-brand text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <div
        className={cn(
          "grid h-5 w-5 place-items-center rounded-full border-2",
          active ? "border-brand bg-brand text-white" : "border-border",
        )}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </div>
    </button>
  );
}

function OTPInputs({
  value,
  onChange,
  onComplete,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onComplete?: () => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setAt = (i: number, ch: string) => {
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
    if (next.every((c) => c) && next.join("").length === 6) onComplete?.();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {value.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={c}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!txt) return;
            e.preventDefault();
            const next = txt.split("").concat(Array(6).fill("")).slice(0, 6);
            onChange(next);
            const focusIdx = Math.min(txt.length, 5);
            refs.current[focusIdx]?.focus();
            if (txt.length === 6) onComplete?.();
          }}
          className="h-14 w-11 rounded-xl border-2 border-border bg-white text-center text-xl font-semibold tabular-nums shadow-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20 sm:h-16 sm:w-12 sm:text-2xl"
        />
      ))}
    </div>
  );
}

function CountryPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = COUNTRIES.find((c) => c.code === value);
  const filtered = useMemo(() => {
    if (!q.trim()) return COUNTRIES;
    const s = q.toLowerCase();
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
      >
        <span className={cn("flex items-center gap-2", !selected && "text-muted-foreground")}>
          {selected ? (
            <>
              <span className="text-base leading-none">{selected.flag}</span>
              {selected.name}
            </>
          ) : (
            "Select your country"
          )}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search countries…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQ("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent",
                    value === c.code && "bg-accent",
                  )}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  {value === c.code && <Check className="h-4 w-4 text-forest" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
