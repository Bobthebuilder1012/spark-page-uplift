import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Lock, CreditCard, Users, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/parent/settings")({
  head: () => ({ meta: [{ title: "Settings — iTutor Parent" }] }),
  component: Settings,
});

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "household", label: "Household", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "payment", label: "Payment methods", icon: CreditCard },
];

function Settings() {
  const [section, setSection] = useState("profile");
  const [notif, setNotif] = useState({ consent: true, payments: true, renewals: true, feedback: true, suspended: true, marketing: false, sms: true });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and household preferences</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group",
                  active ? "bg-background border border-border text-ink" : "text-muted-foreground hover:bg-background")}>
                <Icon className="size-4" />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight className={cn("size-3.5 transition", active && "text-brand-deep")} />
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-background border border-border p-6 space-y-6">
          {section === "profile" && (
            <>
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="relative">
                  <div className="size-20 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-2xl font-semibold">AM</div>
                  <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-background border border-border grid place-items-center hover:bg-muted">
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div>
                  <div className="font-semibold text-ink">Anika Mohammed</div>
                  <div className="text-sm text-muted-foreground">anika.m@email.com</div>
                </div>
              </div>
              <Field label="Full name" defaultValue="Anika Mohammed" />
              <Field label="Email" defaultValue="anika.m@email.com" type="email" />
              <Field label="Phone" defaultValue="+1 868 555 0188" />
              <Field label="Address" defaultValue="14 Pembroke St, Port of Spain" />
              <SaveBar />
            </>
          )}

          {section === "household" && (
            <>
              <p className="text-sm text-muted-foreground">Children added to your household. Each child has their own student login but you control consents and payments.</p>
              <div className="space-y-2">
                {[{ n: "Aliyah Mohammed", a: "Form 5 · 16 yrs" }, { n: "Devon Charles", a: "Form 3 · 13 yrs" }].map((c) => (
                  <div key={c.n} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="size-10 rounded-full bg-brand-soft text-brand-deep grid place-items-center font-bold text-sm">{c.n.split(" ").map((x) => x[0]).join("")}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-ink text-sm">{c.n}</div>
                      <div className="text-xs text-muted-foreground">{c.a}</div>
                    </div>
                    <button className="text-xs font-semibold text-muted-foreground hover:text-ink">Manage</button>
                  </div>
                ))}
                <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add a child</button>
              </div>
            </>
          )}

          {section === "notifications" && (
            <>
              {[
                { key: "consent", label: "Consent requests", desc: "When a child requests to join a class" },
                { key: "payments", label: "Payment confirmations", desc: "Every successful charge and refund" },
                { key: "renewals", label: "Renewal reminders", desc: "3 days before each auto-renewal" },
                { key: "feedback", label: "Monthly feedback reports", desc: "When a tutor delivers a new report" },
                { key: "suspended", label: "Suspensions & alerts", desc: "If a tutor pauses your child's enrollment" },
                { key: "sms", label: "SMS alerts", desc: "Critical alerts (consent, suspension) via text" },
                { key: "marketing", label: "Tips & promotions", desc: "Newsletters, recommended tutors, offers" },
              ].map((n) => (
                <div key={n.key} className="flex items-start justify-between gap-4 py-1">
                  <div>
                    <div className="font-medium text-ink text-sm">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                  </div>
                  <Switch checked={notif[n.key as keyof typeof notif]} onCheckedChange={(v) => setNotif({ ...notif, [n.key]: v })} />
                </div>
              ))}
            </>
          )}

          {section === "security" && (
            <>
              <Field label="Current password" type="password" defaultValue="••••••••" />
              <Field label="New password" type="password" defaultValue="" />
              <Field label="Confirm new password" type="password" defaultValue="" />
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-ink text-sm">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Required for changes to payment methods</div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-forest">Enable</button>
                </div>
              </div>
              <SaveBar label="Update password" />
            </>
          )}

          {section === "payment" && (
            <>
              <div className="rounded-2xl bg-mint p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Default card</div>
                <div className="font-semibold text-ink mt-1">Visa •••• 4242 · exp 09/27</div>
                <div className="text-xs text-muted-foreground mt-1">Used for all renewals across all children.</div>
              </div>
              <div>
                <div className="text-sm font-medium text-ink mb-3">Payment methods</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-ink to-forest grid place-items-center text-white text-[10px] font-bold">VISA</div>
                    <div className="flex-1 text-sm">•••• 4242 <span className="text-muted-foreground">· exp 09/27</span></div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-soft text-forest font-semibold">Default</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-500 to-rose-500 grid place-items-center text-white text-[10px] font-bold">MC</div>
                    <div className="flex-1 text-sm">•••• 1881 <span className="text-muted-foreground">· exp 03/26</span></div>
                    <button className="text-xs font-semibold text-muted-foreground hover:text-ink">Make default</button>
                  </div>
                  <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add payment method</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink mb-1.5 block">{label}</label>
      <input type={type} defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
    </div>
  );
}

function SaveBar({ label = "Save changes" }: { label?: string }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-border">
      <button className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
      <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">{label}</button>
    </div>
  );
}
