import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PLACEHOLDER_RECURRING_REQUESTS, type RecurringRequest } from "@/lib/tutor-store";
import {
  ArrowLeft, Users, User as UserIcon, ChevronRight, Check, Inbox, Clock, MessageCircle, X,
  Globe, Lock, Eye, MessageSquare, Sparkles, DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor/lessons/new")({
  head: () => ({ meta: [{ title: "Create a Class — iTutor Tutor" }] }),
  component: CreateClassPage,
});

type ClassType = "group" | "recurring-1on1";

function CreateClassPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<ClassType | null>(null);
  const [requests, setRequests] = useState<RecurringRequest[]>(PLACEHOLDER_RECURRING_REQUESTS);
  const [presetStudent, setPresetStudent] = useState<RecurringRequest | null>(null);

  // Step 2 form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [studentLimit, setStudentLimit] = useState(8);
  const [billingModel, setBillingModel] = useState<"per-session" | "per-month" | "prepaid">("per-session");
  const [price, setPrice] = useState(120);
  const [memberFee, setMemberFee] = useState(5);
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
  const [joinRequests, setJoinRequests] = useState(false);
  const [autoSuspend, setAutoSuspend] = useState(true);
  const [graceDays, setGraceDays] = useState(7);
  const [whatsapp, setWhatsapp] = useState("");
  const [classroom, setClassroom] = useState("");
  const [primary, setPrimary] = useState<"native" | "whatsapp" | "classroom">("native");
  const [feedback, setFeedback] = useState<"off" | "included" | "paid">("off");
  const [feedbackPrice, setFeedbackPrice] = useState(50);

  const accept = (r: RecurringRequest) => {
    setPresetStudent(r);
    setType("recurring-1on1");
    setStudentLimit(1);
    setSubject(r.subject);
    setLevel(r.level);
    setTitle(`${r.subject} · ${r.studentName.split(" ")[0]}`);
    setStep(2);
  };
  const decline = (id: string) => setRequests(requests.filter((r) => r.id !== id));

  return (
    <div className="max-w-5xl space-y-6">
      <Link to="/tutor/lessons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> All Classes
      </Link>

      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Create a Class</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up a new group or recurring 1:1.</p>
      </header>

      <Stepper step={step} />

      {step === 1 && (
        <>
          <section className="grid sm:grid-cols-2 gap-4">
            <TypeCard
              active={type === "group"}
              onClick={() => setType("group")}
              icon={Users}
              title="Group"
              caption="2+ students, shared schedule, recurring or one-off."
              badges={["Marketplace ready", "Roster & payments grid", "Stream + analytics"]}
            />
            <TypeCard
              active={type === "recurring-1on1"}
              onClick={() => { setType("recurring-1on1"); setStudentLimit(1); }}
              icon={UserIcon}
              title="Recurring 1:1"
              caption="A single student on a repeating schedule."
              badges={["Private by default", "No scarcity UI", "Hides analytics tab"]}
            />
          </section>

          <div className="flex justify-end">
            <button disabled={!type} onClick={() => setStep(2)}
              className={cn("inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold", type ? "bg-brand text-white hover:bg-brand/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
              Continue <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Recurring requests inbox */}
          <section className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="size-4 text-brand-deep" />
              <h2 className="font-bold text-ink">Recurring 1:1 requests</h2>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep">{requests.length} pending</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Students who want you as their recurring tutor. Accept to pre-fill the Class setup with this student.</p>

            {requests.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
                No pending requests right now.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {requests.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-card border border-border p-5">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-brand to-emerald-400 grid place-items-center text-xs font-bold text-white">{r.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-ink">{r.studentName}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.level}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{r.subject}</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-deep font-semibold"><Clock className="size-3" /> {r.preferredTime}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground rounded-xl bg-muted/40 p-3">
                      <MessageCircle className="size-4 mt-0.5 shrink-0" /> {r.message}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-[11px] text-muted-foreground">Received {new Date(r.receivedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => decline(r.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted">
                          <X className="size-3.5" /> Decline
                        </button>
                        <button onClick={() => accept(r)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90">
                          <Check className="size-3.5" /> Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {presetStudent && (
            <div className="rounded-2xl border border-brand bg-brand-soft p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-brand text-white grid place-items-center text-xs font-bold">{presetStudent.initials}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-brand-deep">Pre-loaded from request · {presetStudent.studentName}</div>
                <div className="text-xs text-brand-deep/80">They'll be invited automatically when you publish this Class.</div>
              </div>
            </div>
          )}

          <Card title="Basics">
            <Field label="Class title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CSEC Maths Crash Course" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subject"><input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
              <Field label="Level"><input value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
            </div>
            <Field label="Class bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full min-h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
          </Card>

          <Card title="Capacity & billing">
            {type === "group" && (
              <Field label="Student limit">
                <div className="inline-flex items-center gap-2">
                  <button onClick={() => setStudentLimit(Math.max(2, studentLimit - 1))} className="size-9 grid place-items-center rounded-lg border border-border">−</button>
                  <input type="number" value={studentLimit} onChange={(e) => setStudentLimit(Math.max(1, Number(e.target.value)))} className="w-20 text-center px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                  <button onClick={() => setStudentLimit(studentLimit + 1)} className="size-9 grid place-items-center rounded-lg border border-border">+</button>
                </div>
              </Field>
            )}
            <Field label="Billing model">
              <div className="grid grid-cols-3 gap-2">
                {(["per-session", "per-month", "prepaid"] as const).map((b) => (
                  <button key={b} onClick={() => setBillingModel(b)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize", billingModel === b ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                    {b.replace("-", " ")}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (TTD)">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </div>
              </Field>
              <Field label="Per-member service fee (TTD)">
                <input type="number" value={memberFee} onChange={(e) => setMemberFee(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </Field>
            </div>
          </Card>

          <Card title="Access & policies">
            <Field label="Visibility">
              <div className="grid grid-cols-3 gap-2">
                {(["public","unlisted","private"] as const).map((v) => (
                  <button key={v} onClick={() => setVisibility(v)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize inline-flex items-center justify-center gap-1.5", visibility === v ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                    {v === "public" ? <Globe className="size-3.5" /> : v === "private" ? <Lock className="size-3.5" /> : <Eye className="size-3.5" />} {v}
                  </button>
                ))}
              </div>
            </Field>
            <Toggle label="Enable join requests" hint="Members must request approval before joining." value={joinRequests} onChange={setJoinRequests} />
            <Toggle label="Auto-suspend on overdue payment" value={autoSuspend} onChange={setAutoSuspend} />
            {autoSuspend && (
              <Field label="Grace window (days)">
                <input type="number" value={graceDays} onChange={(e) => setGraceDays(Number(e.target.value))} className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              </Field>
            )}
          </Card>

          <Card title="Communication">
            <Field label="WhatsApp group link"><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="https://chat.whatsapp.com/…" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
            <Field label="Google Classroom link"><input value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="https://classroom.google.com/c/…" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
            <Field label="Primary channel">
              <div className="grid grid-cols-3 gap-2">
                {(["native", "whatsapp", "classroom"] as const).map((c) => (
                  <button key={c} onClick={() => setPrimary(c)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize inline-flex items-center justify-center gap-1.5", primary === c ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                    {c === "whatsapp" ? <MessageSquare className="size-3.5" /> : c === "classroom" ? <Globe className="size-3.5" /> : <Sparkles className="size-3.5" />} {c === "native" ? "iTutor native" : c}
                  </button>
                ))}
              </div>
            </Field>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              Sessions use the video provider on your tutor account. Meeting links are attached per-session in the Sessions tab.
            </div>
          </Card>

          <Card title="Parent feedback">
            <Field label="Mode" hint="AI drafts a monthly report. You review and approve before send.">
              <div className="grid grid-cols-3 gap-2">
                {(["off", "included", "paid"] as const).map((m) => (
                  <button key={m} onClick={() => setFeedback(m)} className={cn("px-3 py-2 rounded-lg border text-xs font-semibold capitalize", feedback === m ? "bg-brand-soft border-brand text-brand-deep" : "border-border bg-background text-muted-foreground hover:text-ink")}>
                    {m === "included" ? "Included free" : m === "paid" ? "Paid add-on" : "Off"}
                  </button>
                ))}
              </div>
            </Field>
            {feedback === "paid" && (
              <Field label="Price per report (TTD)"><input type="number" value={feedbackPrice} onChange={(e) => setFeedbackPrice(Number(e.target.value))} className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm" /></Field>
            )}
          </Card>

          <div className="flex justify-between items-center">
            <button onClick={() => setStep(1)} className="text-sm font-semibold text-muted-foreground hover:text-ink">← Back</button>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Save as draft</button>
              <button onClick={() => navigate({ to: "/tutor/lessons" })} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90">
                <Check className="size-4" /> Publish Class
              </button>
            </div>
          </div>
          {/* TODO(cursor): persist new class to backend on Publish. */}
        </div>
      )}
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {[1, 2].map((n, i) => (
        <div key={n} className="flex items-center gap-3">
          <div className={cn("size-7 rounded-full grid place-items-center text-xs font-bold", step >= (n as 1 | 2) ? "bg-brand text-white" : "bg-muted text-muted-foreground")}>
            {step > n ? <Check className="size-3.5" /> : n}
          </div>
          <span className={cn("font-semibold", step === n ? "text-ink" : "text-muted-foreground")}>{n === 1 ? "Choose type" : "Settings"}</span>
          {i === 0 && <ChevronRight className="size-4 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

function TypeCard({ active, onClick, icon: Icon, title, caption, badges }: any) {
  return (
    <button onClick={onClick} className={cn("text-left rounded-2xl bg-card border p-6 transition", active ? "border-brand ring-2 ring-brand/30" : "border-border hover:border-brand")}>
      <div className={cn("size-12 rounded-xl grid place-items-center mb-3", active ? "bg-brand text-white" : "bg-muted text-muted-foreground")}>
        <Icon className="size-5" />
      </div>
      <div className="font-bold text-ink text-lg">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{caption}</div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {badges.map((b: string) => <span key={b} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">{b}</span>)}
      </div>
    </button>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <h3 className="font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}
function Field({ label, hint, children }: any) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink">{label}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5 mb-2">{hint}</div>}
      <div className={cn(!hint && "mt-2")}>{children}</div>
    </div>
  );
}
function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <button onClick={() => onChange(!value)} className={cn("w-11 h-6 rounded-full p-0.5 transition shrink-0", value ? "bg-brand" : "bg-muted")}>
        <span className={cn("block size-5 rounded-full bg-white shadow transition", value && "translate-x-5")} />
      </button>
    </div>
  );
}
